import {
	ArrowUpRight,
	Check,
	ClipboardCheck,
	Code2,
	FileText,
	GitBranch,
	LayoutDashboard,
	ListChecks,
	MessageSquareText,
	ShieldCheck,
	Sparkles,
	Users,
} from "lucide-react";
import Link from "next/link";
import { HomeActions } from "@/components/site/home-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const workflow = [
	{
		icon: FileText,
		title: "Submit",
		description:
			"Capture the title, summary, repository, live demo, stack, and screenshots in one pass.",
	},
	{
		icon: ListChecks,
		title: "Triage",
		description:
			"Reviewers pick up work from a prioritized queue with owners and deadlines attached.",
	},
	{
		icon: MessageSquareText,
		title: "Evaluate",
		description:
			"Score every project against six shared criteria with written, actionable feedback.",
	},
	{
		icon: ShieldCheck,
		title: "Decide",
		description:
			"Approve, reject, or request changes with a complete, auditable status history.",
	},
];

const features = [
	{
		icon: GitBranch,
		title: "Traceable workflow",
		description:
			"Every transition is recorded, from draft through approval, so nothing depends on memory.",
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
			"Students track their work, reviewers evaluate, and admins oversee the platform.",
	},
	{
		icon: LayoutDashboard,
		title: "Actionable dashboards",
		description:
			"Live queues, submission counts, approval rate, and review velocity at a glance.",
	},
];

const metrics = [
	{
		value: "7",
		label: "Lifecycle states",
		detail: "Draft through final decision",
	},
	{
		value: "6",
		label: "Review criteria",
		detail: "Scored 1–10 with feedback",
	},
	{
		value: "3",
		label: "Roles enforced",
		detail: "Student, reviewer, admin",
	},
	{
		value: "100%",
		label: "Decisions tracked",
		detail: "Full audit history",
	},
];

const roles = [
	{
		icon: FileText,
		name: "Students",
		description:
			"Know exactly what to fix and when your project is ready to ship.",
		points: [
			"Submit drafts with repository and screenshots",
			"Track status in real time",
			"Act on structured reviewer feedback",
		],
	},
	{
		icon: ClipboardCheck,
		name: "Reviewers",
		description:
			"Move through a focused queue without losing context or consistency.",
		points: [
			"Work a prioritized assignment queue",
			"Score against a shared rubric",
			"Keep decisions defensible and documented",
		],
	},
	{
		icon: ShieldCheck,
		name: "Admins",
		description: "Keep the review process fair, measurable, and easy to audit.",
		points: [
			"Assign reviewers and balance load",
			"Manage users, roles, and criteria",
			"Audit every transition and outcome",
		],
	},
];

const queue = [
	{
		title: "Design system audit",
		stack: "Next.js · Tailwind",
		status: "In review",
		variant: "default" as const,
		score: 8.4,
	},
	{
		title: "Realtime chat app",
		stack: "React · Socket.io",
		status: "Changes requested",
		variant: "destructive" as const,
		score: 6.1,
	},
	{
		title: "Analytics dashboard",
		stack: "Next.js · Drizzle",
		status: "Approved",
		variant: "secondary" as const,
		score: 9.2,
	},
];

