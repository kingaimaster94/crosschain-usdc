// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import config from "config/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { AttestationsResponse } from "types/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AttestationsResponse>
) {
  const messageHash = req.query.messageHash as string;

  const _response = await fetch(
    `${config.ATTESTATION_BASE_API}/attestations/${messageHash}`
  )
    .then((resp) => resp.json())
    .catch((err: any) => {});

  if (!_response || _response.error || _response.status !== "complete") {
    return res.status(200).json({
      success: false,
      signature: undefined,
    });
  } else {
    return res.status(200).json({
      success: true,
      signature: _response.attestation,
    });
  }
}
