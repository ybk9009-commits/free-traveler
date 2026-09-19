import {
  test,
  expect,
  type Locator,
  type Page,
  type Request,
} from "@playwright/test";

function futureDateInput(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

/**
 * 국가·지역·날짜 입력값이 어떤 네트워크 요청(URL/query/body)에도 포함되지
 * 않는지 확인한다(REQ-FUNC-017, 025 핵심 검증, CLAUDE.md 규칙 12).
 */
function assertNoLeak(requests: Request[], secrets: string[]) {
  for (const request of requests) {
    const url = request.url();
    const postData = request.postData() ?? "";
    for (const secret of secrets) {
      expect(
        url,
        `요청 URL에 "${secret}"가 포함되면 안 됩니다: ${url}`,
      ).not.toContain(secret);
      expect(
        postData,
        `요청 본문에 "${secret}"가 포함되면 안 됩니다: ${url}`,
      ).not.toContain(secret);
    }
  }
}

/**
 * "지역" select는 국가 미선택 상태에서도 전체 도시 목록을 이미 보여주므로
 * (count() > 1이 처음부터 참) 국가 선택 후 그 목록이 실제로 좁혀질 때까지
 * 기다려야 한다 — 그렇지 않으면 국가 필터가 반영되기 전의 목록에서 지역을
 * 골라 국가/지역이 서로 어긋난 상태로 제출하게 된다.
 */
async function selectCountryThenRegion(panel: Locator): Promise<string> {
  const countrySelect = panel.getByLabel("국가");
  const regionSelect = panel.getByLabel("지역");

  const initialRegionCount = await regionSelect.locator("option").count();
  await expect
    .poll(() => countrySelect.locator("option").count())
    .toBeGreaterThan(1);
  await countrySelect.selectOption({ index: 1 });

  await expect
    .poll(() => regionSelect.locator("option").count())
    .toBeLessThan(initialRegionCount);
  await regionSelect.selectOption({ index: 1 });

  return regionSelect.evaluate(
    (el: HTMLSelectElement) => el.options[el.selectedIndex]?.text ?? "",
  );
}

/**
 * `FLIGHT_OUTBOUND_URL`/`HOTEL_OUTBOUND_URL`이 설정되어 있으면 외부 이동
 * 링크(새 탭, query 없음, `noopener,noreferrer`)를 검증하고, 설정되어 있지
 * 않으면(관리자 미설정 상태, `AdminConsole`에서 설정하는 값) 컴포넌트의
 * 정식 대체 UI("외부 이동 주소가 아직 설정되지 않았습니다")를 검증한다 —
 * 둘 다 애플리케이션이 의도적으로 지원하는 상태이며, 어느 쪽이든 이 Task의
 * 핵심 목적인 "입력값 비전달"과는 무관하다.
 */
async function assertOutboundLinkOrFallback(
  page: Page,
  panel: Locator,
  secrets: string[],
) {
  const outboundLink = panel.getByRole("link", { name: /보러 가기/ });
  if ((await outboundLink.count()) > 0) {
    await expect(outboundLink).toHaveAttribute("target", "_blank");
    await expect(outboundLink).toHaveAttribute("rel", /noopener/);
    await expect(outboundLink).toHaveAttribute("rel", /noreferrer/);
    const href = await outboundLink.getAttribute("href");
    expect(href).toMatch(/^https:\/\//);
    expect(href).not.toContain("?");
    for (const secret of secrets) {
      expect(href).not.toContain(secret);
    }

    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      outboundLink.click(),
    ]);
    expect(popup.url()).toBe(href);
    await popup.close();
    return;
  }

  await expect(
    panel.getByText("외부 이동 주소가 아직 설정되지 않았습니다."),
  ).toBeVisible();
}

test.describe("travel tools flows", () => {
  test("REQ-FUNC-011~017 항공 입력→요약→외부 이동, 입력값 비전달 확인", async ({
    page,
  }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "항공편" }).click();
    const panel = page.getByRole("tabpanel");

    const requests: Request[] = [];
    page.on("request", (request) => requests.push(request));

    const regionName = await selectCountryThenRegion(panel);

    const startDate = futureDateInput(40);
    const endDate = futureDateInput(45);
    await panel.getByLabel("출발일").fill(startDate);
    await panel.getByLabel("귀국일").fill(endDate);
    await panel.getByRole("button", { name: "요약 보기" }).click();

    await expect(panel.getByText("입력 요약")).toBeVisible();
    await expect(panel.getByText(regionName)).toBeVisible();
    assertNoLeak(requests, [regionName, startDate, endDate]);

    await assertOutboundLinkOrFallback(page, panel, [startDate, endDate]);
  });

  test("REQ-FUNC-018~025/054 숙소 입력→검증 오류→요약→외부 이동, 입력값 비전달 확인", async ({
    page,
  }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "숙소" }).click();
    const panel = page.getByRole("tabpanel");

    const regionName = await selectCountryThenRegion(panel);

    // 체크인=체크아웃(같은 날짜)은 <input min>은 통과하지만(REQ-FUNC-019) JS
    // 검증("체크아웃은 체크인보다 늦어야 합니다")이 막는다.
    const sameDay = futureDateInput(40);
    await panel.getByLabel("체크인").fill(sameDay);
    await panel.getByLabel("체크아웃").fill(sameDay);
    await panel.getByRole("button", { name: "요약 보기" }).click();
    await expect(panel.getByRole("alert")).toContainText(
      "체크아웃은 체크인보다 늦어야 합니다",
    );

    const requests: Request[] = [];
    page.on("request", (request) => requests.push(request));

    const checkIn = futureDateInput(40);
    const checkOut = futureDateInput(43);
    await panel.getByLabel("체크아웃").fill(checkOut);
    await panel.getByRole("button", { name: "요약 보기" }).click();

    await expect(panel.getByText("입력 요약")).toBeVisible();
    await expect(panel.getByText(regionName)).toBeVisible();
    assertNoLeak(requests, [regionName, checkIn, checkOut]);

    await assertOutboundLinkOrFallback(page, panel, [checkIn, checkOut]);
  });
});
