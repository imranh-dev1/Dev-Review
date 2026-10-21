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
	name: z.string().trim().min(2, "Name must be at least 2 characters"),
	email: z.string().trim().email("Enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
	const router = useRouter();
	const { register } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: FormValues) {
		setIsLoading(true);
		try {
			await register(values);
			toast.success("Account created", {
				description: "Check your email for a verification code.",
			});
			router.push(
				`/verify-email?email=${encodeURIComponent(values.email.trim().toLowerCase())}`,
			);
		} catch (error) {
			const message =
				error instanceof ApiError
					? error.message
					: "Unable to create account. Try again.";
			toast.error("Registration failed", { description: message });
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className="border-border">
			<CardHeader className="sr-only">
				<h2>Register form</h2>
			</CardHeader>
			<CardContent className="pt-5">
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Full name</FieldLabel>
							<Input
								id="name"
								autoComplete="name"
								placeholder="Alex Johnson"
								{...form.register("name")}
							/>
							<FieldError
								errors={
									form.formState.errors.name ? [form.formState.errors.name] : []
								}
							/>
						</Field>

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
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input
								id="password"
								type="password"
								autoComplete="new-password"
								placeholder="Minimum 8 characters"
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
							{isLoading ? "Creating account…" : "Create account"}
						</Button>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter className="border-t border-border pt-3 text-center text-xs text-muted-foreground">
				You’ll receive a one-time code to verify your email address.
			</CardFooter>
		</Card>
	);
}
