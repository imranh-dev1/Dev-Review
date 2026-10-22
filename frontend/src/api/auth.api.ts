import apiClint from "@/lib/apiClint";
import type {
	IResendOtpPayload,
	IUserRegisterPayload,
	IVerifyEmailPayload,
} from "@/types";

export function userRegister(payload: IUserRegisterPayload) {
	return apiClint("/auth/register", { method: "POST", body: payload });
}

export function userVerifyAccount(payload: IVerifyEmailPayload) {
	return apiClint("/auth/verify-email", {
		method: "POST",
		body: payload,
	});
}

export function resendOTP(payload: IResendOtpPayload) {
	return apiClint("/auth/resend-otp", { method: "POST", body: payload });
}

export function userLogin(payload: { email: string; password: string }) {
	return apiClint("/auth/login", { method: "POST", body: payload });
}

export function getMe() {
	return apiClint("/auth/me", { method: "GET" });
}

export function userLogout() {
	return apiClint("/auth/logout", { method: "POST" });
}
