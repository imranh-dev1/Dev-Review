"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useGetMe, useLogin } from "@/hooks";
import AuthLoading from "../auth/auth-loading";

const schema = z.object({
	email: z.string().trim().email("Enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const queryClient = useQueryClient();
	const { mutate: login, isPending: isLoading } = useLogin();
	const { data, isPending } = useGetMe();

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "imranme.global@gmail.com",
			password: "Pa$$w0rd!",
		},
	});

	if (isPending) {
		return <AuthLoading />;
	}

	const role = data?.data.role.toLowerCase();

	async function onSubmit(values: FormValues) {
		const payload = {
			email: values.email.trim().toLowerCase(),
			password: values.password,
		};
		login(payload, {
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: ["user"],
					exact: true,
				});

				const user = queryClient.getQueryData<{
					data: { role: string };
				}>(["user"])?.data;

				if (!user?.role) {
					toast.error("Unable to identify your account role.");
					return;
				}

				toast.success("Signed in", {
					description: `Welcome back, ${payload.email}.`,
				});

				router.replace(`/${user.role.toLowerCase()}`);
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

								<span className="text-xs text-muted-foreground">
									Need help?
								</span>
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
							{isLoading ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Signing in...
								</>
							) : (
								"Sign in"
							)}
						</Button>
					</FieldGroup>
				</form>
			</CardContent>

			<CardFooter className="border-t border-border pt-3 text-center text-xs text-muted-foreground">
				Secure, role-based access for students, reviewers, and admins.
			</CardFooter>
		</Card>
	);
}
