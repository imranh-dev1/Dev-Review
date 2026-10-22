import { getMe, userLogin, userRegister, userVerifyAccount } from "@/api/auth.api";
import { useMutation, useQuery } from "@tanstack/react-query";

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