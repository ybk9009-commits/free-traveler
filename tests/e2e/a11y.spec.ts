import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { Result } from "axe-core";

const CORE_SCREENS = [
  { screen: "SCR-001", path: "/" },
  { screen: "SCR-002", path: "/about" },
  { screen: "SCR-003", path: "/travel-tools" },
  { screen: "SCR-004", path: "/mates" },
  { screen: "SCR-005", path: "/account" },
] as const;

/**
 * 알려졌지만 브랜드 색상 결정 사항이라 지금 바꾸지 않기로 한 위반만 정확히
 * 제외한다(그 외 color-contrast 위반은 그대로 실패로 잡는다). `{colors.primary}`
 * #F4623A(hover #D94F2B)는 흰 배경 위 텍스트로도, 흰 텍스트 아래 배경으로도
 * 3.15:1로 WCAG AA(4.5:1) 미달이지만, 이 색은 디자인 철학에 명시된 "Airbnb와
 * 구별되는 유일한 브랜드 액센트 컬러"라 값을 바꾸는 것은 이 Task(테스트 작성)
 * 범위를 넘는 브랜드 의사결정이다 — 사용자가 색은 유지하고 이 사실만 기록해
 * 두기로 결정했다(2026-09-19, D-001/DESIGN.md amendments에도 미기록 — primary는
 * muted와 달리 값을 바꾸지 않기로 했으므로).
 */
const KNOWN_BRAND_COLORS = ["#f4623a", "#d94f2b"];

function isKnownBrandColorNode(
  violationId: string,
  node: Result["nodes"][number],
): boolean {
  if (violationId !== "color-contrast") return false;
  return node.any.some((check) => {
    const data = check.data as { bgColor?: string; fgColor?: string } | null;
    const bg = data?.bgColor?.toLowerCase();
    const fg = data?.fgColor?.toLowerCase();
    return (
      (bg && KNOWN_BRAND_COLORS.includes(bg)) ||
      (fg && KNOWN_BRAND_COLORS.includes(fg))
    );
  });
}

/**
 * TEST-A11Y-AXE — REQ-NF-024. 축소 범위(docs/PROJECT_SCOPE.md §4.5)에 따라
 * 핵심 5화면의 기본 로드 상태만 대상으로 하며, 위 브랜드 컬러 예외를 제외한
 * serious/critical 위반 0건을 목표로 한다(minor/moderate는 이 Task 범위 밖).
 */
test.describe("axe accessibility smoke", () => {
  for (const { screen, path } of CORE_SCREENS) {
    test(`${screen} ${path} — serious/critical 위반 0건`, async ({ page }) => {
      await page.goto(path);

      const results = await new AxeBuilder({ page }).analyze();
      const seriousOrCritical = results.violations
        .filter(
          (violation) =>
            violation.impact === "serious" || violation.impact === "critical",
        )
        .map((violation) => ({
          ...violation,
          nodes: violation.nodes.filter(
            (node) => !isKnownBrandColorNode(violation.id, node),
          ),
        }))
        .filter((violation) => violation.nodes.length > 0);

      const summary = seriousOrCritical
        .map(
          (violation) =>
            `[${violation.impact}] ${violation.id}: ${violation.help} (${violation.nodes.length}건)`,
        )
        .join("\n");

      expect(seriousOrCritical, summary).toEqual([]);
    });
  }
});
