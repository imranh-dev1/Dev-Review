"use client";

import { cn } from "cn";
import { ArrowUpRight, LogIn, Menu, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Logo from "../../../public/logo.png";

export type NavigationSection = {
	title: string;
	href: string;
};

const navigationData: NavigationSection[] = [
	{
		title: "Home",
		href: "/",
	},
	{
		title: "How it works",
		href: "/#how-it-works",
	},
	{
		title: "Submit project",
		href: "/signup",
	},
	{
		title: "Review queue",
		href: "/login",
	},
];

const CtaButton = ({ className }: { className?: string }) => (
	<Button
		asChild
		size="sm"
		className={cn(
			"group relative h-8 w-fit overflow-hidden ps-3 pe-10 transition-all duration-300 hover:pe-3",
			className,
		)}
	>
		<Link href="/signup">
			<span className="relative z-10 flex items-center gap-1.5">
				<Sparkles className="size-3.5" />
				Get started
			</span>
			<span className="absolute right-1 flex h-6 w-6 items-center justify-center transition-transform duration-300 group-hover:rotate-45">
				<ArrowUpRight className="size-3.5" />
			</span>
		</Link>
	</Button>
);

export function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header className="fixed top-0 left-0 z-50 w-full">
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				<nav
					className={cn(
						"mt-3 flex h-20 w-full items-center justify-between gap-3 border px-2 transition-all duration-300 sm:px-3",
						scrolled
							? "border-border bg-background/80 shadow-sm backdrop-blur-lg"
							: "border-transparent bg-transparent",
					)}
				>
					<Link
						href="/"
						aria-label="DevReview home"
						className="flex shrink-0 items-center gap-2"
					>
						<Image
							src={Logo}
							alt="DevReview"
							width={1000}
							height={18}
							className="h-18 w-auto object-contain"
							priority
						/>
					</Link>

					<div className="hidden lg:block">
						<NavigationMenu>
							<NavigationMenuList className="gap-1">
								{navigationData.map((navItem) => (
									<NavigationMenuItem key={navItem.title}>
										<NavigationMenuLink
											href={navItem.href}
											className="px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
										>
											{navItem.title}
										</NavigationMenuLink>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					<div className="flex items-center gap-1.5">
						<Link href="/login" className="hidden sm:flex">
							<Button variant="ghost" size="sm" className="gap-1.5">
								<LogIn className="size-3.5" />
								Sign in
							</Button>
						</Link>
						<CtaButton className="hidden lg:flex" />

						<div className="lg:hidden">
							<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon-sm">
										<Menu className="size-4" />
										<span className="sr-only">Open menu</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-52">
									{navigationData.map((item) => (
										<DropdownMenuItem key={item.title} asChild>
											<Link
												href={item.href}
												className="w-full text-sm"
												onClick={() => setIsOpen(false)}
											>
												{item.title}
											</Link>
										</DropdownMenuItem>
									))}
									<DropdownMenuItem asChild>
										<Link href="/login" onClick={() => setIsOpen(false)}>
											Sign in
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/signup" onClick={() => setIsOpen(false)}>
											Get started
										</Link>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</nav>
			</div>
		</header>
	);
}
