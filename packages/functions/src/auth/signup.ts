import ApiHandler from "@lunar/core/ApiHandler";

export const handler = ApiHandler(async (_evt) => {
    return {
        statusCode: 200,
        body: `Hello world. The time is ${new Date().toISOString()}`,
    };
});
