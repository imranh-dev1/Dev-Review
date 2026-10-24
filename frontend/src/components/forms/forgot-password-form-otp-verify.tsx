"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForgotPasswordOtpVerify } from "@/hooks";

const schema = z.object({
	email: z.string().trim().email("Enter a valid email address"),
	otp: z.string().length(6, "Enter a 6-digit code"),
	newPassword: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(72, "Password must not exceed 72 characters"),
});

type FormValues = z.infer<typeof schema>;

const otpSlots = [
	{ key: "otp-slot-1", index: 0 },
	{ key: "otp-slot-2", index: 1 },
	{ key: "otp-slot-3", index: 2 },
	{ key: "otp-slot-4", index: 3 },
	{ key: "otp-slot-5", index: 4 },
	{ key: "otp-slot-6", index: 5 },
];

export function ForgetPasswordOTPForm() {
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const emailParam = searchParams.get("email") ?? "";

	const { mutate: resetPassword, isPending: isLoading } =
		useForgotPasswordOtpVerify();

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: emailParam,
			otp: "",
			newPassword: "",
		},
	});

	function onSubmit(values: FormValues) {
		const payload = {
			email: values.email.trim().toLowerCase(),
			otp: values.otp,
			newPassword: values.newPassword,
		};

		resetPassword(payload, {
			onSuccess: () => {
				toast.success("Password reset successfully", {
					description: "You can now sign in with your new password.",
				});

				router.replace("/login");
			},
			onError: (error) => {
				toast.error("Password reset failed", {
					description:
						error instanceof Error ? error.message : "Please try again.",
				});
			},
		});
	}

	return (
		<Card className="mx-auto w-full max-w-md border-border">
			<CardHeader>
				<h2 className="text-lg font-semibold">Reset your password</h2>
				<p className="text-sm text-muted-foreground">
					Enter the code sent to your email and choose a new password.
				</p>
			</CardHeader>

			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								type="email"
								autoComplete="email"
								readOnly={Boolean(emailParam)}
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

						<Field className="flex flex-col items-center gap-2">
							<FieldLabel htmlFor="otp" className="self-start">
								Password reset code
							</FieldLabel>

							<Controller
								control={form.control}
								name="otp"
								render={({ field }) => (
									<InputOTP
										id="otp"
										maxLength={6}
										value={field.value}
										onChange={field.onChange}
									>
										<InputOTPGroup>
											{otpSlots.map((slot) => (
												<InputOTPSlot key={slot.key} index={slot.index} />
											))}
										</InputOTPGroup>
									</InputOTP>
								)}
							/>

							<FieldError
								errors={
									form.formState.errors.otp ? [form.formState.errors.otp] : []
								}
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="newPassword">New password</FieldLabel>

							<div className="relative">
								<Input
									id="newPassword"
									type={showPassword ? "text" : "password"}
									autoComplete="new-password"
									placeholder="Enter your new password"
									className="pr-10"
									{...form.register("newPassword")}
								/>

								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute top-1/2 right-1 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									onClick={() => setShowPassword((prev) => !prev)}
									aria-label={showPassword ? "Hide password" : "Show password"}
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
									form.formState.errors.newPassword
										? [form.formState.errors.newPassword]
										: []
								}
							/>
						</Field>

						<Button type="submit" className="w-full" disabled={isLoading}>
							<RotateCcw />
							{isLoading ? "Resetting password…" : "Reset password"}
						</Button>
						<p className="justify-center border-t border-border pt-4 text-center text-xs text-muted-foreground">
							The verification code expires after 5 minutes.
						</p>
					</FieldGroup>
				</form>
			</CardContent>

			<CardFooter>
				<Button
					asChild
					variant="outline"
					className="w-full"
					disabled={isLoading}
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
