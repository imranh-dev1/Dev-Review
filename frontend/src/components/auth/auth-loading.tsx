import { Spinner } from "../ui/spinner";

export default function AuthLoading({
	value = "Verifying your account...",
}: {
	value?: string;
}) {
	return (
		<div className="w-full h-screen flex flex-col items-center justify-center gap-3 text-center">
			<Spinner className="size-10 text-primary" />
			<p className="text-sm font-medium text-muted-foreground">{value}</p>
		</div>
	);
}
