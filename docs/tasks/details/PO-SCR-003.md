# PO-SCR-003 — 통합 여행 준비 화면 조립 (`/travel-tools`)

```task-meta
{
  "task_id": "PO-SCR-003",
  "type": "page_owner",
  "depends_on": [
    "CMP-SCR-003-intro-tabs",
    "CMP-SCR-003-flight-form",
    "CMP-SCR-003-hotel-form",
    "CMP-SCR-003-mate-write-form",
    "CMP-COMMON-HEADER-FOOTER",
    "CMP-COMMON-TOAST",
    "API-MATE-POSTS",
    "INFRA-AUTH-SESSION",
    "INFRA-ADULT-VERIFICATION"
  ],
  "requirements": [
    "REQ-FUNC-011",
    "REQ-FUNC-012",
    "REQ-FUNC-013",
    "REQ-FUNC-014",
    "REQ-FUNC-015",
    "REQ-FUNC-016",
    "REQ-FUNC-017",
    "REQ-FUNC-018",
    "REQ-FUNC-019",
    "REQ-FUNC-020",
    "REQ-FUNC-021",
    "REQ-FUNC-022",
    "REQ-FUNC-023",
    "REQ-FUNC-024",
    "REQ-FUNC-025",
    "REQ-FUNC-026",
    "REQ-FUNC-027",
    "REQ-FUNC-028",
    "REQ-FUNC-029",
    "REQ-FUNC-030",
    "REQ-FUNC-031",
    "REQ-FUNC-032",
    "REQ-FUNC-054",
    "REQ-FUNC-064",
    "REQ-FUNC-065",
    "REQ-FUNC-080"
  ],
  "section_order": [
    "intro-3step",
    "tabs-flight-hotel-mate",
    "condition-form",
    "summary-outbound-action",
    "tips-notice",
    "mate-post-form-or-unauthorized"
  ],
  "min_content_counts": {
    "tabs-flight-hotel-mate": 3,
    "tips-notice": 3
  },
  "empty_state_required": true,
  "forbids_placeholder": true
}
```

## Context
이 Task는 SCR-003 화면이 필요로 하는 '통합 여행 준비 화면 조립 (`/travel-tools`)' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-011~032, 054, 064, 065, 080
- 정규화된 Requirement ID: REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-030, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-054, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-080

## Screen / Route / Page Entry
- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: `src/app/travel-tools/page.tsx`

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬
- `design-reference/UI_CONTRACT.md` SCR-003 영역 순서·주요 Component·금지 기능 표

## Depends On
- CMP-SCR-003-intro-tabs
- CMP-SCR-003-flight-form
- CMP-SCR-003-hotel-form
- CMP-SCR-003-mate-write-form
- CMP-COMMON-HEADER-FOOTER
- CMP-COMMON-TOAST
- API-MATE-POSTS
- INFRA-AUTH-SESSION
- INFRA-ADULT-VERIFICATION

## Expected Files
`src/app/travel-tools/page.tsx`(신규 생성)

## Functional AC
- **Section 순서**: 1) Intro(3단계 안내) 2) 탭(항공편/숙소/동행 구하기) 3) 여행정보 Form(선택 탭에 따라 항공 또는 숙소) 4) 입력 요약·외부 이동 5) 찾기 Tip 3개 6) 동행 작성 또는 로그인 안내·안전 안내.
  - **항공·숙소·동행 작성 영역은 각각 별도 Component(`CMP-SCR-003-flight-form`/`HOTEL-FORM`/`MATE-WRITE-FORM`)로 분리해 조립한다(규칙 9).** 탭 전환은 실제로 3개 탭 모두 완전히 동작해야 한다(스텁 금지).
  - **데이터 출처**: 항공/숙소 입력은 브라우저 세션 상태(서버 없음), 동행 작성은 `API-MATE-POSTS`.
  - Tip 최소 3개.

## Visual AC
- Lorem ipsum·"준비 중"·빈 카드 금지. 완성형 Empty State가 필요한 목록형 Section은 없음(폼 화면).
  - Desktop Form+Tip 좌우 분할, Mobile 세로 스택.

## Security/Privacy AC
항공·숙소 폼의 국가·지역·날짜 입력값은 서버·DB·URL query·분석 이벤트 어디에도 전달하지 않는다(REQ-FUNC-017, 025, CON-01, CON-02 — `CMP-SCR-003-flight-form`/`HOTEL-FORM`의 Security/Privacy AC 상속).

## Test Cases
- [Functional AC] **Section 순서**: 1) Intro(3단계 안내) 2) 탭(항공편/숙소/동행 구하기) 3) 여행정보 Form(선택 탭에 따라 항공 또는 숙소) 4) 입력 요약·외부 이동 5) 찾기 Tip 3개 6) 동행 작성 또는 로그인 안내·안전 안내. — Verify: TEST-E2E-TRAVEL-TOOLS, TEST-UNIT-TRAVEL-DATES
- [Functional AC] **항공·숙소·동행 작성 영역은 각각 별도 Component(`CMP-SCR-003-flight-form`/`HOTEL-FORM`/`MATE-WRITE-FORM`)로 분리해 조립한다(규칙 9).** 탭 전환은 실제로 3개 탭 모두 완전히 동작해야 한다(스텁 금지). — Verify: TEST-E2E-TRAVEL-TOOLS, TEST-UNIT-TRAVEL-DATES
- [Functional AC] **데이터 출처**: 항공/숙소 입력은 브라우저 세션 상태(서버 없음), 동행 작성은 `API-MATE-POSTS`. — Verify: TEST-E2E-TRAVEL-TOOLS, TEST-UNIT-TRAVEL-DATES
- [Functional AC] Tip 최소 3개. — Verify: TEST-E2E-TRAVEL-TOOLS, TEST-UNIT-TRAVEL-DATES
- [Visual AC] Lorem ipsum·"준비 중"·빈 카드 금지. 완성형 Empty State가 필요한 목록형 Section은 없음(폼 화면). — Verify: TEST-E2E-TRAVEL-TOOLS, TEST-UNIT-TRAVEL-DATES
- [Security/Privacy AC] 항공·숙소 폼의 국가·지역·날짜 입력값은 서버·DB·URL query·분석 이벤트 어디에도 전달하지 않는다(REQ-FUNC-017, 025, CON-01, CON-02 — `CMP-SCR-003-flight-form`/`HOTEL-FORM`의 Security/Privacy AC 상속). — Verify: TEST-E2E-TRAVEL-TOOLS, TEST-UNIT-TRAVEL-DATES

## Verify
TEST-E2E-TRAVEL-TOOLS, TEST-UNIT-TRAVEL-DATES

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-TRAVEL-TOOLS, TEST-UNIT-TRAVEL-DATES`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
- `python scripts/audit_tasks.py` 감사를 통과한다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
