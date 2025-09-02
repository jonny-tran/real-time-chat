import { getAccessTokenFromCookie } from "@/lib/auth";
import { beFetch } from "@/lib/server-fetch";
import { User } from "@/types/auth";

// Server-only helper: đọc cookie trực tiếp và gọi BE, tránh fetch vòng qua /api để khỏi mất cookie
export async function getMeFromSSR() {
  try {
    const token = await getAccessTokenFromCookie();
    if (!token) return null;

    const be = await beFetch<{ user: User }>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!be.ok || !be.data) return null;
    return be.data.user;
  } catch {
    return null;
  }
}
