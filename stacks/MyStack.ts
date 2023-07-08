import { Api, EventBus, StackContext, use } from "sst/constructs";
import Authentication from "./authentication";

export default function API({ stack }: StackContext) {
    const auth = use(Authentication);

    const bus = new EventBus(stack, "bus", {
        defaults: {
            retries: 10,
        },
    });

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
                bind: [bus],
                runtime: "nodejs18.x",
            },
        },
        routes: {
            "GET /": "packages/functions/src/lambda.handler",
            "GET /todo": "packages/functions/src/todo.list",
            "POST /todo": "packages/functions/src/todo.create",
        },
    });

    bus.subscribe("todo.created", {
        handler: "packages/functions/src/events/todo-created.handler",
    });

    stack.addOutputs({
        ApiEndpoint: api.url,
    });

    return api;
}
