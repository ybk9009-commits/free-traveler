import { test, expect, type Page } from "@playwright/test";

// 사전에 수동으로 이메일 확인을 마친(성인확인 여부는 무관, 테스트가 처리한다)
// 테스트 전용 계정 2개(작성자·신청자) + Moderator/Admin role이 설정된 계정 1개가
// 필요하다. 실제 개인정보를 사용하지 않으며, 값이 없으면 관련 시나리오만
// 건너뛴다(auth-smoke.spec.ts와 동일한 패턴).
const OWNER_EMAIL = process.env.E2E_TEST_OWNER_EMAIL;
const OWNER_PASSWORD = process.env.E2E_TEST_OWNER_PASSWORD;
const APPLICANT_EMAIL = process.env.E2E_TEST_APPLICANT_EMAIL;
const APPLICANT_PASSWORD = process.env.E2E_TEST_APPLICANT_PASSWORD;
const ADMIN_EMAIL = process.env.E2E_TEST_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.E2E_TEST_ADMIN_PASSWORD;

// 회원가입 실제 제출(REQ-FUNC-066)은 대상 Supabase 프로젝트의 Auth 설정
// (가입 허용 여부·Redirect URL 허용목록)에 의존하므로, 로그인 흐름과 동일하게
// 테스트 계정 환경변수가 없으면 파일 전체를 skip한다(실제 이메일 수신함
// 확인은 PROJECT_SCOPE §8 "외부 이메일 사업자 연동" 제외 범위라 자동화하지
// 않는다 — 폼 제출 자체의 성공 상태 표시만 검증한다).
test.skip(
  !OWNER_EMAIL || !OWNER_PASSWORD || !APPLICANT_EMAIL || !APPLICANT_PASSWORD,
  "E2E_TEST_OWNER_*/E2E_TEST_APPLICANT_* 환경변수가 없어 동행 흐름 E2E를 건너뜀",
);

async function login(page: Page, email: string, password: string) {
  await page.goto("/account");
  await page.getByRole("tab", { name: "로그인" }).click();
  await page.getByLabel("이메일").fill(email);
  await page.getByLabel("비밀번호").fill(password);
  await page.getByRole("button", { name: "로그인" }).click();
  await page.waitForURL("/account");
}

async function ensureAdultVerified(page: Page) {
  await page.goto("/account?section=profile");
  const verifyButton = page.getByRole("button", {
    name: "만 19세 이상입니다",
  });
  if (await verifyButton.isVisible().catch(() => false)) {
    await verifyButton.click();
    await expect(page.getByText("성인 확인 완료")).toBeVisible();
  }
}

function todayPlusDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

