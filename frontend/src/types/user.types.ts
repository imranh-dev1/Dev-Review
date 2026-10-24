import type { UserRole, UserStatus } from ".";

export interface IUserListQuery {
	page?: number;
	limit?: number;
	role?: UserRole;
	status?: UserStatus;
	search?: string;
}
