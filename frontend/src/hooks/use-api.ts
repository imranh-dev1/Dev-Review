"use client";

import useSWR from "swr";

import { api } from "@/lib/api-client";

export type QueryParams = Record<
	string,
	string | number | boolean | undefined | null
>;

function serializeQuery(query?: QueryParams): string {
	if (!query) return "";
	const entries = Object.entries(query).filter(
		([, value]) => value !== undefined && value !== null && value !== "",
	);
	if (entries.length === 0) return "";
	const search = new URLSearchParams();
	for (const [key, value] of entries) search.set(key, String(value));
	return `?${search.toString()}`;
}

async function fetcher<T>(path: string): Promise<T> {
	const result = await api.get<T>(path);
	return result.data;
}

export interface UseApiOptions {
	query?: QueryParams;
	enabled?: boolean;
}

export function useApi<T>(path: string | null, options: UseApiOptions = {}) {
	const { query, enabled = true } = options;
	const key = path && enabled ? `${path}${serializeQuery(query)}` : null;

	const { data, error, isLoading, mutate } = useSWR<T>(key, fetcher<T>, {
		revalidateOnFocus: false,
		shouldRetryOnError: false,
		keepPreviousData: true,
	});

	return { data, error, isLoading, mutate };
}

export function useApiMeta<T>(
	path: string | null,
	options: UseApiOptions = {},
) {
	const { query, enabled = true } = options;
	const key = path && enabled ? `${path}${serializeQuery(query)}` : null;

	const fetcherWithMeta = async ([url, params]: [
		string,
		QueryParams | undefined,
	]) => {
		const result = await api.get<T>(url, params);
		return { data: result.data, meta: result.meta };
	};

	const { data, error, isLoading, mutate } = useSWR<{
		data: T;
		meta?: import("@/types").PaginationMeta;
	}>(key, () => fetcherWithMeta([key ?? "", query]), {
		revalidateOnFocus: false,
		shouldRetryOnError: false,
		keepPreviousData: true,
	});

	return {
		data: data?.data,
		meta: data?.meta,
		error,
		isLoading,
		mutate,
	};
}
