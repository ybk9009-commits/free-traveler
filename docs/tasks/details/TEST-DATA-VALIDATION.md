# TEST-DATA-VALIDATION — 정적 데이터 완전성·수량 검증 스크립트

```task-meta
{
  "task_id": "TEST-DATA-VALIDATION",
  "type": "test",
  "depends_on": [
    "DATA-DESTINATIONS",
    "DATA-SAFETY",
    "DATA-REPRESENTATIVE"
  ],
  "requirements": [
    "REQ-FUNC-008",
    "REQ-FUNC-046",
    "REQ-FUNC-074",
    "REQ-NF-026",
    "REQ-NF-027",
    "REQ-NF-028"
  ]
}
```

## Context
이 Task는 — (SCR-001/002 데이터 검증) 화면이 필요로 하는 '정적 데이터 완전성·수량 검증 스크립트' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §6 테스트 전략

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-008, REQ-FUNC-046, REQ-FUNC-074, REQ-NF-026, REQ-NF-027, REQ-NF-028(축소)
- 정규화된 Requirement ID: REQ-FUNC-008, REQ-FUNC-046, REQ-FUNC-074, REQ-NF-026, REQ-NF-027, REQ-NF-028

## Screen / Route / Page Entry
- Screen: — (SCR-001/002 데이터 검증)
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- DATA-DESTINATIONS
- DATA-SAFETY
- DATA-REPRESENTATIVE

## Expected Files
`scripts/validate_content.ts`

## Functional AC
- 국내 10개 이상, 해외 15개국 30개 도시 이상 검증(REQ-FUNC-008).
  - 모든 해외 국가에 안전정보 1:1 매핑 검증(REQ-FUNC-046).
  - 여행지 필수 필드(명소 5+, 음식 3+, 에티켓 3+, 출처 1+), 안전정보 8개 카테고리 존재 검증(REQ-NF-026, 027).
  - 게시 전 완전성 게이트: 누락 목록을 반환하고, 미충족 시 CI를 실패시킨다(REQ-FUNC-074).

## Visual AC
해당 없음.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] 국내 10개 이상, 해외 15개국 30개 도시 이상 검증(REQ-FUNC-008). — Verify: CI-LINT-TYPECHECK-DATA에서 실행
- [Functional AC] 모든 해외 국가에 안전정보 1:1 매핑 검증(REQ-FUNC-046). — Verify: CI-LINT-TYPECHECK-DATA에서 실행
- [Functional AC] 여행지 필수 필드(명소 5+, 음식 3+, 에티켓 3+, 출처 1+), 안전정보 8개 카테고리 존재 검증(REQ-NF-026, 027). — Verify: CI-LINT-TYPECHECK-DATA에서 실행
- [Functional AC] 게시 전 완전성 게이트: 누락 목록을 반환하고, 미충족 시 CI를 실패시킨다(REQ-FUNC-074). — Verify: CI-LINT-TYPECHECK-DATA에서 실행

## Verify
CI-LINT-TYPECHECK-DATA에서 실행

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Verify에 명시된 검증(`CI-LINT-TYPECHECK-DATA에서 실행`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
