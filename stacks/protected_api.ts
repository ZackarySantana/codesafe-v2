import { Api, StackContext, use } from "sst/constructs";
import Authentication from "./authentication";

export default function ProtectedAPI({ stack }: StackContext) {
    const auth = use(Authentication);

    const protectedAPI = new Api(stack, "protected_api", {
        authorizers: {
            userAuth: {
                type: "lambda",
                function: auth.getFunction("POST /authenticate"),
            },
        },
        defaults: {
            authorizer: "userAuth",
            function: {
                runtime: "nodejs18.x",
            },
        },
        routes: {
            "GET /": "packages/functions/src/protected/lambda.handler",
        },
    });

    stack.addOutputs({
        ApiEndpoint: protectedAPI.url,
    });

    return protectedAPI;
}
