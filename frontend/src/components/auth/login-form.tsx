"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api-client";

const schema = z.object({
	email: z.string().trim().email("Enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
	const router = useRouter();
	const { login } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: FormValues) {
		setIsLoading(true);
		try {
			const user = await login(values);
			toast.success("Signed in", {
				description: `Welcome back, ${user.name}.`,
			});
			router.replace("/dashboard");
		} catch (error) {
			const message =
				error instanceof ApiError
					? error.message
					: "Unable to sign in. Check your credentials and try again.";
			toast.error("Sign in failed", { description: message });
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className="border-border">
			<CardHeader className="sr-only">
				<h2>Sign in form</h2>
			</CardHeader>
			<CardContent className="pt-5">
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								type="email"
								autoComplete="email"
								placeholder="name@domain.com"
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

						<Field>
							<div className="flex items-center justify-between">
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<span className="text-xs text-muted-foreground">
									Need help?
								</span>
							</div>
							<Input
								id="password"
								type="password"
								autoComplete="current-password"
								placeholder="Enter your password"
								{...form.register("password")}
							/>
							<FieldError
								errors={
									form.formState.errors.password
										? [form.formState.errors.password]
										: []
								}
							/>
						</Field>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Signing in…" : "Sign in"}
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
