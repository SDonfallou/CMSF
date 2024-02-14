import * as AWS from 'aws-sdk';

// Initialize the DynamoDB DocumentClient for database interactions
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Retrieve the DynamoDB table name from environment variables, or use a default value
const ordersTable = process.env.ORDERS_TABLE || 'Orders';

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
    // Extract the orderId from the path parameters of the incoming API request
    const orderId = event.pathParameters?.orderId;
    // Parse the updated order data from the request body
    const orderData = JSON.parse(event.body || '');

    // Define parameters for the DynamoDB update operation
    const params = {
        TableName: ordersTable,
        Key: {
            orderId,
        },
        UpdateExpression: 'SET agentId = :agentId, clientId = :clientId, orderStatus = :orderStatus, orderDetails = :orderDetails, paymentMethod = :paymentMethod, notes = :notes, otherDetails = :otherDetails',
        ExpressionAttributeValues: {
            ':agentId': orderData.agentId,
            ':clientId': orderData.clientId,
            ':orderStatus': orderData.orderStatus,
            ':orderDetails': orderData.orderDetails,
            ':paymentMethod': orderData.paymentMethod,
            ':notes': orderData.notes,
            ':otherDetails': orderData.otherDetails || {} // Ensure optional fields are handled gracefully
        },
        ReturnValues: 'ALL_NEW', // Return all attributes of the item after the update
    };

    try {
        // Perform the update operation and capture the updated attributes
        const { Attributes } = await dynamoDb.update(params).promise();
        // Return a 200 OK response with the updated order details
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                "Access-Control-Allow-Credentials": true, // Allows browsers to handle credentials
            },
            body: JSON.stringify(Attributes),
        };
    } catch (error) {
        // Log the error for debugging purposes
        console.error(error);
        // Return a 500 Internal Server Error response if the update operation fails
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ error: 'Could not update order' }),
        };
    }
};
