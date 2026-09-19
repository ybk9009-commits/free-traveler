import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { computeEffectiveStatus } from "@/app/api/mates/[id]/route";
import { isDecidableStatus } from "@/app/api/applications/[id]/route";

/**
 * TEST-UNIT-MATE-STATE — REQ-FUNC-035/036/037/038. `computeEffectiveStatus`/
 * `isDecidableStatus`는 API-MATE-POSTS/API-MATE-APPLICATIONS의 순수 함수라
 * 직접 import해 검증한다(이번 Task에서 export로 전환, 동작 변경 없음).
 * 중복 신청 차단(REQ-FUNC-035)과 비작성자 승인/거절 거부(REQ-FUNC-036)는 DB
 * unique 제약·RLS로 강제되는 로직이라 순수 함수로 분리되어 있지 않다 —
 * tests/integration/rls.test.ts와 같은 방식(env-gated, 실제 Supabase 프로젝트
 * 직접 호출)으로 검증한다.
 */
function futureDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

function pastDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

describe("computeEffectiveStatus — REQ-FUNC-037(축소)", () => {
  it("OPEN이고 종료일이 미래면 그대로 OPEN이다", () => {
    expect(computeEffectiveStatus("OPEN", futureDate(5))).toBe("OPEN");
  });

  it("OPEN이고 종료일이 지났으면 조회 시점에 CLOSED로 계산된다", () => {
    expect(computeEffectiveStatus("OPEN", pastDate(1))).toBe("CLOSED");
  });

  it.each(["CLOSED", "HIDDEN", "DELETED"])(
    "%s 상태는 종료일이 지나도 그대로 유지된다(OPEN만 재계산)",
    (status) => {
      expect(computeEffectiveStatus(status, pastDate(30))).toBe(status);
    },
  );
});

describe("isDecidableStatus — REQ-FUNC-036 유효 상태값", () => {
  it.each(["ACCEPTED", "REJECTED"])("%s는 유효한 결정 상태다", (value) => {
    expect(isDecidableStatus(value)).toBe(true);
  });

  it.each(["PENDING", "WITHDRAWN", "accepted", "", null, undefined, 123])(
    "%s는 유효하지 않다",
    (value) => {
      expect(isDecidableStatus(value)).toBe(false);
    },
  );
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const OWNER_EMAIL = process.env.E2E_TEST_OWNER_EMAIL;
const OWNER_PASSWORD = process.env.E2E_TEST_OWNER_PASSWORD;
const APPLICANT_EMAIL = process.env.E2E_TEST_APPLICANT_EMAIL;
const APPLICANT_PASSWORD = process.env.E2E_TEST_APPLICANT_PASSWORD;

const hasRoleEnv = Boolean(
  SUPABASE_URL &&
  ANON_KEY &&
  OWNER_EMAIL &&
  OWNER_PASSWORD &&
  APPLICANT_EMAIL &&
  APPLICANT_PASSWORD,
);

async function signedInClient(
  email: string,
  password: string,
): Promise<{ client: SupabaseClient; userId: string }> {
  const client = createClient(SUPABASE_URL!, ANON_KEY!);
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) {
    throw new Error(`로그인 실패(${email}): ${error?.message}`);
  }
  return { client, userId: data.user.id };
}

describe.skipIf(!hasRoleEnv)(
  "MATE_APPLICATION 상태 규칙 — DB 제약/RLS(REQ-FUNC-035/036)",
  () => {
    let owner: SupabaseClient;
    let applicant: SupabaseClient;
    let applicantId: string;
    let postId: string;

    beforeAll(async () => {
      ({ client: owner } = await signedInClient(OWNER_EMAIL!, OWNER_PASSWORD!));
      ({ client: applicant, userId: applicantId } = await signedInClient(
        APPLICANT_EMAIL!,
        APPLICANT_PASSWORD!,
      ));

      const { data: post, error } = await owner
        .from("mate_post")
        .insert({
          country_code: "TH",
          region_code: "bangkok",
          start_date: futureDate(30),
          end_date: futureDate(35),
          capacity: 2,
          preferences: {},
          travel_styles: [],
          title: "[TEST-UNIT-MATE-STATE] 임시 모집글",
          description: "상태 전이 테스트용 임시 모집글입니다.",
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
        await owner.from("mate_post").delete().eq("post_id", postId);
      }
    });

    it("같은 신청자가 같은 글에 PENDING 상태로 중복 신청하면 DB unique 제약이 막는다(REQ-FUNC-035)", async () => {
      const first = await applicant.from("mate_application").insert({
        post_id: postId,
        applicant_id: applicantId,
        message: "[TEST-UNIT-MATE-STATE] 첫 번째 신청입니다.",
      });
      expect(first.error).toBeNull();

      const second = await applicant.from("mate_application").insert({
        post_id: postId,
        applicant_id: applicantId,
        message: "[TEST-UNIT-MATE-STATE] 중복 신청 시도입니다.",
      });
      expect(second.error).not.toBeNull();
      expect(second.error?.code).toBe("23505");
    });

    it("글 작성자가 아닌 사용자는 신청 상태를 승인/거절로 바꿀 수 없다(REQ-FUNC-036)", async () => {
      const { data: application, error: fetchError } = await owner
        .from("mate_application")
        .select("application_id")
        .eq("post_id", postId)
        .eq("applicant_id", applicantId)
        .single();
      expect(fetchError).toBeNull();

      const { data, error } = await applicant
        .from("mate_application")
        .update({ status: "ACCEPTED" })
        .eq("application_id", application!.application_id)
        .select();
      expect(error).toBeNull();
      expect(data).toEqual([]);
    });
  },
);
