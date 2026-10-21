import { rateLimit } from "express-rate-limit";

const buildMessage = (message: string) => ({
    success: false,
    statusCode: 429,
    message,
    data: null,
});

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: buildMessage("Too many requests, please try again later."),
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: buildMessage("Too many authentication attempts, please try again later."),
});
