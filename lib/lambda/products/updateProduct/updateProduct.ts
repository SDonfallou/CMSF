import * as AWS from 'aws-sdk';

// Initialize the DynamoDB DocumentClient for interacting with the database
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Retrieve the name of the products table from environment variables, or use a default value
const productsTable = process.env.PRODUCTS_TABLE || 'Products';

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
    // Extract the productId from the API request's path parameters
    const productId = event.pathParameters?.productId;
    // Parse the updated product data from the request body
    const productData = JSON.parse(event.body || '');

    // Define parameters for the DynamoDB update operation
    const params = {
        TableName: productsTable,
        Key: {
            productId,
        },
        UpdateExpression: 'SET productName = :productName, productDescription = :productDescription, brand = :brand, category = :category, price = :price, minimumQuantity = :minimumQuantity, multipleQuantity = :multipleQuantity, stockQuantity = :stockQuantity, otherDetails = :otherDetails',
        ExpressionAttributeValues: {
            ':productName': productData.productName,
            ':productDescription': productData.productDescription,
            ':brand': productData.brand,
            ':category': productData.category,
            ':price': productData.price,
            ':minimumQuantity': productData.minimumQuantity,
            ':multipleQuantity': productData.multipleQuantity,
            ':stockQuantity': productData.stockQuantity,
            ':otherDetails': productData.otherDetails || {} // Ensure optional fields are handled gracefully
        },
        ReturnValues: 'ALL_NEW', // Return all attributes of the item after the update
    };

    try {
        // Perform the update operation and capture the updated attributes
        const { Attributes } = await dynamoDb.update(params).promise();
        // Return a 200 OK response with the updated product details
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Include CORS headers for web application compatibility
                "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
            },
            body: JSON.stringify(Attributes),
        };
    } catch (error) {
        // Log any errors encountered during the operation
        console.error(error);
        // Return a 500 Internal Server Error response if the update operation fails
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // Ensure error messages are accessible to the client
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ error: 'Could not update product' }),
        };
    }
};
