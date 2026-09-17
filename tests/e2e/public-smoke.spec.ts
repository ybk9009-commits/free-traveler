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
});
