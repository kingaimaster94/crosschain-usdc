import { task } from "hardhat/config";
import uniswapRouterAbi from "./abi/router.json";
import pangolinRouterAbi from "./abi/pangolinRouter.json";
import { ROUTER, USDC } from "../constants/address";
import { Chain } from "../constants/chains";

task(
  "lp-native",
  "Add an erc20 token - native token pair to given router address"
)
  .addPositionalParam("amountErc20") // full unit amount (specify "10" = 10 * 10^decimals)
  .addPositionalParam("amountNative")
  .setAction(async (taskArgs, hre) => {
    const ethers = hre.ethers;
    const { amountErc20, amountNative } = taskArgs;
    const chainName = hre.network.name as Chain;
    const routerAddress = ROUTER[chainName];
    const [deployer] = await ethers.getSigners();
    if (chainName !== Chain.ETHEREUM && chainName !== Chain.AVALANCHE) return;
    const tokenAddress = USDC[chainName];

    const isPangolin =
      routerAddress.toLowerCase() ===
      "0x2d99abd9008dc933ff5c0cd271b88309593ab921";
    const abi = isPangolin ? pangolinRouterAbi : uniswapRouterAbi;

    const contract = new ethers.Contract(routerAddress, abi, deployer);

    // Approve if needed
    await hre.run("approve", {
      spender: routerAddress,
    });

    const deadline = Math.floor(new Date().getTime() / 1000) + 60 * 20;
    const amountTokenErc20 = ethers.utils.parseUnits(amountErc20, 6);
    const amountTokenNative = ethers.utils.parseUnits(amountNative, 18);
    const functionName = isPangolin ? "addLiquidityAVAX" : "addLiquidityETH";
    const tx = await contract[functionName](
      tokenAddress,
      amountTokenErc20,
      0,
      0,
      deployer.address,
      deadline,
      { value: amountTokenNative }
    );

    console.log("Tx: ", tx.hash);
  });
