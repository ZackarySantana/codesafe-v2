import { Api, StackContext, use } from "sst/constructs";
import Database from "./database";

export default function Authentication({ stack }: StackContext) {
    const db = use(Database);

    const auth = new Api(stack, "auth-api", {
        defaults: {
            function: {
                bind: [db],
                runtime: "nodejs18.x",
            },
        },
        routes: {
            "POST /login": "packages/functions/src/auth/login.handler",
            "POST /signup": "packages/functions/src/auth/signup.handler",
            "POST /authenticate":
                "packages/functions/src/auth/authenticate.handler",
        },
    });

    stack.addOutputs({
        ApiEndpoint: auth.url,
    });

    return auth;
}
