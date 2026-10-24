"use client";

import { Eye } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useGetAllUsers } from "@/hooks";
import type { IUser } from "@/types";
import type { IUserListQuery } from "@/types/user.types";
import { DeleteUserDialog } from "../dialog/delete-user-dialog";
import { UpdateUserRoleDialog } from "../dialog/update-user-role-dialog";
import UserDetailsDialog from "../dialog/user-details-dialog";
import UserStatusDialog from "../dialog/user-status-dialog";
import DataPagination from "../shared/pagination";
import { Button } from "../ui/button";

export default function UsersTable() {
	const [filters, setFilters] = useState<IUserListQuery>({
		page: 1,
		limit: 10,
	});

	const { data: response, isPending, isError } = useGetAllUsers(filters);

	const users = response?.data ?? [];
	const meta = response?.meta;

	const updateFilter = (key: keyof IUserListQuery, value: string) => {
		setFilters((prev) => ({
			...prev,
			[key]: value || undefined,
			page: 1,
		}));
	};

	const formatDate = (date: string) => new Date(date).toLocaleDateString();

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">Users</h1>
					<p className="text-sm text-muted-foreground">
						Manage platform users and their statuses.
					</p>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<Input
						placeholder="Search name or email..."
						value={filters.search ?? ""}
						onChange={(e) => updateFilter("search", e.target.value)}
						className="w-full sm:w-56"
					/>

					<Select
						value={filters.role ?? "ALL"}
						onValueChange={(value) =>
							updateFilter("role", value === "ALL" ? "" : value)
						}
					>
						<SelectTrigger className="w-full sm:w-36">
							<SelectValue placeholder="All roles" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ALL">All roles</SelectItem>
							<SelectItem value="ADMIN">Admin</SelectItem>
							<SelectItem value="REVIEWER">Reviewer</SelectItem>
							<SelectItem value="STUDENT">Student</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={filters.status ?? "ALL"}
						onValueChange={(value) =>
							updateFilter("status", value === "ALL" ? "" : value)
						}
					>
						<SelectTrigger className="w-full sm:w-40">
							<SelectValue placeholder="All statuses" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ALL">All statuses</SelectItem>
							<SelectItem value="ACTIVE">Active</SelectItem>
							<SelectItem value="SUSPENDED">Suspended</SelectItem>
							<SelectItem value="DEACTIVATED">Deactivated</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="overflow-hidden border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Joined</TableHead>
							<TableHead>View Details</TableHead>
							<TableHead>Change Status</TableHead>
							<TableHead>Change Role</TableHead>
							<TableHead>Delete User</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{isPending ? (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center">
									Loading users...
								</TableCell>
							</TableRow>
						) : isError ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="h-24 text-center text-destructive"
								>
									Failed to load users.
								</TableCell>
							</TableRow>
						) : users.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="h-24 text-center text-muted-foreground"
								>
									No users found.
								</TableCell>
							</TableRow>
						) : (
							users.map((user: IUser) => (
								<TableRow key={user.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar>
												<AvatarImage
													src={user.avatar ?? undefined}
													alt={user.name}
												/>
												<AvatarFallback>
													{user.name.slice(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>

											<div className="min-w-0">
												<p className="truncate font-medium">{user.name}</p>
												<p className="truncate text-sm text-muted-foreground">
													{user.email}
												</p>
											</div>
										</div>
									</TableCell>

									<TableCell>
										<Badge variant="outline">{user.role}</Badge>
									</TableCell>

									<TableCell>
										<Badge
											variant={
												user.status === "ACTIVE" ? "default" : "secondary"
											}
										>
											{user.status}
										</Badge>
									</TableCell>

									<TableCell>{formatDate(user.createdAt)}</TableCell>

									<TableCell>
										<UserDetailsDialog userId={user.id} />
									</TableCell>

									<TableCell>
										<UserStatusDialog
											userId={user.id}
											userName={user.name}
											status={user.status}
										/>
									</TableCell>

									<TableCell>
										<UpdateUserRoleDialog
											userId={user.id}
											userName={user.name}
											currentRole={user.role}
										/>
									</TableCell>

									<TableCell>
										<DeleteUserDialog userId={user.id} userName={user.name} />
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<DataPagination
				content="Users"
				page={meta?.page ?? 1}
				totalPages={meta?.totalPages ?? 0}
				total={meta?.total ?? 0}
				limit={meta?.limit ?? filters.limit ?? 10}
				isPending={isPending}
				onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
			/>
		</div>
	);
}
