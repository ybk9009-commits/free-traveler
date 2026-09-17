import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateReportInput } from "@/lib/validation/schemas";

/**
 * API-REPORTS — 신고 접수(REQ-FUNC-039). 대상(글/사용자/신청) + 사유코드 +
 * 설명만 저장한다(증거 첨부·우선순위 필드 없음 — 간소화 범위). 응답에 접수번호와
 * 접수 시각을 반환한다(REQ-NF-019).
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

  const body = await request.json().catch(() => null);
  const validation = validateReportInput(body);

  if (!validation.success || !validation.data) {
    return NextResponse.json(
      { error: "입력값을 확인해 주세요.", issues: validation.issues },
      { status: 400 },
    );
  }

  const { targetType, targetId, reasonCode, description } = validation.data;

  const { data, error } = await supabase
    .from("report")
    .insert({
      reporter_id: userData.user.id,
      target_type: targetType,
      target_id: targetId,
      reason_code: reasonCode,
      description,
    })
    .select("report_id, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { reportId: data.report_id, createdAt: data.created_at },
    { status: 201 },
  );
}
