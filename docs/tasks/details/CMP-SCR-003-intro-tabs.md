# CMP-SCR-003-intro-tabs — Intro 3단계 안내 + 탭 Shell

```task-meta
{
  "task_id": "CMP-SCR-003-intro-tabs",
  "type": "component",
  "depends_on": [],
  "requirements": []
}
```

## Context
이 Task는 SCR-003 화면이 필요로 하는 'Intro 3단계 안내 + 탭 Shell' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): —(디자인 계약, PO-SCR-003이 조립할 탭 shell)
- 정규화된 Requirement ID: — (없음, 조립/기반 Task)

## Screen / Route / Page Entry
- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: `src/app/travel-tools/page.tsx`(PO-SCR-003이 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Form·Tabs
- `design-reference/UI_CONTRACT.md` SCR-003 영역 순서·주요 Component·금지 기능 표

## Depends On
— (없음)

## Expected Files
`src/components/screens/scr003/IntroTabs.tsx`

## Functional AC
- "조건 입력 → 요약 확인 → 이동/작성" 3단계 안내 문단을 표시한다.
  - `tab.underline` 3개(항공편/숙소/동행 구하기)를 렌더링하며, 탭 전환 시 다른 탭의 입력 상태는 세션 동안 유지하되 검증·제출 상태는 탭별로 독립 관리한다(D-001 § Form·Tabs).

## Visual AC
활성 탭 = `{colors.ink}` + 2px `{colors.primary}` 밑줄, 비활성 = `{colors.muted}`.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] "조건 입력 → 요약 확인 → 이동/작성" 3단계 안내 문단을 표시한다. — Verify: TEST-E2E-TRAVEL-TOOLS
- [Functional AC] `tab.underline` 3개(항공편/숙소/동행 구하기)를 렌더링하며, 탭 전환 시 다른 탭의 입력 상태는 세션 동안 유지하되 검증·제출 상태는 탭별로 독립 관리한다(D-001 § Form·Tabs). — Verify: TEST-E2E-TRAVEL-TOOLS
- [Visual AC] 활성 탭 = `{colors.ink}` + 2px `{colors.primary}` 밑줄, 비활성 = `{colors.muted}`. — Verify: TEST-E2E-TRAVEL-TOOLS

## Verify
TEST-E2E-TRAVEL-TOOLS

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-TRAVEL-TOOLS`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
