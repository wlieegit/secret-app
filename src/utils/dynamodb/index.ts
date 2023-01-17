import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

export const client = DynamoDBDocument.from(
    new DynamoDBClient(process.env.JEST_WORKER_ID
        ? { endpoint: process.env.DYNAMODB_ENDPOINT ?? '' } :
        {
            credentials: {
                accessKeyId: process.env.DYNAMODB_ACCESS_KEY ?? '',
                secretAccessKey: process.env.DYNAMODB_SECRET_KEY ?? '',
            },
            region: process.env.DYNAMODB_REGION ?? '',
        }
    ), {
    marshallOptions: {
        convertEmptyValues: true,
    },
});
