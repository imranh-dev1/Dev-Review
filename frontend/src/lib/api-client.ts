import type { PaginationMeta } from "@/types";

export const API_BASE_URL = (
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1"
).replace(/\/$/, "");

const TOKEN_STORAGE_KEY = "devreview.access_token";

export class ApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

let memoryToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function getAccessToken(): string | null {
	if (memoryToken) return memoryToken;
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAccessToken(token: string | null) {
	memoryToken = token;
	if (typeof window === "undefined") return;
	if (token) window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
	else window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export interface ApiResult<T> {
	data: T;
	meta?: PaginationMeta;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
	body?: unknown;
	query?: Record<string, string | number | boolean | undefined | null>;
	auth?: boolean;
	skipRefresh?: boolean;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
	const url = new URL(
		`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
	);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === undefined || value === null || value === "") continue;
			url.searchParams.set(key, String(value));
		}
	}
	return url.toString();
}

async function readAccessTokenFromServer(): Promise<string | null> {
	if (typeof window === "undefined") return null;
	try {
		const response = await fetch(buildUrl("/auth/refresh"), {
			method: "POST",
			credentials: "include",
		});
		if (!response.ok) return null;
		const payload = await response.json();
		const token = payload?.data?.accessToken ?? null;
		if (token) setAccessToken(token);
		return token;
	} catch {
		return null;
	}
}

async function refreshAccessToken(): Promise<string | null> {
	if (refreshPromise) return refreshPromise;
	refreshPromise = readAccessTokenFromServer().finally(() => {
		refreshPromise = null;
	});
	return refreshPromise;
}

async function parseBody(response: Response) {
	const text = await response.text();
	if (!text) return null;
	try {
		return JSON.parse(text);
	} catch {
		return { message: text };
	}
}

export async function apiRequest<T>(
	path: string,
	options: RequestOptions = {},
): Promise<ApiResult<T>> {
	const { body, query, auth = true, skipRefresh, headers, ...rest } = options;

	const send = async (token: string | null): Promise<Response> => {
		const requestHeaders = new Headers(headers);
		if (body !== undefined && !requestHeaders.has("Content-Type")) {
			requestHeaders.set("Content-Type", "application/json");
		}
		if (token && auth) requestHeaders.set("Authorization", `Bearer ${token}`);

		return fetch(buildUrl(path, query), {
			...rest,
			headers: requestHeaders,
			credentials: "include",
			body: body === undefined ? undefined : JSON.stringify(body),
		});
	};

	let token = auth ? getAccessToken() : null;
	let response = await send(token);

	if (response.status === 401 && auth && !skipRefresh) {
		const refreshed = await refreshAccessToken();
		if (refreshed) {
			token = refreshed;
			response = await send(token);
		}
	}

	const payload = await parseBody(response);

	if (!response.ok || payload?.success === false) {
		const message =
			payload?.message ?? `Request failed with status ${response.status}`;
		throw new ApiError(message, response.status);
	}

	return {
		data: (payload?.data ?? null) as T,
		meta: payload?.meta as PaginationMeta | undefined,
	};
}

export const api = {
	get: <T>(path: string, query?: RequestOptions["query"]) =>
		apiRequest<T>(path, { method: "GET", query }),
	post: <T>(path: string, body?: unknown) =>
		apiRequest<T>(path, { method: "POST", body }),
	patch: <T>(path: string, body?: unknown) =>
		apiRequest<T>(path, { method: "PATCH", body }),
	delete: <T>(path: string) => apiRequest<T>(path, { method: "DELETE" }),
};
