# TASK-E2E-PUBLIC-SMOKE — 공개 흐름 E2E(여행지·안전정보·대표소개)

- **Category:** Test(E2E)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-001~010, 047~054, 057~063, 064, 065, 067, 069, 070
- **Screen:** SCR-001, SCR-002
- **Route:** `/`, `/about`
- **Page Entry:** —
- **Depends On:** PAGE-SCR001, PAGE-SCR002
- **Expected Files:** `tests/e2e/public-smoke.spec.ts`
- **Functional AC:**
  - 여행지 탐색·필터·빈 결과(REQ-FUNC-001,002,005), 여행지 상세→안전정보 연결(REQ-FUNC-006), 안전정보 열람 및 stale 경고(REQ-FUNC-050), 대표 소개 열람(REQ-FUNC-057~063)을 각 1개 이상 시나리오로 커버한다(`docs/PROJECT_SCOPE.md` §6 핵심 흐름).
  - Playwright(Chromium)로 실행한다.
- **Visual AC:** 해당 없음(테스트 스펙).
- **Security/Privacy AC:** 해당 없음.
- **Verify:** CI-LINT-TYPECHECK-DATA
- **Priority:** P2
