# TEST-E2E-PUBLIC-SMOKE — 공개 흐름 E2E(여행지·안전정보·대표소개)

```task-meta
{
  "task_id": "TEST-E2E-PUBLIC-SMOKE",
  "type": "test",
  "depends_on": [
    "PO-SCR-001",
    "PO-SCR-002"
  ],
  "requirements": [
    "REQ-FUNC-001",
    "REQ-FUNC-002",
    "REQ-FUNC-003",
    "REQ-FUNC-004",
    "REQ-FUNC-005",
    "REQ-FUNC-006",
    "REQ-FUNC-007",
    "REQ-FUNC-008",
    "REQ-FUNC-009",
    "REQ-FUNC-010",
    "REQ-FUNC-047",
    "REQ-FUNC-048",
    "REQ-FUNC-049",
    "REQ-FUNC-050",
    "REQ-FUNC-051",
    "REQ-FUNC-052",
    "REQ-FUNC-053",
    "REQ-FUNC-054",
    "REQ-FUNC-057",
    "REQ-FUNC-058",
    "REQ-FUNC-059",
    "REQ-FUNC-060",
    "REQ-FUNC-061",
    "REQ-FUNC-062",
    "REQ-FUNC-063",
    "REQ-FUNC-064",
    "REQ-FUNC-065",
    "REQ-FUNC-067",
    "REQ-FUNC-069",
    "REQ-FUNC-070"
  ],
  "browser_projects": [
    "chromium"
  ]
}
```

## Context
이 Task는 SCR-001, SCR-002 화면이 필요로 하는 '공개 흐름 E2E(여행지·안전정보·대표소개)' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §6 테스트 전략

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-001~010, 047~054, 057~063, 064, 065, 067, 069, 070
- 정규화된 Requirement ID: REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-007, REQ-FUNC-008, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-052, REQ-FUNC-053, REQ-FUNC-054, REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-061, REQ-FUNC-062, REQ-FUNC-063, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-067, REQ-FUNC-069, REQ-FUNC-070

## Screen / Route / Page Entry
- Screen: SCR-001, SCR-002
- Route: `/`, `/about`
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- PO-SCR-001
- PO-SCR-002

## Expected Files
`tests/e2e/public-smoke.spec.ts`

## Functional AC
- 여행지 탐색·필터·빈 결과(REQ-FUNC-001,002,005), 여행지 상세→안전정보 연결(REQ-FUNC-006), 안전정보 열람 및 stale 경고(REQ-FUNC-050), 대표 소개 열람(REQ-FUNC-057~063)을 각 1개 이상 시나리오로 커버한다(`docs/PROJECT_SCOPE.md` §6 핵심 흐름).
  - Playwright(Chromium)로 실행한다.

## Visual AC
해당 없음(테스트 스펙).

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] 여행지 탐색·필터·빈 결과(REQ-FUNC-001,002,005), 여행지 상세→안전정보 연결(REQ-FUNC-006), 안전정보 열람 및 stale 경고(REQ-FUNC-050), 대표 소개 열람(REQ-FUNC-057~063)을 각 1개 이상 시나리오로 커버한다(`docs/PROJECT_SCOPE.md` §6 핵심 흐름). — Verify: CI-LINT-TYPECHECK-DATA
- [Functional AC] Playwright(Chromium)로 실행한다. — Verify: CI-LINT-TYPECHECK-DATA
- Depends On 목록의 선행 Task가 모두 완료된 상태에서 통합 동작을 확인한다. Verify: CI-LINT-TYPECHECK-DATA

## Verify
CI-LINT-TYPECHECK-DATA

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Verify에 명시된 검증(`CI-LINT-TYPECHECK-DATA`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
