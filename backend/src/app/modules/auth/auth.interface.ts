export interface IUserRegisterPayload {
    name: string;
    email: string;
    password: string;
    role?: "STUDENT" | "REVIEWER" | "ADMIN";
}