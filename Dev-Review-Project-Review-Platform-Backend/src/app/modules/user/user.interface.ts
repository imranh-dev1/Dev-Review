import type { UserRole, UserStatus } from "../../types/models";

export interface UserListQuery {
    page?: number;
    limit?: number;
    role?: UserRole;
    status?: UserStatus;
    search?: string;
}