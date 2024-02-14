import * as AWS from 'aws-sdk';

// Initialize the DynamoDB DocumentClient for database interactions
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Retrieve the name of the products table from environment variables, or use a default value
const productsTable = process.env.PRODUCTS_TABLE || 'Products';

export const handler = async (): Promise<AWSLambda.APIGatewayProxyResult> => {
    // Define the parameters for the scan operation to retrieve all products
    const params = {
        TableName: productsTable,
    };

    try {
        // Perform the scan operation to retrieve all products from the table
        const { Items } = await dynamoDb.scan(params).promise();
        // If successful, return a 200 OK response with the items
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Include CORS headers for web application compatibility
                "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
            },
            body: JSON.stringify(Items),
        };
    } catch (error) {
        // Log the error for debugging purposes
        console.error(error);
        // Return a 500 Internal Server Error response if the operation fails
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // Ensure error messages are accessible to the client
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ error: 'Could not retrieve products' }),
        };
    }
};
