import { Api, EventBus, StackContext } from "sst/constructs";

export default function PublicAPI({ stack }: StackContext) {
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
            "GET /todo": "packages/functions/src/public/todo.list",
            "POST /todo": "packages/functions/src/public/todo.create",
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
