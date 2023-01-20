import {dynamodbDocument} from '@/utils/dynamodb'
import {getRandomSecret, TableName} from '@/repository/secret'

describe('secret repository', () => {
  describe('getRandomSecret', () => {
    it('should return any number when there has data in db', async () => {
      const secrets = []
      const putRequests = []
      const deleteRequests = []
      for (let id = 1; id <= 10; id++) {
        const secret = `test data-${id}`
        secrets.push(secret)
        putRequests.push({PutRequest: {Item: {id, secret}}})
        deleteRequests.push({DeleteRequest: {Key: {id}}})
      }
      await dynamodbDocument.batchWrite({
        RequestItems: {[TableName]: putRequests},
      })

      for (let i = 0; i < 100; i++) {
        const secret = await getRandomSecret()
        expect(secrets.includes(secret)).toBeTruthy()
      }

      await dynamodbDocument.batchWrite({
        RequestItems: {[TableName]: deleteRequests},
      })
    })

    it('should return null when there has no data in db', async () => {
      const secret = await getRandomSecret()
      expect(secret).toBeNull()
    })
  })
})
