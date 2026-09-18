import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireVerifiedUser } from "@/lib/auth/session";
import { requireAdultVerified } from "@/lib/mate/adult-verification";
import { validateMateApplicationInput } from "@/lib/validation/schemas";

/**
 * API-MATE-APPLICATIONS — 참가 요청 생성(REQ-FUNC-034). `[id]`는 대상
 * 모집글(`mate_post.post_id`)이며, 최대 500자 메시지를 PENDING 상태로
 * 저장한다. 동일 사용자·동일 글의 중복 PENDING/ACCEPTED 요청은 사전 검사 +
 * DB unique 제약(`mate_application(post_id, applicant_id)`)으로 이중 차단한다
 * (REQ-FUNC-035).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireVerifiedUser();
  if (!auth.ok) {
    if ("redirectTo" in auth) {
      return NextResponse.json(
        { error: "이메일 인증이 필요합니다.", redirectTo: auth.redirectTo },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: auth.status },
    );
  }

  const adultGate = await requireAdultVerified();
  if (!adultGate.ok) {
    if ("redirectTo" in adultGate) {
      return NextResponse.json(
        { error: "성인 인증이 필요합니다.", redirectTo: adultGate.redirectTo },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: adultGate.status },
    );
  }

  const { id: postId } = await params;
  const body = await request.json().catch(() => null);
  const validation = validateMateApplicationInput(body);

  if (!validation.success || !validation.data) {
    return NextResponse.json(
      { error: "입력값을 확인해 주세요.", issues: validation.issues },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data: existing, error: existingError } = await supabase
    .from("mate_application")
    .select("application_id, status")
    .eq("post_id", postId)
    .eq("applicant_id", auth.user.id)
    .in("status", ["PENDING", "ACCEPTED"])
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json(
      { error: "이미 신청한 모집글입니다." },
      { status: 409 },
    );
  }

  const { data, error } = await supabase
    .from("mate_application")
    .insert({
      post_id: postId,
      applicant_id: auth.user.id,
      message: validation.data.message,
    })
    .select("application_id, status, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "이미 신청한 모집글입니다." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      applicationId: data.application_id,
      status: data.status,
      createdAt: data.created_at,
    },
    { status: 201 },
  );
}
