"use client";

import {
	BadgeCheck,
	CalendarDays,
	CheckCircle2,
	Clock3,
	GraduationCap,
	Mail,
	ShieldCheck,
	UserRound,
} from "lucide-react";
import Link from "next/link";
import { ErrorState, ProfileSkeleton } from "@/components/shared/state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useGetMe } from "@/hooks";
import cover_image from "../../../../public/assets/profile-cover.jpg";

function formatDate(date: string) {
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(new Date(date));
}

function InfoItem({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ElementType;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-start gap-3 rounded-none border bg-background p-4">
			<div className="flex size-10 shrink-0 items-center justify-center rounded-none bg-muted">
				<Icon className="size-5 text-muted-foreground" />
			</div>

			<div className="min-w-0 space-y-1">
				<p className="text-sm text-muted-foreground">{label}</p>
				<p className="break-words text-sm font-medium">{value}</p>
			</div>
		</div>
	);
}

export default function Profile() {
	const { data, isPending, isError, refetch } = useGetMe();

	const user = data?.data;

	if (isPending) {
		return <ProfileSkeleton />;
	}

	if (isError || !user) {
		return (
			<ErrorState
				title="Unable to load your profile"
				message="We could not load your account details. Please try again."
				onRetry={() => refetch()}
			/>
		);
	}

	return (
		<div className="mx-auto w-full max-w-6xl space-y-6">
			{/* Page heading */}
			<div>
				<p className="text-sm font-medium text-primary">Account</p>
				<h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
					My Profile
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Manage your personal information and view your account details.
				</p>
			</div>

			{/* Profile header */}
			<Card className="overflow-hidden border-border/70 shadow-sm">
				<div
					className="h-40 bg-cover bg-center bg-no-repeat sm:h-36"
					style={{
						backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.05)), url(${cover_image.src})`,
					}}
				/>

				<CardContent className="-mt-12 relative pb-6 sm:-mt-14">
					<div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-end">
							<Avatar className="size-24 border-4 border-background shadow-md sm:size-28">
								<AvatarImage
									src={user?.avatar}
									alt={user?.name}
									className="object-cover"
								/>
								<AvatarFallback className="text-2xl font-semibold"></AvatarFallback>
							</Avatar>

							<div className="space-y-2 sm:pb-1">
								<div className="flex flex-wrap items-center gap-2">
									<h2 className="text-xl font-bold sm:text-2xl">
										{user?.name}
									</h2>
									{user?.emailVerifiedAt && (
										<BadgeCheck
											className="size-5 text-primary"
											aria-label="Verified email"
										/>
									)}
								</div>

								<p className="flex items-center gap-2 text-sm text-muted-foreground">
									<Mail className="size-4" />
									{user.email}
								</p>

								<div className="flex flex-wrap gap-2">
									<Badge variant="secondary" className="gap-1.5">
										<GraduationCap className="size-3.5" />
										{user.role}
									</Badge>

									<Badge className="gap-1.5 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">
										<CheckCircle2 className="size-3.5" />
										{user.status}
									</Badge>

									{user.emailVerifiedAt && (
										<Badge variant="outline" className="gap-1.5">
											<ShieldCheck className="size-3.5" />
											Email verified
										</Badge>
									)}
								</div>
							</div>
						</div>

						<Button asChild className="w-full sm:w-auto">
							<Link href={`/${user.role.toLowerCase()}/update-my-profile`}>
								<UserRound className="mr-2 size-4" />
								Edit Profile
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Main content */}
			<div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
				<Card className="border-border/70 shadow-sm">
					<CardHeader>
						<CardTitle>Personal Information</CardTitle>
						<CardDescription>Your basic profile information.</CardDescription>
					</CardHeader>

					<CardContent className="grid gap-4 sm:grid-cols-2">
						<InfoItem icon={UserRound} label="Full name" value={user?.name} />

						<InfoItem icon={Mail} label="Email address" value={user?.email} />

						<InfoItem
							icon={GraduationCap}
							label="Account role"
							value={user?.role}
						/>

						<InfoItem
							icon={ShieldCheck}
							label="Account status"
							value={user?.status}
						/>
					</CardContent>
				</Card>

				<Card className="border-border/70 shadow-sm">
					<CardHeader>
						<CardTitle>Account Details</CardTitle>
						<CardDescription>
							Important dates and account information.
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-5">
						<div className="flex gap-3">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
								<CalendarDays className="size-5 text-muted-foreground" />
							</div>

							<div className="space-y-1">
								<p className="text-sm text-muted-foreground">Joined on</p>
								<p className="text-sm font-medium">
									{formatDate(user.createdAt)}
								</p>
							</div>
						</div>

						<div className="flex gap-3">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
								<BadgeCheck className="size-5 text-muted-foreground" />
							</div>

							<div className="space-y-1">
								<p className="text-sm text-muted-foreground">
									Email verified on
								</p>
								<p className="text-sm font-medium">
									{user.emailVerifiedAt
										? formatDate(user.emailVerifiedAt)
										: "Not verified"}
								</p>
							</div>
						</div>

						<div className="flex gap-3">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
								<Clock3 className="size-5 text-muted-foreground" />
							</div>

							<div className="space-y-1">
								<p className="text-sm text-muted-foreground">
									Last profile update
								</p>
								<p className="text-sm font-medium">
									{formatDate(user.updatedAt)}
								</p>
							</div>
						</div>

						<div className="border-t pt-4">
							<p className="text-xs text-muted-foreground">User ID</p>
							<p className="mt-1 break-all font-mono text-xs text-muted-foreground">
								{user?.id}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
