import { ErrorResponse, ReturnOr } from "@lunar/types";

export function ErrorWrap<T>(
    fn: () => ReturnOr<T, ErrorResponse>,
): ReturnOr<T, ErrorResponse> {
    try {
        return fn();
    } catch (e) {
        return [
            undefined,
            {
                statusCode: 500,
                body: "Internal server error",
            },
        ];
    }
}

/*
 * This is works like ErrorWrap2(func) and it just wraps the calling of that func.
 * For some reason the typing is lost
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ErrorWrap2<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Targs extends any[],
    E,
    TReturn extends ReturnOr<E, ErrorResponse>,
>(fun: (...args: Targs) => TReturn): (...args: Targs) => TReturn {
    return (...args: Targs): TReturn => {
        try {
            const [result, err] = fun(...args);
            if (err !== undefined) {
                return [undefined, err] as TReturn;
            }
            return [result, undefined] as TReturn;
        } catch (e) {
            return [
                undefined,
                {
                    statusCode: 500,
                    body: "Internal server error",
                },
            ] as TReturn;
        }
    };
}

export function ErrorWrapAsync<T>(
    fn: () => Promise<ReturnOr<T, ErrorResponse>>,
): Promise<ReturnOr<T, ErrorResponse>> {
    return fn().catch(() => [
        undefined,
        {
            statusCode: 500,
            body: "Internal server error",
        },
    ]);
}

export function ErrorWrapRaw<T>(fn: () => T): ReturnOr<T, ErrorResponse> {
    try {
        return [fn(), undefined];
    } catch (e) {
        return [
            undefined,
            {
                statusCode: 500,
                body: "Internal server error",
            },
        ];
    }
}

export function ErrorWrapErr(
    fn: () => ErrorResponse | undefined,
): ErrorResponse | undefined {
    try {
        return fn();
    } catch (e) {
        return {
            statusCode: 500,
            body: "Internal server error",
        };
    }
}
