import { defineMiddleware } from "astro/middleware";

const auth = defineMiddleware((context, next) => {
    console.log("auth middleware ");
    return next();
});

export default auth;
