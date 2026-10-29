import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export interface StatusCount {
	status?: string;
	role?: string;
	count: number;
}

function formatLabel(value: string | undefined) {
	if (!value) {
		return "Unknown";
	}

	return value
		.toLowerCase()
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export default function StatusBreakdown({
	title,
	data,
	isLoading = false,
	emptyMessage = "No data available.",
}: {
	title?: string;
	data: StatusCount[];
	isLoading?: boolean;
	emptyMessage?: string;
}) {
	const total = data.reduce((sum, item) => sum + item.count, 0);

	return (
		<div className="space-y-3">
			{title ? <p className="text-sm font-semibold">{title}</p> : null}

			{isLoading ? (
				<div className="space-y-3">
					{["first", "second", "third", "fourth"].map((rowKey) => (
						<div key={rowKey} className="space-y-1.5">
							<div className="flex items-center justify-between">
								<Skeleton className="h-3 w-24" />
								<Skeleton className="h-3 w-6" />
							</div>
							<Skeleton className="h-1.5 w-full" />
						</div>
					))}
				</div>
			) : data.length === 0 || total === 0 ? (
				<p className="text-sm text-muted-foreground">{emptyMessage}</p>
			) : (
				<div className="space-y-2.5">
					{data.map((item) => {
						const label = item.status ?? item.role ?? "Unknown";

						return (
							<div key={label} className="space-y-1">
								<div className="flex items-center justify-between text-xs">
									<span className="text-muted-foreground">
										{formatLabel(label)}
									</span>

									<span className="font-medium">{item.count}</span>
								</div>

								<Progress
									value={(item.count / total) * 100}
									className="h-1.5"
								/>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
