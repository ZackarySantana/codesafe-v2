import { ConnectToDatabase } from "@lunar/core/database/connect";
import { ApiHandler } from "sst/node/api";

const db = ConnectToDatabase();

export const handler = ApiHandler(async (_evt) => {
    console.log("1");
    const user = await db
        .selectFrom("user")
        .selectAll()
        .where("email", "=", "zackzackyack@gmail.com")
        .execute();
    console.log("2");

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
