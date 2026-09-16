# TASK-UNIT-MATE-STATE — 모집글/신청 상태 전이 Unit Test

- **Category:** Test(Unit)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038
- **Screen:** — (SCR-004/SCR-005 검증)
- **Route:** —
- **Page Entry:** —
- **Depends On:** API-MATE-POSTS, API-MATE-APPLICATIONS
- **Expected Files:** `tests/unit/mate-state.test.ts`
- **Functional AC:**
  - `mate_posts` 상태 전이(OPEN→CLOSED/HIDDEN/DELETED, 종료일 경과 시 조회 시점 CLOSED 계산 포함)를 테스트한다.
  - `mate_applications` 상태 전이(PENDING→ACCEPTED/REJECTED/WITHDRAWN)와 중복 PENDING/ACCEPTED 차단 로직을 테스트한다.
  - 비작성자의 승인/거절 시도가 거부되는지 테스트한다(REQ-FUNC-036).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** CI-LINT-TYPECHECK-DATA에서 자동 실행
- **Priority:** P1
