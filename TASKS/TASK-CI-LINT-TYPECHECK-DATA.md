# TASK-CI-LINT-TYPECHECK-DATA — Lint·Typecheck·데이터검증 CI 게이트

- **Category:** CI
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-NF-031
- **Screen:** —
- **Route:** —
- **Page Entry:** —
- **Depends On:** TEST-DATA-VALIDATION, UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION, UNIT-MATE-STATE
- **Expected Files:** `.github/workflows/ci.yml`(또는 동등 CI 설정)
- **Functional AC:**
  - `tsc --noEmit`, ESLint, `scripts/validate_content.ts`(TEST-DATA-VALIDATION), Unit Test 3종을 main 병합 전 게이트로 실행한다(REQ-NF-031).
  - Playwright E2E/axe는 별도 워크플로(또는 동일 워크플로의 후속 Job)로 실행하되 병합 필수 게이트 여부는 팀 결정에 맡긴다(Lighthouse CI 게이트는 REQ-NF-007 EXCLUDED이므로 포함하지 않는다).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** CI 로그에 `.env` 값·서비스 롤 키를 출력하지 않는다.
- **Verify:** 실제 PR에서 워크플로 성공 확인
- **Priority:** P1
