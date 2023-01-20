import {polkadotAuthorize} from '@/pages/api/auth/authorize'
import {
  isValidAddress,
  isValidSignature,
  isValidMessage,
} from '@/utils/polkadot'
import {getDefaultSignatureInfos} from '../../../../../test/signature-test-util'

jest.mock('@/utils/polkadot')
const isValidAddressMock = jest.mocked(isValidAddress)
const isValidSignatureMock = jest.mocked(isValidSignature)
const isValidMessageMock = jest.mocked(isValidMessage)

describe('authorize', () => {
  describe('polkadotAuthorize', () => {
    const {signature, message, address} = getDefaultSignatureInfos()

    beforeEach(() => {
      jest.resetAllMocks()
      isValidAddressMock.mockReturnValue(true)
      isValidSignatureMock.mockResolvedValue(true)
      isValidMessageMock.mockReturnValue(true)
    })

    it('should throw error when address is invalid', (done) => {
      isValidAddressMock.mockReturnValueOnce(false)

      polkadotAuthorize(address, signature, message)
        .catch((error) => {
          expect(error).toEqual(new Error('polkadot address is invalid'))
        })
        .finally(() => done())
    })

    it('should throw error when signature is invalid', (done) => {
      isValidSignatureMock.mockResolvedValueOnce(false)

      polkadotAuthorize(address, signature, message)
        .catch((error) => {
          expect(error).toEqual(new Error('polkadot signature is invalid'))
        })
        .finally(() => done())
    })

    it('should throw error when message is invalid', (done) => {
      isValidMessageMock.mockReturnValueOnce(false)

      polkadotAuthorize(address, signature, message)
        .catch((error) => {
          expect(error).toEqual(new Error('polkadot message is invalid'))
        })
        .finally(() => done())
    })

    it('should return data when param is all valid', async () => {
      const data = await polkadotAuthorize(address, signature, message)

      expect(data).toEqual({id: address})
    })
  })
})
