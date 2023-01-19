import {usePolkadot} from '@/hooks/usePolkadot'
import {renderHook, act} from '@testing-library/react-hooks'
import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp'

jest.mock('@polkadot/extension-dapp', () => ({
  ...jest.requireActual('@polkadot/extension-dapp'),
  isWeb3Injected: true,
  web3Accounts: jest.fn(),
  web3Enable: jest.fn(),
  web3FromSource: jest.fn(),
}))
const web3AccountsMock = jest.mocked(web3Accounts)
const web3EnableMock = jest.mocked(web3Enable)
const web3FromSourceMock = jest.mocked(web3FromSource)

describe('usePolkadot - Web3IsInjected', () => {
  const account = {
    address: '14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo',
    meta: {source: 'polkadot'},
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should call connect when autoConnect is true', async () => {
    web3EnableMock.mockResolvedValueOnce([])
    const {result, waitForNextUpdate} = renderHook(() => usePolkadot(true))
    await waitForNextUpdate()

    expect(web3EnableMock).toBeCalledWith('secret-app')
    expect(result.current.error).toEqual(new Error('NO_INJECTED_EXTENSIONS'))
  })

  it('should throw error when no account is connected', async () => {
    web3EnableMock.mockResolvedValueOnce([{} as any])
    web3AccountsMock.mockResolvedValueOnce([])
    const {result, waitForNextUpdate} = renderHook(() => usePolkadot(true))
    await waitForNextUpdate()

    expect(result.current.error).toEqual(new Error('NO_ACCOUNTS_CONNECTED'))
  })

  it('should return account when account is connected', async () => {
    web3EnableMock.mockResolvedValueOnce([{} as any])
    web3AccountsMock.mockResolvedValueOnce([account])
    const {result, waitForNextUpdate} = renderHook(() => usePolkadot(true))
    await waitForNextUpdate()

    expect(result.current.accounts).toEqual([account])
    expect(result.current.hasAccount).toBeTruthy()
    expect(result.current.selectedAccount).toBeUndefined()
    expect(result.current.error).toBeNull()
  })

  it('should return account after call connect', async () => {
    web3EnableMock.mockResolvedValueOnce([{} as any])
    web3AccountsMock.mockResolvedValueOnce([account])
    const {result} = renderHook(() => usePolkadot())
    await act(async () => {
      await result.current.connect()
    })

    expect(result.current.accounts).toEqual([account])
    expect(result.current.hasAccount).toBeTruthy()
    expect(result.current.selectedAccount).toBeUndefined()
    expect(result.current.error).toBeNull()
  })

  it('should return undefined when account signer is undefined', async () => {
    web3EnableMock.mockResolvedValueOnce([{} as any])
    web3AccountsMock.mockResolvedValueOnce([account])
    web3FromSourceMock.mockResolvedValueOnce({} as any)
    const {result, waitForNextUpdate} = renderHook(() => usePolkadot(true))
    await waitForNextUpdate()
    const signature = await result.current.getSignature(
      'Sign-in request for address 14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo.',
      account,
    )

    expect(signature).toBeUndefined()
  })

  it('should return error when account signer throw error', async () => {
    web3EnableMock.mockResolvedValueOnce([{} as any])
    web3AccountsMock.mockResolvedValueOnce([account])
    const signRawMock = jest.fn()
    signRawMock.mockImplementationOnce(() => {
      throw new Error('Cancelled')
    })
    web3FromSourceMock.mockResolvedValueOnce({
      signer: {
        signRaw: signRawMock,
      },
    } as any)
    const {result, waitForNextUpdate} = renderHook(() => usePolkadot(true))
    await waitForNextUpdate()

    await act(async () => {
      await result.current.getSignature(
        'Sign-in request for address 14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo.',
        account,
      )
    })

    expect(result.current.error).toEqual(new Error('Cancelled'))
  })

  it('should return signature when account signer sign success', async () => {
    web3EnableMock.mockResolvedValueOnce([{} as any])
    web3AccountsMock.mockResolvedValueOnce([account])
    const signRawMock = jest.fn()
    signRawMock.mockResolvedValueOnce({
      signature: 'test signature',
    })
    web3FromSourceMock.mockResolvedValueOnce({
      signer: {
        signRaw: signRawMock,
      },
    } as any)
    const {result} = renderHook(() => usePolkadot())
    act(() => {
      result.current.setSelectedAccount(account)
    })

    let signature: any
    await act(async () => {
      signature = await result.current.getSignature(
        'Sign-in request for address 14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo.',
      )
    })

    expect(result.current.selectedAccount).toEqual(account)
    expect(signature).toBe('test signature')
  })
})
