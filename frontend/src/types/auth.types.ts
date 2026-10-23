import type { UserRole } from ".";

export interface IUserRegisterPayload {
	name: string;
	email: string;
	password: string;
	role?: UserRole;
}

export interface IVerifyEmailPayload {
	email: string;
	otp: string;
}

export interface IResendOtpPayload {
	email: string;
}

export interface IChangePassword {
	currentPassword: string;
	newPassword: string;
}
