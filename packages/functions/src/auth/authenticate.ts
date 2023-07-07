import ApiHandler from "@lunar/core/ApiHandler";
import { getToken } from "@lunar/core/auth/user";

export const handler = ApiHandler(async (_evt) => {
    const [user, authError] = await getToken(_evt.headers.authorization ?? "");
    if (authError !== undefined) {
        return authError;
    }

    return {
        statusCode: 200,
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json",
        },
    };
});
