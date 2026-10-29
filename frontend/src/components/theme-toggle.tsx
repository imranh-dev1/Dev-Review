"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const isDark = resolvedTheme !== "light";

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon-sm"
			aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
			onClick={() => setTheme(isDark ? "light" : "dark")}
		>
			{mounted ? (
				isDark ? (
					<Sun className="size-4" />
				) : (
					<Moon className="size-4" />
				)
			) : (
				<span className="size-4" />
			)}
		</Button>
	);
}