export default function HomePage() {
	return (
		<div className="relative overflow-hidden">
			<section className="relative border-b border-border">
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-70"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute -top-48 left-1/2 h-[460px] w-[760px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_68%)]"
				/>

				<div className="relative mx-auto grid max-w-7xl gap-12 px-4 pt-28 pb-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:pt-36 lg:pb-24">
					<div className="flex flex-col gap-7">
						<div className="inline-flex w-fit items-center gap-2 border border-border bg-card/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
							<span className="relative flex size-1.5">
								<span className="absolute inline-flex size-full animate-ping bg-primary/60" />
								<span className="relative inline-flex size-1.5 bg-primary" />
							</span>
							Structured review workflow for project teams
						</div>

						<h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
							Ship better projects with{" "}
							<span className="text-primary">structured, actionable</span>{" "}
							review
						</h1>

						<p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
							DevReview brings submissions, rubric-based feedback, and approval
							decisions into one traceable platform. Students know exactly what
							to fix. Reviewers evaluate consistently. Admins see progress
							across the board.
						</p>

						<div className="flex flex-wrap items-center gap-2">
							<HomeActions />
						</div>

						<div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-5">
							{["Draft", "Submitted", "In review", "Approved"].map(
								(stage, index) => (
									<div key={stage} className="flex items-center gap-2">
										{index > 0 && (
											<span className="text-muted-foreground/60">/</span>
										)}
										<span className="text-xs text-muted-foreground">
											{stage}
										</span>
									</div>
								),
							)}
						</div>
					</div>

					<div className="relative">
						<div
							aria-hidden
							className="pointer-events-none absolute -inset-6 -z-10 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_70%)]"
						/>
						<div className="border border-border bg-card/80 shadow-2xl shadow-black/20 backdrop-blur">
							<div className="flex items-center justify-between border-b border-border px-4 py-3">
								<div className="flex items-center gap-2">
									<ClipboardCheck className="size-4 text-primary" />
									<span className="text-sm font-medium">Review queue</span>
								</div>
								<Badge variant="outline" className="tnum">
									12 pending
								</Badge>
							</div>

							<div className="divide-y divide-border">
								{queue.map((item) => (
									<div key={item.title} className="flex flex-col gap-2 p-4">
										<div className="flex items-start justify-between gap-3">
											<div className="flex flex-col gap-1">
												<span className="text-sm font-medium">
													{item.title}
												</span>
												<span className="text-xs text-muted-foreground">
													{item.stack}
												</span>
											</div>
											<Badge variant={item.variant}>{item.status}</Badge>
										</div>
										<div className="flex items-center gap-3">
											<div className="h-1 flex-1 bg-muted">
												<div
													className="h-full bg-primary"
													style={{ width: `${item.score * 10}%` }}
												/>
											</div>
											<span className="tnum text-xs text-muted-foreground">
												{item.score.toFixed(1)} / 10
											</span>
										</div>
									</div>
								))}
							</div>

							<div className="grid grid-cols-3 divide-x divide-border border-t border-border">
								{[
									{ value: "12", label: "Pending" },
									{ value: "4.2h", label: "Avg. review" },
									{ value: "86%", label: "Approval" },
								].map((stat) => (
									<div key={stat.label} className="px-4 py-3">
										<div className="tnum text-lg font-semibold tracking-tight">
											{stat.value}
										</div>
										<div className="text-[11px] text-muted-foreground">
											{stat.label}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="border-b border-border bg-card/30">
				<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border lg:grid-cols-4">
						{metrics.map((metric) => (
							<div
								key={metric.label}
								className="flex flex-col gap-1 bg-card px-4 py-6 sm:px-6"
							>
								<span className="tnum text-3xl font-semibold tracking-tight">
									{metric.value}
								</span>
								<span className="text-sm font-medium">{metric.label}</span>
								<span className="text-xs text-muted-foreground">
									{metric.detail}
								</span>
							</div>
						))}
					</div>
				</div>
			</section>

			<section
				id="how-it-works"
				className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
			>
				<div className="flex flex-col gap-10">
					<div className="flex flex-col gap-3">
						<p className="eyebrow">Workflow</p>
						<h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
							From submission to decision in one loop
						</h2>
						<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
							Clear states, ownership, and feedback history keep expectations
							aligned on both sides of the review.
						</p>
					</div>

					<div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 xl:grid-cols-4">
						{workflow.map((step, index) => (
							<article
								key={step.title}
								className="group relative flex flex-col gap-4 bg-card p-6"
							>
								<div className="flex items-center justify-between">
									<div className="flex size-10 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
										<step.icon className="size-4.5" />
									</div>
									<span className="tnum text-xs text-muted-foreground">
										0{index + 1}
									</span>
								</div>
								<div className="flex flex-col gap-1.5">
									<h3 className="text-sm font-semibold">{step.title}</h3>
									<p className="text-sm leading-relaxed text-muted-foreground">
										{step.description}
									</p>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="border-y border-border bg-card/30">
				<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
					<div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
						<div className="flex flex-col gap-4 lg:sticky lg:top-28">
							<p className="eyebrow">Built for review discipline</p>
							<h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
								Everything needed to evaluate projects consistently
							</h2>
							<p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
								DevReview replaces ad-hoc messages with a shared rubric,
								protected transitions, and an audit-friendly history of every
								decision.
							</p>
							<div className="flex flex-wrap items-center gap-2">
								<Button asChild>
									<Link href="#get-started">
										Get started
										<ArrowUpRight />
									</Link>
								</Button>
								<Button asChild variant="ghost">
									<Link href="/#how-it-works">See the workflow</Link>
								</Button>
							</div>
						</div>

						<div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
							{features.map((feature) => (
								<article
									key={feature.title}
									className="flex flex-col gap-3 bg-card p-6"
								>
									<feature.icon className="size-4 text-primary" />
									<div className="flex flex-col gap-1.5">
										<h3 className="text-sm font-semibold">{feature.title}</h3>
										<p className="text-sm leading-relaxed text-muted-foreground">
											{feature.description}
										</p>
									</div>
								</article>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
				<div className="flex flex-col gap-10">
					<div className="flex flex-col gap-3">
						<p className="eyebrow">One platform, three perspectives</p>
						<h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
							Built around how each role actually works
						</h2>
					</div>

					<div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
						{roles.map((role) => (
							<article
								key={role.name}
								className="flex flex-col gap-4 bg-card p-6"
							>
								<div className="flex items-center gap-3">
									<div className="flex size-9 items-center justify-center border border-border bg-background text-primary">
										<role.icon className="size-4" />
									</div>
									<h3 className="text-sm font-semibold">{role.name}</h3>
								</div>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{role.description}
								</p>
								<ul className="flex flex-col gap-2">
									{role.points.map((point) => (
										<li
											key={point}
											className="flex items-start gap-2 text-sm text-muted-foreground"
										>
											<Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
											{point}
										</li>
									))}
								</ul>
							</article>
						))}
					</div>
				</div>
			</section>

			<section
				id="get-started"
				className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
			>
				<div className="relative overflow-hidden border border-border bg-card px-6 py-12 text-center sm:px-10 lg:py-16">
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 bg-grid opacity-40"
					/>
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent)]"
					/>
					<div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
						<div className="flex items-center gap-2">
							<Sparkles className="size-4 text-primary" />
							<p className="eyebrow">Ready to review with clarity</p>
						</div>
						<h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
							Turn feedback into measurable improvement
						</h2>
						<p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
							Get started in minutes. Submit your first project or join the
							review queue.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-2">
							<HomeActions variant="final" />
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
