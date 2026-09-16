# CMP-SCR-004-report — 신고 모달

```task-meta
{
  "task_id": "CMP-SCR-004-report",
  "type": "component",
  "depends_on": [
    "CMP-SCR-004-detail",
    "API-REPORTS"
  ],
  "requirements": [
    "REQ-FUNC-039"
  ]
}
```

## Context
이 Task는 SCR-004 화면이 필요로 하는 '신고 모달' 기능을 제공한다. Implementation Status가 `IMPLEMENT(간소화)`인 것은 관리자 범위를 신고 처리·외부 URL 설정으로 한정하는 원칙(docs/PROJECT_SCOPE.md §2)에 따라 기능을 간소화했다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-039
- 정규화된 Requirement ID: REQ-FUNC-039

## Screen / Route / Page Entry
- Screen: SCR-004
- Route: `/mates`
- Page Entry: `src/app/mates/page.tsx`(PO-SCR-004가 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬
- `design-reference/UI_CONTRACT.md` SCR-004 영역 순서·주요 Component·금지 기능 표

## Depends On
- CMP-SCR-004-detail
- API-REPORTS

## Expected Files
`src/components/screens/scr004/ReportModal.tsx`

## Functional AC
사유코드 Select + 설명 textarea로 `API-REPORTS`에 제출하고, 접수번호를 3초 이내 표시한다(REQ-FUNC-039).

## Visual AC
Modal(`{elevation.drawer-modal}` + scrim), 44px 닫기 버튼.

## Security/Privacy AC
해당 없음(신고자 정보는 서버 세션에서 자동 채움).

## Test Cases
- [Functional AC] 사유코드 Select + 설명 textarea로 `API-REPORTS`에 제출하고, 접수번호를 3초 이내 표시한다(REQ-FUNC-039). — Verify: TEST-E2E-MATE-AUTH
- [Visual AC] Modal(`{elevation.drawer-modal}` + scrim), 44px 닫기 버튼. — Verify: TEST-E2E-MATE-AUTH
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
