import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/booking") || path.startsWith("/invoice")) {
      return NextResponse.next();
    }

    if (path.startsWith("/owner")) {
      if (!token?.isOwner) {
        return NextResponse.redirect(new URL("/login?role=OWNER&error=wrong-role", req.url));
      }
    }

    if (path.startsWith("/homepage")) {
      if (!token?.isUser) {
        return NextResponse.redirect(new URL("/login?role=USER&error=wrong-role", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/homepage/:path*",
    "/owner/:path*",
    "/booking/:path*",
    "/invoice/:path*",
  ],
};