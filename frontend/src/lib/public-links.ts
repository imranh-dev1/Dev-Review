import type { UserRole } from "@/types";

export type PublicAction = {
	label: string;
	href: string;
};

export type PublicActions = {
	submit: PublicAction;
	queue: PublicAction;
	dashboard: string;
};

const guestActions: PublicActions = {
	submit: { label: "Submit project", href: "/signup" },
	queue: { label: "Review queue", href: "/login" },
	dashboard: "/login",
};

const roleActions: Record<UserRole, PublicActions> = {
	STUDENT: {
		submit: { label: "Submit project", href: "/student/submissions/new" },
		queue: {
			label: "My submissions",
			href: "/student/submissions/my-submissions",
		},
		dashboard: "/student",
	},
	REVIEWER: {
		submit: { label: "Review queue", href: "/reviewer/reviews/pending" },
		queue: { label: "Assigned projects", href: "/reviewer/assignments" },
		dashboard: "/reviewer",
	},
	ADMIN: {
		submit: { label: "Submit project", href: "/admin/submissions/new" },
		queue: { label: "Review queue", href: "/admin/reviews" },
		dashboard: "/admin",
	},
};

export function getPublicActions(role?: UserRole | null): PublicActions {
	return role ? roleActions[role] : guestActions;
}
