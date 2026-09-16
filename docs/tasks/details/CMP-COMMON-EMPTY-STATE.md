# CMP-COMMON-EMPTY-STATE — 완성형 Empty State 공용 컴포넌트

```task-meta
{
  "task_id": "CMP-COMMON-EMPTY-STATE",
  "type": "component",
  "depends_on": [],
  "requirements": [
    "REQ-FUNC-005"
  ]
}
```

## Context
이 Task는 공통(5개 Screen) 화면이 필요로 하는 '완성형 Empty State 공용 컴포넌트' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-005(지원)
- 정규화된 Requirement ID: REQ-FUNC-005

## Screen / Route / Page Entry
- Screen: 공통(5개 Screen)
- Route: 공통(5개 Route)
- Page Entry: —(공용 컴포넌트)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Loading·Empty·Error 상태(완성형 Empty State 3요소)

## Depends On
— (없음)

## Expected Files
`src/components/common/EmptyState.tsx`

## Functional AC
- **3요소를 props로 강제한다**: ① 상황 설명 한 문장(왜 비어 있는지) ② 이용 방법 또는 조건 안내 ③ 다음 행동 CTA 버튼. 아이콘/일러스트는 장식용으로만 허용하며 텍스트 없이 아이콘만 두는 사용을 금지한다(D-001 § Empty State 규칙).
  - Lorem ipsum, "준비 중", "정보 확인 필요" 등 자리표시 문구를 props/기본값 어디에도 두지 않는다.

## Visual AC
모든 Empty State 사용처(CMP-SCR-001-destination-grid, CMP-SCR-001-recent-mates, CMP-SCR-004-list, CMP-SCR-005-my-activity)가 이 컴포넌트를 재사용한다.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] **3요소를 props로 강제한다**: ① 상황 설명 한 문장(왜 비어 있는지) ② 이용 방법 또는 조건 안내 ③ 다음 행동 CTA 버튼. 아이콘/일러스트는 장식용으로만 허용하며 텍스트 없이 아이콘만 두는 사용을 금지한다(D-001 § Empty State 규칙). — Verify: TEST-A11Y-AXE, TEST-E2E-PUBLIC-SMOKE/TEST-E2E-MATE-AUTH의 Empty 상태 시나리오
- [Functional AC] Lorem ipsum, "준비 중", "정보 확인 필요" 등 자리표시 문구를 props/기본값 어디에도 두지 않는다. — Verify: TEST-A11Y-AXE, TEST-E2E-PUBLIC-SMOKE/TEST-E2E-MATE-AUTH의 Empty 상태 시나리오
- [Visual AC] 모든 Empty State 사용처(CMP-SCR-001-destination-grid, CMP-SCR-001-recent-mates, CMP-SCR-004-list, CMP-SCR-005-my-activity)가 이 컴포넌트를 재사용한다. — Verify: TEST-A11Y-AXE, TEST-E2E-PUBLIC-SMOKE/TEST-E2E-MATE-AUTH의 Empty 상태 시나리오

## Verify
TEST-A11Y-AXE, TEST-E2E-PUBLIC-SMOKE/TEST-E2E-MATE-AUTH의 Empty 상태 시나리오

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-A11Y-AXE, TEST-E2E-PUBLIC-SMOKE/TEST-E2E-MATE-AUTH의 Empty 상태 시나리오`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
