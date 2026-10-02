import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const errorDescription = searchParams.get("error_description");

  // Determine base URL, respecting reverse proxy headers on Vercel
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const baseUrl = forwardedHost && !isLocalEnv ? `https://${forwardedHost}` : origin;

  if (errorDescription) {
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(errorDescription)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${baseUrl}${next}`);
    }
  }

  // If next is /reset-password, forward even if server-side code exchange wasn't needed
  // so the client-side form can process any auth token or hash
  if (next.startsWith("/reset-password")) {
    return NextResponse.redirect(`${baseUrl}${next}`);
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${baseUrl}/login?error=Could+not+authenticate`);
}
