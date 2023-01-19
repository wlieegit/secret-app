import {useSignout} from '@/hooks/useSignout'
import {renderHook} from '@testing-library/react-hooks'
import {signOut, useSession} from 'next-auth/react'

jest.mock('next-auth/react')
const signOutMock = jest.mocked(signOut)
const useSessionMock = jest.mocked(useSession)

describe('useSignout', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should not call signOut when session status is loading', () => {
    useSessionMock.mockReturnValueOnce({
      status: 'loading',
      data: null,
    })
    const {result} = renderHook(() => useSignout())

    expect(result.current.session).toBeNull()
    expect(result.current.isAuthenticated).toBeFalsy()
    expect(signOutMock).toBeCalledTimes(0)
  })

  it('should not call signOut when session status is authenticated', () => {
    const data = {user: {address: 'address'}}
    useSessionMock.mockReturnValueOnce({
      status: 'authenticated',
      data: data as any,
    })
    const {result} = renderHook(() => useSignout())

    expect(result.current.session).toBe(data)
    expect(result.current.isAuthenticated).toBeTruthy()
    expect(signOutMock).toBeCalledTimes(0)
  })

  it('should call signOut when session status is unauthenticated', () => {
    useSessionMock.mockReturnValueOnce({
      status: 'unauthenticated',
      data: null,
    })
    const {result} = renderHook(() => useSignout())

    expect(result.current.session).toBeNull()
    expect(result.current.isAuthenticated).toBeFalsy()
    expect(signOutMock).toBeCalledTimes(1)
    expect(signOutMock).toBeCalledWith({callbackUrl: '/signin'})
  })
})
