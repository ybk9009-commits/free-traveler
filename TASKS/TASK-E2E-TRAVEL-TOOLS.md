# TASK-E2E-TRAVEL-TOOLS — 항공·호텔 흐름 E2E

- **Category:** Test(E2E)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-011~026, 054
- **Screen:** SCR-003
- **Route:** `/travel-tools`
- **Page Entry:** —
- **Depends On:** PAGE-SCR003
- **Expected Files:** `tests/e2e/travel-tools.spec.ts`
- **Functional AC:**
  - 항공 입력→검증 오류→요약→외부 이동(새 탭, query 없음, `noopener,noreferrer` 속성 확인) 시나리오.
  - 호텔 동일 시나리오.
  - **입력값이 네트워크 요청(XHR/fetch)이나 URL query에 포함되지 않는지 네트워크 탭 assertion으로 확인한다**(REQ-FUNC-017, 025 핵심 검증).
  - Playwright(Chromium)로 실행한다.
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 이 Task의 핵심 목적이 개인정보 비전달 검증이다.
- **Verify:** CI-LINT-TYPECHECK-DATA
- **Priority:** P2
