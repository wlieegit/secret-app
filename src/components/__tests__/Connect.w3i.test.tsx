import Connect from '@/components/Connect'
import {act, render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp'
import {signIn} from 'next-auth/react'

jest.mock('@polkadot/extension-dapp', () => ({
  isWeb3Injected: true,
  web3Accounts: jest.fn(),
  web3Enable: jest.fn(),
  web3FromSource: jest.fn(),
}))
const web3AccountsMock = jest.mocked(web3Accounts)
const web3EnableMock = jest.mocked(web3Enable)
const web3FromSourceMock = jest.mocked(web3FromSource)
const useRouter = jest.spyOn(require('next/router'), 'useRouter')
useRouter.mockImplementation(() => ({
  pathname: '/',
}))
jest.mock('next-auth/react')
const signInMock = jest.mocked(signIn)

describe('<Connect /> - Web3IsInjected', () => {
  const account = {
    address: '14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo',
    meta: {source: 'polkadot'},
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should call connect when accounts is empty after click button', async () => {
    web3EnableMock.mockResolvedValueOnce([{} as any])
    web3AccountsMock.mockResolvedValueOnce([account])
    const {getByTestId, getAllByTestId} = render(<Connect />)

    await act(() => {
      fireEvent.click(getByTestId('connect-button'))
    })

    expect(web3EnableMock).toBeCalledTimes(1)
    expect(web3AccountsMock).toBeCalledTimes(1)
    expect(getAllByTestId('account-item').length).toBe(1)
  })

  it('should call signin when accounts is not empty after click button', async () => {
    web3EnableMock.mockResolvedValueOnce([{} as any])
    web3AccountsMock.mockResolvedValueOnce([account])
    signInMock.mockResolvedValueOnce({ok: true} as any)
    const signRawMock = jest.fn()
    signRawMock.mockResolvedValueOnce({
      signature: 'test signature',
    })
    web3FromSourceMock.mockResolvedValueOnce({
      signer: {
        signRaw: signRawMock,
      },
    } as any)
    const {getByTestId} = render(<Connect />)

    await act(() => {
      fireEvent.click(getByTestId('connect-button'))
    })

    await act(() => {
      fireEvent.click(getByTestId('account-item'))
    })

    await act(() => {
      fireEvent.click(getByTestId('connect-button'))
    })

    expect(signInMock).toBeCalledTimes(1)
    expect(signInMock).toBeCalledWith('polkadot', {
      address: '14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo',
      message:
        'Sign-in request for address 14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo.',
      redirect: false,
      signature: 'test signature',
    })
  })

  it('should display error message when signin error', async () => {
    web3EnableMock.mockResolvedValueOnce([{} as any])
    web3AccountsMock.mockResolvedValueOnce([account])
    signInMock.mockResolvedValueOnce({ok: false, error: 'test fail'} as any)
    const signRawMock = jest.fn()
    signRawMock.mockResolvedValueOnce({
      signature: 'test signature',
    })
    web3FromSourceMock.mockResolvedValueOnce({
      signer: {
        signRaw: signRawMock,
      },
    } as any)
    const {getByTestId, getByText} = render(<Connect />)

    await act(() => {
      fireEvent.click(getByTestId('connect-button'))
    })

    await act(() => {
      fireEvent.click(getByTestId('account-item'))
    })

    await act(() => {
      fireEvent.click(getByTestId('connect-button'))
    })

    expect(getByText('Error with signin: test fail')).toBeInTheDocument()
  })
})
