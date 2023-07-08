import { AuthorizationHandler } from "@lunar/core/ApiHandler";
import { getToken } from "@lunar/core/auth/user";
import { PolicyDocument } from "aws-lambda";

export const handler = AuthorizationHandler(async (_evt) => {
    const [user, authError] = await getToken(_evt.headers?.authorization ?? "");
    if (authError !== undefined) {
        console.log("error");
        throw new Error("Unauthorized");
    }
    console.log("success");

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
