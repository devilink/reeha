const AWS = require('aws-sdk');

// Initialize AWS with Environment Variables (Region is hardcoded)
AWS.config.update({
    region: 'eu-north-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const tableName = 'Products';

        const params = {
            TableName: tableName
        };

        const data = await docClient.scan(params).promise();
        let products = data.Items || [];

        // Sort by name descending (Natural sort)
        products.sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' }));

        return res.status(200).json(products);

    } catch (err) {
        console.error("DynamoDB Error:", err);
        return res.status(500).json({ error: 'Failed to fetch products', details: err.message });
    }
}
