import { SSTConfig } from "sst";
import API from "./stacks/MyStack";
import CelesteStack from "./stacks/celeste";

export default {
    config() {
        return {
            name: "lunar",
            region: "us-east-2",
        };
    },
    stacks(app) {
        app.stack(API);
        app.stack(CelesteStack);
    },
} satisfies SSTConfig;
