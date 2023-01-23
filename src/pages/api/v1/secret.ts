import type {NextApiRequest, NextApiResponse} from 'next'
import {getRandomSecret} from '@/repository/secret'
import {getToken} from 'next-auth/jwt'

type Data = {
  secret: string
}

async function handlerGet(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token = await getToken({req, secret: process.env.JWT_SECRET}) // recommanded way to verify, vs unstable_getServerSession
  if (!token) {
    res.status(401).end('User not signin')
    return
  }
  const secret = await getRandomSecret()
  if (!secret) {
    res.status(404).end('No secret message found')
    return
  }
  res.status(200).json({secret})
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // nextjs doesn't have router so it comes with all http method for one url path
  if (req.method === 'GET') {
    await handlerGet(req, res)
  } else {
    res.status(405).end('Method Not Allowed')
  }
}
