import * as AWS from 'aws-sdk';

// Initialize the DynamoDB DocumentClient
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Retrieve the DynamoDB table name from environment variables or use 'Clients' as a default value
const clientsTable = process.env.CLIENTS_TABLE || 'Clients';

export const handler = async (): Promise<AWSLambda.APIGatewayProxyResult> => {
    const params = {
        TableName: clientsTable,
    };

    try {
        // Perform a scan operation to retrieve all clients from the table
        const { Items } = await dynamoDb.scan(params).promise();
        // Return a 200 OK response with the retrieved items
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
            },
            body: JSON.stringify(Items)
        };
    } catch (error) {
        // Log the error for debugging purposes
        console.error(error);
        // Return a 500 Internal Server Error response if the operation fails
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
            },
            body: JSON.stringify({ error: 'Could not retrieve clients' })
        };
    }
};
