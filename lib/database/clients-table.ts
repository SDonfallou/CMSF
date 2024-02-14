import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';

export class ClientsTable extends Construct {
  public readonly table: dynamodb.Table;
  public readonly tableName: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new dynamodb.Table(this, 'Clients', {
      partitionKey: { name: 'clientId', type: dynamodb.AttributeType.STRING },
      tableName: 'Clients',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.tableName = this.table.tableName;
  }
}
