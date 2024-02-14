import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface OrdersLambdaFunctions {
  createOrderLambda: lambda.IFunction;
  getOrderLambda: lambda.IFunction;
  getAllOrdersLambda: lambda.IFunction;
  updateOrderLambda: lambda.IFunction;
  deleteOrderLambda: lambda.IFunction;
}

export class OrdersApi extends Construct {
  constructor(scope: Construct, id: string, functions: OrdersLambdaFunctions, apiKey: apigateway.IApiKey) {
    super(scope, id);

    const api = new apigateway.RestApi(this, 'OrdersApi', {
      restApiName: 'Orders Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      }
    });

    const ordersResource = api.root.addResource('orders');
    ordersResource.addMethod('POST', new apigateway.LambdaIntegration(functions.createOrderLambda), {apiKeyRequired: true});
    ordersResource.addMethod('GET', new apigateway.LambdaIntegration(functions.getAllOrdersLambda), {apiKeyRequired: true});

    const singleOrderResource = ordersResource.addResource('{orderId}');
    singleOrderResource.addMethod('GET', new apigateway.LambdaIntegration(functions.getOrderLambda), {apiKeyRequired: true});
    singleOrderResource.addMethod('PUT', new apigateway.LambdaIntegration(functions.updateOrderLambda), {apiKeyRequired: true});
    singleOrderResource.addMethod('DELETE', new apigateway.LambdaIntegration(functions.deleteOrderLambda), {apiKeyRequired: true});

    const usagePlanProps: apigateway.UsagePlanProps = {
      name: 'OrderUsagePlan',
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

    const usagePlan = new apigateway.UsagePlan(this, 'OrderUsagePlan', usagePlanProps);
    usagePlan.addApiKey(apiKey);
  }
}
