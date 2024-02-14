import * as AWS from 'aws-sdk';

// Initialize the DynamoDB DocumentClient for database operations
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Retrieve the DynamoDB table name from environment variables, or use 'Orders' as a default value
const ordersTable = process.env.ORDERS_TABLE || 'Orders';

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
    // Extract the orderId from the path parameters of the API request
    const orderId = event.pathParameters?.orderId;

    // Define parameters for the DynamoDB delete operation
    const params = {
        TableName: ordersTable,
        Key: {
            orderId,
        },
    };

    try {
        // Attempt to delete the specified order from the DynamoDB table
        await dynamoDb.delete(params).promise();
        // Return a 204 No Content response indicating successful deletion without sending any body
        return {
            statusCode: 204,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
            },
            body: '' // No body needed for a 204 response
        };
    } catch (error) {
        // Log the error for debugging purposes
        console.error(error);
        // Return a 500 Internal Server Error response if the deletion operation fails
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
            },
            body: JSON.stringify({ error: 'Could not delete order' })
        };
    }
};
