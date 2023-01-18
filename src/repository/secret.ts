import {client} from '@/utils/dynamodb'

export const TableName = process.env.DYNAMODB_TABLE_NAME ?? 'Secret'

export async function getRandomSecret(): Promise<string | null> {
  const result = await client.scan({
    TableName,
    Select: 'COUNT',
  })
  const count = result.Count ?? 0
  if (count === 0) {
    return null
  }

  const random = Math.max(Math.round(Math.random() * count), 1)
  const item = await client.get({
    TableName,
    Key: {
      id: random,
    },
  })
  return item.Item.secret
}
