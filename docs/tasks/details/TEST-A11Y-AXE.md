# TEST-A11Y-AXE — axe-core 자동 접근성 검사

```task-meta
{
  "task_id": "TEST-A11Y-AXE",
  "type": "test",
  "depends_on": [
    "PO-SCR-001",
    "PO-SCR-002",
    "PO-SCR-003",
    "PO-SCR-004",
    "PO-SCR-005"
  ],
  "requirements": [
    "REQ-NF-024"
  ]
}
```

## Context
이 Task는 SCR-001~SCR-005(핵심 5화면) 화면이 필요로 하는 'axe-core 자동 접근성 검사' 기능을 제공한다. Implementation Status가 `IMPLEMENT(축소)`인 것은 자동화·모니터링 인프라를 최소화하는 원칙(docs/PROJECT_SCOPE.md §1)에 따라 범위를 축소했다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §6 테스트 전략

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-NF-024
- 정규화된 Requirement ID: REQ-NF-024

## Screen / Route / Page Entry
- Screen: SCR-001~SCR-005(핵심 5화면)
- Route: 공통(5개 Route)
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- PO-SCR-001
- PO-SCR-002
- PO-SCR-003
- PO-SCR-004
- PO-SCR-005

## Expected Files
`tests/e2e/a11y.spec.ts`

## Functional AC
Playwright + `@axe-core/playwright`로 5개 핵심 화면(4+1)에서 serious/critical 위반 0건을 목표로 한다(REQ-NF-024, `docs/PROJECT_SCOPE.md` §4.5 축소 범위 — 핵심 화면만 대상).

## Visual AC
해당 없음.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] Playwright + `@axe-core/playwright`로 5개 핵심 화면(4+1)에서 serious/critical 위반 0건을 목표로 한다(REQ-NF-024, `docs/PROJECT_SCOPE.md` §4.5 축소 범위 — 핵심 화면만 대상). — Verify: CI-LINT-TYPECHECK-DATA 또는 별도 E2E 파이프라인
- Depends On 목록의 선행 Task가 모두 완료된 상태에서 통합 동작을 확인한다. Verify: CI-LINT-TYPECHECK-DATA 또는 별도 E2E 파이프라인

## Verify
CI-LINT-TYPECHECK-DATA 또는 별도 E2E 파이프라인

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Verify에 명시된 검증(`CI-LINT-TYPECHECK-DATA 또는 별도 E2E 파이프라인`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
