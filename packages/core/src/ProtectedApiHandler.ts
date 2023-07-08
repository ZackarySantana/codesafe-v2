import { User } from "@lunar/database/schemas/user";
import {
    APIGatewayProxyEventV2,
    APIGatewayProxyStructuredResultV2,
    Context,
} from "aws-lambda";
import { ApiHandler as handler } from "sst/node/api";
import { getUserFromEvent } from "./auth/user";
import * as loggerUtil from "./logger";

function isErrorStatusCode(status: number) {
    return status >= 400 && status < 600;
}

const ProtectedApiHandler = (
    fun: (
        _evt: APIGatewayProxyEventV2,
        ctx: Context,
        logger: typeof loggerUtil,
        user: User,
    ) => Promise<APIGatewayProxyStructuredResultV2>,
) => {
    return handler(async (_evt, ctx) => {
        loggerUtil.init(_evt);
        const [user, userError] = getUserFromEvent(_evt);
        if (userError !== undefined) {
            loggerUtil.debug(userError);
            throw new Error("Unauthorized");
        }

        try {
            const result = await fun(_evt, ctx, loggerUtil, user);
            if (isErrorStatusCode(result.statusCode ?? 0)) {
                loggerUtil.flush(result);
            }
            return result;
        } catch (e) {
            loggerUtil.flush(e);
            return {
                statusCode: 500,
                body: "Internal Server Error",
            };
        }
    });
};

export default ProtectedApiHandler;
