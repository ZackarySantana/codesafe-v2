import { RDS, StackContext } from "sst/constructs";

export default function Database({ stack }: StackContext) {
    const rds = new RDS(stack, "database", {
        engine: "mysql5.7",
        defaultDatabaseName: "lunar",
        migrations: "packages/database/src/migrations",
    });

    return rds;
}
