import * as AWS from 'aws-sdk';

// Initialize the DynamoDB DocumentClient
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Retrieve the DynamoDB table name from environment variables or use a default value
const clientsTable = process.env.CLIENTS_TABLE || 'Clients';

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
    // Extract the clientId from the API request path parameters
    const clientId = event.pathParameters?.clientId;

    // Define parameters for the DynamoDB get operation
    const params = {
        TableName: clientsTable,
        Key: {
            clientId,
        },
    };

    try {
        // Attempt to retrieve the specified client from the DynamoDB table
        const { Item } = await dynamoDb.get(params).promise();
        // Check if the client was found and return the appropriate response
        return Item 
            ? {  
                statusCode: 200, 
                headers: {
                    "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                    "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
                },
                body: JSON.stringify(Item) 
              } 
            : { 
                statusCode: 404, 
                headers: {
                    "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                    "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
                },
                body: JSON.stringify({ error: 'Client not found' }) 
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
            body: JSON.stringify({ error: 'Could not retrieve client' }) 
        };
    }
};