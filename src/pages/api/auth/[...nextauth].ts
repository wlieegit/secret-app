import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { isPolkadotAddress } from "@/utils";

type CustomSession = Session & { address?: string };

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        address: {
          label: "Address",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        if (!isPolkadotAddress(credentials?.address)) {
          throw new Error('address is not a polkadot address')
        }
        return {
          id: credentials?.address,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async session({ session, token }: { session: CustomSession; token: JWT }) {
      session.address = token.sub;
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
});
