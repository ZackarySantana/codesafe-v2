import { AstroSite, StackContext, use } from "sst/constructs";
import Authentication from "./authentication";
import ProtectedAPI from "./protected_api";
import PublicAPI from "./public_api";

export default function CelesteStack({ stack }: StackContext) {
    const protectedAPI = use(ProtectedAPI);
    const publicAPI = use(PublicAPI);
    const authentication = use(Authentication);

    const site = new AstroSite(stack, "celeste", {
        path: "celeste",
        bind: [protectedAPI, publicAPI, authentication],
    });

    stack.addOutputs({
        url: site.url,
    });

    return site;
}
