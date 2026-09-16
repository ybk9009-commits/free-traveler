# CMP-COMMON-ARIA-PATTERNS — 폼·모달·탭·알림 공용 ARIA 패턴

```task-meta
{
  "task_id": "CMP-COMMON-ARIA-PATTERNS",
  "type": "component",
  "depends_on": [],
  "requirements": [
    "REQ-FUNC-079",
    "REQ-NF-023"
  ]
}
```

## Context
이 Task는 공통(5개 Screen) 화면이 필요로 하는 '폼·모달·탭·알림 공용 ARIA 패턴' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-079, REQ-NF-023
- 정규화된 Requirement ID: REQ-FUNC-079, REQ-NF-023

## Screen / Route / Page Entry
- Screen: 공통(5개 Screen)
- Route: 공통(5개 Route)
- Page Entry: —(공용 프리미티브)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Form·Tabs
- `design-reference/D-001/DESIGN.md` § Desktop·Mobile 규칙(접근성), Do/Do Not

## Depends On
— (없음)

## Expected Files
`src/components/common/Modal.tsx`, `src/components/common/Tabs.tsx`, `src/components/common/FormField.tsx`

## Functional AC
- 폼(라벨-입력 연결, `aria-describedby` 오류 연결), 모달(포커스 트랩, `role="dialog"`), 탭(`role="tablist"`/`aria-selected`), 알림(`role="status"`/`aria-live`)의 공용 패턴을 제공한다(REQ-FUNC-079).
  - 키보드 포커스는 항상 `{colors.focus-ring}` 2px 아웃라인+2px 오프셋으로 표시하며 `outline: none`으로 제거하지 않는다(D-001 접근성 원칙, REQ-NF-023).
  - 모든 클릭 가능 요소는 최소 44×44px 히트 영역을 확보한다.

## Visual AC
해당 없음(접근성 프리미티브).

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] 폼(라벨-입력 연결, `aria-describedby` 오류 연결), 모달(포커스 트랩, `role="dialog"`), 탭(`role="tablist"`/`aria-selected`), 알림(`role="status"`/`aria-live`)의 공용 패턴을 제공한다(REQ-FUNC-079). — Verify: TEST-A11Y-AXE, TEST-RELEASE-CHECK-MANUAL(키보드·스크린리더 수동)
- [Functional AC] 키보드 포커스는 항상 `{colors.focus-ring}` 2px 아웃라인+2px 오프셋으로 표시하며 `outline: none`으로 제거하지 않는다(D-001 접근성 원칙, REQ-NF-023). — Verify: TEST-A11Y-AXE, TEST-RELEASE-CHECK-MANUAL(키보드·스크린리더 수동)
- [Functional AC] 모든 클릭 가능 요소는 최소 44×44px 히트 영역을 확보한다. — Verify: TEST-A11Y-AXE, TEST-RELEASE-CHECK-MANUAL(키보드·스크린리더 수동)

## Verify
TEST-A11Y-AXE, TEST-RELEASE-CHECK-MANUAL(키보드·스크린리더 수동)

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-A11Y-AXE, TEST-RELEASE-CHECK-MANUAL(키보드·스크린리더 수동)`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
