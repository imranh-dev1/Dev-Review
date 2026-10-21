import { userLogin, userRegister, userVerifyAccount } from "@/api/auth.api";
import { useMutation } from "@tanstack/react-query";

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