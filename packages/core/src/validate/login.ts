import bcrypt from "bcryptjs";

import { ErrorResponse, LoginCredentials, ReturnOr } from "@lunar/types";
import { ErrorWrap, ErrorWrapErr } from "src/utils";
import { validateProperties } from "./utils";

function _validateLogin(
    body: string,
): ReturnOr<LoginCredentials, ErrorResponse> {
    return validateProperties(JSON.parse(body), ["email", "password"] as const);
}

type ValidateLoginParams = Parameters<typeof _validateLogin>;
type ValidateLoginReturn = ReturnType<typeof _validateLogin>;
export const validateLogin: (
    ...args: ValidateLoginParams
) => ValidateLoginReturn = (b: string) => ErrorWrap(() => _validateLogin(b));

function _comparePasswordSync(
    passwordTest: string,
    passwordHash: string,
): ErrorResponse | undefined {
    const match = bcrypt.compareSync(passwordTest, passwordHash);
    if (!match) {
        return {
            statusCode: 401,
            body: "Incorrect password",
        };
    }

    return undefined;
}

type ComparePasswordSyncParams = Parameters<typeof _comparePasswordSync>;
type ComparePasswordSyncReturn = ReturnType<typeof _comparePasswordSync>;
export const comparePasswordSync: (
    ...args: ComparePasswordSyncParams
) => ComparePasswordSyncReturn = (p: string, ph: string) =>
    ErrorWrapErr(() => _comparePasswordSync(p, ph));
