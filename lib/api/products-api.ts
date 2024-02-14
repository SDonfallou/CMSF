import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface ProductsLambdaFunctions {
  createProductLambda: lambda.IFunction;
  getProductLambda: lambda.IFunction;
  getAllProductsLambda: lambda.IFunction;
  updateProductLambda: lambda.IFunction;
  deleteProductLambda: lambda.IFunction;
}

export class ProductsApi extends Construct {
  constructor(scope: Construct, id: string, functions: ProductsLambdaFunctions, apiKey: apigateway.IApiKey) {
    super(scope, id);

    const api = new apigateway.RestApi(this, 'ProductsApi', {
      restApiName: 'Products Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      }
    });

    const productsResource = api.root.addResource('products');
    productsResource.addMethod('POST', new apigateway.LambdaIntegration(functions.createProductLambda), {apiKeyRequired: true});
    productsResource.addMethod('GET', new apigateway.LambdaIntegration(functions.getAllProductsLambda), {apiKeyRequired: true});
    
    const singleProductResource = productsResource.addResource('{productId}');
    singleProductResource.addMethod('GET', new apigateway.LambdaIntegration(functions.getProductLambda), {apiKeyRequired: true});
    singleProductResource.addMethod('PUT', new apigateway.LambdaIntegration(functions.updateProductLambda), {apiKeyRequired: true});
    singleProductResource.addMethod('DELETE', new apigateway.LambdaIntegration(functions.deleteProductLambda), {apiKeyRequired: true});

    const usagePlanProps: apigateway.UsagePlanProps = {
      name: 'ProductUsagePlan',
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

    const usagePlan = new apigateway.UsagePlan(this, 'ProductUsagePlan', usagePlanProps);
    usagePlan.addApiKey(apiKey);
  }
}
