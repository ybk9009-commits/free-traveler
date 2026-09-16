# CMP-SCR-004-filter — 검색 Filter + 결과 요약

```task-meta
{
  "task_id": "CMP-SCR-004-filter",
  "type": "component",
  "depends_on": [
    "API-BLOCKS",
    "DB-ACCESS"
  ],
  "requirements": [
    "REQ-FUNC-030"
  ]
}
```

## Context
이 Task는 SCR-004 화면이 필요로 하는 '검색 Filter + 결과 요약' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-030
- 정규화된 Requirement ID: REQ-FUNC-030

## Screen / Route / Page Entry
- Screen: SCR-004
- Route: `/mates`
- Page Entry: `src/app/mates/page.tsx`(PO-SCR-004가 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬
- `design-reference/UI_CONTRACT.md` SCR-004 영역 순서·주요 Component·금지 기능 표

## Depends On
- API-BLOCKS
- DB-ACCESS

## Expected Files
`src/components/screens/scr004/Filter.tsx`

## Functional AC
- 국가·지역·기간 겹침·모집상태 Filter를 제공하고 "N건의 동행글" 결과 요약을 표시한다(REQ-FUNC-030).
  - 차단한/차단당한 사용자의 글은 결과에서 제외한다(`API-BLOCKS`의 조인 필터 사용).

## Visual AC
좌우 분할(Filter+요약).

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] 국가·지역·기간 겹침·모집상태 Filter를 제공하고 "N건의 동행글" 결과 요약을 표시한다(REQ-FUNC-030). — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] 차단한/차단당한 사용자의 글은 결과에서 제외한다(`API-BLOCKS`의 조인 필터 사용). — Verify: TEST-E2E-MATE-AUTH
- [Visual AC] 좌우 분할(Filter+요약). — Verify: TEST-E2E-MATE-AUTH

## Verify
TEST-E2E-MATE-AUTH

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-MATE-AUTH`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
