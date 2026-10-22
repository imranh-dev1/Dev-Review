import type { NextFunction, Request, Response } from "express";
import { UserStatus, type UserRole } from "../types/models";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import httpStatus from "http-status"
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import type { JwtPayload } from "jsonwebtoken";
import { db } from "../../prisma/db";

export interface RequestUser {
    email: string;
    name: string;
    userId: string;
    role: UserRole;
}

declare global {
    namespace Express {
        interface Request {
            user?: RequestUser;
        }
    }
}

export const auth = (...requiredRoles: UserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken
            ? req.cookies.accessToken
            : req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization?.split(" ")[1]
                : req.headers.authorization;

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in. Please log in to access this resource.");
        }

        const verifiedToken = jwtUtils.verifyToken(
            token,
            config.jwt_access_secret,
        );

        if (!verifiedToken.success) {
            throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.error);
        }

        const { email, name, userId, role } = verifiedToken.data as JwtPayload;

        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.FORBIDDEN, "Forbidden. You don't have permission to access this resource.");
        }

        const user = await db.orm.public.User.where({
            id: userId,
            email,
            name,
            role,
        }).first()

        if (!user) {
            throw new AppError(401, "User not found. Please log in again.");
        }

        if (user.status === UserStatus.DEACTIVATED) {
            throw new AppError(httpStatus.UNAUTHORIZED,
                "This account has been deactivated. Please contact support.",
            );
        }

        if (user.status === UserStatus.SUSPENDED) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "Your account has been blocked. Please contact support.",
            );
        }

        req.user = {
            email,
            name,
            userId,
            role,
        };

        next();
    });
};