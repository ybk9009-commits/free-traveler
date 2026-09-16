# API-BLOCKS — 사용자 차단·해제

```task-meta
{
  "task_id": "API-BLOCKS",
  "type": "api",
  "depends_on": [
    "DB-SCHEMA-BASE",
    "DB-RLS-BASE",
    "DB-ACCESS",
    "INFRA-AUTH-SESSION"
  ],
  "requirements": [
    "REQ-FUNC-040"
  ]
}
```

## Context
이 Task는 SCR-004, SCR-005 화면이 필요로 하는 '사용자 차단·해제' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-040
- 정규화된 Requirement ID: REQ-FUNC-040

## Screen / Route / Page Entry
- Screen: SCR-004, SCR-005
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- DB-SCHEMA-BASE
- DB-RLS-BASE
- DB-ACCESS
- INFRA-AUTH-SESSION

## Expected Files
`src/app/api/blocks/route.ts`(POST), `src/app/api/blocks/[id]/route.ts`(DELETE)

## Functional AC
- 차단 생성/해제를 제공하며, 차단 이후 두 사용자 사이의 글·프로필·요청이 목록/상세 쿼리에서 상호 제외되도록 `CMP-SCR-004-list`/`CMP-SCR-004-filter`가 사용하는 조회 쿼리에 조인 필터를 반영한다.

## Visual AC
해당 없음.

## Security/Privacy AC
`blocker_id`는 본인만 RLS로 접근 가능.

## Test Cases
- [Functional AC] - 차단 생성/해제를 제공하며, 차단 이후 두 사용자 사이의 글·프로필·요청이 목록/상세 쿼리에서 상호 제외되도록 `CMP-SCR-004-list`/`CMP-SCR-004-filter`가 사용하는 조회 쿼리에 조인 필터를 반영한다. — Verify: TEST-RLS-BASIC, TEST-E2E-MATE-AUTH
- [Security/Privacy AC] `blocker_id`는 본인만 RLS로 접근 가능. — Verify: TEST-RLS-BASIC, TEST-E2E-MATE-AUTH
- Depends On 목록의 선행 Task가 모두 완료된 상태에서 통합 동작을 확인한다. Verify: TEST-RLS-BASIC, TEST-E2E-MATE-AUTH

## Verify
TEST-RLS-BASIC, TEST-E2E-MATE-AUTH

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-RLS-BASIC, TEST-E2E-MATE-AUTH`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
