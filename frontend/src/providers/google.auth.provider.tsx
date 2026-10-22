"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";

export default function GoogleAuthProvider({
	children,
}: {
	children: ReactNode;
}) {
	const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLINT_ID!;

	if (!clientId) {
		return <>{children}</>;
	}

	return (
		<GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
	);
}
