import { test, expect, type Locator } from "@playwright/test";

// data-testid 계약: destination-card(카드), domestic-destinations/overseas-destinations(섹션) — SCREEN_ROUTE_CONTRACT.json sections 값 재사용
function futureDateInput(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

async function selectFirstOption(select: Locator): Promise<void> {
  await expect.poll(() => select.locator("option").count()).toBeGreaterThan(1);
  await select.selectOption({ index: 1 });
}

test.describe("public smoke", () => {
  test("E2E-001 메인 페이지의 추천 여행지와 주요 CTA", async ({ page }) => {
    await page.goto("/");

    const domestic = page.getByTestId("domestic-destinations");
    const overseas = page.getByTestId("overseas-destinations");
    await expect(domestic).toBeVisible();
    await expect(overseas).toBeVisible();
    await expect
      .poll(() => domestic.getByTestId("destination-card").count())
      .toBeGreaterThanOrEqual(6);
    await expect
      .poll(() => overseas.getByTestId("destination-card").count())
      .toBeGreaterThanOrEqual(6);

    const travelToolsCta = page.getByRole("link", {
      name: "항공·숙소 준비하기",
    });
    await expect(travelToolsCta).toHaveAttribute("href", "/travel-tools");

    const aboutCta = page.getByRole("link", { name: "대표 소개 더 보기" });
    await expect(aboutCta).toHaveAttribute("href", "/about");

    const mateListCta = page.getByRole("link", { name: "전체 동행 보기" });
    const mateEmptyCta = page.getByRole("link", { name: "동행 글 작성하기" });
    if ((await mateListCta.count()) > 0) {
      await expect(mateListCta).toHaveAttribute("href", "/mates");
    } else {
      await expect(mateEmptyCta).toHaveAttribute("href", "/travel-tools");
    }

    await travelToolsCta.click();
    await expect(page).toHaveURL(/\/travel-tools$/);
  });

  test("E2E-002 대표 소개의 free_traveler, 50회 이상, 30개국 이상", async ({
    page,
  }) => {
    await page.goto("/about");

    await expect(page.getByText("free_traveler").first()).toBeVisible();
    await expect(page.getByText(/50\+/).first()).toBeVisible();
    await expect(page.getByText(/30\+/).first()).toBeVisible();
  });

  test("E2E-003 여행 도구의 항공 외부 이동 안내와 href", async ({ page }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "항공편" }).click();
    const panel = page.getByRole("tabpanel");

    await selectFirstOption(panel.getByLabel("국가"));
    await selectFirstOption(panel.getByLabel("지역"));
    await panel.getByLabel("출발일").fill(futureDateInput(30));
    await panel.getByLabel("귀국일").fill(futureDateInput(35));

    await expect(
      panel.getByText("입력값은 외부 사이트로 전달되지 않습니다"),
    ).toBeVisible();

    const outboundLink = panel.getByRole("link", { name: /보러 가기/ });
    await expect(outboundLink).toBeVisible();
    await expect(outboundLink).toHaveAttribute("target", "_blank");
    await expect(outboundLink).toHaveAttribute("rel", /noopener/);
    await expect(outboundLink).toHaveAttribute("rel", /noreferrer/);

    const href = await outboundLink.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(/^https:\/\//);
    expect(href).not.toContain("?");
  });

  test("E2E-004 여행 도구의 숙소 외부 이동 안내와 href", async ({ page }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "숙소" }).click();
    const panel = page.getByRole("tabpanel");

    await selectFirstOption(panel.getByLabel("국가"));
    await selectFirstOption(panel.getByLabel("지역"));
    await panel.getByLabel("체크인").fill(futureDateInput(30));
    await panel.getByLabel("체크아웃").fill(futureDateInput(33));

    await expect(
      panel.getByText("입력값은 외부 사이트로 전달되지 않습니다"),
    ).toBeVisible();

    const outboundLink = panel.getByRole("link", { name: /보러 가기/ });
    await expect(outboundLink).toBeVisible();
    await expect(outboundLink).toHaveAttribute("target", "_blank");
    await expect(outboundLink).toHaveAttribute("rel", /noopener/);
    await expect(outboundLink).toHaveAttribute("rel", /noreferrer/);

    const href = await outboundLink.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(/^https:\/\//);
    expect(href).not.toContain("?");
  });

  test("E2E-005 비로그인 동행글 작성의 로그인 안내", async ({ page }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "동행 구하기" }).click();
    const panel = page.getByRole("tabpanel");

    await expect(panel.getByText(/로그인/).first()).toBeVisible();

    const loginCta = panel.getByRole("link", { name: "로그인/가입하기" });
    await expect(loginCta).toHaveAttribute("href", "/account");
  });

  test("E2E-008 여행지 필터와 빈 결과 안내", async ({ page }) => {
    await page.goto("/");
    const domestic = page.getByTestId("domestic-destinations");
    await expect(
      domestic.getByTestId("destination-card").first(),
    ).toBeVisible();

    // 테마 필터는 URL 쿼리로 직렬화된다(REQ-FUNC-002, REQ-FUNC-010).
    await page.getByRole("button", { name: "해변·휴양" }).click();
    await expect(page).toHaveURL(/theme=beach/);
    await page.getByRole("button", { name: "필터 초기화" }).first().click();
    await expect(page).toHaveURL("/");

    // 존재하지 않는 국가로 필터링하면 빈 결과 안내가 뜬다(REQ-FUNC-005).
    await page.goto(`/?country=${encodeURIComponent("존재하지않는나라")}`);
    await expect(
      page.getByText("조건에 맞는 국내 여행지가 없어요."),
    ).toBeVisible();
    await expect(
      page.getByText("조건에 맞는 해외 여행지가 없어요."),
    ).toBeVisible();
    await page.getByRole("button", { name: "필터 초기화" }).first().click();
    await expect(page).toHaveURL("/");
  });

  test("E2E-009 여행지 상세에서 안전정보로 이동하고 stale 고지를 확인한다", async ({
    page,
  }) => {
    await page.goto("/?destination=jp-tokyo");
    const drawer = page.getByRole("dialog", { name: "도쿄" });
    await expect(drawer).toBeVisible();

    // 해외 여행지 상세 → 안전정보 섹션 연결(REQ-FUNC-006).
    await drawer.getByRole("button", { name: "이 나라 안전정보 보기" }).click();
    await expect(drawer).toBeHidden();
    await expect(
      page.getByRole("heading", { name: "국가별 안전정보" }),
    ).toBeInViewport();

    await page.getByRole("button", { name: /^일본/ }).click();
    const safetyDialog = page.getByRole("dialog", { name: "일본 안전정보" });
    await expect(safetyDialog).toBeVisible();

    // 안전정보 재확인 고지는 항상 고정 표시된다(REQ-FUNC-054).
    await expect(
      safetyDialog.getByText(
        "이 정보는 공식 판단을 대체하지 않습니다. 출국 전 공식 출처 재확인이 필요합니다.",
      ),
    ).toBeVisible();

    // stale 배지는 verifiedAt 기준 7일 초과 여부로 렌더링 시점에 계산된다
    // (REQ-FUNC-050) — 고정 날짜를 가정하지 않고 실제 경과 여부를 그대로 검증한다.
    const verifiedText = await safetyDialog
      .getByText(/최종 확인일/)
      .textContent();
    const match = verifiedText?.match(/최종 확인일 (\d{4}-\d{2}-\d{2})/);
    expect(match).toBeTruthy();
    const verifiedAtMs = new Date(match![1]).getTime();
    const isStale = Date.now() - verifiedAtMs > 7 * 24 * 60 * 60 * 1000;
    const staleBadge = safetyDialog.getByText("최신 확인 필요");
    if (isStale) {
      await expect(staleBadge).toBeVisible();
    } else {
      await expect(staleBadge).toHaveCount(0);
    }
  });
});
