import { SSTConfig } from "sst";
import Auth from "./stacks/authentication";
import CelesteStack from "./stacks/celeste";
import Database from "./stacks/database";
import ProtectedAPI from "./stacks/protected_api";
import PublicAPI from "./stacks/public_api";
import Secrets from "./stacks/secrets";

export default {
    config() {
        return {
            name: "lunar",
            region: "us-east-2",
        };
    },
    stacks(app) {
        app.stack(Secrets);
        app.stack(Database);
        app.stack(Auth);
        app.stack(ProtectedAPI);
        app.stack(PublicAPI);
        app.stack(CelesteStack);
    },
} satisfies SSTConfig;
