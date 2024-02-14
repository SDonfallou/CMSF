import * as AWS from 'aws-sdk';

// Initialize AWS SDK DynamoDB DocumentClient
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Retrieve the clients table name from environment variables, or use 'Clients' as a default
const clientsTable = process.env.CLIENTS_TABLE || 'Clients';

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
    // Extract clientId from the path parameters of the API request
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
        // Return a 200 OK response with a success message
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Include CORS headers to allow cross-origin requests
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ message: "Client deleted successfully" }),
        };
    } catch (error) {
        // Log the error to CloudWatch
        console.error(error);
        // Return a 500 Internal Server Error response if the delete operation fails
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // Include CORS headers to ensure the error response is accessible to the client
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ error: 'Could not delete client' }),
        };
    }
};
