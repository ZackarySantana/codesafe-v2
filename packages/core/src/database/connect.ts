import { RDSData } from "@aws-sdk/client-rds-data";
import { Database } from "@lunar/database/database";
import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { RDS } from "sst/node/rds";

export function ConnectToDatabase() {
    return new Kysely<Database>({
        dialect: new DataApiDialect({
            mode: "mysql",
            driver: {
                database: RDS.database.defaultDatabaseName,
                secretArn: RDS.database.secretArn,
                resourceArn: RDS.database.clusterArn,
                client: new RDSData({}),
            },
        }),
    });
}
