// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import config from "config/constants";
import { FeeResponse } from "types/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FeeResponse>
) {
  const { sourceChain, destinationChain, commonKey } = req.query;
  if (!sourceChain || !destinationChain || !commonKey) {
    return res.status(400).json({
      status: false,
      error: "Missing parameters",
    });
  }

  const params = new URLSearchParams({
    source_chain: sourceChain as string,
    destination_chain: destinationChain as string,
    amount: `1${commonKey}`,
  }).toString();

  const result = await fetch(
    `${config.AXELAR_LCD}/axelar/nexus/v1beta1/transfer_fee?${params}`
  ).then((res) => res.json());

  if (result.code) {
    return res.status(400).json({
      status: false,
      error: result.message,
    });
  }

  res.setHeader("Cache-control", "public, max-age=86400");
  return res.status(200).json({
    status: true,
    data: result.fee.amount,
  });
}
