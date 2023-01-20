import {isValidAddress, isValidMessage, isValidSignature} from '../polkadot'
import {stringToHex} from '@polkadot/util'
import {
  defaultTestAddress,
  getDefaultSignatureInfos,
} from '../../../test/signature-test-util'
import {getSignInMessageWithAddress} from '../signature'

describe('polkadot', () => {
  describe('isValidAddress', () => {
    it('should return true if address is valid', () => {
      const isValid = isValidAddress(defaultTestAddress)
      expect(isValid).toBeTruthy()
    })

    it('should return false if address is invalid', () => {
      const isValid = isValidAddress('invalid address')
      expect(isValid).toBeFalsy()
    })

    it('should return true if hex address is valid', () => {
      const isValid = isValidAddress(stringToHex(defaultTestAddress))
      expect(isValid).toBeTruthy()
    })

    it('should return false if hex address is invalid', () => {
      const isValid = isValidAddress(stringToHex('invalid address'))
      expect(isValid).toBeFalsy()
    })
  })

  describe('isValidSignature', () => {
    it('should return true if signature is valid', async () => {
      const {signature, message, user} = getDefaultSignatureInfos()
      const isValid = await isValidSignature(message, signature, user.address)
      expect(isValid).toBeTruthy()
    })

    it('should return false if signature is invalid', async () => {
      const {signature, address} = getDefaultSignatureInfos()
      const isValid = await isValidSignature(
        getSignInMessageWithAddress(address),
        `${signature}_xxx`,
        address,
      )
      expect(isValid).toBeFalsy()
    })

    it('should return false if signature length is invalid', async () => {
      const {signature, address} = getDefaultSignatureInfos()
      const isValid = await isValidSignature(
        getSignInMessageWithAddress(address),
        signature.substr(0, signature.length / 2),
        address,
      )
      expect(isValid).toBeFalsy()
    })
  })
  describe('isValidMessage', () => {
    it('should return true if message is valid', async () => {
      const isValid = await isValidMessage(
        getSignInMessageWithAddress(defaultTestAddress),
        defaultTestAddress,
      )
      expect(isValid).toBeTruthy()
    })
    it('should return false if message is invalid', async () => {
      const isValid = await isValidMessage(
        getSignInMessageWithAddress(
          '14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84CCCC',
        ),
        defaultTestAddress,
      )
      expect(isValid).toBeFalsy()
    })
  })
})
