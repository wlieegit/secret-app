import {createMocks, RequestMethod} from 'node-mocks-http'
import handler from '../secret'
import http from 'http'
import {encode} from 'next-auth/jwt'
import initDatas from '@/../scripts/init_data.json'
import {dynamodbDocument} from '@/utils/dynamodb'

const TableName = process.env.DYNAMODB_TABLE_NAME
let token = ''

describe('secret api test', () => {
  beforeAll(async () => {
    token = await encode({
      secret: process.env.JWT_SECRET,
    })
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  const noGetMethods = http.METHODS.filter((it) => it !== 'GET').map((it) => {
    return {method: it}
  })

  it.each(noGetMethods)('should fail if method not GET', async ({method}) => {
    const {req, res} = createMocks({
      method: method as RequestMethod,
    })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(405)
  })

  it('should fail if not pass token', async () => {
    const {req, res} = createMocks({
      method: 'GET',
    })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(401)
  })

  it('should fail if database has no data', async () => {
    const {req, res} = createMocks({
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(404)
  })

  it('should return a random secret from database', async () => {
    const secrets = new Set()
    const responseSecrets = new Set()
    for (const initData of initDatas) {
      await dynamodbDocument.put({
        TableName,
        Item: {id: initData.id, secret: initData.secret},
      })
      secrets.add(initData.secret)
    }

    for (let i = 0; i < 100; i++) {
      const {req, res} = createMocks({
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      await handler(req, res)
      expect(res._getStatusCode()).toBe(200)
      const secret = JSON.parse(res._getData()).secret
      expect(secrets.has(secret)).toBeTruthy()
      responseSecrets.add(secret)
    }

    //Get 100 times, we can think that at least 2 of the 10 data can be randomly selected
    expect(responseSecrets.size).toBeGreaterThan(2)

    for (const initData of initDatas) {
      await client.delete({
        TableName,
        Key: {id: initData.id},
      })
    }
  })
})
