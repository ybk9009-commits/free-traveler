# TASK-INFRA-USER-DELETE — 탈퇴 시 즉시 비식별화

- **Category:** Infra
- **Implementation Status:** IMPLEMENT(축소)
- **Requirement Ref:** REQ-FUNC-045, REQ-NF-018
- **Screen:** — (SCR-005에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE, INFRA-AUTH-SESSION
- **Expected Files:** `src/lib/account/delete.ts`
- **Functional AC:**
  - 탈퇴 요청 시 `profiles`의 닉네임·자기소개 등 공개 식별 정보를 즉시 비식별화한다.
  - 유예기간 후 배치 삭제(법적 보존 예외 처리 등)는 만들지 않는다(`docs/PROJECT_SCOPE.md` REQ-FUNC-045 처리 방법 축소 범위).
  - 개인정보 **내보내기**(다운로드) 기능은 만들지 않는다(REQ-NF-018 축소 범위 — 삭제만 구현).
- **Visual AC:** 해당 없음(탈퇴 버튼 UI는 CMP-SCR005-PROFILE에서 정의).
- **Security/Privacy AC:** 비식별화 처리 결과를 코드 리뷰로 확인한다. 배치 삭제·감사 로그는 EXCLUDED 범위(REQ-FUNC-076)와 무관하게 만들지 않는다.
- **Verify:** 코드 리뷰, 수동 확인
- **Priority:** P1
