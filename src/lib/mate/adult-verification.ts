"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdultVerificationResult {
  ok: boolean;
  error?: string;
}

/**
 * REQ-FUNC-028 — "만 19세 이상"을 확인하면 `is_adult=true`,
 * `adult_verified_at=now()`만 저장한다. 생년월일·나이 원본값은 어떤
 * 저장소에도 남기지 않는다.
 */
export async function verifyAdult(): Promise<AdultVerificationResult> {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

  const { error } = await supabase
    .from("user_profile")
    .update({ is_adult: true, adult_verified_at: new Date().toISOString() })
    .eq("user_id", userData.user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export type AdultGateResult =
  { ok: true } | { ok: false; status: 401 } | { ok: false; redirectTo: string };

/**
 * 동행 글 작성(CMP-SCR-003-mate-write-form)·참가 요청(CMP-SCR-004-apply)
 * 진입 시 이 플래그를 게이트로 사용한다.
 */
export async function requireAdultVerified(): Promise<AdultGateResult> {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { ok: false, status: 401 };
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profile")
    .select("is_adult")
    .eq("user_id", userData.user.id)
    .single();

  if (
    profileError ||
    !profile ||
    !(profile as { is_adult?: boolean }).is_adult
  ) {
    return { ok: false, redirectTo: "/account?flow=adult-verification" };
  }

  return { ok: true };
}
