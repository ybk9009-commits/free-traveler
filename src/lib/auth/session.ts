import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthActionResult {
  ok: boolean;
  error?: string;
}

function buildCallbackUrl(next = "/account"): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = new URL("/auth/callback", base);
  url.searchParams.set("next", next);
  return url.toString();
}

/** REQ-FUNC-066 — 이메일 가입. 인증 메일의 콜백은 /auth/callback으로 돌아온다. */
export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<AuthActionResult> {
  "use server";
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: buildCallbackUrl() },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** REQ-FUNC-066 — 이메일 로그인. */
export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthActionResult> {
  "use server";
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** REQ-FUNC-066 — 로그아웃 후 홈으로 리다이렉트한다. */
export async function signOut(): Promise<void> {
  "use server";
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

/** REQ-FUNC-066 — 비밀번호 재설정 메일 발송. */
export async function requestPasswordReset(
  email: string,
): Promise<AuthActionResult> {
  "use server";
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: buildCallbackUrl("/account?flow=reset-password"),
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** 현재 요청의 로그인 사용자(없으면 null). Server Component/Route Handler에서 사용. */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

export type RequireVerifiedUserResult =
  | { ok: true; user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>> }
  | { ok: false; status: 401 }
  | { ok: false; redirectTo: string };

/**
 * REQ-FUNC-027 — 이메일 인증 미완료 세션은 동행 쓰기 작업(API-MATE-POSTS,
 * API-MATE-APPLICATIONS 등) 호출 시 서버에서 401/리다이렉트로 차단한다.
 * 각 API Route Handler가 요청 처리 맨 앞에서 호출해야 한다.
 */
export async function requireVerifiedUser(): Promise<RequireVerifiedUserResult> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { ok: false, status: 401 };
  }
  if (!data.user.email_confirmed_at) {
    return { ok: false, redirectTo: "/account?flow=verify-email" };
  }
  return { ok: true, user: data.user };
}
