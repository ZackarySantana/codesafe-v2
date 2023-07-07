import ApiHandler from "@lunar/core/ApiHandler";
import { ConnectToDatabase } from "@lunar/core/auth/connect";
import { createJWT, login } from "@lunar/core/auth/user";
import { validateLogin } from "@lunar/core/validate/login";

const db = ConnectToDatabase();

export const handler = ApiHandler(async (_evt, _, logger) => {
    const [loginCredentials, loginError] = validateLogin(_evt.body ?? "{}");
    if (loginError !== undefined) {
        return loginError;
    }
    logger.debug("email", loginCredentials.email);
    const [user, authError] = await login(
        db,
        loginCredentials.email,
        loginCredentials.password,
    );
    if (authError !== undefined) {
        return authError;
    }
    logger.debug("user", user);
    const [jwt, jwtError] = createJWT(user);
    if (jwtError !== undefined) {
        return jwtError;
    }
    return {
        statusCode: 200,
        body: jwt,
    };
});
