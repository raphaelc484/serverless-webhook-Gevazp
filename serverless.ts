import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "webhook-sintegre-gevazp",
  frameworkVersion: "3",
  plugins: [
    "serverless-dotenv-plugin",
    "serverless-esbuild",
    "serverless-dynamodb-local",
    "serverless-offline",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "sa-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: ["*"],
      },
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: ["*"],
      },
    ],
  },
  // import the function via paths
  functions: {
    webhookGEVAZP: {
      handler: "src/functions/webhookGEVAZP.handler",
      events: [
        {
          http: {
            path: "webhookGEVAZP",
            method: "post",
            cors: true,
          },
        },
      ],
    },
    databaseIPDO: {
      handler: "src/functions/databaseIPDO.handler",
      events: [
        {
          s3: {
            bucket: "bucket-docs-nodejs",
            event: "s3:ObjectCreated:*",
            rules: [
              {
                prefix: "IPDO/",
              },
              {
                suffix: ".xlsm",
              },
            ],
            existing: true,
          },
        },
      ],
    },
  },
  package: {
    individually: true,
    patterns: [
      "!node_modules/.prisma/client/libquery_engine-*",
      "node_modules/.prisma/client/libquery_engine-rhel-*",
      "node_modules/.prisma/client/schema.prisma",
      "!node_modules/prisma/libquery_engine-*",
      "!node_modules/@prisma/engines/**",
    ],
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    dynamodb: {
      stages: ["dev", "local"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      },
    },
  },
  resources: {
    Resources: {
      dbDocuments: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "received_tables",
          ProvisionedThroughput: {
            ReadCapacityUnits: 8,
            WriteCapacityUnits: 8,
          },
          KeySchema: [
            {
              AttributeName: "nome",
              KeyType: "HASH", //Partition key
            },
            {
              AttributeName: "periodicidade",
              KeyType: "RANGE", //Sort key
            },
          ],
          AttributeDefinitions: [
            {
              AttributeName: "nome",
              AttributeType: "S",
            },
            {
              AttributeName: "periodicidade",
              AttributeType: "S",
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
