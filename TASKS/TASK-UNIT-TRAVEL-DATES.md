# TASK-UNIT-TRAVEL-DATES — 날짜 검증 Unit Test

- **Category:** Test(Unit)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-013, REQ-FUNC-021
- **Screen:** — (SCR-003 검증)
- **Route:** —
- **Page Entry:** —
- **Depends On:** CMP-SCR003-FLIGHT-FORM, CMP-SCR003-HOTEL-FORM
- **Expected Files:** `tests/unit/travel-dates.test.ts`
- **Functional AC:**
  - 항공: 출발일<오늘, 귀국일<출발일 케이스가 모두 차단되는지 경계값(오늘, 오늘-1, 동일일) 테스트.
  - 호텔: 체크인<오늘, 체크아웃≤체크인 케이스가 모두 차단되는지 경계값 테스트.
  - statement coverage 80% 이상, 핵심 규칙(날짜 검증) 100% 커버를 목표로 한다(`docs/02_SRS_BASELINE.md.md` §6.8.1).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** CI-LINT-TYPECHECK-DATA에서 자동 실행
- **Priority:** P1
