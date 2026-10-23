import apiClint from "@/lib/apiClint";

export function userUpdateProfile(payload: FormData) {
	return apiClint("/user/profile-update", {
		method: "PATCH",
		body: payload,
	});
}
