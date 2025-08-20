import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // For Firebase Auth, we'll handle authentication on the client side
  // This middleware will only handle basic routing logic

  const { pathname } = request.nextUrl;

  // Allow all requests to pass through
  // Firebase Auth will handle authentication state on the client
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/(dashboard)/:path*",
    "/login",
    "/register",
  ],
};
