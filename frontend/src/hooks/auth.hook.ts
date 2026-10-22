import { useMutation, useQuery } from "@tanstack/react-query";
import {
	getMe,
	resendOTP,
	userLogin,
	userLogout,
	userRegister,
	userVerifyAccount,
} from "@/api/auth.api";

export function useRegister() {
	return useMutation({
		mutationFn: userRegister,
	});
}

export function useVerifyAccount() {
	return useMutation({
		mutationFn: userVerifyAccount,
	});
}

export function useResendOTP() {
	return useMutation({
		mutationFn: resendOTP,
	});
}

export function useLogin() {
	return useMutation({
		mutationFn: userLogin,
	});
}

export function useGetMe() {
	return useQuery({
		queryKey: ["user"],
		queryFn: getMe,
		retry: false,
	});
}

export function useLogout() {
	return useMutation({
		mutationFn: userLogout,
	});
}
