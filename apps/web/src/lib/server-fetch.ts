// Unified server-side fetch to BE (NestJS) with sane defaults.
// - Always no-store (avoid caching auth responses)
// - JSON headers
// - Safe JSON parse
// - Generic typing for response payload

const BE_URL = process.env.BE_URL ?? "http://localhost:8080";

type BeResult<T> = {
  ok: boolean;
  status: number;
  data?: T; // parsed JSON
  raw: Response; // original response
};

async function safeJson(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return undefined;
  try {
    // Important: call the function to actually parse body
    return await res.json();
  } catch {
    return undefined;
  }
}

export async function beFetch<T>(
  path: string,
  init?: RequestInit
): Promise<BeResult<T>> {
  const res = await fetch(`${BE_URL}${path}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const data = ((await safeJson(res)) as T) || undefined;
  return { ok: res.ok, status: res.status, data, raw: res };
}
