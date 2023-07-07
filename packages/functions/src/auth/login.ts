import { ConnectToDatabase } from "@lunar/core/auth/connect";
import { createJWT, login } from "@lunar/core/auth/user";
import { validateLogin } from "@lunar/core/validate/login";
import { ApiHandler } from "sst/node/api";

const db = ConnectToDatabase();

export const handler = ApiHandler(async (_evt) => {
    const [loginCredentials, loginError] = validateLogin(_evt.body ?? "{}");
    if (loginError !== undefined) {
        return loginError;
    }
    const [user, authError] = await login(
        db,
        loginCredentials.email,
        loginCredentials.password,
    );
    if (authError !== undefined) {
        return authError;
    }
    const jwt = createJWT(user);
    return {
        statusCode: 200,
        body: jwt,
    };
});
