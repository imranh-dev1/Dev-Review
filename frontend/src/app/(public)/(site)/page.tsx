import {
	ArrowRight,
	Code2,
	FileText,
	GitBranch,
	LayoutDashboard,
	MessageSquareText,
	ShieldCheck,
	Sparkles,
	Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const workflow = [
	{
		icon: FileText,
		title: "Submit",
		description:
			"Share title, summary, repo, live demo, stack, and screenshots.",
	},
	{
		icon: LayoutDashboard,
		title: "Triage",
		description: "Reviewers pick up submissions from a filterable queue.",
	},
	{
		icon: MessageSquareText,
		title: "Evaluate",
		description: "Score against structured criteria with actionable feedback.",
	},
	{
		icon: ShieldCheck,
		title: "Track to closure",
		description: "Every decision is recorded with a full status history.",
	},
];

const features = [
	{
		icon: GitBranch,
		title: "Traceable workflow",
		description:
			"Draft → Submitted → In Review → Changes Requested → Resubmitted → Approved/Rejected.",
	},
	{
		icon: Code2,
		title: "Structured evaluation",
		description:
			"Code quality, functionality, UI/UX, responsiveness, accessibility, and documentation.",
	},
	{
		icon: Users,
		title: "Role-based access",
		description:
			"Students track their own work. Reviewers evaluate. Admins oversee the platform.",
	},
	{
		icon: LayoutDashboard,
		title: "Actionable dashboards",
		description:
			"Live queues, submission counts, approval rate, and review velocity at a glance.",
	},
];

export default function HomePage() {
	return (
		<div className="relative overflow-hidden">
			<section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-28 pb-16 sm:px-6 lg:px-8 lg:pt-36 lg:pb-24">
				<div className="flex max-w-3xl flex-col gap-6">
					<h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
						Ship better projects with{" "}
						<span className="text-primary">structured, actionable</span> review
					</h1>

					<p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
						DevReview brings project submissions, reviewer feedback, and
						approval decisions into one traceable platform. Students know
						exactly what to fix. Reviewers evaluate consistently. Admins see
						progress across the board.
					</p>

					<div className="flex flex-wrap items-center gap-2">
						<Button asChild size="lg">
							<Link href="/signup">
								Start submitting
								<ArrowRight />
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/login">Sign in</Link>
						</Button>
						<Button asChild variant="ghost" size="lg">
							<Link href="#how-it-works">See how it works</Link>
						</Button>
					</div>
				</div>

				<div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
					{[
						{ label: "Lifecycle states", value: "7" },
						{ label: "Review criteria", value: "6" },
						{ label: "Roles enforced", value: "3" },
						{ label: "Decisions tracked", value: "100%" },
					].map((item) => (
						<div key={item.label} className="flex flex-col gap-2 bg-card p-4">
							<span className="tnum text-2xl font-semibold tracking-tight">
								{item.value}
							</span>
							<span className="text-xs text-muted-foreground">
								{item.label}
							</span>
						</div>
					))}
				</div>
			</section>

			<section
				id="how-it-works"
				className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24"
			>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<p className="eyebrow">Workflow</p>
						<h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
							From submission to decision in one loop
						</h2>
						<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
							Clear states, ownership, and feedback history keep expectations
							aligned on both sides.
						</p>
					</div>

					<div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 xl:grid-cols-4">
						{workflow.map((step, index) => (
							<article
								key={step.title}
								className="relative flex flex-col gap-3 bg-card p-5"
							>
								<div className="flex items-center justify-between">
									<div className="flex size-9 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
										<step.icon className="size-4" />
									</div>
									<span className="tnum text-xs text-muted-foreground">
										0{index + 1}
									</span>
								</div>
								<div className="flex flex-col gap-1">
									<h3 className="text-sm font-semibold">{step.title}</h3>
									<p className="text-xs leading-relaxed text-muted-foreground">
										{step.description}
									</p>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
				<div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-start">
					<div className="flex flex-col gap-4">
						<p className="eyebrow">Built for review discipline</p>
						<h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
							Everything needed to evaluate projects consistently
						</h2>
						<p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
							DevReview replaces ad-hoc messages with a shared rubric, protected
							transitions, and an audit-friendly history of every decision.
						</p>
						<div className="flex flex-wrap items-center gap-2">
							<Button asChild>
								<Link href="/signup">
									Create an account
									<ArrowRight />
								</Link>
							</Button>
							<Button asChild variant="ghost">
								<Link href="/login">Sign in</Link>
							</Button>
						</div>
					</div>

					<div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
						{features.map((feature) => (
							<article
								key={feature.title}
								className="flex flex-col gap-3 bg-card p-5"
							>
								<feature.icon className="size-4 text-primary" />
								<div className="flex flex-col gap-1">
									<h3 className="text-sm font-semibold">{feature.title}</h3>
									<p className="text-xs leading-relaxed text-muted-foreground">
										{feature.description}
									</p>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden border border-border bg-card px-6 py-10 text-center sm:px-10">
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_8%,transparent),transparent)]"
					/>
					<div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4">
						<div className="flex items-center gap-2">
							<Sparkles className="size-4 text-primary" />
							<p className="eyebrow">Ready to review with clarity</p>
						</div>
						<h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
							Turn feedback into measurable improvement
						</h2>
						<p className="text-sm leading-relaxed text-muted-foreground">
							Get started in minutes. Submit your first project or join the
							review queue.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-2">
							<Button asChild size="lg">
								<Link href="/signup">
									Get started
									<ArrowRight />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<Link href="/login">Sign in</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
