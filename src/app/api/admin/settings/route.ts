import { NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from "@/lib/supabase/server";
import { isHttpsUrl } from "@/lib/links/external-link";

const ALLOWED_SETTING_KEYS = [
  "FLIGHT_OUTBOUND_URL",
  "HOTEL_OUTBOUND_URL",
] as const;
type AllowedSettingKey = (typeof ALLOWED_SETTING_KEYS)[number];

type AuthCheck =
  { ok: true; userId: string } | { ok: false; status: 401 | 403 };

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
  return { ok: true, userId: data.user.id };
}

/**
 * API-ADMIN-SETTINGS — 관리자 외부 URL 허용목록 조회.
 * `app_settings`는 RLS로 클라이언트 접근이 전면 차단되어 있어 Service Role로만 읽는다.
 */
export async function GET() {
  const auth = await requireModeratorOrAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { error: "권한이 없습니다." },
      { status: auth.status },
    );
  }

  const serviceClient = createSupabaseServiceRoleClient();
  const { data, error } = await serviceClient
    .from("app_settings")
    .select("key, value, updated_at")
    .in("key", ALLOWED_SETTING_KEYS);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}

/**
 * REQ-FUNC-077 — HTTPS 허용목록 내에서만 외부 URL 설정을 저장한다.
 */
export async function PATCH(request: Request) {
  const auth = await requireModeratorOrAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { error: "권한이 없습니다." },
      { status: auth.status },
    );
  }

  const body = (await request.json().catch(() => null)) as Partial<
    Record<AllowedSettingKey, string>
  > | null;

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "잘못된 요청 본문입니다." },
      { status: 400 },
    );
  }

  const updates: {
    key: AllowedSettingKey;
    value: string;
    updated_by: string;
  }[] = [];

  for (const key of ALLOWED_SETTING_KEYS) {
    const value = body[key];
    if (value === undefined) continue;
    if (typeof value !== "string" || !isHttpsUrl(value)) {
      return NextResponse.json(
        { error: `${key}은 https:// URL만 허용합니다.` },
        { status: 400 },
      );
    }
    updates.push({ key, value, updated_by: auth.userId });
  }

  if (updates.length === 0) {
    return NextResponse.json(
      { error: "변경할 설정이 없습니다." },
      { status: 400 },
    );
  }

  const serviceClient = createSupabaseServiceRoleClient();
  const { error } = await serviceClient.from("app_settings").upsert(
    updates.map((update) => ({
      ...update,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: "key" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
