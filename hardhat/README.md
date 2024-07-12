# Running Crosschain USDC Example

1. Install dependencies by running `yarn`
2. Rename `secret.example.json` to `secret.json` and add your private key
3. Run hardhat task with `yarn task tradeSendTrade amount destChain --network srcChain`
   For example:

- Swap 0.01 AVAX to USDC and sending to Goerli: `yarn task tradeSendTrade 0.01 ethereum --network avalanche`
- Swap 0.1 ETH to USDC and sending to Avalanche: `yarn task tradeSendTrade 0.1 avalanche --network ethereum`
