# PO-SCR-002 — 대표 소개 화면 조립 (`/about`)

```task-meta
{
  "task_id": "PO-SCR-002",
  "type": "page_owner",
  "depends_on": [
    "CMP-SCR-002-hero-profile",
    "CMP-SCR-002-stats-story",
    "CMP-SCR-002-timeline",
    "CMP-SCR-002-countries-gallery",
    "CMP-SCR-002-favorite-destinations-cta",
    "CMP-COMMON-HEADER-FOOTER",
    "DATA-REPRESENTATIVE",
    "DATA-DESTINATIONS"
  ],
  "requirements": [
    "REQ-FUNC-057",
    "REQ-FUNC-058",
    "REQ-FUNC-059",
    "REQ-FUNC-060",
    "REQ-FUNC-061",
    "REQ-FUNC-062",
    "REQ-FUNC-063",
    "REQ-FUNC-064",
    "REQ-FUNC-065"
  ],
  "section_order": [
    "hero-profile",
    "travel-stats",
    "story-intro",
    "travel-timeline",
    "visited-countries",
    "photo-gallery",
    "favorite-destinations-cta"
  ],
  "min_content_counts": {
    "travel-stats": 3,
    "story-intro": 2,
    "travel-timeline": 6,
    "visited-countries": 30,
    "photo-gallery": 8,
    "favorite-destinations-cta": 4
  },
  "empty_state_required": true,
  "forbids_placeholder": true
}
```

## Context
이 Task는 SCR-002 화면이 필요로 하는 '대표 소개 화면 조립 (`/about`)' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-057~063, 064, 065
- 정규화된 Requirement ID: REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-061, REQ-FUNC-062, REQ-FUNC-063, REQ-FUNC-064, REQ-FUNC-065

## Screen / Route / Page Entry
- Screen: SCR-002
- Route: `/about`
- Page Entry: `src/app/about/page.tsx`

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬
- `design-reference/UI_CONTRACT.md` SCR-002 영역 순서·주요 Component·금지 기능 표

## Depends On
- CMP-SCR-002-hero-profile
- CMP-SCR-002-stats-story
- CMP-SCR-002-timeline
- CMP-SCR-002-countries-gallery
- CMP-SCR-002-favorite-destinations-cta
- CMP-COMMON-HEADER-FOOTER
- DATA-REPRESENTATIVE
- DATA-DESTINATIONS

## Expected Files
`src/app/about/page.tsx`(신규 생성)

## Functional AC
- **Section 순서**: 1) Profile Hero 2) 여행 지표 3) 소개·철학 4) Timeline 6개 5) 방문 국가 30개 6) Gallery 8개 7) 기억에 남는 여행지 4개 + CTA.
  - **데이터 출처**: 전 Section `DATA-REPRESENTATIVE`, 7번만 `DATA-DESTINATIONS` 딥링크.
  - **최소 수**: Timeline 6, 방문 국가 30, Gallery 8, 추천 여행지 4.
  - **반응형 밀도**: Hero 좌우 분할→Mobile 세로 스택, Gallery Desktop Grid→Mobile 1~2열.

## Visual AC
- Lorem ipsum·"준비 중"·"정보 확인 필요"·빈 카드 금지. 정적 콘텐츠 화면이라 Empty State가 발생하지 않지만, 이미지 로드 실패 시 대체 배경+alt 텍스트를 노출한다.
  - D-001 토큰만 사용한다.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] **Section 순서**: 1) Profile Hero 2) 여행 지표 3) 소개·철학 4) Timeline 6개 5) 방문 국가 30개 6) Gallery 8개 7) 기억에 남는 여행지 4개 + CTA. — Verify: TEST-E2E-PUBLIC-SMOKE
- [Functional AC] **데이터 출처**: 전 Section `DATA-REPRESENTATIVE`, 7번만 `DATA-DESTINATIONS` 딥링크. — Verify: TEST-E2E-PUBLIC-SMOKE
- [Functional AC] **최소 수**: Timeline 6, 방문 국가 30, Gallery 8, 추천 여행지 4. — Verify: TEST-E2E-PUBLIC-SMOKE
- [Functional AC] **반응형 밀도**: Hero 좌우 분할→Mobile 세로 스택, Gallery Desktop Grid→Mobile 1~2열. — Verify: TEST-E2E-PUBLIC-SMOKE
- [Visual AC] Lorem ipsum·"준비 중"·"정보 확인 필요"·빈 카드 금지. 정적 콘텐츠 화면이라 Empty State가 발생하지 않지만, 이미지 로드 실패 시 대체 배경+alt 텍스트를 노출한다. — Verify: TEST-E2E-PUBLIC-SMOKE

## Verify
TEST-E2E-PUBLIC-SMOKE

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-PUBLIC-SMOKE`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
- `python scripts/audit_tasks.py` 감사를 통과한다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
