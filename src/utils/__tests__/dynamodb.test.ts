import {dynamodbDocument} from '../dynamodb'

const TableName = process.env.DYNAMODB_TABLE_NAME

describe('dynamodb', () => {
  it('should insert item into table', async () => {
    await dynamodbDocument.put({TableName, Item: {id: 1, data: 'test data'}})
    const {Item} = await dynamodbDocument.get({TableName, Key: {id: 1}})
    expect(Item).toEqual({
      id: 1,
      data: 'test data',
    })

    // clean up
    await dynamodbDocument.delete({TableName, Key: {id: 1}})
  })
})

describe('dynamodb test for aws keys', () => {
  let JEST_WORKER_ID = undefined
  let DYNAMODB_ENDPOINT = undefined
  beforeAll(() => {
    // Use aws access key create sdk document
    JEST_WORKER_ID = process.env.JEST_WORKER_ID
    DYNAMODB_ENDPOINT = process.env.S_AWS_REGION
    delete process.env.JEST_WORKER_ID
    delete process.env.DYNAMODB_ENDPOINT

    process.env.S_AWS_ACCESS_KEY = 'fake key'
    process.env.S_AWS_SECRET_KEY = 'fake secret'
    process.env.S_AWS_REGION = 'ap-southeast-2'
  })

  afterAll(() => {
    process.env.JEST_WORKER_ID = JEST_WORKER_ID
    process.env.DYNAMODB_ENDPOINT = DYNAMODB_ENDPOINT

    delete process.env.S_AWS_ACCESS_KEY
    delete process.env.S_AWS_SECRET_KEY
    delete process.env.S_AWS_REGION
  })

  it('should works in aws env', async () => {
    jest.resetModules()
    const dynamodb = require('../dynamodb')
    const dynamodbDocument = dynamodb.dynamodbDocument
    expect(dynamodbDocument.get({TableName, Key: {id: 1}})).rejects.toThrow()
  })
})
