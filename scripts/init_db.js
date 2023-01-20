const {
  DynamoDBClient,
  CreateTableCommand,
  PutItemCommand,
} = require('@aws-sdk/client-dynamodb')
const dotenv = require('dotenv')
const initData = require('./init_data.json')

if (process.argv.length === 3) {
  switch (process.argv[2]) {
    case 'local': {
      dotenv.config({path: '.env'})
      dotenv.config({path: '.env.local'})
      const client = new DynamoDBClient({
        endpoint: process.env.DYNAMODB_ENDPOINT,
      })
      initTable(client, process.env.DYNAMODB_TABLE_NAME, true)
      break
    }
    case 'test': {
      dotenv.config({path: '.env.test'})
      const client = new DynamoDBClient({
        endpoint: process.env.DYNAMODB_ENDPOINT,
      })
      initTable(client, process.env.DYNAMODB_TABLE_NAME)
      break
    }
    case 'prod': {
      dotenv.config({path: '.env'})
      dotenv.config({path: '.env.prod'})
      const client = new DynamoDBClient({
        // add 'S' prefix to avoid conflict with the reserved env variable name at Vercel
        // https://vercel.com/docs/concepts/limits/overview?query=reserve#reserved-variables
        region: process.env.S_AWS_REGION,
        credentials: {
          accessKeyId: process.env.S_AWS_ACCESS_KEY,
          secretAccessKey: process.env.S_AWS_SECRET_KEY,
        },
      })
      initTable(client, process.env.DYNAMODB_TABLE_NAME, true)
      break
    }
  }
}

async function initTable(client, tableName, addData) {
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
    if ((error.code === 'ECONNRESET')) {
      // try again, until dyanmodb service up
      return initTable(client, tableName, addData)
    }
    if (`Table already exists: ${tableName}` === error.message) {
      console.log(error.message)
    } else {
      throw error
    }
  }

  if (addData) {
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
}

module.exports.initTable = initTable
