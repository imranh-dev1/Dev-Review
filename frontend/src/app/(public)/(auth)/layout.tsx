import {
	CheckCircle2,
	ClipboardCheck,
	FileCode2,
	ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Logo from "../../../../public/logo.png";

const highlights = [
	{
		icon: ClipboardCheck,
		title: "Rubric-based reviews",
		description:
			"Consistent scoring across code quality, functionality, UI/UX, and more.",
	},
	{
		icon: FileCode2,
		title: "Traceable submissions",
		description:
			"Every status change is recorded from draft through to the final decision.",
	},
	{
		icon: ShieldCheck,
		title: "Role-aware workspaces",
		description:
			"Students, reviewers, and admins each get the tools built for their job.",
	},
];

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
			<aside className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-card p-10 xl:p-14 lg:flex">
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-50"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute -top-40 -left-32 size-[28rem] rounded-full bg-primary/10 blur-3xl"
				/>

				<div className="relative flex flex-col gap-10">
					<Link
						href="/"
						aria-label="DevReview home"
						className="inline-flex w-fit items-center"
					>
						<Image
							src={Logo}
							alt="DevReview"
							width={140}
							height={72}
							className="h-14 w-auto object-contain"
							priority
						/>
					</Link>

					<div className="flex max-w-md flex-col gap-4">
						<p className="eyebrow">Structured project review</p>
						<h2 className="text-balance text-3xl font-semibold tracking-tight xl:text-4xl">
							Review work with structure, not guesswork.
						</h2>
						<p className="text-sm leading-relaxed text-muted-foreground">
							DevReview turns project feedback into a repeatable workflow with
							clear states, shared criteria, and an auditable history.
						</p>
					</div>

					<ul className="flex flex-col gap-4">
						{highlights.map(({ icon: Icon, title, description }) => (
							<li key={title} className="flex items-start gap-3">
								<div className="flex size-9 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
									<Icon className="size-4" />
								</div>
								<div className="min-w-0">
									<p className="text-sm font-medium">{title}</p>
									<p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
										{description}
									</p>
								</div>
							</li>
						))}
					</ul>
				</div>

				<div className="relative flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-6 text-xs text-muted-foreground">
					<span className="inline-flex items-center gap-1.5">
						<CheckCircle2 className="size-3.5 text-primary" />7 lifecycle states
					</span>
					<span className="inline-flex items-center gap-1.5">
						<CheckCircle2 className="size-3.5 text-primary" />6 review criteria
					</span>
					<span className="inline-flex items-center gap-1.5">
						<CheckCircle2 className="size-3.5 text-primary" />3 enforced roles
					</span>
				</div>
			</aside>

			<main className="relative flex flex-col bg-background">
				<div className="flex items-center justify-between px-5 py-5 sm:px-8 lg:hidden">
					<Link
						href="/"
						aria-label="DevReview home"
						className="inline-flex items-center"
					>
						<Image
							src={Logo}
							alt="DevReview"
							width={120}
							height={60}
							className="h-10 w-auto object-contain"
							priority
						/>
					</Link>
					<Link
						href="/"
						className="text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						Back to home
					</Link>
				</div>

				<div className="flex flex-1 flex-col">{children}</div>
			</main>
		</div>
	);
}
