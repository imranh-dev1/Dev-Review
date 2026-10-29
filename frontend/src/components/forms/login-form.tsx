"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
	ClipboardCheck,
	Eye,
	EyeOff,
	GraduationCap,
	Loader2,
	ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks";
import type { UserRole } from "@/types";

const schema = z.object({
	email: z.string().trim().email("Enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

const DEMO_PASSWORD = "Demo@1234";

const dashboardRoutes: Record<UserRole, string> = {
	STUDENT: "/student",
	REVIEWER: "/reviewer",
	ADMIN: "/admin",
};

const demoAccounts: {
	role: UserRole;
	label: string;
	email: string;
	icon: typeof GraduationCap;
}[] = [
	{
		role: "STUDENT",
		label: "Student",
		email: "student@devreview.dev",
		icon: GraduationCap,
	},
	{
		role: "REVIEWER",
		label: "Reviewer",
		email: "reviewer@devreview.dev",
		icon: ClipboardCheck,
	},
	{
		role: "ADMIN",
		label: "Admin",
		email: "admin@devreview.dev",
		icon: ShieldCheck,
	},
];

export function LoginForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [demoRole, setDemoRole] = useState<UserRole | null>(null);
	const queryClient = useQueryClient();
	const { mutate: login, isPending: isLoading } = useLogin();

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: FormValues) {
		const payload = {
			email: values.email.trim().toLowerCase(),
			password: values.password,
		};
		login(payload, {
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: ["user"] });

				toast.success("Signed in", {
					description: `Welcome back, ${payload.email}.`,
				});

				router.replace(`/`);
			},
			onError: (error) => {
				const message =
					error instanceof Error
						? error.message
						: "Unable to sign in. Check your credentials and try again.";

				toast.error("Sign in failed", {
					description: message,
				});
			},
		});
	}

	function onDemoLogin(account: (typeof demoAccounts)[number]) {
		setDemoRole(account.role);
		form.setValue("email", account.email);
		form.setValue("password", DEMO_PASSWORD);

		login(
			{ email: account.email, password: DEMO_PASSWORD },
			{
				onSuccess: async () => {
					await queryClient.invalidateQueries({ queryKey: ["user"] });

					toast.success(`Signed in as ${account.label}`, {
						description: `Explore the ${account.label.toLowerCase()} dashboard with sample data.`,
					});

					router.replace(dashboardRoutes[account.role]);
				},
				onError: (error) => {
					toast.error("Demo sign in failed", {
						description:
							error instanceof Error
								? error.message
								: "Unable to sign in with the demo account. Please try again.",
					});
				},
				onSettled: () => setDemoRole(null),
			},
		);
	}

	return (
		<Card className="border-border">
			<CardHeader className="sr-only">
				<h2>Sign in form</h2>
			</CardHeader>

			<CardContent className="pt-5">
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						{/* Email */}
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>

							<Input
								id="email"
								type="email"
								autoComplete="email"
								placeholder="name@domain.com"
								disabled={isLoading}
								aria-invalid={!!form.formState.errors.email}
								{...form.register("email")}
							/>

							<FieldError
								errors={
									form.formState.errors.email
										? [form.formState.errors.email]
										: []
								}
							/>
						</Field>

						{/* Password */}
						<Field>
							<div className="flex items-center justify-between">
								<FieldLabel htmlFor="password">Password</FieldLabel>

								<Link
									href="/forgot-password"
									className="text-primary underline-offset-4 hover:underline"
								>
									Forgot password?
								</Link>
							</div>

							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									placeholder="Enter your password"
									className="pr-11"
									disabled={isLoading}
									aria-invalid={!!form.formState.errors.password}
									{...form.register("password")}
								/>

								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:bg-transparent"
									onClick={() => setShowPassword((previous) => !previous)}
									disabled={isLoading}
									aria-label={showPassword ? "Hide password" : "Show password"}
									aria-pressed={showPassword}
								>
									{showPassword ? (
										<EyeOff className="size-4" />
									) : (
										<Eye className="size-4" />
									)}
								</Button>
							</div>

							<FieldError
								errors={
									form.formState.errors.password
										? [form.formState.errors.password]
										: []
								}
							/>
						</Field>

						{/* Submit */}
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading && !demoRole ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Signing in...
								</>
							) : (
								"Sign in"
							)}
						</Button>

						<FieldSeparator>or try a demo account</FieldSeparator>

						<div className="grid grid-cols-3 gap-2">
							{demoAccounts.map((account) => {
								const Icon = account.icon;
								const isDemoLoading = isLoading && demoRole === account.role;

								return (
									<Button
										key={account.role}
										type="button"
										variant="outline"
										size="sm"
										className="h-auto flex-col gap-1.5 py-2.5"
										title={`Sign in as ${account.label} (${account.email})`}
										onClick={() => onDemoLogin(account)}
										disabled={isLoading}
									>
										{isDemoLoading ? (
											<Loader2 className="size-4 animate-spin" />
										) : (
											<Icon className="size-4" />
										)}
										<span>{account.label}</span>
									</Button>
								);
							})}
						</div>

						<p className="text-center text-[11px] leading-relaxed text-muted-foreground">
							One-click access with preloaded sample data for each role.
						</p>
					</FieldGroup>
				</form>
			</CardContent>

			<CardFooter className="border-t border-border pt-3 text-center text-xs text-muted-foreground">
				Secure, role-based access for students, reviewers, and admins.
			</CardFooter>
		</Card>
	);
}
