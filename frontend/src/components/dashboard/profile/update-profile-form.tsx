"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
	Camera,
	Check,
	ImagePlus,
	Loader2,
	Mail,
	RotateCcw,
	UserRound,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetMe, useProfileUpdate } from "@/hooks";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const profileSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters.")
		.max(100, "Name must not exceed 100 characters."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function UpdateProfileForm() {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

	const queryClient = useQueryClient();

	const { data } = useGetMe();
	const { mutate: updateProfile, isPending } = useProfileUpdate();

	const user = data?.data;
	const currentName = user?.name ?? "";
	const currentAvatar = user?.avatar ?? null;
	const currentEmail = user?.email ?? "";

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: "",
		},
	});

	useEffect(() => {
		if (!user) return;

		reset({
			name: user.name ?? "",
		});
	}, [user, reset]);

	useEffect(() => {
		if (!imageFile) {
			setPreview(currentAvatar);
			return;
		}

		const objectUrl = URL.createObjectURL(imageFile);
		setPreview(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [imageFile, currentAvatar]);

	const watchedName = watch("name") ?? "";
	const nameChanged = watchedName.trim() !== currentName.trim();
	const hasChanges = nameChanged || imageFile !== null;

	const handleImageChange = (file?: File) => {
		if (!file) return;

		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			toast.error("Please select a JPG, PNG, or WebP image.");
			return;
		}

		if (file.size > MAX_IMAGE_SIZE) {
			toast.error("Image size must not exceed 5 MB.");
			return;
		}

		setImageFile(file);
	};

	const removeSelectedImage = () => {
		setImageFile(null);

		const input = document.getElementById(
			"profile-image",
		) as HTMLInputElement | null;

		if (input) input.value = "";
	};

	const handleCancel = () => {
		reset({ name: currentName });
		setImageFile(null);

		const input = document.getElementById(
			"profile-image",
		) as HTMLInputElement | null;

		if (input) input.value = "";
	};

	const onSubmit = (values: ProfileFormValues) => {
		const name = values.name.trim();
		const hasNameChanged = name !== currentName.trim();

		if (!hasNameChanged && !imageFile) {
			toast.info("No changes to save.");
			return;
		}

		const formData = new FormData();

		if (hasNameChanged) {
			formData.append("name", name);
		}

		if (imageFile) {
			formData.append("profile-image", imageFile);
		}

		updateProfile(formData, {
			onSuccess: async () => {
				setImageFile(null);
				await queryClient.invalidateQueries({
					queryKey: ["user"],
				});
				toast.success("Your profile has been updated.");
			},
			onError: (error) => {
				toast.error(
					error instanceof Error
						? error.message
						: "Unable to update your profile. Please try again.",
				);
			},
		});
	};

	return (
		<div className="mx-auto w-full max-w-4xl space-y-7 pb-8">
			{/* Page heading */}
			<div className="space-y-2">
				<div className="flex size-11 items-center justify-center rounded-xl border bg-card shadow-sm">
					<UserRound className="size-5 text-primary" />
				</div>

				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
						Profile settings
					</h1>
					<p className="max-w-2xl text-sm leading-6 text-muted-foreground">
						Manage your personal information and customize how you appear to
						other members on DevReview.
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Profile picture */}
				<Card className="overflow-hidden shadow-sm">
					<CardHeader className="border-b bg-muted/20 px-5 py-4 sm:px-6">
						<CardTitle className="text-base">Profile picture</CardTitle>
						<CardDescription>
							Choose a photo that helps others recognize you.
						</CardDescription>
					</CardHeader>

					<CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
						<div className="flex min-w-0 items-center gap-4">
							<div className="relative shrink-0">
								<Avatar className="size-20 border shadow-sm sm:size-24">
									<AvatarImage
										src={preview ?? undefined}
										alt={currentName || "Profile picture"}
										className="object-cover"
									/>
									<AvatarFallback className="bg-muted">
										<UserRound className="size-9 text-muted-foreground" />
									</AvatarFallback>
								</Avatar>

								<div className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground">
									<Camera className="size-3.5" />
								</div>
							</div>

							<div className="min-w-0 space-y-1">
								<p className="truncate font-medium">
									{currentName || "Your profile"}
								</p>
								<p className="break-all text-sm text-muted-foreground">
									{currentEmail}
								</p>
								<p className="text-xs text-muted-foreground">
									JPG, PNG or WebP · Maximum 5 MB
								</p>
							</div>
						</div>

						<div className="flex shrink-0 items-center gap-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="gap-2"
								disabled={isPending}
								onClick={() =>
									document.getElementById("profile-image")?.click()
								}
							>
								<ImagePlus className="size-4" />
								{imageFile ? "Change photo" : "Upload photo"}
							</Button>

							{imageFile && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="size-9 text-muted-foreground hover:text-destructive"
									aria-label="Remove selected image"
									disabled={isPending}
									onClick={removeSelectedImage}
								>
									<X className="size-4" />
								</Button>
							)}

							<Input
								id="profile-image"
								type="file"
								accept="image/jpeg,image/png,image/webp"
								className="hidden"
								disabled={isPending}
								onChange={(event) => {
									handleImageChange(event.target.files?.[0]);
									event.target.value = "";
								}}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Personal information */}
				<Card className="shadow-sm">
					<CardHeader className="border-b bg-muted/20 px-5 py-4 sm:px-6">
						<CardTitle className="text-base">Personal information</CardTitle>
						<CardDescription>
							Update your name and review your account email.
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6 p-5 sm:p-6">
						<div className="grid gap-6 sm:grid-cols-2">
							{/* Name */}
							<div className="space-y-2">
								<label htmlFor="name" className="text-sm font-medium">
									Full name <span className="text-destructive">*</span>
								</label>

								<Input
									id="name"
									placeholder="Enter your full name"
									autoComplete="name"
									aria-invalid={!!errors.name}
									aria-describedby={errors.name ? "name-error" : "name-hint"}
									className="h-11"
									disabled={isPending}
									{...register("name")}
								/>

								{errors.name ? (
									<p id="name-error" className="text-sm text-destructive">
										{errors.name.message}
									</p>
								) : (
									<p
										id="name-hint"
										className="text-xs leading-5 text-muted-foreground"
									>
										This name will be visible on your profile.
									</p>
								)}
							</div>

							{/* Email */}
							<div className="space-y-2">
								<label htmlFor="email" className="text-sm font-medium">
									Email address
								</label>

								<div className="relative">
									<Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										id="email"
										type="email"
										value={currentEmail}
										readOnly
										className="h-11 bg-muted/40 pl-9 text-muted-foreground"
										aria-describedby="email-hint"
									/>
								</div>

								<p
									id="email-hint"
									className="text-xs leading-5 text-muted-foreground"
								>
									Your account email cannot be changed here.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-4">
							<div className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
								<Check className="size-4 text-primary" />
							</div>

							<div className="space-y-1">
								<p className="text-sm font-medium">
									Keep your profile up to date
								</p>
								<p className="text-sm leading-5 text-muted-foreground">
									Use your preferred name and a clear profile picture so
									students, reviewers, and admins can recognize you.
								</p>
							</div>
						</div>
					</CardContent>

					{/* Form actions */}
					<div className="flex flex-col-reverse gap-3 border-t bg-muted/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
						<p className="text-xs text-muted-foreground">
							{hasChanges
								? "You have unsaved changes."
								: "Your profile is up to date."}
						</p>

						<div className="flex flex-col-reverse gap-2 sm:flex-row">
							<Button
								type="button"
								variant="outline"
								disabled={isPending || !hasChanges}
								onClick={handleCancel}
							>
								<RotateCcw className="mr-2 size-4" />
								Discard changes
							</Button>

							<Button
								type="submit"
								disabled={isPending || !hasChanges}
								className="min-w-36"
							>
								{isPending ? (
									<>
										<Loader2 className="mr-2 size-4 animate-spin" />
										Saving changes...
									</>
								) : (
									"Save changes"
								)}
							</Button>
						</div>
					</div>
				</Card>
			</form>
		</div>
	);
}
