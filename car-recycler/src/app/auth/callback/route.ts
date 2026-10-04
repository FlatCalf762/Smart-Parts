import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseServerClient } from "@/src/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const requestedNext = request.nextUrl.searchParams.get("next") ?? "/dashboard";
  const destination = new URL(requestedNext, request.url);
  const next = destination.origin === request.nextUrl.origin
    ? `${destination.pathname}${destination.search}${destination.hash}`
    : "/dashboard";

  const supabase = await createSupabaseServerClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  if (tokenHash && type === "invite") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "invite",
    });

    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL("/login?reason=invite", request.url));
}