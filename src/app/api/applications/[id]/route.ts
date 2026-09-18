import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const DECIDABLE_STATUSES = ["ACCEPTED", "REJECTED"] as const;
type DecidableStatus = (typeof DECIDABLE_STATUSES)[number];

function isDecidableStatus(value: unknown): value is DecidableStatus {
  return (
    typeof value === "string" &&
    (DECIDABLE_STATUSES as readonly string[]).includes(value)
  );
}

/**
 * API-MATE-APPLICATIONS — 참가 요청 승인/거절(REQ-FUNC-036). 글 작성자만
 * ACCEPTED/REJECTED로 상태를 변경할 수 있다. 비작성자 호출은 403을 반환한다.
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

  const { id: applicationId } = await params;
  const body = (await request.json().catch(() => null)) as {
    status?: unknown;
  } | null;

  if (!body || !isDecidableStatus(body.status)) {
    return NextResponse.json(
      { error: "status는 ACCEPTED/REJECTED 중 하나여야 합니다." },
      { status: 400 },
    );
  }

  const { data: application, error: applicationError } = await supabase
    .from("mate_application")
    .select("post_id")
    .eq("application_id", applicationId)
    .single();

  if (applicationError || !application) {
    return NextResponse.json(
      { error: "참가 요청을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  const { data: post, error: postError } = await supabase
    .from("mate_post")
    .select("owner_id")
    .eq("post_id", application.post_id)
    .single();

  if (postError || !post) {
    return NextResponse.json(
      { error: "모집글을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  if (post.owner_id !== userData.user.id) {
    return NextResponse.json(
      { error: "글 작성자만 처리할 수 있습니다." },
      { status: 403 },
    );
  }

  const { data, error } = await supabase
    .from("mate_application")
    .update({ status: body.status })
    .eq("application_id", applicationId)
    .select("application_id, status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    applicationId: data.application_id,
    status: data.status,
  });
}
