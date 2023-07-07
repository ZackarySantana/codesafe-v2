import { SSTConfig } from "sst";
import API from "./stacks/MyStack";
import Auth from "./stacks/authentication";
import CelesteStack from "./stacks/celeste";
import Database from "./stacks/database";
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
        app.stack(API);
        app.stack(CelesteStack);
    },
} satisfies SSTConfig;
