import { pickErrorMessage } from "@/lib/error-map";
import { beFetch } from "@/lib/server-fetch";
import { ForgotResponse } from "@/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const be = await beFetch<ForgotResponse>("/auth/forgot", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!be.ok || !be.data) {
    const message = pickErrorMessage(
      be.data,
      be.status,
      "Quên mật khẩu thất bại."
    );
    return NextResponse.json(
      { message, status: be.status },
      { status: be.status || 500 }
    );
  }

  return NextResponse.json(be.data, { status: 200 });
}
