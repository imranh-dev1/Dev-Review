import { useMutation } from "@tanstack/react-query";
import { userChangePassword, userUpdateProfile } from "@/api/user.api";

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
