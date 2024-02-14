import * as AWS from 'aws-sdk';

// Initialize the DynamoDB DocumentClient to interact with the database
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Retrieve the name of the orders table from environment variables, or use a default value
const ordersTable = process.env.ORDERS_TABLE || 'Orders';

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
    // Extract the orderId from the API request's path parameters
    const orderId = event.pathParameters?.orderId;

    // Set up parameters for the DynamoDB get operation
    const params = {
        TableName: ordersTable,
        Key: {
            orderId,
        },
    };

    try {
        // Attempt to retrieve the specified order from the DynamoDB table
        const { Item } = await dynamoDb.get(params).promise();
        // If an item is found, return a 200 OK response with the item data
        return Item 
            ? {  
                statusCode: 200, 
                headers: {
                    "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                    "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
                },
                body: JSON.stringify(Item)
              } 
            : { // If no item is found, return a 404 Not Found response
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                    "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
                },
                body: JSON.stringify({ error: 'Order not found' })
              };
    } catch (error) {
        // Log the error for debugging purposes
        console.error(error);
        // Return a 500 Internal Server Error response if an exception occurs
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
            },
            body: JSON.stringify({ error: 'Could not retrieve order' })
        };
    }
};
