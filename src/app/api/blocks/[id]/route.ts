import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * API-BLOCKS — 사용자 차단 해제(REQ-FUNC-040). `[id]`는 해제할 차단 대상의
 * `blocked_id`이며, `blocker_id`는 항상 현재 로그인 사용자로 고정한다.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const { id: blockedId } = await params;

  const { error } = await supabase
    .from("user_block")
    .delete()
    .eq("blocker_id", userData.user.id)
    .eq("blocked_id", blockedId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
