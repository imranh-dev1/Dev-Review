import apiClint from "@/lib/apiClint";
import { UserStatus } from "@/types";
import { IChangePassword } from "@/types/auth.types";
import { IUserListQuery } from "@/types/user.types";

export function userUpdateProfile(payload: FormData) {
	return apiClint("/user/profile-update", {
		method: "PATCH",
		body: payload,
	});
}

export function userChangePassword(payload: IChangePassword) {
	return apiClint("/user/me/password", {
		method: "PATCH",
		body: payload,
	});
}

export function getAllUsers(params?: IUserListQuery) {
	return apiClint("/user/all", {
		method: "GET",
		query: params,
	});
}

export const getUserDetails = (id: string) => {
	return apiClint(`/user/${id}`, {
		method: "GET",
	});
};

export const updateUserStatus = (id: string, status: UserStatus) => {
	return apiClint(`/user/${id}/status`, {
		method: "PATCH",
		body: { status },
	});
};

export const deleteUser = (id: string) => {
	return apiClint(`/user/${id}`, {
		method: "DELETE",
	});
};
