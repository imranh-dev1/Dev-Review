import type { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/AppError";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const REFRESH_COOKIE = "refresh_token";

const refreshCookieOptions = () => ({
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: (config.node_env === "production" ? "none" : "lax") as "none" | "lax",
    path: "/api/v1/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

const currentUserId = (req: Request): string => {
    if (!req.user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }
    return req.user.id;
};

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.registerUser(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: result.message,
        data: null,
    });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.verifyEmail(req.body);

    res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions());

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Email verified successfully.",
        data: {
            user: result.user,
            accessToken: result.accessToken,
        },
    });
});

const resendOtp = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.resendOtp(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: result.message,
        data: null,
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.loginUser(req.body);

    res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions());

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Logged in successfully.",
        data: {
            user: result.user,
            accessToken: result.accessToken,
        },
    });
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE] as string | undefined;

    if (!refreshToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token missing");
    }

    const result = await AuthServices.refreshTokens(refreshToken);

    res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions());

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Token refreshed successfully.",
        data: {
            user: result.user,
            accessToken: result.accessToken,
        },
    });
});

const logout = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE] as string | undefined;

    await AuthServices.logout(refreshToken);

    res.clearCookie(REFRESH_COOKIE, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: config.node_env === "production" ? "none" : "lax",
        path: "/api/v1/auth",
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Logged out successfully.",
        data: null,
    });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
    const user = await AuthServices.getMe(currentUserId(req));

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile fetched successfully.",
        data: user,
    });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const user = await AuthServices.updateProfile(currentUserId(req), req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile updated successfully.",
        data: user,
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.changePassword(currentUserId(req), req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: result.message,
        data: null,
    });
});

export const AuthControllers = {
    registerUser,
    verifyEmail,
    resendOtp,
    loginUser,
    refreshTokens,
    logout,
    getMe,
    updateProfile,
    changePassword,
};
