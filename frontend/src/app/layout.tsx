import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";

import "./globals.css";
import Providers from "@/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
		default: "DevReview — Structured project review for developers",
		template: "%s | DevReview",
	},
	description:
		"Submit your projects, get structured review from mentors, and track every decision from draft to approval.",
	applicationName: "DevReview",
	keywords: [
		"DevReview",
		"project review platform",
		"developer community",
		"project submission",
		"code review",
		"developer feedback",
		"mentorship platform",
	],
	openGraph: {
		title: "DevReview — Structured project review for developers",
		description:
			"Submit projects, share feedback, and grow as a developer with a traceable review workflow.",
		siteName: "DevReview",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "DevReview — Structured project review for developers",
		description: "Build projects. Share ideas. Grow together.",
	},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}
		>
			<body className="min-h-full bg-background font-sans antialiased">
				<Providers>
					<ThemeProvider>
						{children}
						<Toaster position="bottom-right" richColors closeButton />
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	);
}
