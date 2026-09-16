# CMP-SCR-004-detail — 동행 상세 패널

```task-meta
{
  "task_id": "CMP-SCR-004-detail",
  "type": "component",
  "depends_on": [
    "CMP-SCR-004-list"
  ],
  "requirements": [
    "REQ-FUNC-033"
  ]
}
```

## Context
이 Task는 SCR-004 화면이 필요로 하는 '동행 상세 패널' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-033
- 정규화된 Requirement ID: REQ-FUNC-033

## Screen / Route / Page Entry
- Screen: SCR-004
- Route: `/mates`
- Page Entry: `src/app/mates/page.tsx`(PO-SCR-004가 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬
- `design-reference/UI_CONTRACT.md` SCR-004 영역 순서·주요 Component·금지 기능 표

## Depends On
- CMP-SCR-004-list

## Expected Files
`src/components/screens/scr004/MateDetailPanel.tsx`

## Functional AC
- 작성자 정보(연락처 비공개), 국가·지역·기간·인원, 선호조건·여행스타일, 설명, 모집상태 배지를 표시한다(REQ-FUNC-033).
  - 작성자 본인이 열람 시 "내 글 관리는 계정 > 내 활동에서" 안내 배너를 표시한다.

## Visual AC
Desktop 좌(목록)/우(상세) 분할, Mobile 목록→상세 하단 Drawer 전환(좌우 분할 유지 금지).

## Security/Privacy AC
응답 JSON/HTML에 이메일·전화번호가 포함되지 않는다(REQ-FUNC-033 핵심 AC).

## Test Cases
- [Functional AC] 작성자 정보(연락처 비공개), 국가·지역·기간·인원, 선호조건·여행스타일, 설명, 모집상태 배지를 표시한다(REQ-FUNC-033). — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] 작성자 본인이 열람 시 "내 글 관리는 계정 > 내 활동에서" 안내 배너를 표시한다. — Verify: TEST-E2E-MATE-AUTH
- [Visual AC] Desktop 좌(목록)/우(상세) 분할, Mobile 목록→상세 하단 Drawer 전환(좌우 분할 유지 금지). — Verify: TEST-E2E-MATE-AUTH
- [Security/Privacy AC] 응답 JSON/HTML에 이메일·전화번호가 포함되지 않는다(REQ-FUNC-033 핵심 AC). — Verify: TEST-E2E-MATE-AUTH

## Verify
TEST-E2E-MATE-AUTH

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-MATE-AUTH`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
