import { defineMiddleware } from "astro/middleware";

const protectedRoutes = defineMiddleware((context, next) => {
    console.log("protected routes middleware ");
    return next();
});

export default protectedRoutes;
