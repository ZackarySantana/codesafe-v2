import { AstroSite, StackContext, use } from "sst/constructs";
import API from "./MyStack";

export default function CelesteStack({ stack }: StackContext) {
    const api = use(API);

    const site = new AstroSite(stack, "celeste", {
        path: "celeste",
        bind: [api],
        environment: {
            API_ENDPOINT: api.url,
        },
    });
    stack.addOutputs({
        url: site.url,
    });

    return site;
}
