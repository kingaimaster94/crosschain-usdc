// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { AttestationsResponse } from "types/api";
import { PopulatedTransaction } from "ethers";
import { ChainName } from "types/chain";
import { sendTx } from "utils/defender";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AttestationsResponse>
) {
  const chain = req.body.chain as ChainName;
  const rawTx = req.body.rawTx as PopulatedTransaction;
  if (
    chain !== ChainName.AVALANCHE &&
    chain !== ChainName.ETHEREUM &&
    chain !== ChainName.ETHEREUM_MAINNET
  ) {
    return res
      .status(400)
      .json({ success: false, error: `${chain} is not supported.` });
  }

  const tx = await sendTx(chain, rawTx).catch(() => undefined);

  if (!tx) {
    return res.status(400).json({ success: false, error: "Failed to send tx" });
  }

  return res.status(200).json({
    success: true,
    hash: tx.hash,
  });
}
