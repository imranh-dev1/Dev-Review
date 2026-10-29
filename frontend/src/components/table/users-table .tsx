"use client";

import { Users } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useGetAllUsers } from "@/hooks";
import type { IUser, UserRole, UserStatus } from "@/types";
import type { IUserListQuery } from "@/types/user.types";
import { DeleteUserDialog } from "../dialog/delete-user-dialog";
import { UpdateUserRoleDialog } from "../dialog/update-user-role-dialog";
import UserDetailsDialog from "../dialog/user-details-dialog";
import UserStatusDialog from "../dialog/user-status-dialog";
import { DataToolbar, FilterSelect } from "../shared/data-toolbar";
import { PageHeader } from "../shared/page-header";
import DataPagination from "../shared/pagination";
import { EmptyState, TableSkeleton } from "../shared/state";

const roleOptions = [
	{ value: "ADMIN", label: "Admin" },
	{ value: "REVIEWER", label: "Reviewer" },
	{ value: "STUDENT", label: "Student" },
];

const statusOptions = [
	{ value: "ACTIVE", label: "Active" },
	{ value: "SUSPENDED", label: "Suspended" },
	{ value: "DEACTIVATED", label: "Deactivated" },
];

const statusVariant: Record<UserStatus, "default" | "secondary" | "outline"> = {
	ACTIVE: "default",
	SUSPENDED: "outline",
	DEACTIVATED: "secondary",
};

const formatDate = (date: string) => new Date(date).toLocaleDateString();

export default function UsersTable() {
	const [filters, setFilters] = useState<IUserListQuery>({
		page: 1,
		limit: 10,
	});

	const { data: response, isPending, isError } = useGetAllUsers(filters);

	const users = response?.data ?? [];
	const meta = response?.meta;

	const hasFilters = Boolean(filters.search || filters.role || filters.status);

	const setSearch = (value: string) =>
		setFilters((prev) => ({ ...prev, search: value || undefined, page: 1 }));

	const setRole = (value: string) =>
		setFilters((prev) => ({
			...prev,
			role: (value || undefined) as UserRole | undefined,
			page: 1,
		}));

	const setStatus = (value: string) =>
		setFilters((prev) => ({
			...prev,
			status: (value || undefined) as UserStatus | undefined,
			page: 1,
		}));

	const resetFilters = () =>
		setFilters((prev) => ({
			page: 1,
			limit: prev.limit,
		}));

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Management"
				title="Users"
				description="Manage platform users, review their details, and update access."
				actions={
					<Badge variant="secondary" className="h-7 px-3">
						{meta?.total ?? 0} users
					</Badge>
				}
			/>

			<DataToolbar
				searchValue={filters.search ?? ""}
				onSearchChange={setSearch}
				searchPlaceholder="Search name or email..."
				onReset={hasFilters ? resetFilters : undefined}
			>
				<FilterSelect
					label="Role"
					value={filters.role ?? ""}
					onChange={setRole}
					options={roleOptions}
					allLabel="All roles"
				/>
				<FilterSelect
					label="Status"
					value={filters.status ?? ""}
					onChange={setStatus}
					options={statusOptions}
					allLabel="All statuses"
				/>
			</DataToolbar>

			{isPending ? (
				<TableSkeleton rows={7} columns={6} />
			) : isError ? (
				<EmptyState
					title="Unable to load users"
					description="Something went wrong while fetching users. Please refresh the page and try again."
				/>
			) : users.length === 0 ? (
				<EmptyState
					icon={Users}
					title="No users found"
					description={
						hasFilters
							? "No users match your current filters. Try a different search."
							: "Users will appear here once accounts are created."
					}
				/>
			) : (
				<div className="overflow-hidden border border-border bg-card">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/40 hover:bg-muted/40">
									<TableHead>User</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Joined</TableHead>
									<TableHead className="text-right">Details</TableHead>
									<TableHead className="text-right">Status</TableHead>
									<TableHead className="text-right">Role</TableHead>
									<TableHead className="pr-4 text-right">Delete</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{users.map((user: IUser) => (
									<TableRow key={user.id} className="hover:bg-muted/30">
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
													<p className="truncate text-xs text-muted-foreground">
														{user.email}
													</p>
												</div>
											</div>
										</TableCell>

										<TableCell>
											<Badge variant="outline">{user.role}</Badge>
										</TableCell>

										<TableCell>
											<Badge variant={statusVariant[user.status]}>
												{user.status}
											</Badge>
										</TableCell>

										<TableCell className="whitespace-nowrap text-muted-foreground">
											{formatDate(user.createdAt)}
										</TableCell>

										<TableCell className="text-right">
											<UserDetailsDialog userId={user.id} />
										</TableCell>

										<TableCell className="text-right">
											<UserStatusDialog
												userId={user.id}
												userName={user.name}
												status={user.status}
											/>
										</TableCell>

										<TableCell className="text-right">
											<UpdateUserRoleDialog
												userId={user.id}
												userName={user.name}
												currentRole={user.role}
											/>
										</TableCell>

										<TableCell className="pr-4 text-right">
											<DeleteUserDialog userId={user.id} userName={user.name} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			)}

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
