/**
 * Server-side bridge to the ipu-back user app, which stores every form
 * submission in its own MongoDB collection. Never import from client code:
 * the base URL is a server-only variable so the backend can stay on a
 * private network.
 */

const DEFAULT_BACKEND_URL = "http://localhost:4000";

function baseUrl(): string {
  return (process.env.CONFERENCE_API_URL ?? DEFAULT_BACKEND_URL).replace(
    /\/$/,
    "",
  );
}

export type BackendResult<T = Record<string, unknown>> =
  | { ok: true; data: T }
  | { ok: false; status: number };

async function send<T>(path: string, init: RequestInit): Promise<BackendResult<T>> {
  try {
    const response = await fetch(`${baseUrl()}${path}`, init);
    if (!response.ok) {
      console.error(
        `[backend] ${init.method} ${path} failed with ${response.status}`,
      );
      return { ok: false, status: response.status };
    }
    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (error) {
    console.error(`[backend] ${init.method} ${path} unreachable:`, error);
    return { ok: false, status: 503 };
  }
}

export function backendPostJson<T = Record<string, unknown>>(
  path: string,
  body: unknown,
): Promise<BackendResult<T>> {
  return send<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function backendPostForm<T = Record<string, unknown>>(
  path: string,
  form: FormData,
): Promise<BackendResult<T>> {
  return send<T>(path, { method: "POST", body: form });
}
