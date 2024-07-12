// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import {IAxelarGasService} from "@axelar-network/axelar-cgp-solidity/contracts/interfaces/IAxelarGasService.sol";
import {IAxelarGateway} from "@axelar-network/axelar-cgp-solidity/contracts/interfaces/IAxelarGateway.sol";
import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ITokenMessenger} from "./ITokenMessenger.sol";
import "./StringAddressUtils.sol";

contract CrosschainNativeSwap is AxelarExecutable, Ownable {
    IERC20 public usdc;
    ITokenMessenger public tokenMessenger;
    IAxelarGasService immutable gasReceiver;

    // mapping chain name => domain number;
    mapping(string => uint32) public circleDestinationDomains;
    // mapping destination chain name => destination contract address
    mapping(string => address) public siblings;

    error InvalidTrade();
    error InsufficientInput();
    error TradeFailed();

    event SwapSuccess(bytes32 indexed traceId, uint256 amount, bytes tradeData);

    event SwapFailed(
        bytes32 indexed traceId,
        uint256 amount,
        address refundAddress
    );

    event SwapPending(
        bytes32 indexed traceId,
        bytes32 indexed payloadHash,
        uint256 amount,
        string destinationChain,
        bytes payload
    );

    constructor(
        address usdc_,
        address gasReceiver_,
        address gateway_,
        address tokenMessenger_
    ) AxelarExecutable(gateway_) Ownable() {
        usdc = IERC20(usdc_);
        tokenMessenger = ITokenMessenger(tokenMessenger_);
        gasReceiver = IAxelarGasService(gasReceiver_);
        circleDestinationDomains["ethereum"] = 0;
        circleDestinationDomains["avalanche"] = 1;
    }

    modifier isValidChain(string memory destinationChain) {
        require(siblings[destinationChain] != address(0), "Invalid chain");
        _;
    }

    // Set address for this contract that deployed at another chain
    function addSibling(
        string memory chain_,
        address address_
    ) external onlyOwner {
        siblings[chain_] = address_;
    }

    /**
     * @dev Swap native token to USDC, burn it, and send swap payload to AxelarGateway contract
     * @param destinationChain Name of the destination chain
     * @param srcTradeData Trade data for the first swap
     * @param destTradeData Trade data for the second swap
     * @param traceId Trace ID of the swap
     * @param fallbackRecipient Recipient address to receive USDC token if the swap fails
     * @param inputPos Position of the input token in destTradeData
     */
    function nativeTradeSendTrade(
        string memory destinationChain,
        bytes memory srcTradeData,
        bytes memory destTradeData,
        bytes32 traceId,
        address fallbackRecipient,
        uint16 inputPos
    ) external payable isValidChain(destinationChain) {
        // Swap native token to USDC
        (uint256 nativeSwapAmount, uint256 usdcAmount) = _swapNativeToUsdc(
            srcTradeData
        );

        // Burns a specified amount of USDC tokens by calling `depositForBurn` function in Circle's TokenMessenger contract
        _sendViaCCTP(
            usdcAmount,
            destinationChain,
            this.siblings(destinationChain)
        );

        // encode the payload to send to the sibling contract
        bytes memory payload = abi.encode(
            destTradeData,
            usdcAmount,
            traceId,
            fallbackRecipient,
            inputPos
        );

        // Pay gas to AxelarGasReceiver contract with native token to execute the sibling contract at the destination chain
        _payGasAndCallContract(
            destinationChain,
            payload,
            msg.value - nativeSwapAmount
        );

        emit SwapPending(
            traceId,
            keccak256(payload),
            usdcAmount,
            destinationChain,
            payload
        );
    }

    function _payGasAndCallContract(
        string memory destinationChain,
        bytes memory payload,
        uint256 fee
    ) private {
        gasReceiver.payNativeGasForContractCall{value: fee}(
            address(this),
            destinationChain,
            AddressToString.toString(this.siblings(destinationChain)),
            payload,
            msg.sender
        );

        // Send all information to AxelarGateway contract.
        gateway.callContract(
            destinationChain,
            AddressToString.toString(this.siblings(destinationChain)),
            payload
        );
    }

    function _sendViaCCTP(
        uint256 amount,
        string memory destinationChain,
        address recipient
    ) private isValidChain(destinationChain) {
        IERC20(address(usdc)).approve(address(tokenMessenger), amount);

        tokenMessenger.depositForBurn(
            amount,
            this.circleDestinationDomains(destinationChain),
            bytes32(uint256(uint160(recipient))),
            address(usdc)
        );
    }

    function _swapNativeToUsdc(
        bytes memory tradeData
    ) private returns (uint256 amount, uint256 burnAmount) {
        // Calculate remaining usdc token in the contract
        uint256 preTradeBalance = IERC20(address(usdc)).balanceOf(
            address(this)
        );

        (uint256 nativeAmountIn, address router, bytes memory data) = abi
            .decode(tradeData, (uint256, address, bytes));

        // Swap native token to USDC
        (bool success, ) = router.call{value: nativeAmountIn}(data);

        // Revert if trade failed
        require(success, "TRADE_FAILED");

        // Calculate amount of USDC token swapped. This is the amount to be burned at the source chain.
        uint256 usdcAmount = IERC20(address(usdc)).balanceOf(address(this)) -
            preTradeBalance;

        // Return amount of native token swapped and amount of USDC token to be burned
        return (nativeAmountIn, usdcAmount);
    }

    function _refund(
        bytes32 traceId,
        uint256 amount,
        address recipient
    ) internal {
        SafeERC20.safeTransfer(IERC20(address(usdc)), recipient, amount);
        emit SwapFailed(traceId, amount, recipient);
    }

    // This function will be called by Axelar Executor service.
    function _execute(
        string memory /*sourceChain*/,
        string memory /*sourceAddress*/,
        bytes calldata payload
    ) internal override {
        // Decode payload
        (
            bytes memory tradeData,
            uint256 usdcAmount,
            bytes32 traceId,
            address fallbackRecipient,
            uint16 inputPos
        ) = abi.decode(payload, (bytes, uint256, bytes32, address, uint16));

        // This code inserts the usdcAmount into the tradeData bytes at a specific location, in order to properly position the data.
        assembly {
            mstore(add(tradeData, inputPos), usdcAmount)
        }

        (address srcToken, , address router, bytes memory data) = abi.decode(
            tradeData,
            (address, uint256, address, bytes)
        );

        // Approve USDC to the router contract
        IERC20(srcToken).approve(router, usdcAmount);

        // Swap USDC to native token
        (bool swapSuccess, ) = router.call(data);

        // If swap failed, refund USDC to the user at the destination chain.
        if (!swapSuccess)
            return _refund(traceId, usdcAmount, fallbackRecipient);

        // Emit success event so that our application can be notified.
        emit SwapSuccess(traceId, usdcAmount, tradeData);
    }
}
