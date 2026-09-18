import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireVerifiedUser } from "@/lib/auth/session";
import { requireAdultVerified } from "@/lib/mate/adult-verification";
import { detectContactInfo } from "@/lib/mate/contact-detection";
import { validateMatePostInput } from "@/lib/validation/schemas";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * API-MATE-POSTS — 동행 모집글 생성(REQ-FUNC-031). 선호조건(`preferences`)과
 * 안전수칙 동의(`safetyAgreement`)는 `INFRA-INPUT-VALIDATION`(공용 스키마)
 * 범위 밖의 필드라 이 Route 안에서 직접 검증한다. 본문에 공개 연락처가
 * 탐지되면 제출을 차단한다(REQ-FUNC-032).
 */
export async function POST(request: Request) {
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

  const body = await request.json().catch(() => null);
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

  if (raw.safetyAgreement !== true) {
    return NextResponse.json(
      { error: "안전수칙 동의가 필요합니다." },
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

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("mate_post")
    .insert({
      owner_id: auth.user.id,
      country_code: countryCode,
      region_code: regionCode || null,
      start_date: startDate,
      end_date: endDate,
      capacity,
      preferences,
      travel_styles: travelStyles,
      title,
      description,
    })
    .select("post_id, status, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { postId: data.post_id, status: data.status, createdAt: data.created_at },
    { status: 201 },
  );
}
