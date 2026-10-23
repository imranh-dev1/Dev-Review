"use client";

import { ArrowLeft, Home, ShieldX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AccessDenied() {
	const router = useRouter();

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-background px-6">
			<div className="flex max-w-md flex-col items-center text-center">
				<div className="mb-6 flex size-16 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10">
					<ShieldX className="size-8 text-destructive" />
				</div>

				<span className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
					403 · Access Denied
				</span>

				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
					You don&apos;t have access
				</h1>

				<p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
					You don&apos;t have the required permissions to access this page.
					Please contact an administrator if you believe this is a mistake.
				</p>

				<div className="mt-7 flex flex-col gap-3 sm:flex-row">
					<Button variant="outline" onClick={() => router.back()}>
						<ArrowLeft className="size-4" />
						Go Back
					</Button>

					<Button asChild>
						<Link href="/">
							<Home className="size-4" />
							Go Home
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
