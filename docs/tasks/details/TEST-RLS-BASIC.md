# TEST-RLS-BASIC — RLS 정책 기본 Integration Test

```task-meta
{
  "task_id": "TEST-RLS-BASIC",
  "type": "test",
  "depends_on": [
    "DB-RLS-BASE",
    "DB-SEED-BASE"
  ],
  "requirements": [
    "REQ-FUNC-044",
    "REQ-NF-013"
  ]
}
```

## Context
이 Task는 — (전체 Screen의 데이터 접근 경로 검증) 화면이 필요로 하는 'RLS 정책 기본 Integration Test' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §6 테스트 전략

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-044, REQ-NF-013
- 정규화된 Requirement ID: REQ-FUNC-044, REQ-NF-013

## Screen / Route / Page Entry
- Screen: — (전체 Screen의 데이터 접근 경로 검증)
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- DB-RLS-BASE
- DB-SEED-BASE

## Expected Files
`tests/integration/rls.test.ts`

## Functional AC
- 본인/상대방/비회원/Moderator/Admin 각 역할로 `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `USER_PROFILE` 비공개 필드에 대한 부정 접근을 시도하고 전부 403 또는 빈 결과인지 검증한다(REQ-FUNC-044 AC).

## Visual AC
해당 없음.

## Security/Privacy AC
테스트 자체가 이 Task의 핵심 목적(보안 검증)이다.

## Test Cases
- [Functional AC] - 본인/상대방/비회원/Moderator/Admin 각 역할로 `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `USER_PROFILE` 비공개 필드에 대한 부정 접근을 시도하고 전부 403 또는 빈 결과인지 검증한다(REQ-FUNC-044 AC). — Verify: CI-LINT-TYPECHECK-DATA(가능 시) 또는 별도 통합테스트 파이프라인에서 실행
- [Security/Privacy AC] 테스트 자체가 이 Task의 핵심 목적(보안 검증)이다. — Verify: CI-LINT-TYPECHECK-DATA(가능 시) 또는 별도 통합테스트 파이프라인에서 실행
- Depends On 목록의 선행 Task가 모두 완료된 상태에서 통합 동작을 확인한다. Verify: CI-LINT-TYPECHECK-DATA(가능 시) 또는 별도 통합테스트 파이프라인에서 실행

## Verify
CI-LINT-TYPECHECK-DATA(가능 시) 또는 별도 통합테스트 파이프라인에서 실행

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`CI-LINT-TYPECHECK-DATA(가능 시) 또는 별도 통합테스트 파이프라인에서 실행`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
