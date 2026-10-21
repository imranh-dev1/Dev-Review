export type UserRole = "STUDENT" | "REVIEWER" | "ADMIN";

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