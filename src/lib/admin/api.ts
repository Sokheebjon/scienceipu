/**
 * Browser-side client for the ipu-back ADMIN app. Auth is entirely ipu-back's:
 * POST /auth/login issues the JWT, every other call sends it as a Bearer
 * header, and a 401 clears the stored session and returns to the login page.
 */

export const ADMIN_API_URL = (
  process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

const TOKEN_KEY = "ipu_admin_token";
const USER_KEY = "ipu_admin_user";

export type AdminUser = {
  _id: string;
  phone?: string;
  email?: string;
  name?: { uz?: string; ru?: string; en?: string };
};

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type AdminRegistration = {
  _id: string;
  registrationNumber: string;
  title: string | null;
  firstName: string;
  lastName: string;
  affiliation: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  secondEmail: string;
  conference: string;
  presentationType: string;
  articleTitle: string;
  articleAbstract: string;
  hasSecondArticle: boolean;
  articleTitle2: string;
  articleAbstract2: string;
  locale: string;
  createdAt: string;
};

export type AdminContact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  locale: string;
  createdAt: string;
};

export type AdminNewsletter = {
  _id: string;
  email: string;
  sourcePath: string;
  locale: string;
  createdAt: string;
};

export type AdminUpload = {
  _id: string;
  registrationNumber: string;
  email: string;
  kind: string;
  fileUrl: string;
  fileKey: string;
  fileName: string;
  fileSize: number;
  locale: string;
  createdAt: string;
};

export function getToken(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(TOKEN_KEY) ?? "";
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

export function storeSession(token: string, user: AdminUser): void {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export async function login(
  phone: string,
  password: string,
): Promise<{ user: AdminUser; token: string }> {
  let response: Response;
  try {
    response = await fetch(`${ADMIN_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });
  } catch {
    throw new Error("Server bilan bogʻlanib boʻlmadi");
  }

  const data = (await response.json().catch(() => null)) as {
    user?: AdminUser;
    token?: string;
    error?: string;
  } | null;

  if (!response.ok || !data?.token || !data.user) {
    throw new Error("Telefon raqami yoki parol notoʻgʻri");
  }

  return { user: data.user, token: data.token };
}

/** Thrown when the backend answers 401; callers redirect to the login page. */
export class UnauthorizedError extends Error {
  constructor() {
    super("Sessiya muddati tugadi");
  }
}

export async function adminFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${ADMIN_API_URL}${path}`, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${getToken()}`,
      },
    });
  } catch {
    throw new Error("Server bilan bogʻlanib boʻlmadi");
  }

  if (response.status === 401) {
    clearSession();
    throw new UnauthorizedError();
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `Soʻrov bajarilmadi (${response.status})`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export function listQuery(params: {
  page: number;
  limit: number;
  search?: string;
  [key: string]: string | number | undefined;
}): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  return `?${query.toString()}`;
}
