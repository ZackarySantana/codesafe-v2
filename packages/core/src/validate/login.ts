import bcrypt from "bcryptjs";

import { ErrorResponse, LoginCredentials, ReturnOr } from "@lunar/types";
import { validateProperties } from "./utils";

export function validateLogin(
    body: string,
): ReturnOr<LoginCredentials, ErrorResponse> {
    return validateProperties(JSON.parse(body), ["email", "password"] as const);
}

export function comparePassword(
    passwordTest: string,
    passwordHash: string,
): boolean {
    return bcrypt.compareSync(passwordTest, passwordHash);
}
