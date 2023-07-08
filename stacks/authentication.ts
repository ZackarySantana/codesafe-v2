import { Api, StackContext, use } from "sst/constructs";
import Database from "./database";
import Secrets from "./secrets";

export default function Authentication({ stack }: StackContext) {
    const db = use(Database);
    const { JWT_SECRET, JWT_LIFETIME } = use(Secrets);

    const auth = new Api(stack, "auth-api", {
        defaults: {
            function: {
                bind: [db, JWT_SECRET, JWT_LIFETIME],
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

    auth.getFunction("POST / authenticate");

    stack.addOutputs({
        ApiEndpoint: auth.url,
    });

    return auth;
}
