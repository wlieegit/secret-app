import {dynamodbDocument} from '@/utils/dynamodb'

export const TableName = process.env.DYNAMODB_TABLE_NAME

export async function getRandomSecret(): Promise<string | null> {
  const result = await dynamodbDocument.scan({
    TableName,
    Select: 'COUNT',
  })
  const count = result.Count
  if (!count) {
    return null
  }

  const random = Math.max(Math.round(Math.random() * count), 1)
  const item = await dynamodbDocument.get({
    TableName,
    Key: {
      id: random,
    },
  })
  return item.Item.secret
}
