import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { detectContactInfo } from "@/lib/mate/contact-detection";
import { validateMatePostInput } from "@/lib/validation/schemas";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * REQ-FUNC-037(축소) — 종료일이 지난 OPEN 글은 배치 없이 조회 시점에 CLOSED로
 * 계산한다. TEST-UNIT-MATE-STATE(tests/unit/mate-state.test.ts)가 직접
 * import해 검증할 수 있도록 export한다.
 */
export function computeEffectiveStatus(
  status: string,
  endDate: string,
): string {
  if (status === "OPEN" && endDate < todayIsoDate()) return "CLOSED";
  return status;
}

async function requireOwnedPost(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  postId: string,
  userId: string,
) {
  const { data: post, error } = await supabase
    .from("mate_post")
    .select("post_id, owner_id, status, start_date, end_date")
    .eq("post_id", postId)
    .single();

  if (error || !post) {
    return { ok: false as const, status: 404 as const };
  }
  if (post.owner_id !== userId) {
    return { ok: false as const, status: 403 as const };
  }
  return { ok: true as const, post };
}

/**
 * API-MATE-POSTS — 동행 모집글 수정/수동 마감(REQ-FUNC-038). 작성자만 호출할
 * 수 있으며, 승인된 신청이 있는 상태에서 시작일/종료일을 바꾸면 응답에 경고
 * 플래그를 포함한다.
 */
export async function PATCH(
  request: Request,
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

  const { id: postId } = await params;
  const ownedPost = await requireOwnedPost(supabase, postId, userData.user.id);
  if (!ownedPost.ok) {
    if (ownedPost.status === 404) {
      return NextResponse.json(
        { error: "모집글을 찾을 수 없습니다." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "작성자만 수정할 수 있습니다." },
      { status: 403 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    action?: unknown;
  } | null;

  if (body?.action === "CLOSE") {
    const { data, error } = await supabase
      .from("mate_post")
      .update({ status: "CLOSED" })
      .eq("post_id", postId)
      .select("post_id, status")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ postId: data.post_id, status: data.status });
  }

  const validation = validateMatePostInput(body);
  if (!validation.success || !validation.data) {
    return NextResponse.json(
      { error: "입력값을 확인해 주세요.", issues: validation.issues },
      { status: 400 },
    );
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const preferences = isPlainObject(raw.preferences) ? raw.preferences : null;
  if (preferences === null) {
    return NextResponse.json(
      { error: "preferences(선호조건)를 입력해 주세요." },
      { status: 400 },
    );
  }

  const {
    title,
    description,
    countryCode,
    regionCode,
    startDate,
    endDate,
    capacity,
    travelStyles,
  } = validation.data;

  if (endDate < todayIsoDate()) {
    return NextResponse.json(
      { error: "endDate는 과거일 수 없습니다." },
      { status: 400 },
    );
  }

  const contactCheck = detectContactInfo(`${title}\n${description}`);
  if (contactCheck.detected) {
    return NextResponse.json({ error: contactCheck.message }, { status: 400 });
  }

  const scheduleChanged =
    startDate !== ownedPost.post.start_date ||
    endDate !== ownedPost.post.end_date;

  let warning: string | undefined;
  if (scheduleChanged) {
    const { count, error: countError } = await supabase
      .from("mate_application")
      .select("application_id", { count: "exact", head: true })
      .eq("post_id", postId)
      .eq("status", "ACCEPTED");

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }
    if ((count ?? 0) > 0) {
      warning = "APPROVED_APPLICANTS_SCHEDULE_CHANGED";
    }
  }

  const { data, error } = await supabase
    .from("mate_post")
    .update({
      title,
      description,
      country_code: countryCode,
      region_code: regionCode || null,
      start_date: startDate,
      end_date: endDate,
      capacity,
      preferences,
      travel_styles: travelStyles,
    })
    .eq("post_id", postId)
    .select("post_id, status, start_date, end_date")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    postId: data.post_id,
    status: computeEffectiveStatus(data.status, data.end_date),
    warning,
  });
}

/**
 * API-MATE-POSTS — 동행 모집글 삭제(REQ-FUNC-038). RLS 필터
 * (`mate_post_select_not_deleted`)와 동일한 소프트 삭제 방식으로 상태만
 * `DELETED`로 바꾼다.
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

  const { id: postId } = await params;
  const ownedPost = await requireOwnedPost(supabase, postId, userData.user.id);
  if (!ownedPost.ok) {
    if (ownedPost.status === 404) {
      return NextResponse.json(
        { error: "모집글을 찾을 수 없습니다." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "작성자만 삭제할 수 있습니다." },
      { status: 403 },
    );
  }

  const { error } = await supabase
    .from("mate_post")
    .update({ status: "DELETED" })
    .eq("post_id", postId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
