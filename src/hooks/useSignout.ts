import {useCallback, useEffect} from 'react'
import {useSession, signOut} from 'next-auth/react'

export default function () {
  const session = useSession()
  const handleSignout = useCallback(async () => {
    await signOut({callbackUrl: '/signin'})
  }, [])

  useEffect(() => {
    if (session.status !== 'authenticated' && session.status !== 'loading') {
      handleSignout()
    }
  }, [session.status, handleSignout])

  return {
    handleSignout,
    session: session.data,
    isAuthenticated: session.status === 'authenticated',
  } as const
}
