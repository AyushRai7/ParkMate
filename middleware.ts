import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    console.log(`🔒 [Middleware] ${path}`, {
      email: token?.email,
      isUser: token?.isUser,
      isOwner: token?.isOwner,
    });

    // Allow booking and invoice pages for any authenticated user
    if (path.startsWith("/booking") || path.startsWith("/invoice")) {
      return NextResponse.next();
    }

    // Check if user is trying to access owner routes
    if (path.startsWith("/owner")) {
      // ✅ Only block if explicitly NOT an owner (don't block undefined/null)
      if (token?.isOwner === false) {
        console.log(`❌ [Middleware] User ${token?.email} is not an owner`);
        return NextResponse.redirect(new URL("/login?role=OWNER&error=wrong-role", req.url));
      }
    }

    // Check if user is trying to access homepage
    if (path.startsWith("/homepage")) {
      // ✅ Only block if explicitly NOT a user (don't block undefined/null)
      if (token?.isUser === false) {
        console.log(`❌ [Middleware] User ${token?.email} is not a regular user`);
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