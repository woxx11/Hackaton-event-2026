import { getToken } from "./session";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface ApiFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  token?: string;
}

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

// Server-only fetch wrapper around the HISOBIM API. Always call this from
// Server Components / Server Actions — it reads the httpOnly session
// cookie, so it must never be invoked from client code.
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const token = options.token ?? (await getToken());

  const url = new URL(path, BACKEND_URL);
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await res.json() : undefined;

  if (!res.ok) {
    const err = payload?.error;
    throw new ApiError(res.status, err?.code ?? "UNKNOWN", err?.message ?? "Request failed", err?.details);
  }

  return payload as T;
}
