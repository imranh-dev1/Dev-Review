"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, LockKeyholeOpen, Mail } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/hooks";
import { useRouter } from "next/navigation";

const formSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "Email address is required.")
		.email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
	const { mutate: forgotPassword, isPending } = useForgotPassword();
	const router = useRouter();

	const form = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	const handleSubmit = (values: ForgotPasswordFormValues) => {
		forgotPassword(
			{ email: values.email },
			{
				onSuccess: () => {
					toast.success("Password reset request submitted.", {
						description:
							"If an account exists with this email, you will receive password reset instructions.",
					});

					router.push(
						`/forgot-password-otp-verify?email=${encodeURIComponent(
							values.email.trim().toLowerCase(),
						)}`,
					);
				},
				onError: (error) => {
					toast.error("Unable to request password reset.", {
						description:
							error instanceof Error
								? error.message
								: "Something went wrong. Please try again.",
					});
				},
			},
		);
	};

	return (
		<Card className="mx-auto w-full max-w-md">
			<CardHeader className="space-y-3">
				<div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
					<Mail className="size-6" />
				</div>

				<CardTitle className="text-2xl">Forgot password?</CardTitle>

				<CardDescription>
					No worries! Enter the email address associated with your account, and
					we&apos;ll send you instructions to reset your password.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<form
					id="forgot-password-form"
					onSubmit={form.handleSubmit(handleSubmit)}
					className="space-y-5"
				>
					<FieldGroup>
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="email">Email address</FieldLabel>

									<Input
										{...field}
										id="email"
										type="email"
										placeholder="you@example.com"
										autoComplete="email"
										aria-invalid={fieldState.invalid}
										disabled={isPending}
									/>

									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>

					<Button type="submit" className="w-full" disabled={isPending}>
						{isPending ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Sending ...
							</>
						) : (
							<>
								<LockKeyholeOpen className="mr-2 size-4" />
								Forgot password
							</>
						)}
					</Button>
				</form>
			</CardContent>

			<CardFooter>
				<Button
					asChild
					variant="outline"
					className="w-full"
					disabled={isPending}
				>
					<Link href="/login">
						<ArrowLeft className="mr-2 size-4" />
						Back to login
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
