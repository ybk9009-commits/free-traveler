# CMP-SCR-001-destination-detail-drawer — 여행지 상세 Drawer

```task-meta
{
  "task_id": "CMP-SCR-001-destination-detail-drawer",
  "type": "component",
  "depends_on": [
    "CMP-SCR-001-destination-grid",
    "DATA-DESTINATIONS",
    "DATA-SAFETY",
    "CMP-COMMON-FAVORITES-SHARE"
  ],
  "requirements": [
    "REQ-FUNC-004",
    "REQ-FUNC-006",
    "REQ-FUNC-007",
    "REQ-FUNC-009",
    "REQ-FUNC-069"
  ]
}
```

## Context
이 Task는 SCR-001 화면이 필요로 하는 '여행지 상세 Drawer' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-004, REQ-FUNC-006, REQ-FUNC-007(축소), REQ-FUNC-009, REQ-FUNC-069
- 정규화된 Requirement ID: REQ-FUNC-004, REQ-FUNC-006, REQ-FUNC-007, REQ-FUNC-009, REQ-FUNC-069

## Screen / Route / Page Entry
- Screen: SCR-001
- Route: `/`
- Page Entry: `src/app/page.tsx`(PO-SCR-001이 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Drawer·Modal
- `design-reference/D-001/DESIGN.md` § Destination Card
- `design-reference/UI_CONTRACT.md` SCR-001 영역 순서·주요 Component·금지 기능 표

## Depends On
- CMP-SCR-001-destination-grid
- DATA-DESTINATIONS
- DATA-SAFETY
- CMP-COMMON-FAVORITES-SHARE

## Expected Files
`src/components/screens/scr001/DestinationDetailDrawer.tsx`

## Functional AC
- 대표 이미지, 300자+ 소개, 명소·체험 5개+, 추천/비추천 시기, 1일·3일 일정, 예상 예산, 교통, 음식 3개+, 문화·에티켓 3개+, 출처·최종 수정일을 표시한다(REQ-FUNC-004).
  - 해외 여행지는 "이 나라 안전정보 보기" 버튼으로 `CMP-SCR-001-safety-section`의 안전정보 Drawer로 전환한다(REQ-FUNC-006, `country_code` 일치).
  - 관련 여행지 최대 6개(같은 국가·테마, 비공개·현재 여행지 제외)를 하단에 표시한다(REQ-FUNC-009).
  - URL 공유 버튼 제공, Web Share API 실패 시 클립보드 복사로 폴백(REQ-FUNC-069).

## Visual AC
Desktop 우측 슬라이드 Drawer(480-560px, `{elevation.drawer-modal}`), Mobile 하단 풀스크린 시트. 상단 고정 헤더 + 44px 닫기 버튼.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] 대표 이미지, 300자+ 소개, 명소·체험 5개+, 추천/비추천 시기, 1일·3일 일정, 예상 예산, 교통, 음식 3개+, 문화·에티켓 3개+, 출처·최종 수정일을 표시한다(REQ-FUNC-004). — Verify: TEST-E2E-PUBLIC-SMOKE
- [Functional AC] 해외 여행지는 "이 나라 안전정보 보기" 버튼으로 `CMP-SCR-001-safety-section`의 안전정보 Drawer로 전환한다(REQ-FUNC-006, `country_code` 일치). — Verify: TEST-E2E-PUBLIC-SMOKE
- [Functional AC] 관련 여행지 최대 6개(같은 국가·테마, 비공개·현재 여행지 제외)를 하단에 표시한다(REQ-FUNC-009). — Verify: TEST-E2E-PUBLIC-SMOKE
- [Functional AC] URL 공유 버튼 제공, Web Share API 실패 시 클립보드 복사로 폴백(REQ-FUNC-069). — Verify: TEST-E2E-PUBLIC-SMOKE
- [Visual AC] Desktop 우측 슬라이드 Drawer(480-560px, `{elevation.drawer-modal}`), Mobile 하단 풀스크린 시트. 상단 고정 헤더 + 44px 닫기 버튼. — Verify: TEST-E2E-PUBLIC-SMOKE

## Verify
TEST-E2E-PUBLIC-SMOKE

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-PUBLIC-SMOKE`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
