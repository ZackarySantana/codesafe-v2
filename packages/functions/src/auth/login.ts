import { ConnectToDatabase } from "@lunar/core/database/connect";
import { comparePassword, validateLogin } from "@lunar/core/validate/login";
import { User } from "@lunar/database/schemas/user";
import { ErrorResponse, ReturnOr } from "@lunar/types";
import { ApiHandler } from "sst/node/api";

const db = ConnectToDatabase();

const correctLogin = async (
    email: string,
    password: string,
): Promise<ReturnOr<User, ErrorResponse>> => {
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
};

export const handler = ApiHandler(async (_evt) => {
    const [loginCredentials, loginError] = validateLogin(_evt.body ?? "{}");
    if (loginError !== undefined) {
        return loginError;
    }
    const [user, authError] = await correctLogin(
        loginCredentials.email,
        loginCredentials.password,
    );
    if (authError !== undefined) {
        return authError;
    }
    // TODO: Generate JWT
    return {
        statusCode: 200,
        body: `Hello world. The time is ${new Date().toISOString()}`,
    };
});
