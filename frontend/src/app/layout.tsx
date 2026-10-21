import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "DevReview | Project Review Platform",
		template: "%s | DevReview",
	},
	description:
		"DevReview helps developers submit projects, receive valuable feedback, review others' work, and grow their development skills through collaborative learning.",
	applicationName: "DevReview",
	keywords: [
		"DevReview",
		"project review platform",
		"developer community",
		"project submission",
		"code review",
		"developer feedback",
		"web development",
		"collaborative learning",
	],
	openGraph: {
		title: "DevReview | Project Review Platform",
		description:
			"Submit projects, share feedback, and grow as a developer with the DevReview community.",
		siteName: "DevReview",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "DevReview | Project Review Platform",
		description: "Build projects. Share ideas. Grow together.",
	},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={cn(
				"h-full",
				"antialiased",
				geistSans.variable,
				geistMono.variable,
				"font-sans",
				inter.variable,
			)}
		>
			<body className="min-h-full flex flex-col">{children}</body>
		</html>
	);
}
