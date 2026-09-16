# API-REPORTS — 신고 접수

```task-meta
{
  "task_id": "API-REPORTS",
  "type": "api",
  "depends_on": [
    "DB-SCHEMA-BASE",
    "DB-RLS-BASE",
    "DB-ACCESS",
    "INFRA-AUTH-SESSION",
    "INFRA-INPUT-VALIDATION"
  ],
  "requirements": [
    "REQ-FUNC-039",
    "REQ-NF-019"
  ]
}
```

## Context
이 Task는 SCR-004 화면이 필요로 하는 '신고 접수' 기능을 제공한다. Implementation Status가 `IMPLEMENT(간소화)`인 것은 관리자 범위를 신고 처리·외부 URL 설정으로 한정하는 원칙(docs/PROJECT_SCOPE.md §2)에 따라 기능을 간소화했다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-039, REQ-NF-019
- 정규화된 Requirement ID: REQ-FUNC-039, REQ-NF-019

## Screen / Route / Page Entry
- Screen: SCR-004
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- DB-SCHEMA-BASE
- DB-RLS-BASE
- DB-ACCESS
- INFRA-AUTH-SESSION
- INFRA-INPUT-VALIDATION

## Expected Files
`src/app/api/reports/route.ts`(POST)

## Functional AC
- 대상(글/사용자/신청) + 사유코드 + 설명만 저장한다(증거 첨부·우선순위 필드는 만들지 않음 — 간소화 범위).
  - 응답에 신고 접수번호와 접수 시각을 3초 이내 반환한다(REQ-NF-019 목표).

## Visual AC
해당 없음.

## Security/Privacy AC
신고자 본인과 Moderator/Admin만 조회 가능.

## Test Cases
- [Functional AC] 대상(글/사용자/신청) + 사유코드 + 설명만 저장한다(증거 첨부·우선순위 필드는 만들지 않음 — 간소화 범위). — Verify: TEST-RLS-BASIC, TEST-E2E-MATE-AUTH
- [Functional AC] 응답에 신고 접수번호와 접수 시각을 3초 이내 반환한다(REQ-NF-019 목표). — Verify: TEST-RLS-BASIC, TEST-E2E-MATE-AUTH
- [Security/Privacy AC] 신고자 본인과 Moderator/Admin만 조회 가능. — Verify: TEST-RLS-BASIC, TEST-E2E-MATE-AUTH

## Verify
TEST-RLS-BASIC, TEST-E2E-MATE-AUTH

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-RLS-BASIC, TEST-E2E-MATE-AUTH`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
