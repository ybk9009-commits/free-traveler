# TASK-API-REPORTS — 신고 접수

- **Category:** API
- **Implementation Status:** IMPLEMENT(간소화)
- **Requirement Ref:** REQ-FUNC-039, REQ-NF-019
- **Screen:** SCR-004
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, INFRA-AUTH-SESSION, INFRA-INPUT-VALIDATION
- **Expected Files:** `src/app/api/reports/route.ts`(POST)
- **Functional AC:**
  - 대상(글/사용자/신청) + 사유코드 + 설명만 저장한다(증거 첨부·우선순위 필드는 만들지 않음 — 간소화 범위).
  - 응답에 신고 접수번호와 접수 시각을 3초 이내 반환한다(REQ-NF-019 목표).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 신고자 본인과 Moderator/Admin만 조회 가능.
- **Verify:** TEST-RLS-BASIC, E2E-MATE-AUTH
- **Priority:** P1
