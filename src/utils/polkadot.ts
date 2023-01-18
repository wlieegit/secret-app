import {hexToString, isHex, u8aToHex} from '@polkadot/util'
import {
  cryptoWaitReady,
  decodeAddress,
  encodeAddress,
  signatureVerify,
} from '@polkadot/util-crypto'

export const isValidAddress = (address: string): boolean => {
  try {
    encodeAddress(
      decodeAddress(isHex(address) ? hexToString(address) : address),
    )
    return true
  } catch (e: any) {
    return false
  }
}

export const isValidSignature = async (
  signedMessage?: string,
  signature?: string,
  address?: string,
): Promise<boolean> => {
  try {
    // Some interfaces, such as using sr25519 however are only available via WASM
    await cryptoWaitReady()
    const publicKey = decodeAddress(address)
    const hexPublicKey = u8aToHex(publicKey)
    return signatureVerify(signedMessage, signature, hexPublicKey).isValid
  } catch (e: any) {
    console.warn('fail to check signature', e)
    return false
  }
}
