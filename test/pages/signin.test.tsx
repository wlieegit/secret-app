import SigninPage, {getServerSideProps} from '@/pages/signin'
import '@testing-library/jest-dom'
import {render} from '@testing-library/react'
import {getSession} from 'next-auth/react'

jest.mock('next-auth/react')
const getSessionMock = jest.mocked(getSession)

describe('<SigninPage />', () => {
  it('should display title ', () => {
    const {getByText} = render(<SigninPage />)

    expect(getByText('Signin with Polkadot')).toBeInTheDocument()
  })

  it('should return redirect data when session is exists', async () => {
    getSessionMock.mockResolvedValueOnce({} as any)
    const result = await getServerSideProps({} as any)

    expect(result).toEqual({
      redirect: {
        destination: '/',
        permanent: true,
      },
    })
  })

  it('should return props data when session is not exists', async () => {
    getSessionMock.mockResolvedValueOnce(null)
    const result = await getServerSideProps({} as any)

    expect(result).toEqual({
      props: {},
    })
  })
})
