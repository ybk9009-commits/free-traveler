# PO-SCR-001 — 메인 화면 조립 (`/`)

```task-meta
{
  "task_id": "PO-SCR-001",
  "type": "page_owner",
  "depends_on": [
    "CMP-SCR-001-hero-search",
    "CMP-SCR-001-destination-grid",
    "CMP-SCR-001-destination-detail-drawer",
    "CMP-SCR-001-safety-section",
    "CMP-SCR-001-recent-mates",
    "CMP-SCR-001-about-summary",
    "CMP-COMMON-HEADER-FOOTER",
    "CMP-COMMON-EMPTY-STATE",
    "DATA-DESTINATIONS",
    "DATA-SAFETY",
    "DATA-REPRESENTATIVE"
  ],
  "requirements": [
    "REQ-FUNC-001",
    "REQ-FUNC-002",
    "REQ-FUNC-003",
    "REQ-FUNC-004",
    "REQ-FUNC-005",
    "REQ-FUNC-006",
    "REQ-FUNC-007",
    "REQ-FUNC-008",
    "REQ-FUNC-009",
    "REQ-FUNC-010",
    "REQ-FUNC-047",
    "REQ-FUNC-048",
    "REQ-FUNC-049",
    "REQ-FUNC-050",
    "REQ-FUNC-051",
    "REQ-FUNC-052",
    "REQ-FUNC-053",
    "REQ-FUNC-054",
    "REQ-FUNC-057",
    "REQ-FUNC-064",
    "REQ-FUNC-065",
    "REQ-FUNC-067",
    "REQ-FUNC-068",
    "REQ-FUNC-069",
    "REQ-FUNC-070"
  ],
  "section_order": [
    "hero-search",
    "domestic-destinations",
    "overseas-destinations",
    "travel-theme-chips",
    "country-safety",
    "recent-mates",
    "about-summary"
  ],
  "min_content_counts": {
    "domestic-destinations": 6,
    "overseas-destinations": 6,
    "travel-theme-chips": 6,
    "country-safety": 6,
    "recent-mates": 3
  },
  "empty_state_required": true,
  "forbids_placeholder": true,
  "starter_template_removal_required": true
}
```

## Context
이 Task는 SCR-001 화면이 필요로 하는 '메인 화면 조립 (`/`)' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-001~010, 047~054, 057, 064, 065, 067~070(조립 수준)
- 정규화된 Requirement ID: REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-007, REQ-FUNC-008, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-052, REQ-FUNC-053, REQ-FUNC-054, REQ-FUNC-057, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-067, REQ-FUNC-068, REQ-FUNC-069, REQ-FUNC-070

## Screen / Route / Page Entry
- Screen: SCR-001
- Route: `/`
- Page Entry: `src/app/page.tsx`

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬
- `design-reference/UI_CONTRACT.md` SCR-001 영역 순서·주요 Component·금지 기능 표

## Depends On
- CMP-SCR-001-hero-search
- CMP-SCR-001-destination-grid
- CMP-SCR-001-destination-detail-drawer
- CMP-SCR-001-safety-section
- CMP-SCR-001-recent-mates
- CMP-SCR-001-about-summary
- CMP-COMMON-HEADER-FOOTER
- CMP-COMMON-EMPTY-STATE
- DATA-DESTINATIONS
- DATA-SAFETY
- DATA-REPRESENTATIVE

## Expected Files
`src/app/page.tsx`(create-next-app 스타터 템플릿 완전 교체 — 현재 `next.svg`, "To get started, edit the page.tsx", Vercel/Next.js 학습 링크가 남아 있음)

## Functional AC
- **Section 순서**(Header 제외 본문): 1) Hero(통합 검색) 2) 국내 여행지 6개 3) 해외 여행지 6개 4) 여행 동기(테마) 6개 5) 국가별 주의사항 6개 6) 최근 동행글 3개 또는 완성형 Empty State 7) free_traveler 소개 — 화면별 콘텐츠 계약과 정확히 일치해야 한다.
  - **Section별 데이터 출처**: 2·3은 `DATA-DESTINATIONS`(scope=DOMESTIC/OVERSEAS), 5는 `DATA-SAFETY`, 6은 Supabase `MATE_POST`(`DB-ACCESS`), 7은 `DATA-REPRESENTATIVE`.
  - **최소 Card 수**: 국내 6, 해외 6, 테마 Chip 6, 안전정보 6, 최근 동행 최대 3(0건이면 Empty State).
  - **반응형 콘텐츠 밀도**: Desktop Card Grid 3열 → Tablet 2열 → Mobile 1열. Hero는 Desktop 뷰포트 60-70%로 제한해 로드 즉시 다음 Section 상단이 보이게 한다.
  - 모든 Component/Data Task를 실제로 연결한다(더미 데이터·하드코딩 텍스트 금지).

## Visual AC
- **Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 카드를 절대 두지 않는다.**
  - 콘텐츠가 없는 Section(최근 동행 0건 등)은 `CMP-COMMON-EMPTY-STATE`(상황 설명+이용 방법+CTA 3요소)로 대체하며, 빈 화면이나 무한 스피너를 남기지 않는다.
  - D-001 토큰(Color/Typography/Radius/Spacing/Shadow) 외 임의 색상·폰트를 추가하지 않는다.

## Security/Privacy AC
해당 없음(공개 페이지, 로그인 불필요).

## Test Cases
- [Functional AC] **Section 순서**(Header 제외 본문): 1) Hero(통합 검색) 2) 국내 여행지 6개 3) 해외 여행지 6개 4) 여행 동기(테마) 6개 5) 국가별 주의사항 6개 6) 최근 동행글 3개 또는 완성형 Empty State 7) free_traveler 소개 — 화면별 콘텐츠 계약과 정확히 일치해야 한다. — Verify: TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- [Functional AC] **Section별 데이터 출처**: 2·3은 `DATA-DESTINATIONS`(scope=DOMESTIC/OVERSEAS), 5는 `DATA-SAFETY`, 6은 Supabase `MATE_POST`(`DB-ACCESS`), 7은 `DATA-REPRESENTATIVE`. — Verify: TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- [Functional AC] **최소 Card 수**: 국내 6, 해외 6, 테마 Chip 6, 안전정보 6, 최근 동행 최대 3(0건이면 Empty State). — Verify: TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- [Functional AC] **반응형 콘텐츠 밀도**: Desktop Card Grid 3열 → Tablet 2열 → Mobile 1열. Hero는 Desktop 뷰포트 60-70%로 제한해 로드 즉시 다음 Section 상단이 보이게 한다. — Verify: TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- [Visual AC] **Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 카드를 절대 두지 않는다.** — Verify: TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE

## Verify
TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
- `python scripts/audit_tasks.py` 감사를 통과한다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
