import {
  isValidAddress,
  isValidSignature,
  isValidMessage,
} from '@/utils/polkadot'

export async function polkadotAuthorize(
  address: string,
  message: string,
  signature: string,
): Promise<{id: string}> {
  let isValid = isValidAddress(address)
  if (!isValid) {
    throw new Error('polkadot address is invalid')
  }
  isValid = await isValidSignature(message, signature, address)
  if (!isValid) {
    throw new Error('polkadot signature is invalid')
  }
  isValid = isValidMessage(message, address)
  if (!isValid) {
    throw new Error('polkadot message is invalid')
  }
  return {
    id: address,
  }
}
