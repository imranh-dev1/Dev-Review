import type { UserRole } from "../../types/models";

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

export interface ILoginPayload {
	email: string;
	password: string;
}

export interface IUpdateProfilePayload {
	name?: string;
	avatar?: string;
}

export interface IChangePasswordPayload {
	currentPassword: string;
	newPassword: string;
}

export interface IPublicUser {
	id: string;
	name: string;
	email: string;
	avatar: string | null;
	role: UserRole;
	status: string;
	emailVerifiedAt: unknown;
	createdAt: unknown;
	updatedAt: unknown;
}
