import {DynamoDBClient} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocument} from '@aws-sdk/lib-dynamodb'

export const client = DynamoDBDocument.from(
  new DynamoDBClient(
    process.env.JEST_WORKER_ID || process.env.DYNAMODB_ENDPOINT
      ? {endpoint: process.env.DYNAMODB_ENDPOINT ?? ''}
      : {
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY ?? '',
            secretAccessKey: process.env.AWS_SECRET_KEY ?? '',
          },
          region: process.env.AWS_REGION ?? '',
        },
  ),
  {
    marshallOptions: {
      convertEmptyValues: true,
    },
  },
)
