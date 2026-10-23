"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetMe } from "@/hooks";
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
	const { data, isPending, isError } = useGetMe();

	const router = useRouter();
	const user = data?.data;

	useEffect(() => {
		if (isPending) return;

		if (isError || !user) {
			router.replace("/login");
		}
	}, [router, user, isError, isPending]);

	if (isPending) {
		return <AuthLoading value="Verifying your account..." />;
	}

	if (isError || !user) {
		return <AuthLoading value="Redirecting..." />;
	}

	return <>{children}</>;
}
