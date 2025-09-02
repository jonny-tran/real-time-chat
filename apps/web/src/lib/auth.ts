import { cookies } from "next/headers";

const isProd = process.env.NODE_ENV === "production";
export const ACCESS_COOKIE_NAME =
  process.env.ACCESS_COOKIE_NAME || "access-token";
const MAX_AGE = process.env.AUTH_COOKIE_MAX_AGE || 604800; // 7days
const COOKIE_DOMAIN = process.env.AUTH_COOKIE_DOMAIN || undefined;

export async function setAccessToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    maxAge: Number(MAX_AGE),
    domain: COOKIE_DOMAIN,
    path: "/",
    sameSite: "lax",
  });
}

export async function clearAccessToken() {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProd,
    maxAge: 0,
    domain: COOKIE_DOMAIN,
    path: "/",
    sameSite: "lax",
  });
}

export async function getAccessTokenFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE_NAME)?.value;
}

// Helper: options for setting cookie on NextResponse in Route Handlers
export function buildAccessCookieOptions() {
  const base = {
    httpOnly: true as const,
    secure: isProd,
    maxAge: Number(MAX_AGE),
    path: "/",
    sameSite: "lax" as const,
  };
  // Chỉ set domain ở production khi được cấu hình đúng; dev để trình duyệt tự mặc định theo host hiện tại (localhost)
  if (isProd && COOKIE_DOMAIN) {
    return { ...base, domain: COOKIE_DOMAIN } as const;
  }
  return base;
}
