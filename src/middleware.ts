import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isPortalRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

  // If visiting a protected portal route without a user session
  if (isPortalRoute && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If visiting login/register while already logged in
  if (isAuthRoute && user) {
    // Check user's role to redirect to proper dashboard
    const { data: profile } = await (supabase.from("profiles") as any)
      .select("role")
      .eq("id", user.id)
      .single();

    const role = (profile as any)?.role || "customer";
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  // If user visits generic /dashboard, redirect to their role dashboard
  if (pathname === "/dashboard" && user) {
    const { data: profile } = await (supabase.from("profiles") as any)
      .select("role")
      .eq("id", user.id)
      .single();

    const role = (profile as any)?.role || "customer";
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (.svg, .png, .jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
