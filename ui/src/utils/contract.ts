import { Contract, ethers } from "ethers";
import pangolinRouterAbi from "abi/pangolinRouter.json";
import uniswapRouterAbi from "abi/router.json";
import { getProvider } from "./provider";
import { SwapEstimatorPayload } from "slices/swapEstimatorSlice";
import config from "config/constants";
import { ChainName } from "types/chain";

export function createSwapPayloadForNative(
  chain: string,
  swapFunctionName: string,
  swapPath: string[],
  recipientAddress: string
) {
  const swapRouterAbi = getAbi(chain);

  const iface = new ethers.utils.Interface(swapRouterAbi);
  const deadline = Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24; // within a day
  const swapPayload = iface.encodeFunctionData(swapFunctionName, [
    0,
    swapPath,
    recipientAddress,
    deadline,
  ]);

  return swapPayload;
}

export function createSwapPayloadForErc20(
  chain: string,
  swapFunctionName: string,
  amount: ethers.BigNumberish,
  swapPath: string[],
  recipientAddress: string
) {
  const swapRouterAbi = getAbi(chain);

  const iface = new ethers.utils.Interface(swapRouterAbi);
  const deadline = Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24; // within a day
  const swapPayload = iface.encodeFunctionData(swapFunctionName, [
    amount,
    0,
    swapPath,
    recipientAddress,
    deadline,
  ]);

  return swapPayload;
}

export function createSrcTradeData(
  swapPath: string[],
  chain: string,
  recipientAddress: string,
  amount: ethers.BigNumberish
) {
  const swapFunctionName = getSrcSwapFunctionName(chain);
  const swapPayload = createSwapPayloadForNative(
    chain,
    swapFunctionName,
    swapPath,
    recipientAddress
  );
  const _chain = config.chains.find((c) => c.name === chain);
  return ethers.utils.defaultAbiCoder.encode(
    ["uint256", "address", "bytes"],
    [amount, _chain?.routerAddress, swapPayload]
  );
}

export function createDestTradeData(
  swapPath: string[],
  chain: string,
  recipientAddress: string,
  amount: ethers.BigNumberish,
  usdcAddress: string
) {
  const swapPayload = createSwapPayloadForErc20(
    chain,
    getDestSwapFunctionName(chain),
    amount,
    swapPath,
    recipientAddress
  );
  const _chain = config.chains.find((c) => c.name === chain);
  return ethers.utils.defaultAbiCoder.encode(
    ["address", "uint256", "address", "bytes"],
    [usdcAddress, amount, _chain?.routerAddress, swapPayload]
  );
}

function getSrcSwapFunctionName(chain: string) {
  if (chain === ChainName.AVALANCHE) {
    return "swapExactAVAXForTokens";
  }

  return "swapExactETHForTokens";
}

function getDestSwapFunctionName(chain: string) {
  if (chain === ChainName.AVALANCHE) {
    return "swapExactTokensForAVAX";
  }

  return "swapExactTokensForETH";
}

function getAbi(chain: string) {
  if (chain === ChainName.AVALANCHE) {
    return pangolinRouterAbi;
  }
  return uniswapRouterAbi;
}

export function createPayloadHash(
  tradeData: string,
  amount: ethers.BigNumberish,
  traceId: string,
  recipientAddress: string,
  inputPos: number
) {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["bytes", "uint256", "bytes32", "address", "uint16"],
      [tradeData, amount, traceId, recipientAddress, inputPos]
    )
  );
}

export async function estimateSwapOutputAmount(payload: SwapEstimatorPayload) {
  const { routerAddress, token, amount, chain, nativeToErc20 } = payload;
  const provider = getProvider(chain);
  const contract = new ethers.Contract(
    routerAddress,
    uniswapRouterAbi,
    provider
  );
  try {
    const path = nativeToErc20
      ? [chain.wrappedNativeToken, token.address]
      : [token.address, chain.wrappedNativeToken];
    const amountOuts = await contract.getAmountsOut(amount, path);
    return amountOuts[amountOuts.length - 1].toString();
  } catch (e: any) {
    console.log(e);
    let errMsg = `No ${token.symbol} liquidity at ${chain.alias}`;
    if (e.message.indexOf("out-of-bounds") > -1) {
      errMsg = "Swap amount is too low";
    }
    throw new Error(errMsg);
  }
}

export const getSwapPendingEvent = (
  contract: Contract,
  txReceipt: ethers.providers.TransactionReceipt
) => {
  const eventLogs = txReceipt.logs;
  const swapPendingEventId = ethers.utils.id(
    "SwapPending(bytes32,bytes32,uint256,string,bytes)"
  );
  for (const log of eventLogs) {
    if (log.topics[0] === swapPendingEventId) {
      const swapPendingEvent = contract.interface.parseLog(log);
      const [traceId, payloadHash, amount, destinationChainName, payload] =
        swapPendingEvent.args;

      const destChain = config.chains.find(
        (chain) =>
          chain.name.toLowerCase() === destinationChainName.toLowerCase()
      );

      return {
        traceId,
        amount: amount.toString(),
        destChain,
        payload,
        payloadHash,
      };
    }
  }

  return null;
};

export const getSwapFailedEvent = (
  contract: Contract,
  txReceipt: ethers.providers.TransactionReceipt
) => {
  const eventLogs = txReceipt.logs;
  const swapFailedEventId = ethers.utils.id(
    "SwapFailed(bytes32,string,uint256,address)"
  );
  for (const log of eventLogs) {
    if (log.topics[0] === swapFailedEventId) {
      return contract.interface.parseLog(log);
    }
  }
};

export const getSwapSuccessEvent = (
  contract: Contract,
  txReceipt: ethers.providers.TransactionReceipt
) => {
  const eventLogs = txReceipt.logs;
  const swapSuccessEventId = ethers.utils.id(
    "SwapSuccess(bytes32,string,uint256,bytes)"
  );
  for (const log of eventLogs) {
    if (log.topics[0] === swapSuccessEventId) {
      return contract.interface.parseLog(log);
    }
  }
  return null;
};

export const getMessageSentEvent = (
  contract: Contract,
  txReceipt: ethers.providers.TransactionReceipt
) => {
  const eventLogs = txReceipt.logs;
  const messageSentEventId = ethers.utils.id("MessageSent(bytes)");
  for (const log of eventLogs) {
    if (log.topics[0] === messageSentEventId) {
      return contract.interface.parseLog(log);
    }
  }
  return null;
};

export const getCallContractEvent = (
  contract: Contract,
  txReceipt: ethers.providers.TransactionReceipt
) => {
  const eventLogs = txReceipt.logs;
  const contractCallEventId = ethers.utils.id(
    "ContractCall(address,string,string,bytes32,bytes)"
  );
  for (const log of eventLogs) {
    if (log.topics[0] === contractCallEventId) {
      return contract.interface.parseLog(log);
    }
  }
  return null;
};
