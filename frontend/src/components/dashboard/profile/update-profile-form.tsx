"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Check, ImagePlus, Loader2, UserRound, X } from "lucide-react";
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
	name: z.string().trim().min(2, "Name must be at least 2 characters."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function UpdateProfileForm() {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

	const { data, isLoading } = useGetMe();
	const { mutate: updateProfile, isPending } = useProfileUpdate();

	const user = data?.data;
	const currentName = user?.name ?? "";
	const currentAvatar = user?.avatar ?? null;

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

	const watchedName = watch("name") ?? "";

	const nameChanged = watchedName.trim() !== currentName.trim();

	const hasChanges = nameChanged || imageFile !== null;

	useEffect(() => {
		if (!imageFile) {
			setPreview(currentAvatar);
			return;
		}

		const objectUrl = URL.createObjectURL(imageFile);
		setPreview(objectUrl);

		return () => {
			URL.revokeObjectURL(objectUrl);
		};
	}, [imageFile, currentAvatar]);

	const handleImageChange = (file?: File) => {
		if (!file) return;

		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			toast.error("Please select a JPG, PNG, or WebP image.");
			return;
		}

		if (file.size > MAX_IMAGE_SIZE) {
			toast.error("Image size must be less than 5 MB.");
			return;
		}

		setImageFile(file);
	};

	const removeSelectedImage = () => {
		setImageFile(null);

		const input = document.getElementById(
			"profile-image",
		) as HTMLInputElement | null;

		if (input) {
			input.value = "";
		}
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

				toast.success("Your profile has been updated.");
			},
			onError: (error) => {
				const message =
					error instanceof Error
						? error.message
						: "Unable to update your profile. Please try again.";

				toast.error(message);
			},
		});
	};

	const initials = currentName
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part: string) => part[0])
		.join("")
		.toUpperCase();

	if (isLoading) {
		return (
			<div className="flex min-h-64 items-center justify-center">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-5xl space-y-6">
			<div className="space-y-1 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">
					Profile settings
				</h1>

				<p className="text-sm text-muted-foreground">
					Manage your personal information and how you appear on DevReview.
				</p>
			</div>

			<Card className="overflow-hidden border-border/70 shadow-sm">
				<CardHeader className="border-b bg-muted/20 px-6 py-5 sm:px-8">
					<CardTitle className="text-base font-semibold">
						Personal information
					</CardTitle>

					<CardDescription>
						Update your profile details and profile picture.
					</CardDescription>
				</CardHeader>

				<CardContent className="p-6 sm:p-8">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						<div className="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
							{/* Profile picture */}
							<div className="space-y-4">
								<p className="text-sm font-medium">Profile picture</p>

								<div className="flex items-center gap-4 md:flex-col md:items-start">
									<div className="relative">
										<Avatar className="size-24 border-2 border-background shadow-sm ring-1 ring-border sm:size-28">
											<AvatarImage
												src={preview ?? undefined}
												alt={currentName || "Profile picture"}
												className="object-cover"
											/>

											<AvatarFallback className="bg-muted">
												{initials || (
													<UserRound className="size-10 text-muted-foreground" />
												)}
											</AvatarFallback>
										</Avatar>

										<span className="absolute bottom-1 right-1 flex size-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground">
											<Camera className="size-3.5" />
										</span>
									</div>

									<div className="space-y-1 md:max-w-44">
										<p className="text-sm font-medium">
											{currentName || "Your profile"}
										</p>

										<p className="text-xs leading-relaxed text-muted-foreground">
											Your photo helps other members recognize you.
										</p>
									</div>
								</div>

								<div className="flex flex-wrap items-center gap-2">
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
										Upload photo
									</Button>

									{imageFile && (
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="size-8 text-muted-foreground hover:text-destructive"
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

								<p className="text-xs text-muted-foreground">
									JPG, PNG or WebP · Max 5 MB
								</p>
							</div>

							{/* Name input */}
							<div className="space-y-5">
								<div className="space-y-2">
									<label htmlFor="name" className="text-sm font-medium">
										Full name
									</label>

									<Input
										id="name"
										placeholder="Enter your full name"
										autoComplete="name"
										aria-invalid={!!errors.name}
										className="h-10"
										disabled={isPending}
										{...register("name")}
									/>

									{errors.name ? (
										<p className="text-sm text-destructive">
											{errors.name.message}
										</p>
									) : (
										<p className="text-xs text-muted-foreground">
											This is the name displayed on your DevReview profile.
										</p>
									)}
								</div>

								<div className="rounded-lg border bg-muted/20 p-4">
									<div className="flex items-start gap-3">
										<div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
											<Check className="size-4 text-muted-foreground" />
										</div>

										<div className="space-y-1">
											<p className="text-sm font-medium">
												Keep your profile up to date
											</p>

											<p className="text-sm leading-relaxed text-muted-foreground">
												Use your preferred name and a clear profile picture so
												students, reviewers, and admins can recognize you.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Save changes */}
						<div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
							<p className="text-xs text-muted-foreground">
								Only the information you change will be updated.
							</p>

							<Button
								type="submit"
								disabled={isPending || !hasChanges}
								className="min-w-32"
							>
								{isPending ? (
									<>
										<Loader2 className="mr-2 size-4 animate-spin" />
										Saving...
									</>
								) : (
									"Save changes"
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
