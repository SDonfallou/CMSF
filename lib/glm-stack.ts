import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { ClientsApi } from './api/clients-api';
import { ClientsTable } from './database/clients-table';
import { ProductsApi } from './api/products-api';
import { ProductsTable } from './database/products-table';
import { OrdersApi } from './api/orders-api';
import { OrdersTable } from './database/orders-table';

export class GlmStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // Table Clients
    const clientsTable = new ClientsTable(this, 'ClientsTable');

    // CRUD Clients
    const createClientLambda = this.createLambdaFunction('CreateClient', 'clients', 'createClient', clientsTable.tableName, 512, 30);
    const getClientsLambda = this.createLambdaFunction('GetClients', 'clients', 'getClients', clientsTable.tableName, 256, 10);
    const getClientLambda = this.createLambdaFunction('GetClient', 'clients', 'getClient', clientsTable.tableName, 256, 10);
    const updateClientLambda = this.createLambdaFunction('UpdateClient', 'clients', 'updateClient', clientsTable.tableName, 512, 30);
    const deleteClientLambda = this.createLambdaFunction('DeleteClient', 'clients', 'deleteClient', clientsTable.tableName, 256, 10);

    // Table Products
    const productsTable = new ProductsTable(this, 'ProductsTable');

    // CRUD Products
    const createProductLambda = this.createLambdaFunction('CreateProduct', 'products','createProduct', productsTable.tableName, 512, 30);
    const getAllProductsLambda = this.createLambdaFunction('GetProducts', 'products', 'getProducts', productsTable.tableName, 256, 10);
    const getProductLambda = this.createLambdaFunction('GetProduct', 'products','getProduct', productsTable.tableName, 256, 10);
    const updateProductLambda = this.createLambdaFunction('UpdateProduct', 'products','updateProduct', productsTable.tableName, 512, 30);
    const deleteProductLambda = this.createLambdaFunction('DeleteProduct', 'products','deleteProduct', productsTable.tableName, 256, 10);

    // Table Order
    const ordersTable = new OrdersTable(this, 'OrdersTable');

    // Definizione delle funzioni Lambda per le operazioni sugli ordini
    const createOrderLambda = this.createLambdaFunction('CreateOrder', 'orders','createOrder', ordersTable.tableName, 512, 30);
    const getAllOrdersLambda = this.createLambdaFunction('GetOrders', 'orders','getOrders', ordersTable.tableName, 256, 10);
    const getOrderLambda = this.createLambdaFunction('GetOrder', 'orders','getOrder', ordersTable.tableName, 256, 10);
    const updateOrderLambda = this.createLambdaFunction('UpdateOrder', 'orders','updateOrder', ordersTable.tableName, 512, 30);
    const deleteOrderLambda = this.createLambdaFunction('DeleteOrder', 'orders','deleteOrder', ordersTable.tableName, 256, 10);

    // API Key Configuration
    const apiKeyClients = new apigateway.ApiKey(this, 'GlmApiKeyClients');
    const apiKeyProducts = new apigateway.ApiKey(this, 'GlmApiKeyProducts');
    const apiKeyOrders = new apigateway.ApiKey(this, 'GlmApiKeyOrders');

    // Clients Api Gateway
    new ClientsApi(this, 'ClientsApi', {
      createClientLambda,
      getClientsLambda,
      getClientLambda,
      updateClientLambda,
      deleteClientLambda
    }, apiKeyClients);

    // Products Api Gateway
    new ProductsApi(this, 'ProductsApi', {
      createProductLambda,
      getAllProductsLambda,
      getProductLambda,
      updateProductLambda,
      deleteProductLambda
    }, apiKeyProducts);

    // Orders Api Gateway
    new OrdersApi(this, 'OrdersApi', {
      createOrderLambda,
      getAllOrdersLambda,
      getOrderLambda,
      updateOrderLambda,
      deleteOrderLambda
    }, apiKeyOrders);
  }

  createLambdaFunction(id: string, folder: string, handlerFileName: string, tableName: string, memorySize: number, timeout: number): lambda.Function {
    const fn = new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset(`../GLM/dist/${folder}/${handlerFileName}`),
      handler: `${handlerFileName}.handler`,
      environment: {
        TABLE_NAME: tableName,
      },
      memorySize: memorySize,
      timeout: Duration.seconds(timeout)
    });

    fn.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));

    return fn;
  }
}
