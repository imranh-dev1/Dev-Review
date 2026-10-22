import type { CookieOptions, Response } from "express";
import config from "../config";

const ONE_DAY_MS = 1000 * 60 * 60 * 24;
const SEVEN_DAYS_MS = ONE_DAY_MS * 7;

const isDevelopment = config.node_env === "development";

const baseOptions: CookieOptions = {
	httpOnly: true,
	secure: isDevelopment ? false : true,
	sameSite: isDevelopment ? "lax" : "none",
};

export const setAuthCookies = (
	res: Response,
	accessToken: string,
	refreshToken: string,
) => {
	res.cookie("accessToken", accessToken, {
		...baseOptions,
		maxAge: ONE_DAY_MS,
	});

	res.cookie("refreshToken", refreshToken, {
		...baseOptions,
		maxAge: SEVEN_DAYS_MS,
	});
};

export const clearAuthCookies = (res: Response) => {
	res.clearCookie("accessToken", baseOptions);
	res.clearCookie("refreshToken", baseOptions);
};
