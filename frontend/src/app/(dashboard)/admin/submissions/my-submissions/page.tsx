import { SubmissionList } from "@/components/dashboard/submissions/submission-list";

export default function AdminSubmissionsPage() {
	return (
		<SubmissionList
			title="My Submissions"
			description="Manage your projects and track their review progress."
			createHref="/admin/submissions/new"
			detailBasePath="/admin/submissions"
		/>
	);
}
