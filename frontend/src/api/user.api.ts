import apiClint from "@/lib/apiClint";
import { IChangePassword } from "@/types/auth.types";

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
