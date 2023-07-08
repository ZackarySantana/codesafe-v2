import { AstroSite, StackContext, use } from "sst/constructs";
import Authentication from "./authentication";
import API from "./protected_api";

export default function CelesteStack({ stack }: StackContext) {
    const api = use(API);
    const authentication = use(Authentication);

    const site = new AstroSite(stack, "celeste", {
        path: "celeste",
        bind: [api],
        environment: {
            API_URL: api.url,
            AUTHENTICATION_URL: authentication.url,
        },
    });

    stack.addOutputs({
        url: site.url,
    });

    return site;
}
