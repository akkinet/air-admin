import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuthenticated = !!token;

  const protectedRoutes = ["/dashboard", "/profile", "/admin"]; // Add routes that need authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url); // Redirect to login page
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware to these routes
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*"], // Protect these routes
};
