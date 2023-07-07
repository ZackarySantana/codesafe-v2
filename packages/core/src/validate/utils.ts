/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorResponse, ReturnOr } from "@lunar/types";

type GuaranteedObject<T extends string> = Record<Readonly<T[]>[number], any>;

export function validateProperties<T extends string>(
    test: any,
    properties: Readonly<T[]>,
): ReturnOr<GuaranteedObject<T>, ErrorResponse> {
    const obj = {} as GuaranteedObject<T>;
    for (const property of properties) {
        if (test[property] === undefined) {
            return [
                undefined,
                {
                    statusCode: 400,
                    body: `Missing ${property}`,
                },
            ];
        }
    }
    return [obj, undefined];
}
