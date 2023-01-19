import {polkadotAuthorize} from '@/pages/api/auth/authorize'
import {
  isValidAddress,
  isValidSignature,
  isValidMessage,
} from '@/utils/polkadot'

jest.mock('@/utils/polkadot')
const isValidAddressMock = jest.mocked(isValidAddress)
const isValidSignatureMock = jest.mocked(isValidSignature)
const isValidMessageMock = jest.mocked(isValidMessage)

describe('authorize', () => {
  describe('polkadotAuthorize', () => {
    const message =
      'Sign-in request for address 14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo.'
    const signature =
      '0xfc03197bd2110f613677913e3d52afbc1ecda9099109f01300a97acde7122d305d87d115cf173632319c6666d829a4585a45462cb3d2df5513f7d5a68c9f1785'
    const address = '14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo'

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
