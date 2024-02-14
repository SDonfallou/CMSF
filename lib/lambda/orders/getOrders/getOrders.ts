import * as AWS from 'aws-sdk';

// Initialize the DynamoDB DocumentClient for interacting with the database.
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Retrieve the name of the orders table from environment variables, or use 'Orders' as a default.
const ordersTable = process.env.ORDERS_TABLE || 'Orders';

export const handler = async (): Promise<AWSLambda.APIGatewayProxyResult> => {
    const params = {
        TableName: ordersTable,
    };

    try {
        // Perform a scan operation to retrieve all orders from the specified table.
        const { Items } = await dynamoDb.scan(params).promise();
        // Return a successful 200 response with the retrieved items.
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Include CORS headers for web application compatibility.
                "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials in a cross-origin manner.
            },
            body: JSON.stringify(Items),
        };
    } catch (error) {
        // Log any errors encountered during the operation for debugging.
        console.error(error);
        // Return a 500 Internal Server Error response if the operation fails.
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // Ensure error messages are accessible to the client in a cross-origin situation.
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ error: 'Could not retrieve orders' }),
        };
    }
};
