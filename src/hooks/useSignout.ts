import {useCallback, useEffect} from 'react'
import {useSession, signOut} from 'next-auth/react'
import type {Session} from 'next-auth/core/types'

type UseSignoutData = {
  handleSignout: () => Promise<void>
  session: Session
  isAuthenticated: boolean
}

export function useSignout(): UseSignoutData {
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
  }
}
