import * as AWS from 'aws-sdk';

// Initialize the DynamoDB DocumentClient for database operations
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Retrieve the DynamoDB table name from environment variables, or use a default value if not specified
const clientsTable = process.env.CLIENTS_TABLE || 'Clients';

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
    // Extract the clientId from the path parameters of the incoming API request
    const clientId = event.pathParameters?.clientId;
    // Parse the request body to get the updated client details
    const requestBody = JSON.parse(event.body || '{}');
    const { clientName, contactInfo, address, otherDetails } = requestBody;

    // Define parameters for the DynamoDB update operation
    const params = {
        TableName: clientsTable,
        Key: {
            clientId,
        },
        UpdateExpression: "set clientName = :n, contactInfo = :c, address = :a, otherDetails = :o",
        ExpressionAttributeValues: {
            ":n": clientName,
            ":c": contactInfo,
            ":a": address,
            ":o": otherDetails,
        },
        ReturnValues: "UPDATED_NEW",
    };

    try {
        // Attempt to update the client information in the DynamoDB table
        const result = await dynamoDb.update(params).promise();
        // Return a 200 OK response with the updated attributes of the client
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
            },
            body: JSON.stringify(result)
        };
    } catch (error) {
        // Log the error to CloudWatch for debugging purposes
        console.error(error);
        // Return a 500 Internal Server Error response if the update operation fails
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
            },
            body: JSON.stringify({ error: 'Could not update client' })
        };
    }
};
