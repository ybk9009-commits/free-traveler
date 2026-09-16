# TASK-API-MATE-APPLICATIONS — 참가 요청 생성·승인·거절

- **Category:** API
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036
- **Screen:** SCR-004(신청), SCR-005(승인/거절)
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, INFRA-AUTH-SESSION, INFRA-ADULT-VERIFICATION, INFRA-INPUT-VALIDATION
- **Expected Files:** `src/app/api/mates/[id]/applications/route.ts`(POST), `src/app/api/applications/[id]/route.ts`(PATCH)
- **Functional AC:**
  - 최대 500자 참가 메시지를 PENDING 상태로 저장한다(REQ-FUNC-034).
  - 동일 사용자·동일 글의 중복 PENDING/ACCEPTED 요청은 DB unique 제약 + 사전 검사로 차단한다(REQ-FUNC-035).
  - 글 작성자만 ACCEPTED/REJECTED로 상태를 변경할 수 있다. 비작성자 호출은 403을 반환한다(REQ-FUNC-036).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 신청 메시지는 신청자 본인과 글 작성자만 RLS로 조회 가능하다.
- **Verify:** UNIT-MATE-STATE, TEST-RLS-BASIC, E2E-MATE-AUTH
- **Priority:** P1
