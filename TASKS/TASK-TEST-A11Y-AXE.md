# TASK-TEST-A11Y-AXE — axe-core 자동 접근성 검사

- **Category:** Test(A11y)
- **Implementation Status:** IMPLEMENT(축소)
- **Requirement Ref:** REQ-NF-024
- **Screen:** SCR-001~SCR-005(핵심 5화면)
- **Route:** 공통(5개 Route)
- **Page Entry:** —
- **Depends On:** PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005
- **Expected Files:** `tests/e2e/a11y.spec.ts`
- **Functional AC:** Playwright + `@axe-core/playwright`로 5개 핵심 화면(4+1)에서 serious/critical 위반 0건을 목표로 한다(REQ-NF-024, `docs/PROJECT_SCOPE.md` §4.5 축소 범위 — 핵심 화면만 대상).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** CI-LINT-TYPECHECK-DATA 또는 별도 E2E 파이프라인
- **Priority:** P2
