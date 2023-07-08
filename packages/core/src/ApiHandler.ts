import {
    APIGatewayAuthorizerEvent,
    APIGatewayAuthorizerResult,
    APIGatewayProxyEventV2,
    APIGatewayProxyStructuredResultV2,
    APIGatewayRequestAuthorizerEvent,
    Context,
    PolicyDocument,
} from "aws-lambda";
import { ApiHandler as handler } from "sst/node/api";
import * as loggerUtil from "./logger";

function isErrorStatusCode(status: number) {
    return status >= 400 && status < 600;
}

const ApiHandler = (
    fun: (
        _evt: APIGatewayProxyEventV2,
        ctx: Context,
        logger: typeof loggerUtil,
    ) => Promise<APIGatewayProxyStructuredResultV2>,
) => {
    return handler(async (_evt, ctx) => {
        loggerUtil.init(_evt);
        try {
            const result = await fun(_evt, ctx, loggerUtil);
            if (isErrorStatusCode(result.statusCode ?? 0)) {
                loggerUtil.flush(result);
            }
            return result;
        } catch (e) {
            loggerUtil.flush(e);
            return {
                statusCode: 500,
                body: "Internal Server Error",
            };
        }
    });
};

export default ApiHandler;

const AuthorizationHandler = (
    fun: (
        _evt: APIGatewayRequestAuthorizerEvent,
        ctx: Context,
        logger: typeof loggerUtil,
    ) => Promise<APIGatewayAuthorizerResult>,
) => {
    return async (_evt: APIGatewayAuthorizerEvent, ctx: Context) => {
        loggerUtil.initAuthorizer(_evt);
        try {
            if (_evt.type === "TOKEN") {
                loggerUtil.flush(new Error("Invalid token type"));
                throw new Error("Authorization type must be REQUEST");
            }
            const e = _evt as APIGatewayRequestAuthorizerEvent;
            loggerUtil.debug(e);
            const result = await fun(e, ctx, loggerUtil);
            /*
             * If (isErrorStatusCode(result. ?? 0)) {
             *     loggerUtil.flush(result);
             * }
             */
            return result;
        } catch (err) {
            loggerUtil.flush(err);
            console.log("ERROR 2");
            return {
                principalId: "user",
                policyDocument: {
                    Version: "2012-10-17",
                    Statement: [
                        {
                            Action: "execute-api:Invoke",
                            Effect: "Deny",
                            Resource: _evt.methodArn,
                        },
                    ],
                } satisfies PolicyDocument,
            };
        }
    };
};

export { AuthorizationHandler };
