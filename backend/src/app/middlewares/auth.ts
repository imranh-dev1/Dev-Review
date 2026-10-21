import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { db } from "../../prisma/db";
import { AppError } from "../utils/AppError";
import { verifyAccessToken } from "../utils/jwt";
import type { UserRole } from "../types/models";

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;
        let token: string | undefined;

        if (header && header.startsWith("Bearer ")) {
            token = header.slice(7);
        } else if (req.cookies?.access_token) {
            token = req.cookies.access_token;
        }

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
        }

        const payload = verifyAccessToken(token);

        const user = await db.orm.public.User
            .where({ id: payload.sub })
            .select("id", "name", "email", "role", "status")
            .first();

        if (!user) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Account no longer exists");
        }

        if (user.status !== "ACTIVE") {
            throw new AppError(httpStatus.FORBIDDEN, "Account is not active");
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as UserRole,
        };

        next();
    } catch (error) {
        next(error);
    }
};

export const authorize = (...roles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError(httpStatus.UNAUTHORIZED, "Authentication required"));
        }
        if (roles.length > 0 && !roles.includes(req.user.role)) {
            return next(
                new AppError(httpStatus.FORBIDDEN, "You do not have permission to perform this action"),
            );
        }
        next();
    };
};
