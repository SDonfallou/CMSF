import * as AWS from 'aws-sdk';
import { randomBytes } from 'crypto'; 

// Initialize DynamoDB DocumentClient to interact with the database
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Fetch the products table name from environment variables, or use a default
const productsTable = process.env.PRODUCTS_TABLE || 'Products';

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
    try {
        // Parse the incoming product data from the request body
        const productData = JSON.parse(event.body || '');
        // Generate a unique ID for the new product
        const productId = randomBytes(16).toString('hex');
        
        // Define parameters for inserting the new product into the DynamoDB table
        const params = {
            TableName: productsTable,
            Item: {
                productId,
                productName: productData.productName,
                productDescription: productData.productDescription,
                brand: productData.brand,
                category: productData.category, 
                brandColor: productData.brandColor,
                categoryColor: productData.categoryColor,
                price: productData.price,
                minimumQuantity: productData.minimumQuantity,
                multipleQuantity: productData.multipleQuantity,
                stockQuantity: productData.stockQuantity,
                ...productData.otherDetails // Include additional product details if provided
            },
            ConditionExpression: 'attribute_not_exists(productId)', // Prevent duplicate products
        };

        // Attempt to insert the new product into the table
        await dynamoDb.put(params).promise();

        // Return a 201 Created response with the new product item
        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS headers for cross-origin requests
                "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
            },
            body: JSON.stringify(params.Item),
        };
    } catch (error) {
        console.error(error); // Log the error for debugging
        
        // Default error response for unexpected errors
        let errorCode = 500;
        let errorMessage = 'Could not create product';
        
        if (typeof error === "object" && error !== null && "code" in error) {
            // Cast the error to AWS.AWSError to access the error code
            const awsError = error as AWS.AWSError;
            if (awsError.code === 'ConditionalCheckFailedException') {
                errorCode = 409; // Conflict error code for duplicate product IDs
                errorMessage = 'Product ID already exists';
            }
        }
        
        // Return the error response with the determined code and message
        return {
            statusCode: errorCode,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS headers for error responses
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ error: errorMessage }),
        };
    }
};
