# TASK-API-BLOCKS — 사용자 차단·해제

- **Category:** API
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-040
- **Screen:** SCR-004, SCR-005
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, INFRA-AUTH-SESSION
- **Expected Files:** `src/app/api/blocks/route.ts`(POST), `src/app/api/blocks/[id]/route.ts`(DELETE)
- **Functional AC:**
  - 차단 생성/해제를 제공하며, 차단 이후 두 사용자 사이의 글·프로필·요청이 목록/상세 쿼리에서 상호 제외되도록 `CMP-SCR004-LIST`/`CMP-SCR004-FILTER`가 사용하는 조회 쿼리에 조인 필터를 반영한다.
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** `blocker_id`는 본인만 RLS로 접근 가능.
- **Verify:** TEST-RLS-BASIC, E2E-MATE-AUTH
- **Priority:** P1
