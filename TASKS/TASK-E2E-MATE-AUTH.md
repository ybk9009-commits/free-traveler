# TASK-E2E-MATE-AUTH — 인증·동행·신고·관리자 흐름 E2E

- **Category:** Test(E2E)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-027~045, 066, 077, 041, 042
- **Screen:** SCR-003, SCR-004, SCR-005
- **Route:** `/travel-tools`, `/mates`, `/account`
- **Page Entry:** —
- **Depends On:** PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, DB-SEED-BASE
- **Expected Files:** `tests/e2e/mate-auth.spec.ts`
- **Functional AC:**
  - 회원가입·로그인·성인확인(REQ-FUNC-066, 028) → 동행글 작성(연락처 탐지 차단 케이스 포함, REQ-FUNC-031, 032) → 참가 요청(REQ-FUNC-034) → 승인/거절(REQ-FUNC-036) → 신고(REQ-FUNC-039) → 차단(REQ-FUNC-040) → 관리자 신고 처리·외부 URL 설정(REQ-FUNC-041, 042, 077)까지 하나의 연속 시나리오(또는 2~3개로 분할된 관련 시나리오)로 커버한다(`docs/PROJECT_SCOPE.md` §6).
  - Playwright(Chromium)로 실행하며 `DB-SEED-BASE` 시드 데이터를 사용한다.
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 테스트 계정은 실제 개인정보를 사용하지 않는다.
- **Verify:** CI-LINT-TYPECHECK-DATA
- **Priority:** P2
