import * as AWS from 'aws-sdk';
import { randomBytes } from 'crypto';

// Initialize AWS SDK for DynamoDB
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Retrieve the DynamoDB table name from environment variables or use a default
const clientsTable = process.env.CLIENTS_TABLE || 'Clients';

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
    // Destructure and parse the incoming request body
    const {
        ragioneSociale, // Business name
        regione, // Region
        citta, // City
        pIva, // VAT number
        cf, // Fiscal code
        mail, // Email address
        pec, // Certified email address (optional)
        codiceDestinatario, // Recipient code
        indirizzoSpedizione, // Shipping address (optional)
        banca, // Bank
        iban, // IBAN
        giorniChiusura, // Closure days (optional)
        canale // Channel
    } = JSON.parse(event.body || '{}');

    // Generate a unique ID for the client using randomBytes
    const clientId = randomBytes(16).toString('hex');

    // Check for the presence of required fields
    if (!ragioneSociale || !regione || !citta || !pIva || !cf || !mail || !codiceDestinatario || !iban || !canale) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ error: 'Missing some mandatory fields.' })
        };
    }

    const params = {
        TableName: clientsTable,
        Item: {
            clientId,
            ragioneSociale,
            regione,
            citta,
            pIva,
            cf,
            mail,
            pec, // PEC is not mandatory, can be null if not provided
            codiceDestinatario,
            indirizzoSpedizione, // Can be null if not provided
            banca,
            iban,
            giorniChiusura, // Can be null if not provided
            canale,
            // Additional details can be added here if necessary
        },
        ConditionExpression: 'attribute_not_exists(clientId)',
    };

    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify(params.Item)
        };
    } catch (error) {
        console.error(error);

        if (typeof error === "object" && error !== null && "code" in error) {
            const awsError = error as AWS.AWSError;
            if (awsError.code === 'ConditionalCheckFailedException') {
                return {
                    statusCode: 409,
                    headers: {
                        "Access-Control-Allow-Origin": "*", // CORS header
                        "Access-Control-Allow-Credentials": true,
                    },
                    body: JSON.stringify({ error: 'Client ID already exists' })
                };
            }
        }

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS header
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ error: 'Could not create client' })
        };
    }
};
