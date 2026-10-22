import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = async (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (config.node_env === "development") {
        console.log("Error from Global Error Handler", err);
    }

    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = err.message || "Internal Server Error";
    const errorName = err.name || "Internal Server Error";

    const isPrismaError = err?.code?.startsWith("DB.") || err?.code?.startsWith("ORM.") || err?.code?.startsWith("CLIENT.") || err?.code?.startsWith("P");

    if (isPrismaError) {
        if (err.code === "CLIENT.VALIDATION_FAILED") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "You have provided incorrect field type or missing fields";
        } else if (err.code === "DB.UNIQUE_CONSTRAINT_VIOLATION" || err.code === "P2002") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "Duplicate Key Error";
        } else if (err.code === "DB.FOREIGN_KEY_CONSTRAINT_FAILED" || err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "Foreign key constraint failed";
        } else if (err.code === "ORM.MUTATION_ROW_MISSING" || err.code === "P2025") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
        } else if (err.code === "DB.AUTHENTICATION_FAILED" || err.errorCode === "P1000") {
            statusCode = httpStatus.UNAUTHORIZED;
            errorMessage = "Authentication failed against database server. Please Check Your Credentials";
        } else if (err.code === "DB.CONNECTION_FAILED" || err.errorCode === "P1001") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "Can't reach database server";
        } else if (err.code?.startsWith("CLIENT.UNKNOWN") || err.name?.includes("UnknownRequestError")) {
            statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            errorMessage = "Error occurred during query execution";
        }
    } else if (err instanceof Error) {
        errorMessage = err.message;
    }

    if (typeof err?.statusCode === "number") {
        statusCode = err.statusCode;
    }

    res.status(statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        name:
            config.node_env === "development" ? errorName : "Internal Server Error",
        message:
            config.node_env === "development"
                ? errorMessage
                : "Internal Server Error",
        error: config.node_env === "development" ? err : undefined,
        stack: config.node_env === "development" ? err.stack : undefined,
    });
};
