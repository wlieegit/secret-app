import SecretPage from '@/pages/index'
import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import {useSignout} from '@/hooks/useSignout'

jest.mock('@/hooks/useSignout')
const useSignoutMock = jest.mocked(useSignout)

describe('<SecretPage />', () => {
  it('should render nothing when isAuthenticated is false', () => {
    useSignoutMock.mockReturnValueOnce({isAuthenticated: false} as any)
    render(<SecretPage />)

    expect(screen.queryByTestId('page-container')).not.toBeInTheDocument()
  })
})
