"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { api, setAccessToken } from "@/lib/api-client";
import type { AuthPayload, User } from "@/types";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
	user: User | null;
	status: AuthStatus;
	login: (input: { email: string; password: string }) => Promise<User>;
	register: (input: {
		name: string;
		email: string;
		password: string;
	}) => Promise<void>;
	verifyEmail: (input: { email: string; otp: string }) => Promise<User>;
	logout: () => Promise<void>;
	setUser: (user: User | null) => void;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [status, setStatus] = useState<AuthStatus>("loading");

	const applySession = useCallback((payload: AuthPayload) => {
		setAccessToken(payload.accessToken);
		setUser(payload.user);
		setStatus("authenticated");
		return payload.user;
	}, []);

	const bootstrap = useCallback(async () => {
		try {
			const result = await api.get<AuthPayload>("/auth/refresh");
			applySession(result.data);
			return;
		} catch {
			// No refresh session — fall through to anonymous state.
		}

		setAccessToken(null);
		setUser(null);
		setStatus("unauthenticated");
	}, [applySession]);

	useEffect(() => {
		void bootstrap();
	}, [bootstrap]);

	const login = useCallback(
		async (input: { email: string; password: string }) => {
			const result = await api.post<AuthPayload>("/auth/login", input);
			return applySession(result.data);
		},
		[applySession],
	);

	const register = useCallback(
		async (input: { name: string; email: string; password: string }) => {
			await api.post("/auth/register", input);
		},
		[],
	);

	const verifyEmail = useCallback(
		async (input: { email: string; otp: string }) => {
			const result = await api.post<AuthPayload>(
				"/auth/verify-email",
				input,
			);
			return applySession(result.data);
		},
		[applySession],
	);

	const logout = useCallback(async () => {
		try {
			await api.post("/auth/logout");
		} catch {
			// Session may already be invalid; clear local state regardless.
		}
		setAccessToken(null);
		setUser(null);
		setStatus("unauthenticated");
	}, []);

	const refreshUser = useCallback(async () => {
		try {
			const result = await api.get<User>("/auth/me");
			setUser(result.data);
			setStatus("authenticated");
		} catch {
			setUser(null);
			setStatus("unauthenticated");
		}
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			status,
			login,
			register,
			verifyEmail,
			logout,
			setUser,
			refreshUser,
		}),
		[user, status, login, register, verifyEmail, logout, refreshUser],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuthContext must be used inside <AuthProvider>");
	}
	return context;
}
