import { ACCESS_COOKIE_NAME, buildAccessCookieOptions } from "@/lib/auth";
import { pickErrorMessage } from "@/lib/error-map";
import { beFetch } from "@/lib/server-fetch";
import { AuthResponse } from "@/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const be = await beFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!be.ok || !be.data) {
    const message = pickErrorMessage(be.data, be.status, "Đăng ký thất bại.");
    return NextResponse.json(
      { message, status: be.status },
      { status: be.status || 500 }
    );
  }

  const res = NextResponse.json(be.data, { status: 200 });
  res.cookies.set(
    ACCESS_COOKIE_NAME,
    be.data.accessToken,
    buildAccessCookieOptions()
  );
  return res;
}
