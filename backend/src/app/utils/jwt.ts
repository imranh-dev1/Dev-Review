import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import config from "../config";
import { AppError } from "./AppError";
import httpStatus from "http-status";
import type { UserRole } from "../types/models";

export interface AccessTokenPayload {
    sub: string;
    email: string;
    role: UserRole;
}

export interface RefreshTokenPayload {
    sub: string;
    role: UserRole;
    jti: string;
}

export const signAccessToken = (payload: AccessTokenPayload): string =>
    jwt.sign(payload, config.jwt_access_secret, {
        expiresIn: config.jwt_access_expires_in as SignOptions["expiresIn"],
    });

export const signRefreshToken = (payload: RefreshTokenPayload): string =>
    jwt.sign(payload, config.jwt_refresh_secret, {
        expiresIn: config.jwt_refresh_expires_in as SignOptions["expiresIn"],
    });

export const verifyAccessToken = (token: string): AccessTokenPayload => {
    try {
        return jwt.verify(token, config.jwt_access_secret) as AccessTokenPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Access token expired");
        }
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid access token");
    }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
    try {
        return jwt.verify(token, config.jwt_refresh_secret) as RefreshTokenPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token expired");
        }
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
    }
};
