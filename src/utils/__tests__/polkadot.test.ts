import {isValidAddress, isValidMessage, isValidSignature} from '../polkadot'
import {stringToHex, u8aToHex} from '@polkadot/util'
import Keyring from '@polkadot/keyring'

describe('polkadot', () => {
  describe('isValidAddress', () => {
    it('should return true if address is valid', () => {
      const isValid = isValidAddress(
        '14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo',
      )
      expect(isValid).toBeTruthy()
    })

    it('should return false if address is invalid', () => {
      const isValid = isValidAddress('invalid address')
      expect(isValid).toBeFalsy()
    })

    it('should return true if hex address is valid', () => {
      const isValid = isValidAddress(
        stringToHex('14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo'),
      )
      expect(isValid).toBeTruthy()
    })

    it('should return false if hex address is invalid', () => {
      const isValid = isValidAddress(stringToHex('invalid address'))
      expect(isValid).toBeFalsy()
    })
  })

  describe('isValidSignature', () => {
    it('should return true if signature is valid', async () => {
      const keyring = new Keyring()
      const user = keyring.addFromUri('//user')
      const msg =
        'Sign-in request for address 14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo.'
      const signature = u8aToHex(user.sign(msg))
      const isValid = await isValidSignature(msg, signature, user.address)
      expect(isValid).toBeTruthy()
    })

    it('should return false if signature is invalid', async () => {
      const isValid = await isValidSignature(
        'Sign-in request for address 14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo.',
        '0xfc03197bd2110f613677913e3d52afbc1ecda9099109f01300a97acde7122d305d87d115cf173632319c6666d829a4585a45462cb3d2df5513f7d5a68c9f1784',
        '14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo',
      )
      expect(isValid).toBeFalsy()
    })

    it('should return false if signature length is invalid', async () => {
      const isValid = await isValidSignature(
        'Sign-in request for address 14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo.',
        '0xfc03197bd2110f613677913e3d52afbc1ecda9099109f01300a97acde7122d305d87d115c',
        '14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo',
      )
      expect(isValid).toBeFalsy()
    })
  })
  describe('isValidMessage', () => {
    it('should return true if message is valid', async () => {
      const isValid = await isValidMessage(
        'Sign-in request for address 14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo.',
        '14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo',
      )
      expect(isValid).toBeTruthy()
    })
    it('should return false if message is invalid', async () => {
      const isValid = await isValidMessage(
        'Sign-in request for address 14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84CCCC.',
        '14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo',
      )
      expect(isValid).toBeFalsy()
    })
  })
})
