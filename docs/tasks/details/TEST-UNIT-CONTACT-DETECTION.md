# TEST-UNIT-CONTACT-DETECTION — 연락처 탐지 Unit Test

```task-meta
{
  "task_id": "TEST-UNIT-CONTACT-DETECTION",
  "type": "test",
  "depends_on": [
    "INFRA-CONTACT-DETECTION"
  ],
  "requirements": [
    "REQ-FUNC-032"
  ]
}
```

## Context
이 Task는 — (SCR-003 검증) 화면이 필요로 하는 '연락처 탐지 Unit Test' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §6 테스트 전략

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-032
- 정규화된 Requirement ID: REQ-FUNC-032

## Screen / Route / Page Entry
- Screen: — (SCR-003 검증)
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- INFRA-CONTACT-DETECTION

## Expected Files
`tests/unit/contact-detection.test.ts`

## Functional AC
- 기준 테스트셋(전화번호/이메일/카카오톡·텔레그램 ID 패턴 + 정상 문장 오탐 케이스)으로 탐지율 95% 이상, 오탐률 5% 이하를 검증한다(REQ-FUNC-032 AC).

## Visual AC
해당 없음.

## Security/Privacy AC
테스트 픽스처에 실제 개인 연락처를 사용하지 않는다(가짜 패턴만).

## Test Cases
- [Functional AC] - 기준 테스트셋(전화번호/이메일/카카오톡·텔레그램 ID 패턴 + 정상 문장 오탐 케이스)으로 탐지율 95% 이상, 오탐률 5% 이하를 검증한다(REQ-FUNC-032 AC). — Verify: CI-LINT-TYPECHECK-DATA에서 자동 실행
- [Security/Privacy AC] 테스트 픽스처에 실제 개인 연락처를 사용하지 않는다(가짜 패턴만). — Verify: CI-LINT-TYPECHECK-DATA에서 자동 실행
- Depends On 목록의 선행 Task가 모두 완료된 상태에서 통합 동작을 확인한다. Verify: CI-LINT-TYPECHECK-DATA에서 자동 실행

## Verify
CI-LINT-TYPECHECK-DATA에서 자동 실행

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`CI-LINT-TYPECHECK-DATA에서 자동 실행`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
