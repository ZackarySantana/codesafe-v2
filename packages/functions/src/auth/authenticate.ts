import { ConnectToDatabase } from "@lunar/core/database";
import { ApiHandler } from "sst/node/api";

const db = ConnectToDatabase();

export const handler = ApiHandler(async (_evt) => {
    const user = await db
        .selectFrom("person")
        .selectAll()
        .where("email", "=", "zackzackyack@gmail.com")
        .execute();

    if (user.length === 0) {
        return {
            statusCode: 404,
            body: "User not found",
        };
    }

    return {
        statusCode: 200,
        body: `Hello world. The time is ${new Date().toISOString()}`,
    };
});
