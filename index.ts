import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// IAM Role for Lambda Execution
const role = new aws.iam.Role("lambda-exec-role", {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({ Service: "lambda.amazonaws.com" }),
});

// Attach policy
new aws.iam.RolePolicyAttachment("lambda-basic-execution", {
    role: role.name,
    policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
});


const lambdaZip = new pulumi.asset.AssetArchive({
    ".": new pulumi.asset.FileArchive("./app/dist"),
});

// Create the Lambda Function
const lambda = new aws.lambda.Function("calcLambda", {
    runtime: "nodejs18.x", 
    timeout: 10,
    handler: "index.handler",
    role: role.arn,
});

// Create API Gateway 
const api = new aws.apigatewayv2.Api("calcApi", {
    protocolType: "HTTP",
});

// Lambda integration with API Gateway
const integration = new aws.apigatewayv2.Integration("calcIntegration", {
    apiId: api.id,
    integrationType: "AWS_PROXY",
    integrationUri: lambda.invokeArn, 
    integrationMethod: "POST",
    payloadFormatVersion: "2.0",
});

// Grant API Gateway permission to invoke Lambda
new aws.lambda.Permission("api-permission", {
    action: "lambda:InvokeFunction",
    function: lambda.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/*`,
});

// Define route for POST /calculate
const route = new aws.apigatewayv2.Route("calcRoute", {
    apiId: api.id,
    routeKey: "POST /calculate",
    target: pulumi.interpolate`integrations/${integration.id}`,
});

// Deploy the API (default stage)
new aws.apigatewayv2.Stage("calcStage", {
    apiId: api.id,
    name: "$default",
    autoDeploy: true,
});

// Export the full API endpoint
export const endpoint = pulumi.interpolate`${api.apiEndpoint}/calculate`;
