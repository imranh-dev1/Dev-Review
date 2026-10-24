"use client";

import { Eye, Loader2 } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useGetUserDetails } from "@/hooks";
import { Spinner } from "../ui/spinner";

interface UserDetailsDialogProps {
	userId: string;
}

export default function UserDetailsDialog({ userId }: UserDetailsDialogProps) {
	const [open, setOpen] = useState(false);

	const { data, isPending, isError } = useGetUserDetails(open ? userId : "");

	const user = data?.data;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<Eye className="mr-2 size-4 text-primary" />
					Details
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>User Details</DialogTitle>
				</DialogHeader>

				{isPending && (
					<div className="flex justify-center py-10">
						<Spinner className="text-primary" />
					</div>
				)}

				{isError && (
					<p className="py-6 text-center text-sm text-destructive">
						Failed to load user details.
					</p>
				)}

				{user && (
					<div className="space-y-5">
						<div className="flex items-center gap-3">
							<Avatar className="size-14">
								<AvatarImage src={user.avatar ?? undefined} />
								<AvatarFallback>
									{user.name.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>

							<div className="min-w-0">
								<h3 className="font-semibold">{user.name}</h3>
								<p className="break-all text-sm text-muted-foreground">
									{user.email}
								</p>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="rounded-lg border p-3">
								<p className="text-sm text-muted-foreground">Role</p>
								<p className="mt-1 font-medium">{user.role}</p>
							</div>

							<div className="rounded-lg border p-3">
								<p className="text-sm text-muted-foreground">Status</p>
								<p className="mt-1 font-medium">{user.status}</p>
							</div>

							<div className="rounded-lg border p-3">
								<p className="text-sm text-muted-foreground">Submissions</p>
								<p className="mt-1 text-xl font-semibold">
									{user.counts.submissions}
								</p>
							</div>

							<div className="rounded-lg border p-3">
								<p className="text-sm text-muted-foreground">Reviews</p>
								<p className="mt-1 text-xl font-semibold">
									{user.counts.reviews}
								</p>
							</div>
						</div>

						<div className="space-y-2 text-sm">
							<div className="flex justify-between gap-3">
								<span className="text-muted-foreground">Email verified</span>
								<span>{user.emailVerifiedAt ? "Yes" : "No"}</span>
							</div>

							<div className="flex justify-between gap-3">
								<span className="text-muted-foreground">Joined</span>
								<span>{new Date(user.createdAt).toLocaleDateString()}</span>
							</div>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
