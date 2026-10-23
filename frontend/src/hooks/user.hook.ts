import { useMutation } from "@tanstack/react-query";
import { userUpdateProfile } from "@/api/user.api";

export function useProfileUpdate() {
	return useMutation({
		mutationFn: userUpdateProfile,
	});
}
