import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * API-BLOCKS — 사용자 차단 생성(REQ-FUNC-040). `blocker_id`는 항상 현재
 * 로그인 사용자로 고정하며, RLS(`user_block_insert_own`)가 이를 다시 강제한다.
 */
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    blockedId?: unknown;
  } | null;
  const blockedId = body?.blockedId;

  if (typeof blockedId !== "string" || blockedId.length === 0) {
    return NextResponse.json(
      { error: "blockedId가 필요합니다." },
      { status: 400 },
    );
  }

  if (blockedId === userData.user.id) {
    return NextResponse.json(
      { error: "자기 자신은 차단할 수 없습니다." },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("user_block")
    .insert({ blocker_id: userData.user.id, blocked_id: blockedId });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
