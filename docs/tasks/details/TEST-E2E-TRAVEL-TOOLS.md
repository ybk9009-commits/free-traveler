# TEST-E2E-TRAVEL-TOOLS — 항공·호텔 흐름 E2E

```task-meta
{
  "task_id": "TEST-E2E-TRAVEL-TOOLS",
  "type": "test",
  "depends_on": [
    "PO-SCR-003"
  ],
  "requirements": [
    "REQ-FUNC-011",
    "REQ-FUNC-012",
    "REQ-FUNC-013",
    "REQ-FUNC-014",
    "REQ-FUNC-015",
    "REQ-FUNC-016",
    "REQ-FUNC-017",
    "REQ-FUNC-018",
    "REQ-FUNC-019",
    "REQ-FUNC-020",
    "REQ-FUNC-021",
    "REQ-FUNC-022",
    "REQ-FUNC-023",
    "REQ-FUNC-024",
    "REQ-FUNC-025",
    "REQ-FUNC-026",
    "REQ-FUNC-054"
  ],
  "browser_projects": [
    "chromium"
  ]
}
```

## Context
이 Task는 SCR-003 화면이 필요로 하는 '항공·호텔 흐름 E2E' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §6 테스트 전략

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-011~026, 054
- 정규화된 Requirement ID: REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-FUNC-054

## Screen / Route / Page Entry
- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- PO-SCR-003

## Expected Files
`tests/e2e/travel-tools.spec.ts`

## Functional AC
- 항공 입력→검증 오류→요약→외부 이동(새 탭, query 없음, `noopener,noreferrer` 속성 확인) 시나리오.
  - 호텔 동일 시나리오.
  - **입력값이 네트워크 요청(XHR/fetch)이나 URL query에 포함되지 않는지 네트워크 탭 assertion으로 확인한다**(REQ-FUNC-017, 025 핵심 검증).
  - Playwright(Chromium)로 실행한다.

## Visual AC
해당 없음.

## Security/Privacy AC
이 Task의 핵심 목적이 개인정보 비전달 검증이다.

## Test Cases
- [Functional AC] 항공 입력→검증 오류→요약→외부 이동(새 탭, query 없음, `noopener,noreferrer` 속성 확인) 시나리오. — Verify: CI-LINT-TYPECHECK-DATA
- [Functional AC] 호텔 동일 시나리오. — Verify: CI-LINT-TYPECHECK-DATA
- [Functional AC] **입력값이 네트워크 요청(XHR/fetch)이나 URL query에 포함되지 않는지 네트워크 탭 assertion으로 확인한다**(REQ-FUNC-017, 025 핵심 검증). — Verify: CI-LINT-TYPECHECK-DATA
- [Functional AC] Playwright(Chromium)로 실행한다. — Verify: CI-LINT-TYPECHECK-DATA
- [Security/Privacy AC] 이 Task의 핵심 목적이 개인정보 비전달 검증이다. — Verify: CI-LINT-TYPECHECK-DATA

## Verify
CI-LINT-TYPECHECK-DATA

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`CI-LINT-TYPECHECK-DATA`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
