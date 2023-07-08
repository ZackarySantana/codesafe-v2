import ApiHandler from "@lunar/core/ApiHandler";
import { getUserFromEvent } from "@lunar/core/auth/user";

export const handler = ApiHandler(async (_evt, ctx, logger) => {
    const [user, userError] = getUserFromEvent(_evt);
    if (userError !== undefined) {
        logger.debug(userError);
        throw new Error("Unauthorized");
    }
    return {
        statusCode: 200,
        body: `Hello ${
            user.email
        }. The time is ${new Date().toISOString()} and your account was created at ${
            user.created_at
        }`,
    };
});
