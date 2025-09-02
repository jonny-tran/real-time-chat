/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAccessTokenFromCookie } from "@/lib/auth";
import { beFetch } from "@/lib/server-fetch";
import { User } from "@/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getAccessTokenFromCookie();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const be = await beFetch<User>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!be.ok || !be.data) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(be.data, { status: 200 });
}
