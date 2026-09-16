# CMP-SCR-004-intro-cta — Intro + 새 글 작성 CTA Banner

```task-meta
{
  "task_id": "CMP-SCR-004-intro-cta",
  "type": "component",
  "depends_on": [],
  "requirements": []
}
```

## Context
이 Task는 SCR-004 화면이 필요로 하는 'Intro + 새 글 작성 CTA Banner' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): —(디자인 계약)
- 정규화된 Requirement ID: — (없음, 조립/기반 Task)

## Screen / Route / Page Entry
- Screen: SCR-004
- Route: `/mates`
- Page Entry: `src/app/mates/page.tsx`(PO-SCR-004가 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬
- `design-reference/UI_CONTRACT.md` SCR-004 영역 순서·주요 Component·금지 기능 표

## Depends On
— (없음)

## Expected Files
`src/components/screens/scr004/IntroCta.tsx`

## Functional AC
안내 문단 + "새 동행 글 작성하기" CTA(`/travel-tools` 동행 탭)를 표시한다.

## Visual AC
좌우 분할 + CTA Banner.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] 안내 문단 + "새 동행 글 작성하기" CTA(`/travel-tools` 동행 탭)를 표시한다. — Verify: TEST-E2E-MATE-AUTH
- [Visual AC] 좌우 분할 + CTA Banner. — Verify: TEST-E2E-MATE-AUTH
- Depends On 목록의 선행 Task가 모두 완료된 상태에서 통합 동작을 확인한다. Verify: TEST-E2E-MATE-AUTH

## Verify
TEST-E2E-MATE-AUTH

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-MATE-AUTH`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
