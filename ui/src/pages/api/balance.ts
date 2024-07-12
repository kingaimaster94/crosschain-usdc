// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import config from "config/constants";
import erc20Abi from "abi/erc20.json";
import { makeCalls } from "utils/multicall";
import { getProvider } from "utils/provider";
import { Approval } from "slices/tokenApprovalSlice";

type TokenInfo = {
  address: string;
  amount: string;
  approvals: Approval[];
};

type BalanceResponse = {
  status: boolean;
  data: {
    tokenInfos: TokenInfo[];
  };
  error?: string;
};

interface BalanceApiRequest extends NextApiRequest {
  body: {
    tokenAddresses: string[];
    spenderAddresses: string[];
    walletAddress: string;
    chainId: string;
  };
}

export default async function handler(
  req: BalanceApiRequest,
  res: NextApiResponse<BalanceResponse>
) {
  const tokenAddresses = req.body.tokenAddresses;
  const walletAddress = req.body.walletAddress;
  const spenderAddresses = req.body.spenderAddresses;
  const chainId = parseInt(req.body.chainId);
  const chain = config.chains.find((chain) => chain.id === chainId);
  if (!chain) {
    return res.status(400).json({
      status: false,
      data: {
        tokenInfos: [],
      },
      error: "Unsupported chainId: " + chainId,
    });
  }

  const provider = getProvider(chain);
  const tokenInfos = await fetchTokenInfo(
    tokenAddresses,
    chain.multicallAddress,
    walletAddress,
    spenderAddresses,
    provider
  );

  return res.status(200).json({
    status: true,
    data: {
      tokenInfos,
    },
  });
}

async function fetchTokenInfo(
  tokenAddresses: string[],
  multicallAddress: string,
  ownerAddress: string,
  spenderAddresses: string[],
  provider: ethers.providers.BaseProvider
): Promise<TokenInfo[]> {
  const erc20TokenAddresses = tokenAddresses.filter(
    (address) => address !== ethers.constants.AddressZero
  );
  const calls = erc20TokenAddresses.flatMap((tokenAddress) => [
    {
      name: "balanceOf",
      params: [ownerAddress],
      targetAddress: tokenAddress,
    },
    ...spenderAddresses.map((spenderAddress) => {
      return {
        name: "allowance",
        params: [ownerAddress, spenderAddress],
        targetAddress: tokenAddress,
      };
    }),
  ]);
  const results = await makeCalls(multicallAddress, provider, erc20Abi, calls);

  const approvals: Record<string, Approval[]> = {};
  const balances: Record<string, string> = {};

  for (let i = 0; i < results.length; i++) {
    const result = results[i].toString();
    const tokenAddress = calls[i].targetAddress;
    if (calls[i].name === "balanceOf") {
      balances[tokenAddress] = result;
    } else {
      if (!approvals[tokenAddress]) approvals[tokenAddress] = [];
      approvals[tokenAddress].push({
        spender: calls[i].params[1],
        allowance: result,
      });
    }
  }

  const nativeBalanceRequest = await provider.getBalance(ownerAddress);
  balances[ethers.constants.AddressZero] = nativeBalanceRequest.toString();
  approvals[ethers.constants.AddressZero] = [];
  for (const spenderAddress of spenderAddresses) {
    approvals[ethers.constants.AddressZero].push({
      spender: spenderAddress,
      allowance: ethers.constants.MaxUint256.toString(),
    });
  }

  const tokenInfos = tokenAddresses.map((address) => ({
    address,
    amount: balances[address],
    approvals: approvals[address],
  }));

  return tokenInfos;
}
