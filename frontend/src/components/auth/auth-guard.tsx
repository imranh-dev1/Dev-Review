"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingState } from "@/components/shared/state";
import { useAuth } from "@/hooks/use-auth";

export function AuthGuard({
	children,
	requiredRoles,
}: {
	children: React.ReactNode;
	requiredRoles?: string[];
}) {
	const router = useRouter();
	const { user, status } = useAuth();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.replace("/login");
		}
	}, [status, router]);

	useEffect(() => {
		if (status === "authenticated" && requiredRoles && user) {
			if (!requiredRoles.includes(user.role)) {
				router.replace("/dashboard");
			}
		}
	}, [status, user, requiredRoles, router]);

	if (status === "loading") {
		return <LoadingState label="Checking session" className="min-h-svh" />;
	}

	if (status === "unauthenticated") {
		return (
			<LoadingState label="Redirecting to sign in" className="min-h-svh" />
		);
	}

	if (requiredRoles && user && !requiredRoles.includes(user.role)) {
		return <LoadingState label="Redirecting" className="min-h-svh" />;
	}

	return <>{children}</>;
}
