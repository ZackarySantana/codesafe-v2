import ProtectedApiHandler from "@lunar/core/ProtectedApiHandler";

export const handler = ProtectedApiHandler(async (_evt, ctx, logger, user) => {
    return {
        statusCode: 200,
        body: `Hello ${
            user.email
        }. The time is ${new Date().toISOString()} and your account was created at ${
            user.created_at
        }`,
    };
});
