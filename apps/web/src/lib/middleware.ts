import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE_NAME = process.env.ACCESS_COOKIE_NAME || "access-token";

// routes need guard
const CHAT_PREFIX = "/chat";
const AUTH_PAGES = new Set(["/login", "/register", "/"]);

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get(ACCESS_COOKIE_NAME)?.value;

  // 1) Chưa đăng nhập mà vào /chat -> chuyển sang /login?redirect=/chat...
  if (pathname.startsWith(CHAT_PREFIX)) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname + (search || ""));
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 2) Đã đăng nhập mà vào /login | /register | / -> chuyển sang /chat
  if (AUTH_PAGES.has(pathname)) {
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = CHAT_PREFIX;
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // 3) Các route khác: cho qua
  return NextResponse.next();
}

export const config = {
  matcher: ["/chat", "/chat/:path*", "/login", "/register", "/"],
};
