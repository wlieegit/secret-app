import type { NextApiRequest, NextApiResponse } from 'next'
import { cryptoWaitReady, decodeAddress, signatureVerify } from '@polkadot/util-crypto'
import { u8aToHex } from '@polkadot/util'

type ResquestData = {
    address: string
    message: string
    signature: string
}

type ResponseData = {
}

const isValidSignature = (signedMessage: string, signature: string, address: string) => {
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);

  return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === 'POST') {
    await cryptoWaitReady()
    const body = req.body as ResquestData
    const isValid = isValidSignature(body.message, body.signature, body.address);
    return res.status(200).json({ isValid })
  }
  return res.status(404).end()
}
