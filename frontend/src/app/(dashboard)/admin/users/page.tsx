import UsersTable from "@/components/table/users-table ";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Users",
	description:
		"Manage platform users, review their details, and update their statuses.",
};

export default function UsersPage() {
	return (
		<div className="space-y-6">
			<UsersTable />
		</div>
	);
}
