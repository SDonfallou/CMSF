import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { GlmStack } from '../lib/glm-stack';

describe('GlmStack', () => {
  let app: App;
  let stack: GlmStack;
  let template: Template;

  beforeAll(() => {
    app = new App();
    stack = new GlmStack(app, 'GlmStackTest');
    template = Template.fromStack(stack);
  });

  test('Should have DynamoDB Tables', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'Clients'
    });
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'Products'
    });
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'Orders'
    });
  });

  test('Should have Lambda Functions', () => {
    template.resourceCountIs('AWS::Lambda::Function', 15);
  });

  test('Should have API Gateway API Keys', () => {
    template.resourceCountIs('AWS::ApiGateway::ApiKey', 3);
  });

});