test.describe("mate auth flow", () => {
  test("REQ-FUNC-066/028 회원가입 폼 제출 시 가입 확인 안내가 표시된다", async ({
    page,
  }) => {
    await page.goto("/account");
    await page.getByRole("tab", { name: "회원가입" }).click();
    await page
      .getByLabel("이메일")
      .fill(`e2e-signup-${Date.now()}@example.test`);
    await page.getByLabel("비밀번호").fill("Password1234!");
    await page.getByRole("button", { name: "회원가입" }).click();
    await expect(page.getByText(/가입 확인 이메일을 보냈습니다/)).toBeVisible();
  });

  test(
    "REQ-FUNC-028/031/032/034/036/039/040 성인확인→작성(연락처 차단 포함)" +
      "→참가 신청→승인→신고→차단",
    async ({ browser }) => {
      const ownerContext = await browser.newContext();
      const ownerPage = await ownerContext.newPage();
      const applicantContext = await browser.newContext();
      const applicantPage = await applicantContext.newPage();

      try {
        await login(ownerPage, OWNER_EMAIL!, OWNER_PASSWORD!);
        await ensureAdultVerified(ownerPage);

        const title = `E2E 동행 모집 ${Date.now()}`;

        await test.step("연락처 노출 시 등록이 차단된다(REQ-FUNC-032)", async () => {
          await ownerPage.goto("/travel-tools?tab=mate");
          await ownerPage.getByLabel("제목").fill(title);
          await ownerPage.getByLabel("국가").selectOption({ index: 1 });
          await ownerPage.getByLabel("시작일").fill(todayPlusDays(30));
          await ownerPage.getByLabel("종료일").fill(todayPlusDays(35));
          await ownerPage
            .getByLabel("선호 조건")
            .fill("나이 무관, 배낭여행 좋아하는 분");
          await ownerPage
            .getByLabel("설명")
            .fill("연락은 test-contact@example.com 으로 주세요.");
          await ownerPage.getByRole("checkbox", { name: /안전수칙/ }).check();
          await ownerPage
            .getByRole("button", { name: "동행 모집글 등록" })
            .click();

          await expect(ownerPage.getByRole("alert")).toContainText(
            "등록할 수 없습니다",
          );
          await expect(ownerPage).toHaveURL(/\/travel-tools/);
        });

        let postId = "";

        await test.step("연락처를 제거하면 정상 등록된다(REQ-FUNC-031)", async () => {
          await ownerPage
            .getByLabel("설명")
            .fill("함께 여행할 동행을 구합니다. 편하게 신청해 주세요.");

          const [response] = await Promise.all([
            ownerPage.waitForResponse(
              (res) =>
                res.url().includes("/api/mates") &&
                res.request().method() === "POST",
            ),
            ownerPage.getByRole("button", { name: "동행 모집글 등록" }).click(),
          ]);

          expect(response.ok()).toBe(true);
          const body = (await response.json()) as { postId: string };
          postId = body.postId;
          expect(postId).toBeTruthy();
          await expect(ownerPage).toHaveURL("/mates");
        });

        await test.step("신청자가 참가를 신청한다(REQ-FUNC-034)", async () => {
          await login(applicantPage, APPLICANT_EMAIL!, APPLICANT_PASSWORD!);
          await ensureAdultVerified(applicantPage);

          await applicantPage.goto(`/mates?post=${postId}`);
          await expect(
            applicantPage.getByRole("heading", { name: title }),
          ).toBeVisible();

          await applicantPage
            .getByLabel("신청 메시지")
            .fill("Playwright E2E 참가 신청입니다.");
          await applicantPage
            .getByRole("button", { name: "참가 신청 보내기" })
            .click();
          await expect(
            applicantPage.getByText(/참가 신청을 보냈습니다/),
          ).toBeVisible();
        });

        await test.step("작성자가 신청을 승인한다(REQ-FUNC-036)", async () => {
          await ownerPage.goto("/account?section=activity");
          await ownerPage
            .getByRole("button", { name: "받은 참가 요청" })
            .click();
          await expect(ownerPage.getByText(title)).toBeVisible();
          await ownerPage.getByRole("button", { name: "승인" }).first().click();
          await expect(ownerPage.getByText("ACCEPTED")).toBeVisible();
        });

        await test.step("신청자가 글을 신고한다(REQ-FUNC-039)", async () => {
          await applicantPage.goto(`/mates?post=${postId}`);
          await applicantPage.getByRole("button", { name: "신고하기" }).click();
          await applicantPage.getByLabel("신고 사유").selectOption("SPAM");
          await applicantPage
            .getByRole("button", { name: "신고 제출" })
            .click();
          await expect(
            applicantPage.getByText("신고가 접수되었습니다."),
          ).toBeVisible();
        });

        await test.step("신청자가 작성자를 차단한다(REQ-FUNC-040)", async () => {
          await applicantPage
            .getByRole("button", { name: "작성자 차단" })
            .click();
          await applicantPage.getByRole("button", { name: "차단하기" }).click();
          await expect(
            applicantPage.getByText(/작성자를 차단했습니다/),
          ).toBeVisible();

          await applicantPage.goto("/account?section=activity");
          await applicantPage
            .getByRole("button", { name: "차단 목록" })
            .click();
          await expect(applicantPage.getByText("차단 해제")).toBeVisible();
        });
      } finally {
        await ownerContext.close();
        await applicantContext.close();
      }
    },
  );

  test("REQ-FUNC-041/042/077 관리자 신고 큐 처리와 외부 URL 설정", async ({
    page,
  }) => {
    test.skip(
      !ADMIN_EMAIL || !ADMIN_PASSWORD,
      "E2E_TEST_ADMIN_* 환경변수가 없어 관리자 E2E를 건너뜀",
    );

    await login(page, ADMIN_EMAIL!, ADMIN_PASSWORD!);
    await page.goto("/account?section=admin");
    await expect(
      page.getByRole("heading", { name: "관리자 콘솔" }),
    ).toBeVisible();

    const resolveButton = page
      .getByRole("button", { name: "처리 완료" })
      .first();
    if (await resolveButton.isVisible().catch(() => false)) {
      await resolveButton.click();
    }

    await page.getByLabel("항공 외부 URL").fill("https://example.test/flight");
    await page.getByLabel("숙소 외부 URL").fill("https://example.test/hotel");
    await page.getByRole("button", { name: "설정 저장" }).click();
    await expect(page.getByText("저장되었습니다.")).toBeVisible();
  });
});
