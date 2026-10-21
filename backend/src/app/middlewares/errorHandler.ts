import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import config from "../config";
import { AppError } from "../utils/AppError";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(httpStatus.NOT_FOUND, `Route not found: ${req.method} ${req.originalUrl}`));
};

const isUniqueViolation = (error: unknown): boolean => {
    const err = error as { code?: string; cause?: { code?: string } };
    return err?.code === "23505" || err?.cause?.code === "23505";
};

export const errorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let message = config.node_env === "production" ? "Internal server error" : String((error as Error)?.message ?? error);

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    } else if (error instanceof ZodError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = error.issues
            .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
            .join("; ");
    } else if (isUniqueViolation(error)) {
        statusCode = httpStatus.CONFLICT;
        message = "A record with this information already exists";
    }

    if (statusCode >= 500) {
        console.error("Unhandled error:", error);
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        data: null,
    });
};
