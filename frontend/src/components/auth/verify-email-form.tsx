"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
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
	otp: z.string().regex(/^\d{6}$/, "Enter a 6-digit code"),
});

type FormValues = z.infer<typeof schema>;

export function VerifyEmailForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { verifyEmail } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: searchParams.get("email") ?? "",
			otp: "",
		},
	});

	async function onSubmit(values: FormValues) {
		setIsLoading(true);
		try {
			const user = await verifyEmail({
				email: values.email.trim().toLowerCase(),
				otp: values.otp.trim(),
			});
			toast.success("Email verified", {
				description: `You're in, ${user.name}.`,
			});
			router.replace("/dashboard");
		} catch (error) {
			const message =
				error instanceof ApiError
					? error.message
					: "Verification failed. Check the code and try again.";
			toast.error("Verification failed", { description: message });
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className="border-border">
			<CardHeader className="sr-only">
				<h2>Verify email form</h2>
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
								readOnly={Boolean(searchParams.get("email"))}
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
							<FieldLabel htmlFor="otp">Verification code</FieldLabel>
							<Input
								id="otp"
								inputMode="numeric"
								pattern="[0-9]*"
								maxLength={6}
								placeholder="123456"
								className="tracking-[0.5em]"
								{...form.register("otp")}
							/>
							<FieldError
								errors={
									form.formState.errors.otp ? [form.formState.errors.otp] : []
								}
							/>
						</Field>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Verifying…" : "Verify and continue"}
						</Button>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter className="border-t border-border pt-3 text-center text-xs text-muted-foreground">
				The code expires shortly. If you didn’t receive it, request a new one
				from the login flow.
			</CardFooter>
		</Card>
	);
}
