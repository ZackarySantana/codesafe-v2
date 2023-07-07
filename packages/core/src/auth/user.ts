import { Database } from "@lunar/database/database";
import { User } from "@lunar/database/schemas/user";
import { ErrorResponse, ReturnOr } from "@lunar/types";
import jwt from "jsonwebtoken";
import { Kysely } from "kysely";
import { ErrorWrapAsync, ErrorWrapRaw } from "src/utils";
import { comparePasswordSync } from "src/validate/login";
import { Config } from "sst/node/config";

async function _login(
    db: Kysely<Database>,
    email: string,
    password: string,
): Promise<ReturnOr<User, ErrorResponse>> {
    const user = await db
        .selectFrom("user")
        .selectAll()
        .where("email", "=", email)
        .execute();

    if (user.length === 0) {
        return [
            undefined,
            {
                statusCode: 404,
                body: "User not found",
            },
        ];
    }
    const passwordErr = comparePasswordSync(password, user[0].password);
    if (passwordErr !== undefined) {
        return [undefined, passwordErr];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pw, ...userWithoutPassword } = user[0];
    return [userWithoutPassword, undefined];
}

type LoginParams = Parameters<typeof _login>;
type LoginReturn = ReturnType<typeof _login>;
export const login: (...args: LoginParams) => LoginReturn = (
    db: Kysely<Database>,
    e: string,
    p: string,
) => ErrorWrapAsync(() => _login(db, e, p));

function _createJWT(user: User): string {
    const secret = Config.JWT_SECRET;

    return jwt.sign(user, secret, {
        expiresIn: Config.JWT_LIFETIME,
    });
}

type CreateJWTParams = Parameters<typeof _createJWT>;
type CreateJWTReturn = ReturnType<typeof _createJWT>;
export const createJWT: (
    ...args: CreateJWTParams
) => ReturnOr<CreateJWTReturn, ErrorResponse> = (u: User) =>
    ErrorWrapRaw(() => _createJWT(u));

async function _getToken(
    token: string,
): Promise<ReturnOr<User, ErrorResponse>> {
    const secret = Config.JWT_SECRET;

    let decoded;
    try {
        decoded = jwt.verify(token.replace("Bearer ", ""), secret) as User & {
            iat: number;
            exp: number;
        };
    } catch (e) {
        return [
            undefined,
            {
                statusCode: 401,
                body: "Invalid token",
            },
        ];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...user } = decoded;

    return [user, undefined];
}

export const getToken = (t: string) => ErrorWrapAsync(() => _getToken(t));
