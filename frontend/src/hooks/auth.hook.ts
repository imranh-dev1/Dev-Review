import { userRegister } from "@/api/auth.api";
import { useMutation } from "@tanstack/react-query";

export function useRegister() {
    return useMutation({
        mutationFn: userRegister,
    });
}