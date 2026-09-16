# TEST-UNIT-MATE-STATE — 모집글/신청 상태 전이 Unit Test

```task-meta
{
  "task_id": "TEST-UNIT-MATE-STATE",
  "type": "test",
  "depends_on": [
    "API-MATE-POSTS",
    "API-MATE-APPLICATIONS"
  ],
  "requirements": [
    "REQ-FUNC-035",
    "REQ-FUNC-036",
    "REQ-FUNC-037",
    "REQ-FUNC-038"
  ]
}
```

## Context
이 Task는 — (SCR-004/SCR-005 검증) 화면이 필요로 하는 '모집글/신청 상태 전이 Unit Test' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §6 테스트 전략

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038
- 정규화된 Requirement ID: REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038

## Screen / Route / Page Entry
- Screen: — (SCR-004/SCR-005 검증)
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- API-MATE-POSTS
- API-MATE-APPLICATIONS

## Expected Files
`tests/unit/mate-state.test.ts`

## Functional AC
- `MATE_POST` 상태 전이(OPEN→CLOSED/HIDDEN/DELETED, 종료일 경과 시 조회 시점 CLOSED 계산 포함)를 테스트한다.
  - `MATE_APPLICATION` 상태 전이(PENDING→ACCEPTED/REJECTED/WITHDRAWN)와 중복 PENDING/ACCEPTED 차단 로직을 테스트한다.
  - 비작성자의 승인/거절 시도가 거부되는지 테스트한다(REQ-FUNC-036).

## Visual AC
해당 없음.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] `MATE_POST` 상태 전이(OPEN→CLOSED/HIDDEN/DELETED, 종료일 경과 시 조회 시점 CLOSED 계산 포함)를 테스트한다. — Verify: CI-LINT-TYPECHECK-DATA에서 자동 실행
- [Functional AC] `MATE_APPLICATION` 상태 전이(PENDING→ACCEPTED/REJECTED/WITHDRAWN)와 중복 PENDING/ACCEPTED 차단 로직을 테스트한다. — Verify: CI-LINT-TYPECHECK-DATA에서 자동 실행
- [Functional AC] 비작성자의 승인/거절 시도가 거부되는지 테스트한다(REQ-FUNC-036). — Verify: CI-LINT-TYPECHECK-DATA에서 자동 실행

## Verify
CI-LINT-TYPECHECK-DATA에서 자동 실행

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Verify에 명시된 검증(`CI-LINT-TYPECHECK-DATA에서 자동 실행`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
