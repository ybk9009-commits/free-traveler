# TASK-TEST-DATA-VALIDATION — 정적 데이터 완전성·수량 검증 스크립트

- **Category:** Test(Data Validation)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-008, REQ-FUNC-046, REQ-FUNC-074, REQ-NF-026, REQ-NF-027, REQ-NF-028(축소)
- **Screen:** — (SCR-001/002 데이터 검증)
- **Route:** —
- **Page Entry:** —
- **Depends On:** DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE
- **Expected Files:** `scripts/validate_content.ts`
- **Functional AC:**
  - 국내 10개 이상, 해외 15개국 30개 도시 이상 검증(REQ-FUNC-008).
  - 모든 해외 국가에 안전정보 1:1 매핑 검증(REQ-FUNC-046).
  - 여행지 필수 필드(명소 5+, 음식 3+, 에티켓 3+, 출처 1+), 안전정보 8개 카테고리 존재 검증(REQ-NF-026, 027).
  - 게시 전 완전성 게이트: 누락 목록을 반환하고, 미충족 시 CI를 실패시킨다(REQ-FUNC-074).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** CI-LINT-TYPECHECK-DATA에서 실행
- **Priority:** P1
