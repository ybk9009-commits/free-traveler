import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * TEST-RLS-BASIC — REQ-FUNC-044/REQ-NF-013. 실제 Supabase 프로젝트에 적용된
 * RLS 정책(supabase/migrations/0002_rls.sql)을 본인/상대방/비회원/
 * Moderator·Admin 역할로 직접 질의해 검증한다. 비회원(anon) 검사는 URL·anon
 * key만 있으면 실행되고, 역할별 검사는 사전에 확인된 이메일의 테스트 계정이
 * 필요해 해당 환경변수가 없으면 건너뛴다(tests/e2e/mate-auth.spec.ts와 같은
 * E2E_TEST_OWNER_, E2E_TEST_APPLICANT_, E2E_TEST_ADMIN_ 접두 이름을 재사용한다).
 *
 * report/mate_application에는 DELETE RLS 정책이 없어(0002_rls.sql) 생성한
 * report 행은 클라이언트로 정리할 수 없다 — 설명에 [TEST-RLS-BASIC] 표시를
 * 남겨 실제 신고와 구분한다. mate_application은 소속 mate_post를 owner가
 * 삭제하면 FK CASCADE로 함께 정리된다.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const OWNER_EMAIL = process.env.E2E_TEST_OWNER_EMAIL;
const OWNER_PASSWORD = process.env.E2E_TEST_OWNER_PASSWORD;
const APPLICANT_EMAIL = process.env.E2E_TEST_APPLICANT_EMAIL;
const APPLICANT_PASSWORD = process.env.E2E_TEST_APPLICANT_PASSWORD;
const ADMIN_EMAIL = process.env.E2E_TEST_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.E2E_TEST_ADMIN_PASSWORD;

const hasAnonEnv = Boolean(SUPABASE_URL && ANON_KEY);
const hasRoleEnv = Boolean(
  hasAnonEnv &&
  OWNER_EMAIL &&
  OWNER_PASSWORD &&
  APPLICANT_EMAIL &&
  APPLICANT_PASSWORD,
);
const hasAdminEnv = Boolean(hasRoleEnv && ADMIN_EMAIL && ADMIN_PASSWORD);

function anonClient(): SupabaseClient {
  return createClient(SUPABASE_URL!, ANON_KEY!);
}

async function signedInClient(
  email: string,
  password: string,
): Promise<{ client: SupabaseClient; userId: string }> {
  const client = anonClient();
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) {
    throw new Error(`로그인 실패(${email}): ${error?.message}`);
  }
  return { client, userId: data.user.id };
}

describe.skipIf(!hasAnonEnv)("RLS 기본 정책 — 비회원(anon)", () => {
  it("user_block/report/mate_application은 비회원에게 항상 빈 결과다", async () => {
    const anon = anonClient();

    const { data: blocks, error: blockError } = await anon
      .from("user_block")
      .select("*");
    expect(blockError).toBeNull();
    expect(blocks).toEqual([]);

    const { data: reports, error: reportError } = await anon
      .from("report")
      .select("*");
    expect(reportError).toBeNull();
    expect(reports).toEqual([]);

    const { data: applications, error: applicationError } = await anon
      .from("mate_application")
      .select("*");
    expect(applicationError).toBeNull();
    expect(applications).toEqual([]);
  });

  it("user_profile 공개 필드는 비회원도 조회할 수 있다(공개 SELECT 정책)", async () => {
    const anon = anonClient();
    const { error } = await anon
      .from("user_profile")
      .select("user_id, nickname")
      .limit(1);
    expect(error).toBeNull();
  });
});

