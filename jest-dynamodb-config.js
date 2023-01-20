/**
 * @type {import('@shelf/jest-dynamodb/lib').Config}')}
 */
require('dotenv').config({path: './.env.test'})

const config = {
  tables: [
    {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeySchema: [{AttributeName: 'id', KeyType: 'HASH'}],
      AttributeDefinitions: [{AttributeName: 'id', AttributeType: 'N'}],
      ProvisionedThroughput: {ReadCapacityUnits: 5, WriteCapacityUnits: 5},
    },
  ],
  port: process.env.DYNAMODB_PORT || 8000,
}
module.exports = config
