"use client";

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

interface DataPaginationProps {
	page: number;
	totalPages: number;
	total: number;
	limit: number;
	isPending?: boolean;
	onPageChange: (page: number) => void;
}

export default function DataPagination({
	page,
	totalPages,
	total,
	limit,
	isPending = false,
	onPageChange,
}: DataPaginationProps) {
	if (totalPages <= 0) return null;

	const start = total === 0 ? 0 : (page - 1) * limit + 1;
	const end = Math.min(page * limit, total);

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<p className="text-sm text-muted-foreground">
				Showing {start}–{end} of {total} users
			</p>

			<Pagination className="mx-0 w-auto justify-end">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href="#"
							aria-disabled={page <= 1 || isPending}
							className={
								page <= 1 || isPending ? "pointer-events-none opacity-50" : ""
							}
							onClick={(event) => {
								event.preventDefault();

								if (page > 1 && !isPending) {
									onPageChange(page - 1);
								}
							}}
						/>
					</PaginationItem>

					<PaginationItem>
						<PaginationLink
							href="#"
							isActive
							onClick={(event) => event.preventDefault()}
						>
							{page}
						</PaginationLink>
					</PaginationItem>

					<PaginationItem>
						<PaginationNext
							href="#"
							aria-disabled={page >= totalPages || isPending}
							className={
								page >= totalPages || isPending
									? "pointer-events-none opacity-50"
									: ""
							}
							onClick={(event) => {
								event.preventDefault();

								if (page < totalPages && !isPending) {
									onPageChange(page + 1);
								}
							}}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
