import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface ClientsLambdaFunctions {
  createClientLambda: lambda.IFunction;
  getClientsLambda: lambda.IFunction;
  getClientLambda: lambda.IFunction;
  updateClientLambda: lambda.IFunction;
  deleteClientLambda: lambda.IFunction;
}

export class ClientsApi extends Construct {
  constructor(scope: Construct, id: string, functions: ClientsLambdaFunctions, apiKey: apigateway.IApiKey) {
    super(scope, id);

    const api = new apigateway.RestApi(this, 'ClientsApi', {
      restApiName: 'Client Service', 
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      }
    });

    const clientsResource = api.root.addResource('clients');
    clientsResource.addMethod('POST', new apigateway.LambdaIntegration(functions.createClientLambda), {apiKeyRequired: true});
    clientsResource.addMethod('GET', new apigateway.LambdaIntegration(functions.getClientsLambda), {apiKeyRequired: true});

    const singleClientResource = clientsResource.addResource('{clientId}');
    singleClientResource.addMethod('GET', new apigateway.LambdaIntegration(functions.getClientLambda), {apiKeyRequired: true});
    singleClientResource.addMethod('PUT', new apigateway.LambdaIntegration(functions.updateClientLambda), {apiKeyRequired: true});
    singleClientResource.addMethod('DELETE', new apigateway.LambdaIntegration(functions.deleteClientLambda), {apiKeyRequired: true});

    const usagePlanProps: apigateway.UsagePlanProps = {
      name: 'ClientsUsagePlan',
      apiStages: [{
        api: api,
        stage: api.deploymentStage
      }],
      throttle: {
        rateLimit: 10,
        burstLimit: 20
      },
      quota: {
        limit: 10000,
        period: apigateway.Period.MONTH
      }
    };

    const usagePlan = new apigateway.UsagePlan(this, 'ClientsUsagePlan', usagePlanProps);
    usagePlan.addApiKey(apiKey);
  }
}
