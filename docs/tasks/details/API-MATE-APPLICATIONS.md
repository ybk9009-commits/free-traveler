# API-MATE-APPLICATIONS — 참가 요청 생성·승인·거절

```task-meta
{
  "task_id": "API-MATE-APPLICATIONS",
  "type": "api",
  "depends_on": [
    "DB-SCHEMA-BASE",
    "DB-RLS-BASE",
    "DB-ACCESS",
    "INFRA-AUTH-SESSION",
    "INFRA-ADULT-VERIFICATION",
    "INFRA-INPUT-VALIDATION"
  ],
  "requirements": [
    "REQ-FUNC-034",
    "REQ-FUNC-035",
    "REQ-FUNC-036"
  ]
}
```

## Context
이 Task는 SCR-004(신청), SCR-005(승인/거절) 화면이 필요로 하는 '참가 요청 생성·승인·거절' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036
- 정규화된 Requirement ID: REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036

## Screen / Route / Page Entry
- Screen: SCR-004(신청), SCR-005(승인/거절)
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- DB-SCHEMA-BASE
- DB-RLS-BASE
- DB-ACCESS
- INFRA-AUTH-SESSION
- INFRA-ADULT-VERIFICATION
- INFRA-INPUT-VALIDATION

## Expected Files
`src/app/api/mates/[id]/applications/route.ts`(POST), `src/app/api/applications/[id]/route.ts`(PATCH)

## Functional AC
- 최대 500자 참가 메시지를 PENDING 상태로 저장한다(REQ-FUNC-034).
  - 동일 사용자·동일 글의 중복 PENDING/ACCEPTED 요청은 DB unique 제약 + 사전 검사로 차단한다(REQ-FUNC-035).
  - 글 작성자만 ACCEPTED/REJECTED로 상태를 변경할 수 있다. 비작성자 호출은 403을 반환한다(REQ-FUNC-036).

## Visual AC
해당 없음.

## Security/Privacy AC
신청 메시지는 신청자 본인과 글 작성자만 RLS로 조회 가능하다.

## Test Cases
- [Functional AC] 최대 500자 참가 메시지를 PENDING 상태로 저장한다(REQ-FUNC-034). — Verify: TEST-UNIT-MATE-STATE, TEST-RLS-BASIC, TEST-E2E-MATE-AUTH
- [Functional AC] 동일 사용자·동일 글의 중복 PENDING/ACCEPTED 요청은 DB unique 제약 + 사전 검사로 차단한다(REQ-FUNC-035). — Verify: TEST-UNIT-MATE-STATE, TEST-RLS-BASIC, TEST-E2E-MATE-AUTH
- [Functional AC] 글 작성자만 ACCEPTED/REJECTED로 상태를 변경할 수 있다. 비작성자 호출은 403을 반환한다(REQ-FUNC-036). — Verify: TEST-UNIT-MATE-STATE, TEST-RLS-BASIC, TEST-E2E-MATE-AUTH
- [Security/Privacy AC] 신청 메시지는 신청자 본인과 글 작성자만 RLS로 조회 가능하다. — Verify: TEST-UNIT-MATE-STATE, TEST-RLS-BASIC, TEST-E2E-MATE-AUTH

## Verify
TEST-UNIT-MATE-STATE, TEST-RLS-BASIC, TEST-E2E-MATE-AUTH

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-UNIT-MATE-STATE, TEST-RLS-BASIC, TEST-E2E-MATE-AUTH`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
