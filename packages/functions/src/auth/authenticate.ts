import { getToken } from "@lunar/core/auth/user";
import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
    const [user, authError] = await getToken(_evt.headers.authorization ?? "");
    if (authError !== undefined) {
        return authError;
    }

    return {
        statusCode: 200,
        body: JSON.stringify(user),
    };
});
