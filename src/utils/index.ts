import {decodeAddress, encodeAddress} from '@polkadot/keyring'
import {hexToU8a, isHex} from '@polkadot/util'

export function beatifyAddress(address: string) {
  return `${address.slice(0, 3)}...${address.slice(-3)}`
}

export const isPolkadotAddress = (address: string) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))
    return true
  } catch (error) {
    return false
  }
}
