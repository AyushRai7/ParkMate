import { NextResponse } from "next/server";

export function middleware(req) {
  const userToken = req.cookies.get("userToken");
  const ownerToken = req.cookies.get("ownerToken");

  const { pathname } = req.nextUrl;

  // Protect booking page
  if (pathname.startsWith("/booking") && !userToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect owner dashboard
  if (pathname.startsWith("/owner") && !ownerToken) {
    return NextResponse.redirect(new URL("/ownerlogin", req.url));
  }

  return NextResponse.next();
}
