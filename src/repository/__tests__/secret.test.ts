import {dynamodbDocument} from '@/utils/dynamodb'
import {getRandomSecret, TableName} from '@/repository/secret'
import initDatas from '@/../scripts/init_data.json'

describe('secret repository', () => {
  describe('getRandomSecret', () => {
    it('should return any number when there has data in db', async () => {
      const secrets = []
      for (const initData of initDatas) {
        await dynamodbDocument.put({
          TableName,
          Item: {id: initData.id, secret: initData.secret},
        })
        secrets.push(initData.secret)
      }

      for (let i = 0; i < 100; i++) {
        const secret = await getRandomSecret()
        expect(secrets.includes(secret)).toBeTruthy()
      }

      for (const initData of initDatas) {
        await dynamodbDocument.delete({
          TableName,
          Key: {id: initData.id},
        })
      }
    })

    it('should return null when there has no data in db', async () => {
      const secret = await getRandomSecret()
      expect(secret).toBeNull()
    })
  })
})
