"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, Loader2, LockKeyhole } from "lucide-react";
import { useState } from "react";
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
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useChangePassword } from "@/hooks";

const formSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required."),
		newPassword: z
			.string()
			.min(8, "Password must be at least 8 characters.")
			.max(128, "Password must not exceed 128 characters."),
		confirmPassword: z.string().min(1, "Please confirm your new password."),
	})
	.refine((data) => data.newPassword !== data.currentPassword, {
		message: "New password must be different from your current password.",
		path: ["newPassword"],
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"],
	});

type ChangePasswordFormValues = z.infer<typeof formSchema>;

export function ChangePasswordForm() {
	const [visiblePasswords, setVisiblePasswords] = useState<
		Record<string, boolean>
	>({});

	const { mutate: changePassword, isPending } = useChangePassword();

	const form = useForm<ChangePasswordFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const isSubmitting = form.formState.isSubmitting;

	const togglePasswordVisibility = (name: string) => {
		setVisiblePasswords((previous) => ({
			...previous,
			[name]: !previous[name],
		}));
	};

	const handleSubmit = async (values: ChangePasswordFormValues) => {
		const payload = {
			currentPassword: values.currentPassword,
			newPassword: values.newPassword,
		};

		changePassword(payload, {
			onSuccess: () => {
				form.reset();

				toast.success("Password changed successfully.", {
					description: "Your account password has been updated securely.",
				});
			},
			onError: (error) => {
				toast.error("Failed to change password.", {
					description:
						error instanceof Error
							? error.message
							: "Something went wrong. Please try again.",
				});
			},
		});
	};

	const passwordFields = [
		{
			name: "currentPassword" as const,
			label: "Current password",
			placeholder: "Enter your current password",
			autoComplete: "current-password",
		},
		{
			name: "newPassword" as const,
			label: "New password",
			placeholder: "Enter your new password",
			autoComplete: "new-password",
		},
		{
			name: "confirmPassword" as const,
			label: "Confirm new password",
			placeholder: "Re-enter your new password",
			autoComplete: "new-password",
		},
	];

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader>
				<div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<LockKeyhole className="size-5" />
				</div>

				<CardTitle className="text-xl">Change Password</CardTitle>
				<CardDescription>
					Update your password to keep your account secure.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<form
					id="change-password-form"
					onSubmit={form.handleSubmit(handleSubmit)}
					className="space-y-5"
				>
					<FieldGroup>
						{passwordFields.map((item) => (
							<Controller
								key={item.name}
								name={item.name}
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={item.name}>{item.label}</FieldLabel>

										<div className="relative">
											<Input
												{...field}
												id={item.name}
												type={visiblePasswords[item.name] ? "text" : "password"}
												placeholder={item.placeholder}
												autoComplete={item.autoComplete}
												aria-invalid={fieldState.invalid}
												disabled={isSubmitting}
												className="pr-11"
											/>

											<Button
												type="button"
												variant="ghost"
												size="icon"
												disabled={isSubmitting}
												className="absolute top-1/2 right-1 size-8 -translate-y-1/2 text-muted-foreground"
												aria-label={
													visiblePasswords[item.name]
														? `Hide ${item.label.toLowerCase()}`
														: `Show ${item.label.toLowerCase()}`
												}
												onClick={() => togglePasswordVisibility(item.name)}
											>
												{visiblePasswords[item.name] ? (
													<EyeOff className="size-4" />
												) : (
													<Eye className="size-4" />
												)}
											</Button>
										</div>

										{item.name === "newPassword" && (
											<FieldDescription>
												Use at least 8 characters and choose a password you
												haven't used before.
											</FieldDescription>
										)}

										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						))}
					</FieldGroup>
				</form>
			</CardContent>

			<CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
				<Button
					type="button"
					variant="outline"
					disabled={isPending}
					onClick={() => form.reset()}
					className="w-full sm:w-auto"
				>
					Reset
				</Button>

				<Button
					type="submit"
					form="change-password-form"
					disabled={isPending}
					className="w-full sm:w-auto"
				>
					{isPending ? (
						<>
							<Loader2 className="mr-2 size-4 animate-spin" />
							Updating password...
						</>
					) : (
						<>
							<KeyRound className="mr-2 size-4" />
							Update password
						</>
					)}
				</Button>
			</CardFooter>
		</Card>
	);
}
