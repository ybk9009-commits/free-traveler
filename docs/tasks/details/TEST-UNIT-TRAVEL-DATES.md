# TEST-UNIT-TRAVEL-DATES — 날짜 검증 Unit Test

```task-meta
{
  "task_id": "TEST-UNIT-TRAVEL-DATES",
  "type": "test",
  "depends_on": [
    "CMP-SCR-003-flight-form",
    "CMP-SCR-003-hotel-form"
  ],
  "requirements": [
    "REQ-FUNC-013",
    "REQ-FUNC-021"
  ]
}
```

## Context
이 Task는 — (SCR-003 검증) 화면이 필요로 하는 '날짜 검증 Unit Test' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §6 테스트 전략

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-013, REQ-FUNC-021
- 정규화된 Requirement ID: REQ-FUNC-013, REQ-FUNC-021

## Screen / Route / Page Entry
- Screen: — (SCR-003 검증)
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- CMP-SCR-003-flight-form
- CMP-SCR-003-hotel-form

## Expected Files
`tests/unit/travel-dates.test.ts`

## Functional AC
- 항공: 출발일<오늘, 귀국일<출발일 케이스가 모두 차단되는지 경계값(오늘, 오늘-1, 동일일) 테스트.
  - 호텔: 체크인<오늘, 체크아웃≤체크인 케이스가 모두 차단되는지 경계값 테스트.
  - statement coverage 80% 이상, 핵심 규칙(날짜 검증) 100% 커버를 목표로 한다(`docs/02_SRS_BASELINE.md.md` §6.8.1).

## Visual AC
해당 없음.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] 항공: 출발일<오늘, 귀국일<출발일 케이스가 모두 차단되는지 경계값(오늘, 오늘-1, 동일일) 테스트. — Verify: CI-LINT-TYPECHECK-DATA에서 자동 실행
- [Functional AC] 호텔: 체크인<오늘, 체크아웃≤체크인 케이스가 모두 차단되는지 경계값 테스트. — Verify: CI-LINT-TYPECHECK-DATA에서 자동 실행
- [Functional AC] statement coverage 80% 이상, 핵심 규칙(날짜 검증) 100% 커버를 목표로 한다(`docs/02_SRS_BASELINE.md.md` §6.8.1). — Verify: CI-LINT-TYPECHECK-DATA에서 자동 실행

## Verify
CI-LINT-TYPECHECK-DATA에서 자동 실행

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Verify에 명시된 검증(`CI-LINT-TYPECHECK-DATA에서 자동 실행`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
