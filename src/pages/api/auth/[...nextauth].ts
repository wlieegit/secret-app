import type {JWT} from 'next-auth/jwt'
import NextAuth, {Session} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import {polkadotAuthorize} from '@/pages/api/auth/authorize'

const maxAge = 3600 // expires in 1 hour to be safe, as already have session refresh built in nextauth

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'polkadot', //
      name: 'Polkadot',
      credentials: {
        address: {type: 'text'},
        message: {type: 'text'},
        signature: {type: 'text'},
      },
      async authorize({address, message, signature}) {
        return polkadotAuthorize(address, message, signature)
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge,
  },
  callbacks: {
    // /session api
    async session({session, token}: {session: Session; token: JWT}) {
      return {...session, user: {address: token.sub}} as Session
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: '/signin',
    signOut: '/signin',
  },
})
