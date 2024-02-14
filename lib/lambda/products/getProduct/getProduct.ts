import * as AWS from 'aws-sdk';

// Initialize the DynamoDB DocumentClient to interact with the DynamoDB service
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Retrieve the products table name from environment variables or use a default value
const productsTable = process.env.PRODUCTS_TABLE || 'Products';

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
    // Extract the productId from the API request's path parameters
    const productId = event.pathParameters?.productId;

    // Define the parameters for the DynamoDB get operation
    const params = {
        TableName: productsTable,
        Key: {
            productId,
        },
    };

    try {
        // Perform the get operation using the provided parameters
        const { Item } = await dynamoDb.get(params).promise();
        // If the item is found, return a 200 OK response with the item data
        return Item 
            ? {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*", // CORS headers for cross-origin requests
                    "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
                },
                body: JSON.stringify(Item),
            } 
            : { // If no item is found, return a 404 Not Found response
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*", // CORS headers for cross-origin requests
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify({ error: 'Product not found' }),
            };
    } catch (error) {
        // Log any errors encountered during the operation
        console.error(error);
        // Return a 500 Internal Server Error response if an exception occurs
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS headers for cross-origin requests
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ error: 'Could not retrieve product' }),
        };
    }
};
