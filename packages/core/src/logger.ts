import { APIGatewayAuthorizerEvent, APIGatewayProxyEventV2 } from "aws-lambda";
import AWS from "aws-sdk";

let logs: { date: Date; string: string }[];

export function debug(...args: unknown[]) {
    logs.push({
        date: new Date(),
        // eslint-disable-next-line prefer-rest-params
        string: JSON.stringify(args, null, 2),
    });
}

AWS.config.logger = { log: debug };

export function init(_evt: APIGatewayProxyEventV2) {
    logs = [];

    debug("API event", {
        body: _evt.body,
        pathParameters: _evt.pathParameters,
        queryStringParameters: _evt.queryStringParameters,
    });
}

export function initAuthorizer(_evt: APIGatewayAuthorizerEvent) {
    logs = [];

    debug("Authorizer event", {
        body: _evt.type,
        pathParameters: _evt.methodArn,
    });
}

export function flush(e: unknown) {
    // eslint-disable-next-line no-console
    logs.forEach(({ date, string }) => console.debug(date, string));
    // eslint-disable-next-line no-console
    console.error(e);
}
