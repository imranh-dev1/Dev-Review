"use client";

import { ReactNode } from "react";
import QueryProvider from "./query.provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }: { children: ReactNode }) {
    return (

        <QueryProvider>
            <TooltipProvider>{children}</TooltipProvider>
        </QueryProvider>
    );
}