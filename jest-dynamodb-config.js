/**
 * @type {import('@shelf/jest-dynamodb/lib').Config}')}
 */
require('dotenv').config({path: './.env.test'})

const config = {
  tables: [
    {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeySchema: [{AttributeName: 'id', KeyType: 'HASH'}],
      AttributeDefinitions: [{AttributeName: 'id', AttributeType: 'S'}],
      ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
    },
  ],
  port: 8000,
}
module.exports = config
