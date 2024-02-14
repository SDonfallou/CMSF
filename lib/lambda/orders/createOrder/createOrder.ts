import * as AWS from 'aws-sdk';
import { randomBytes } from 'crypto'; 

// Initialize the DynamoDB DocumentClient for database operations
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Retrieve the DynamoDB table name from environment variables, or use 'Orders' as a default value
const ordersTable = process.env.ORDERS_TABLE || 'Orders';

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
    try {
        // Parse the incoming order data from the request body
        const orderData = JSON.parse(event.body || '');
        // Generate a unique ID for the new order
        const orderId = randomBytes(16).toString('hex');

        // Define parameters for inserting the new order into the DynamoDB table
        const params = {
            TableName: ordersTable,
            Item: {
                orderId,
                agentId: orderData.agentId, // ID of the agent who placed the order
                clientId: orderData.clientId, // ID of the client for whom the order is placed
                orderStatus: orderData.orderStatus, // Status of the order (e.g., pending, completed)
                orderDetails: orderData.orderDetails, // Details of the order items
                paymentMethod: orderData.paymentMethod, // Payment method for the order
                trackingId: orderData.trackingId, // Tracking ID for order shipment
                ...orderData.otherDetails // Additional details about the order, if any
            },
            ConditionExpression: 'attribute_not_exists(orderId)', // Ensure no duplicate orders
        };

        // Attempt to insert the new order into the table
        await dynamoDb.put(params).promise();

        // Return a 201 Created response with the created order item
        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
            },
            body: JSON.stringify(params.Item)
        };
    } catch (error) {
        console.error(error);

        // Default error response for unexpected errors
        let errorCode = 500;
        let errorMessage = 'Could not create order';

        // Handle specific DynamoDB error codes for more precise user feedback
        if (typeof error === "object" && error !== null && "code" in error) {
            const awsError = error as AWS.AWSError;
            if (awsError.code === 'ConditionalCheckFailedException') {
                errorCode = 409; // Conflict error code if order ID already exists
                errorMessage = 'Order ID already exists';
            }
        }

        // Return the error response with the determined error code and message
        return {
            statusCode: errorCode,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
            },
            body: JSON.stringify({ error: errorMessage })
        };
    }
};
