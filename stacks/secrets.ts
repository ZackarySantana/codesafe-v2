import { Config, StackContext } from "sst/constructs";

export default function Secrets({ stack }: StackContext) {
    const JWT_SECRET = new Config.Secret(stack, "JWT_SECRET");

    const JWT_LIFETIME = new Config.Parameter(stack, "JWT_LIFETIME", {
        value: `${60 * 60 * 24 * 7}`, // 7 days
    });

    return {
        JWT_SECRET,
        JWT_LIFETIME,
    };
}
