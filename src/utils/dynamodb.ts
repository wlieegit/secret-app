import {DynamoDBClient} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocument} from '@aws-sdk/lib-dynamodb'

if (process.env.DYNAMODB_ENDPOINT && !process.env.AWS_REGION) {
  //set a test region for dynamodb local
  process.env.AWS_REGION = 'ap-southeast-2'
}

export const dynamodbDocument = DynamoDBDocument.from(
  new DynamoDBClient(
    process.env.JEST_WORKER_ID || process.env.DYNAMODB_ENDPOINT
      ? {endpoint: process.env.DYNAMODB_ENDPOINT ?? ''}
      : {
          // add 'S' prefix to avoid conflict with the reserved env variable name at Vercel
          // https://vercel.com/docs/concepts/limits/overview?query=reserve#reserved-variables
          credentials: {
            accessKeyId: process.env.S_AWS_ACCESS_KEY ?? '',
            secretAccessKey: process.env.S_AWS_SECRET_KEY ?? '',
          },
          region: process.env.S_AWS_REGION ?? '',
        },
  ),
  {
    marshallOptions: {
      convertEmptyValues: true,
    },
  },
)
