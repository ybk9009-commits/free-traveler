import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * INFRA-AUTH-SESSION — Supabase Auth 이메일 인증/비밀번호 재설정 콜백.
 * Screen 5개와 별개의 기술 Route이며 어떤 Page Owner의 Expected Files에도
 * 포함하지 않는다.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/account?flow=auth-error`);
}
