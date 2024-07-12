import { task } from "hardhat/config";
import { CROSSCHAIN_NATIVE_SWAP, USDC } from "../constants/address";
import { Chain } from "../constants/chains";
import crosschainNativeSwapAbi from "./abi/crosschainNativeSwap.json";

task("addSibling", "Add sibling contract to the CrosschainNativeSwap contract")
  .addPositionalParam("siblingChain")
  .setAction(async (taskArgs, hre) => {
    const { siblingChain } = taskArgs;
    const ethers = hre.ethers;
    const [deployer] = await ethers.getSigners();
    const chainName = hre.network.name as Chain;
    const siblingChainName = siblingChain as Chain;

    console.log(siblingChain);

    if (!CROSSCHAIN_NATIVE_SWAP[siblingChainName]) return;

    const contract = new ethers.Contract(
      CROSSCHAIN_NATIVE_SWAP[chainName],
      crosschainNativeSwapAbi,
      deployer
    );
    const tx = await contract
      .addSibling(
        siblingChain === "ethereum"
          ? "ethereum-2"
          : siblingChain === "ethereumMainnet"
          ? "ethereum"
          : siblingChain,
        CROSSCHAIN_NATIVE_SWAP[siblingChainName]
      )
      .then((tx: any) => tx.wait());

    console.log("Added sibling", tx.transactionHash);
  });
