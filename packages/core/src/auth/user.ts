import { Database } from "@lunar/database/database";
import { User } from "@lunar/database/schemas/user";
import { ErrorResponse, ReturnOr } from "@lunar/types";
import jwt from "jsonwebtoken";
import { Kysely } from "kysely";
import { comparePassword } from "src/validate/login";
import { Config } from "sst/node/config";

export async function login(
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
    if (!comparePassword(password, user[0].password)) {
        return [
            undefined,
            {
                statusCode: 401,
                body: "Incorrect password",
            },
        ];
    }
    return [user[0], undefined];
}

export function createJWT(user: User): string {
    const secret = Config.JWT_SECRET;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return jwt.sign(userWithoutPassword, secret, {
        expiresIn: Config.JWT_LIFETIME,
    });
}

export async function getToken(
    token: string,
): Promise<ReturnOr<User, ErrorResponse>> {
    const secret = Config.JWT_SECRET;

    const decoded = jwt.verify(token.replace("Bearer ", ""), secret) as User & {
        iat: number;
        exp: number;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...user } = decoded;

    return [user, undefined];
}
