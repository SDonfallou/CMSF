#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { GlmStack } from '../lib/glm-stack';

const app = new cdk.App();
new GlmStack(app, 'GlmStack', {});