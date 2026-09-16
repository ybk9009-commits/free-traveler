# TASK-TEST-RLS-BASIC — RLS 정책 기본 Integration Test

- **Category:** Test(Integration)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-044, REQ-FUNC-077, REQ-NF-013
- **Screen:** — (전체 Screen의 데이터 접근 경로 검증)
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-RLS-BASE, DB-SEED-BASE
- **Expected Files:** `tests/integration/rls.test.ts`
- **Functional AC:**
  - 본인/상대방/비회원/Moderator/Admin 각 역할로 `mate_applications`, `blocks`, `reports`, `profiles` 비공개 필드에 대한 부정 접근을 시도하고 전부 403 또는 빈 결과인지 검증한다(REQ-FUNC-044 AC).
  - Guest/Member/Moderator 역할로 `app_settings`를 직접 SELECT/UPDATE 시도해 전부 거부되는지(서버 Route Handler 경유만 허용) 검증한다(REQ-FUNC-077).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 테스트 자체가 이 Task의 핵심 목적(보안 검증)이다.
- **Verify:** CI-LINT-TYPECHECK-DATA(가능 시) 또는 별도 통합테스트 파이프라인에서 실행
- **Priority:** P1
