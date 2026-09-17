import { NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from "@/lib/supabase/server";

const ALLOWED_REPORT_STATUSES = ["OPEN", "RESOLVED", "DISMISSED"] as const;
type ReportStatus = (typeof ALLOWED_REPORT_STATUSES)[number];

type AuthCheck = { ok: true } | { ok: false; status: 401 | 403 };

async function requireModeratorOrAdmin(): Promise<AuthCheck> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { ok: false, status: 401 };
  }
  const role = (data.user.app_metadata as { role?: string } | undefined)?.role;
  if (role !== "MODERATOR" && role !== "ADMIN") {
    return { ok: false, status: 403 };
  }
  return { ok: true };
}

function isReportStatus(value: unknown): value is ReportStatus {
  return (
    typeof value === "string" &&
    (ALLOWED_REPORT_STATUSES as readonly string[]).includes(value)
  );
}

/**
 * API-ADMIN-SETTINGS — 신고 상태 변경 + 신고 대상 게시물 숨김만 지원한다
 * (경고·계정 일시제한 기능은 만들지 않는다, REQ-FUNC-042 간소화 범위).
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireModeratorOrAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { error: "권한이 없습니다." },
      { status: auth.status },
    );
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    status?: unknown;
    hideTargetPost?: unknown;
  } | null;

  if (!body || !isReportStatus(body.status)) {
    return NextResponse.json(
      { error: "status는 OPEN/RESOLVED/DISMISSED 중 하나여야 합니다." },
      { status: 400 },
    );
  }

  const serviceClient = createSupabaseServiceRoleClient();

  const { data: report, error: fetchError } = await serviceClient
    .from("report")
    .select("target_type, target_id")
    .eq("report_id", id)
    .single();

  if (fetchError || !report) {
    return NextResponse.json(
      { error: "신고를 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  const { error: updateError } = await serviceClient
    .from("report")
    .update({
      status: body.status,
      resolved_at: body.status === "OPEN" ? null : new Date().toISOString(),
    })
    .eq("report_id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (body.hideTargetPost === true && report.target_type === "MATE_POST") {
    const { error: hideError } = await serviceClient
      .from("mate_post")
      .update({ status: "HIDDEN" })
      .eq("post_id", report.target_id);

    if (hideError) {
      return NextResponse.json({ error: hideError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
