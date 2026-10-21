"use client";

import { useAuthContext } from "@/providers/auth-provider";

export function useAuth() {
	return useAuthContext();
}

export function useRole(...roles: string[]) {
	const { user } = useAuthContext();
	if (!user) return false;
	return roles.includes(user.role);
}
