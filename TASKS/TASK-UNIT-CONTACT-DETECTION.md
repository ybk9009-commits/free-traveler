# TASK-UNIT-CONTACT-DETECTION — 연락처 탐지 Unit Test

- **Category:** Test(Unit)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-032
- **Screen:** — (SCR-003 검증)
- **Route:** —
- **Page Entry:** —
- **Depends On:** INFRA-CONTACT-DETECTION
- **Expected Files:** `tests/unit/contact-detection.test.ts`
- **Functional AC:**
  - 기준 테스트셋(전화번호/이메일/카카오톡·텔레그램 ID 패턴 + 정상 문장 오탐 케이스)으로 탐지율 95% 이상, 오탐률 5% 이하를 검증한다(REQ-FUNC-032 AC).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 테스트 픽스처에 실제 개인 연락처를 사용하지 않는다(가짜 패턴만).
- **Verify:** CI-LINT-TYPECHECK-DATA에서 자동 실행
- **Priority:** P1
