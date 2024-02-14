import * as AWS from 'aws-sdk';

// Initialize the DynamoDB DocumentClient for interacting with DynamoDB
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Retrieve the name of the clients table from environment variables, or use a default value
const clientsTable = process.env.CLIENTS_TABLE || 'Clients';

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
    // Extract the clientId from the API request's path parameters
    const clientId = event.pathParameters?.clientId;

    // Define parameters for the DynamoDB delete operation
    const params = {
        TableName: clientsTable,
        Key: {
            clientId,
        },
    };

    try {
        // Attempt to delete the specified client from the DynamoDB table
        await dynamoDb.delete(params).promise();
        // Return a 200 OK response indicating the client was successfully deleted
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
            },
            body: JSON.stringify({ message: "Client deleted successfully" }),
        };
    } catch (error) {
        // Log the error for debugging purposes
        console.error(error);
        // Return a 500 Internal Server Error response if the delete operation fails
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ error: 'Could not delete client' }),
        };
    }
};
