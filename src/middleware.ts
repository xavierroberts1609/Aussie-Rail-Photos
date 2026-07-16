import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROLES } from "@/lib/constants";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== ROLES.ADMIN) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/upload", "/admin/:path*", "/api/admin/:path*"],
};
