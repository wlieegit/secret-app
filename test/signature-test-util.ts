import {getSignInMessageWithAddress} from '@/utils/signature'
import Keyring from '@polkadot/keyring'
import {u8aToHex} from '@polkadot/util'

export const defaultTestAddress =
  '14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo'

export const getDefaultSignatureInfos = () => {
  const keyring = new Keyring()
  const user = keyring.addFromUri('//user')
  const message = getSignInMessageWithAddress(defaultTestAddress)
  const signature = u8aToHex(user.sign(message))
  return {
    signature,
    message,
    address: defaultTestAddress,
    user,
  }
}
