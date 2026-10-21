import { Footer } from "@/components/layout-public/footer";
import { Navbar } from "@/components/layout-public/navbar";

export default function PublicSiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-svh flex-col">
			<Navbar />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
