import { test, expect, type Page } from "@playwright/test";

const TEST_EMAIL = process.env.E2E_TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.E2E_TEST_USER_PASSWORD;

// E2E_TEST_USER_EMAIL/E2E_TEST_USER_PASSWORD가 없으면 이 파일 전체를 skip한다(시드된 테스트 계정 전제).
test.skip(
  !TEST_EMAIL || !TEST_PASSWORD,
  "E2E_TEST_USER_EMAIL/E2E_TEST_USER_PASSWORD 환경변수가 없어 인증 Smoke를 건너뜀",
);

async function login(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto("/account");
  await page.getByRole("tab", { name: "로그인" }).click();
  await page.getByLabel("이메일").fill(email);
  await page.getByLabel("비밀번호").fill(password);
  await page.getByRole("button", { name: "로그인" }).click();
}

test.describe("auth smoke", () => {
  test("E2E-006 로그인 사용자의 동행글 작성과 목록·상세 확인", async ({
    page,
  }) => {
    await login(page, TEST_EMAIL!, TEST_PASSWORD!);

    const title = `E2E-006 테스트 모집글 ${Date.now()}`;

    await test.step("동행 구하기 탭에서 모집글 작성", async () => {
      await page.goto("/travel-tools");
      await page.getByRole("tab", { name: "동행 구하기" }).click();
      const panel = page.getByRole("tabpanel");

      await panel.getByLabel("제목").fill(title);
      await panel.getByRole("checkbox", { name: /안전수칙/ }).check();
      await panel.getByTestId("mate-write-submit").click();

      await expect(page).toHaveURL(/\/mates\//);
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    });

    await test.step("/mates 목록·상세에서 작성한 글 확인", async () => {
      await page.goto("/mates");
      await page.getByText(title).first().click();
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    });
  });

  test("E2E-007 동행글 신청과 계정 화면의 내 활동 확인", async ({ page }) => {
    await login(page, TEST_EMAIL!, TEST_PASSWORD!);

    await test.step("동행 목록에서 글을 골라 참가 신청", async () => {
      await page.goto("/mates");
      await page.getByTestId("mate-card").first().click();

      await page
        .getByTestId("mate-apply-message")
        .fill("Playwright 스모크 테스트 참가 신청입니다.");
      await page.getByTestId("mate-apply-submit").click();

      await expect(page.getByText(/신청.*완료|참가 신청이 접수/)).toBeVisible();
    });

    await test.step("계정 > 내 활동에서 보낸 신청 확인", async () => {
      await page.goto("/account");
      await page.getByRole("tab", { name: "내 활동" }).click();

      await expect(
        page.getByRole("heading", { name: "내가 보낸 참가 신청" }),
      ).toBeVisible();
    });
  });
});
