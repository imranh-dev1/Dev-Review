import { useMutation, useQuery } from "@tanstack/react-query";
import {
	deleteUser,
	getAllUsers,
	getUserDetails,
	updateUserRole,
	updateUserStatus,
	userChangePassword,
	userUpdateProfile,
} from "@/api/user.api";
import type { UserRole, UserStatus } from "@/types";
import type { IUserListQuery } from "@/types/user.types";

export function useProfileUpdate() {
	return useMutation({
		mutationFn: userUpdateProfile,
	});
}

export function useChangePassword() {
	return useMutation({
		mutationFn: userChangePassword,
	});
}

export function useGetAllUsers(params?: IUserListQuery) {
	return useQuery({
		queryKey: ["users", params],
		queryFn: () => getAllUsers(params),
	});
}

export function useGetUserDetails(id: string) {
	return useQuery({
		queryKey: ["user-details", id],
		queryFn: () => getUserDetails(id),
		enabled: Boolean(id),
	});
}

export function useUpdateUserStatus() {
	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
			updateUserStatus(id, status),
	});
}

export function useUpdateUserRole() {
	return useMutation({
		mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
			updateUserRole(id, role),
	});
}

export function useDeleteUser() {
	return useMutation({
		mutationFn: (id: string) => deleteUser(id),
	});
}
