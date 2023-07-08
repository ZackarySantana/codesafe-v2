import {
    APIGatewayAuthorizerEvent,
    APIGatewayAuthorizerResult,
    APIGatewayRequestAuthorizerEvent,
    Context,
    PolicyDocument,
} from "aws-lambda";
import * as loggerUtil from "./logger";

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
            return await fun(e, ctx, loggerUtil);
        } catch (err) {
            loggerUtil.flush(err);
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

export default AuthorizationHandler;
