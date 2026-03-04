/**
 * Client API Portfolio as a Service
 * Base URL : NEXT_PUBLIC_API_URL (ex: http://localhost:8000/api/v1)
 */

const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_API_URL is not set");
  return url.replace(/\/$/, "");
};

export function getApiUrl(): string {
  return getBaseUrl();
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("portfolio_token");
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("portfolio_token", token);
  else localStorage.removeItem("portfolio_token");
}

type RequestInitAuth = RequestInit & { skipAuth?: boolean };

export async function apiFetch<T>(
  path: string,
  options: RequestInitAuth = {}
): Promise<T> {
  const { skipAuth, ...init } = options;
  const url = path.startsWith("http") ? path : `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(init.headers as Record<string, string>),
  };
  const token = getToken();
  if (!skipAuth && token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error((data as { message?: string }).message || res.statusText) as Error & { status?: number; errors?: Record<string, string[]> };
    err.status = res.status;
    err.errors = (data as { errors?: Record<string, string[]> }).errors;
    throw err;
  }
  return data as T;
}

/** POST JSON */
export async function apiPost<T>(path: string, body: unknown, options?: RequestInitAuth): Promise<T> {
  return apiFetch<T>(path, { method: "POST", body: JSON.stringify(body), ...options });
}

/** PUT JSON */
export async function apiPut<T>(path: string, body: unknown, options?: RequestInitAuth): Promise<T> {
  return apiFetch<T>(path, { method: "PUT", body: JSON.stringify(body), ...options });
}

/** PATCH JSON */
export async function apiPatch<T>(path: string, body: unknown, options?: RequestInitAuth): Promise<T> {
  return apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body), ...options });
}

/** DELETE */
export async function apiDelete(path: string, options?: RequestInitAuth): Promise<void> {
  await apiFetch(path, { method: "DELETE", ...options });
}

/** Upload file (multipart) */
export async function apiUpload<T>(path: string, file: File, options?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const token = getToken();
  const form = new FormData();
  form.append("file", file);
  const headers: HeadersInit = {};
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { method: "POST", body: form, headers, ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error((data as { message?: string }).message || res.statusText) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return data as T;
}

/**
 * POST /api/v1/me/portfolio/extract-from-cv
 *
 * Envoie un CV (PDF), le serveur extrait le texte et parse les sections
 * (profil, expériences, formation, compétences).
 *
 * @param file - Fichier PDF du CV
 * @param apply - Si true, le serveur écrit directement les sections dans le portfolio
 * @returns { success, extracted?, applied? } — extracted contient profile, experiences, education, skills
 *
 * Utilisation depuis un composant :
 *   const { extractFromCv } = useDashboard();
 *   const result = await extractFromCv(pdfFile, true);
 *
 * Ou directement (avec token en localStorage) :
 *   import { apiExtractFromCv } from "@/lib/api";
 *   const result = await apiExtractFromCv(pdfFile, true);
 */
export interface ExtractFromCvResponse {
  success: boolean;
  message?: string;
  extracted?: {
    profile?: { name?: string; title?: string; bio?: string };
    contact?: { email?: string; phone?: string };
    experiences?: Array<{ id: string; period?: string; role?: string; company?: string; location?: string; current?: boolean; desc?: string }>;
    education?: Array<{ id: string; year?: string; degree?: string; school?: string; location?: string }>;
    skills?: Record<string, string[]>;
  };
  applied?: boolean;
}

export async function apiExtractFromCv(file: File, apply = false): Promise<ExtractFromCvResponse> {
  const url = `${getBaseUrl()}/me/portfolio/extract-from-cv${apply ? "?apply=1" : ""}`;
  const form = new FormData();
  form.append("file", file);
  const token = getToken();
  const headers: HeadersInit = {};
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { method: "POST", body: form, headers });
  const data = await res.json().catch(() => ({})) as ExtractFromCvResponse & { message?: string };
  if (!res.ok) {
    const err = new Error(data.message || res.statusText) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return data;
}