describe.skipIf(!hasRoleEnv)("RLS 기본 정책 — 역할별 부정 접근", () => {
  let owner: SupabaseClient;
  let ownerId: string;
  let applicant: SupabaseClient;
  let applicantId: string;
  let postId: string;

  beforeAll(async () => {
    ({ client: owner, userId: ownerId } = await signedInClient(
      OWNER_EMAIL!,
      OWNER_PASSWORD!,
    ));
    ({ client: applicant, userId: applicantId } = await signedInClient(
      APPLICANT_EMAIL!,
      APPLICANT_PASSWORD!,
    ));

    const { data: post, error } = await owner
      .from("mate_post")
      .insert({
        country_code: "TH",
        region_code: "bangkok",
        start_date: "2099-01-01",
        end_date: "2099-01-05",
        capacity: 2,
        preferences: {},
        travel_styles: [],
        title: "[TEST-RLS-BASIC] 임시 모집글",
        description: "RLS 통합 테스트용 임시 모집글입니다.",
      })
      .select("post_id")
      .single();
    if (error || !post) {
      throw new Error(`테스트용 mate_post 생성 실패: ${error?.message}`);
    }
    postId = post.post_id as string;
  });

  afterAll(async () => {
    if (postId) {
      // mate_application은 FK CASCADE로 함께 삭제된다.
      await owner.from("mate_post").delete().eq("post_id", postId);
    }
    await owner
      .from("user_block")
      .delete()
      .eq("blocker_id", ownerId)
      .eq("blocked_id", applicantId);
  });

  it("본인은 자신이 만든 user_block을 볼 수 있지만, 차단당한 상대는 볼 수 없다", async () => {
    const { error: insertError } = await owner
      .from("user_block")
      .upsert(
        { blocker_id: ownerId, blocked_id: applicantId },
        { onConflict: "blocker_id,blocked_id" },
      );
    expect(insertError).toBeNull();

    const { data: ownerView, error: ownerError } = await owner
      .from("user_block")
      .select("blocked_id")
      .eq("blocked_id", applicantId);
    expect(ownerError).toBeNull();
    expect(ownerView?.length).toBeGreaterThan(0);

    const { data: applicantView, error: applicantError } = await applicant
      .from("user_block")
      .select("blocked_id")
      .eq("blocker_id", ownerId);
    expect(applicantError).toBeNull();
    expect(applicantView).toEqual([]);
  });

  it("글 작성자와 신청자만 mate_application을 볼 수 있다", async () => {
    const { error: insertError } = await applicant
      .from("mate_application")
      .insert({
        post_id: postId,
        applicant_id: applicantId,
        message: "[TEST-RLS-BASIC] RLS 통합 테스트용 참가 신청입니다.",
      });
    expect(insertError).toBeNull();

    const { data: applicantView, error: applicantError } = await applicant
      .from("mate_application")
      .select("application_id")
      .eq("post_id", postId);
    expect(applicantError).toBeNull();
    expect(applicantView?.length).toBe(1);

    const { data: ownerView, error: ownerError } = await owner
      .from("mate_application")
      .select("application_id")
      .eq("post_id", postId);
    expect(ownerError).toBeNull();
    expect(ownerView?.length).toBe(1);

    const anon = anonClient();
    const { data: anonView, error: anonError } = await anon
      .from("mate_application")
      .select("application_id")
      .eq("post_id", postId);
    expect(anonError).toBeNull();
    expect(anonView).toEqual([]);
  });

  it("본인이 아닌 사용자는 다른 사람의 user_profile을 수정할 수 없다", async () => {
    const { data, error } = await applicant
      .from("user_profile")
      .update({ nickname: `해킹시도_${Date.now()}` })
      .eq("user_id", ownerId)
      .select();
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it("신고자 본인은 자신이 접수한 report를 볼 수 있지만, 무관한 사용자는 볼 수 없다", async () => {
    const { data: report, error: insertError } = await applicant
      .from("report")
      .insert({
        target_type: "MATE_POST",
        target_id: postId,
        reason_code: "OTHER",
        description: "[TEST-RLS-BASIC] RLS 통합 테스트용 신고입니다.",
      })
      .select("report_id")
      .single();
    expect(insertError).toBeNull();
    expect(report).toBeTruthy();

    const { data: reporterView, error: reporterError } = await applicant
      .from("report")
      .select("report_id")
      .eq("report_id", report!.report_id);
    expect(reporterError).toBeNull();
    expect(reporterView?.length).toBe(1);

    const { data: ownerView, error: ownerError } = await owner
      .from("report")
      .select("report_id")
      .eq("report_id", report!.report_id);
    expect(ownerError).toBeNull();
    expect(ownerView).toEqual([]);
  });

  describe.skipIf(!hasAdminEnv)("Moderator/Admin", () => {
    it("Moderator/Admin은 자신이 신고하지 않은 report도 볼 수 있다", async () => {
      const { client: admin } = await signedInClient(
        ADMIN_EMAIL!,
        ADMIN_PASSWORD!,
      );

      const { data: report, error: insertError } = await applicant
        .from("report")
        .insert({
          target_type: "MATE_POST",
          target_id: postId,
          reason_code: "OTHER",
          description: "[TEST-RLS-BASIC] Moderator 가시성 확인용 신고입니다.",
        })
        .select("report_id")
        .single();
      expect(insertError).toBeNull();

      const { data: adminView, error: adminError } = await admin
        .from("report")
        .select("report_id")
        .eq("report_id", report!.report_id);
      expect(adminError).toBeNull();
      expect(adminView?.length).toBe(1);
    });
  });
});
