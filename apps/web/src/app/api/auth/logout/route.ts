/* eslint-disable @typescript-eslint/no-unused-vars */
import { clearAccessToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  clearAccessToken();
  return NextResponse.json({ success: true }, { status: 200 });
}
