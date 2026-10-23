import { useMutation, useQuery } from "@tanstack/react-query";
import {
	getAllUsers,
	getUserDetails,
	userChangePassword,
	userUpdateProfile,
} from "@/api/user.api";
import { IUserListQuery } from "@/types/user.types";

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