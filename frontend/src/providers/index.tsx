"use client";

import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "./query.provider";

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryProvider>
			<TooltipProvider>{children}</TooltipProvider>
		</QueryProvider>
	);
}
