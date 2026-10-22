"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRegister } from "@/hooks";
import { ApiError } from "@/lib/api-client";

const schema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters"),
	email: z.string().trim().email("Enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);

	const { mutate: userRegister, isPending } = useRegister();

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	function onSubmit(values: FormValues) {
		userRegister(
			{
				...values,
				name: values.name.trim(),
				email: values.email.trim().toLowerCase(),
			},
			{
				onSuccess: () => {
					toast.success("Account created", {
						description: "Check your email for a verification code.",
					});

					router.push(
						`/verify-email?email=${encodeURIComponent(
							values.email.trim().toLowerCase(),
						)}`,
					);
				},

				onError: (error) => {
					const message =
						error instanceof Error
							? error.message
							: "Unable to create account. Try again.";

					toast.error("Registration failed", {
						description: message,
					});
				},
			},
		);
	}

	return (
		<Card className="border-border">
			<CardHeader className="sr-only">
				<h2>Create your account</h2>
			</CardHeader>

			<CardContent className="pt-5">
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						{/* Full Name */}
						<Field>
							<FieldLabel htmlFor="name">Full name</FieldLabel>

							<Input
								id="name"
								autoComplete="name"
								placeholder="Alex Johnson"
								disabled={isPending}
								aria-invalid={!!form.formState.errors.name}
								{...form.register("name")}
							/>

							<FieldError
								errors={
									form.formState.errors.name ? [form.formState.errors.name] : []
								}
							/>
						</Field>

						{/* Email */}
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>

							<Input
								id="email"
								type="email"
								autoComplete="email"
								placeholder="name@domain.com"
								disabled={isPending}
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

						{/* Password with Show/Hide */}
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>

							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									autoComplete="new-password"
									placeholder="Minimum 8 characters"
									className="pr-11"
									disabled={isPending}
									aria-invalid={!!form.formState.errors.password}
									{...form.register("password")}
								/>

								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:bg-transparent"
									onClick={() => setShowPassword((previous) => !previous)}
									disabled={isPending}
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
						<Button
							type="submit"
							className="w-full"
							disabled={isPending || !form.formState.isDirty}
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Creating account...
								</>
							) : (
								"Create account"
							)}
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
