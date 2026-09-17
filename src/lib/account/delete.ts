import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface DeleteAccountResult {
  ok: boolean;
  error?: string;
}

/**
 * REQ-FUNC-045(축소) — 탈퇴 요청 시 USER_PROFILE의 닉네임·자기소개 등 공개
 * 식별 정보를 즉시 비식별화한다. 유예기간 후 배치 삭제(법적 보존 예외 처리 등)와
 * 개인정보 내보내기(다운로드) 기능은 만들지 않는다(REQ-NF-018 축소 범위 — 삭제만 구현).
 */
export async function deleteAccount(): Promise<DeleteAccountResult> {
  "use server";
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

  const anonymizedNickname = `탈퇴한 사용자_${userData.user.id.slice(0, 8)}`;

  const { error: updateError } = await supabase
    .from("user_profile")
    .update({
      nickname: anonymizedNickname,
      bio: null,
      gender: null,
      travel_styles: [],
      status: "DELETED",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userData.user.id);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  await supabase.auth.signOut();

  return { ok: true };
}
