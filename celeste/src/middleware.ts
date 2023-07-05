import { sequence } from "astro/middleware";
import auth from "./middlewares/auth";
import protectedRoutes from "./middlewares/protected_routes";

export const onRequest = sequence(auth, protectedRoutes);
