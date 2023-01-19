import Connect from '@/components/Connect'
import {usePolkadot} from '@/hooks/usePolkadot'
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('@/hooks/usePolkadot')
const usePolkadotMock = jest.mocked(usePolkadot)
const useRouter = jest.spyOn(require('next/router'), 'useRouter')
useRouter.mockImplementation(() => ({
  pathname: '/',
}))

describe('<Connect />', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should display error when usePolkadot return error', () => {
    usePolkadotMock.mockReturnValue({
      accounts: [],
      hasAccount: false,
      error: new Error('test message'),
    } as any)
    const {getByText} = render(<Connect />)

    expect(getByText('Error with connect: test message')).toBeInTheDocument()
  })

  it('should show connect button when accounts is empty', () => {
    usePolkadotMock.mockReturnValue({
      accounts: [],
      hasAccount: false,
    } as any)
    const {getByTestId} = render(<Connect />)

    expect(getByTestId('connect-button')).toHaveTextContent('Connect')
  })

  it('should show signin button when accounts is not empty', () => {
    usePolkadotMock.mockReturnValue({
      accounts: [
        {
          address: 'test address',
          meta: {
            name: 'test name',
          },
        },
      ],
      hasAccount: true,
    } as any)
    const {getByTestId} = render(<Connect />)

    expect(getByTestId('connect-button')).toHaveTextContent('Signin')
  })

  it('should show account list when accounts is not empty', () => {
    usePolkadotMock.mockReturnValue({
      accounts: [
        {
          address: 'test address',
          meta: {
            name: 'test name',
          },
        },
      ],
      hasAccount: true,
    } as any)
    const {getAllByTestId} = render(<Connect />)

    expect(getAllByTestId('account-item').length).toBe(1)
  })

  it('should show account list when accounts is not empty', () => {
    const setSelectedAccountMock = jest.fn()
    const account = {
      address: 'test address',
      meta: {
        name: 'test name',
      },
    }
    usePolkadotMock.mockReturnValue({
      accounts: [account],
      hasAccount: true,
      setSelectedAccount: setSelectedAccountMock,
    } as any)
    const {getByTestId} = render(<Connect />)

    fireEvent.click(getByTestId('account-item'))
    expect(setSelectedAccountMock).toBeCalledWith(account)
  })
})
