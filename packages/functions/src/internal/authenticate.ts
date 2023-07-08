import { getToken } from "@lunar/core/auth/user";
import AuthorizationHandler from "@lunar/core/AuthorizationHandler";
import { PolicyDocument } from "aws-lambda";

export const handler = AuthorizationHandler(async (_evt) => {
    const [user, authError] = await getToken(_evt.headers?.authorization ?? "");
    if (authError !== undefined) {
        throw new Error("Unauthorized. You may have an expired token");
    }

    return {
        context: {
            user: JSON.stringify(user),
        },
        principalId: "user",
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: "Allow",
                    Resource: _evt.methodArn,
                },
            ],
        } satisfies PolicyDocument,
    };
});
