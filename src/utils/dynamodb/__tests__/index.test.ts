import { client } from '../index';

const TableName = process.env.DYNAMODB_TABLE_NAME;

describe('dynamodb', () => {
    it('should insert item into table', async () => {
        await client.put({ TableName, Item: { id: '1', data: 'test data' } });
        const { Item } = await client.get({ TableName, Key: { id: '1' } });
        expect(Item).toEqual({
            id: '1',
            data: 'test data',
        });
    });
});