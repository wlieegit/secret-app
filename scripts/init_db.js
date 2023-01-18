const {
  DynamoDBClient,
  CreateTableCommand,
  PutItemCommand,
} = require('@aws-sdk/client-dynamodb')
const dotenv = require('dotenv')
const initData = require('./init_data.json')

dotenv.config({path: '.env.devops'})

// add 'S' prefix to avoid conflict with the reserved env variable name at Vercel
// https://vercel.com/docs/concepts/limits/overview?query=reserve#reserved-variables
const client = new DynamoDBClient({
  region: process.env.S_AWS_REGION,
  credentials: {
    accessKeyId: process.env.S_AWS_ACCESS_KEY,
    secretAccessKey: process.env.S_AWS_SECRET_KEY,
  },
})

initTable()

async function initTable() {
  const tableName = 'Secret'
  try {
    const command = new CreateTableCommand({
      TableName: tableName,
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'N',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    })
    await client.send(command)
    console.log(`Table created: ${tableName}`)
  } catch (error) {
    if (`Table already exists: ${tableName}` === error.message) {
      console.log(error.message)
    } else {
      throw error
    }
  }

  try {
    console.log('Upsert secret data')
    for (const data of initData) {
      const command = new PutItemCommand({
        TableName: tableName,
        Item: {
          id: {
            N: `${data.id}`,
          },
          secret: {
            S: data.secret,
          },
        },
      })
      await client.send(command)
    }
    console.log('Upsert secret data: success')
  } catch (error) {
    throw error
  }
}
