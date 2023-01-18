import type {JWT} from 'next-auth/jwt'
import NextAuth, {Session} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import {isValidAddress, isValidSignature} from '@/utils/polkadot'

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'polkadot',
      name: 'Polkadot',
      credentials: {
        address: {type: 'text'},
        message: {type: 'text'},
        signature: {type: 'text'},
      },
      async authorize({address, message, signature}) {
        const isAddressValid = await isValidAddress(address)
        if (!isAddressValid) {
          throw new Error('polkadot isAddressValid is invalid')
        }
        const isSignatureValid = await isValidSignature(
          message,
          signature,
          address,
        )
        if (!isSignatureValid) {
          throw new Error('polkadot signature is invalid')
        }
        return {
          id: address,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async session({session, token}: {session: Session; token: JWT}) {
      return {...session, user: {address: token.sub}} as Session
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
})
