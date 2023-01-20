const {DynamoDBClient, CreateTableCommand} = require('@aws-sdk/client-dynamodb')
const dotenv = require('dotenv')

dotenv.config({path: '.env.test'})

// add 'S' prefix to avoid conflict with the reserved env variable name at Vercel
// https://vercel.com/docs/concepts/limits/overview?query=reserve#reserved-variables
const client = new DynamoDBClient({
  region: 'ap-southeast-2',
  endpoint: process.env.DYNAMODB_ENDPOINT,
})

initTable()

async function initTable() {
  const tableName = process.env.DYNAMODB_TABLE_NAME
  
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
    if (error.code = 'ECONNRESET') {
      // try again, until dyanmodb service up
      return initTable()
    }
    if (`Table already exists: ${tableName}` === error.message) {
      console.log(error.message)
    } else {
      throw error
    }
  }
}
