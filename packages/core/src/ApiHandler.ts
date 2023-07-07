import {
    APIGatewayProxyEventV2,
    APIGatewayProxyStructuredResultV2,
    Context,
} from "aws-lambda";
import { ApiHandler as handler } from "sst/node/api";
import * as loggerUtil from "./logger";

function isErrorStatusCode(status: number) {
    return status >= 400 && status < 600;
}

const ApiHandler = (
    fun: (
        _evt: APIGatewayProxyEventV2,
        ctx: Context,
        logger: typeof loggerUtil,
    ) => Promise<APIGatewayProxyStructuredResultV2>,
) => {
    return handler(async (_evt, ctx) => {
        loggerUtil.init(_evt);
        try {
            const result = await fun(_evt, ctx, loggerUtil);
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

export default ApiHandler;
