import { Api, EventBus, StackContext } from "sst/constructs";

export default function API({ stack }: StackContext) {
    const bus = new EventBus(stack, "bus", {
        defaults: {
            retries: 10,
        },
    });

    const api = new Api(stack, "api", {
        defaults: {
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
