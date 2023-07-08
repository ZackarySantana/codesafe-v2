import { Api, StackContext, use } from "sst/constructs";
import Authentication from "./authentication";

export default function ProtectedAPI({ stack }: StackContext) {
    const auth = use(Authentication);

    const api = new Api(stack, "api", {
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
        ApiEndpoint: api.url,
    });

    return api;
}
