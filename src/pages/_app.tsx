import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {SessionProvider} from 'next-auth/react'

export default function App({Component, pageProps}: AppProps) {
  return (
    <SessionProvider
      session={pageProps.session}
      // Re-fetch session every 5 minutes
      refetchInterval={5 * 60}
      // Re-fetches session when window is focused
      refetchOnWindowFocus={true}
      // No polling new session during device offline
      refetchWhenOffline={false}
    >
      <Component {...pageProps} />
    </SessionProvider>
  )
}
