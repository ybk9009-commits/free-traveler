# CMP-SCR-003-hotel-form — 숙소 조건 입력·요약·외부 이동

```task-meta
{
  "task_id": "CMP-SCR-003-hotel-form",
  "type": "component",
  "depends_on": [
    "CMP-SCR-003-intro-tabs",
    "INFRA-EXTERNAL-LINK-SAFETY",
    "CMP-COMMON-TOAST"
  ],
  "requirements": [
    "REQ-FUNC-019",
    "REQ-FUNC-020",
    "REQ-FUNC-021",
    "REQ-FUNC-022",
    "REQ-FUNC-023",
    "REQ-FUNC-024",
    "REQ-FUNC-025",
    "REQ-FUNC-026",
    "REQ-NF-017"
  ],
  "no_server_persistence": true
}
```

## Context
이 Task는 SCR-003 화면이 필요로 하는 '숙소 조건 입력·요약·외부 이동' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리 항공·숙소 입력값은 서버로 전달하지 않는 원칙(§1, §3.2/§3.3)을 따른다.

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-NF-017
- 정규화된 Requirement ID: REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-NF-017

## Screen / Route / Page Entry
- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: `src/app/travel-tools/page.tsx`(PO-SCR-003이 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬
- `design-reference/UI_CONTRACT.md` SCR-003 영역 순서·주요 Component·금지 기능 표

## Depends On
- CMP-SCR-003-intro-tabs
- INFRA-EXTERNAL-LINK-SAFETY
- CMP-COMMON-TOAST

## Expected Files
`src/components/screens/scr003/HotelForm.tsx`

## Functional AC
- 국가/지역(종속)/체크인/체크아웃을 필수 입력으로 제공한다(REQ-FUNC-019, 020).
  - 체크인이 오늘 이전이거나 체크아웃이 체크인과 같거나 빠르면 제출을 차단한다(REQ-FUNC-021, `TEST-UNIT-TRAVEL-DATES`).
  - 유효 입력 후 요약을 표시하며 폼 값과 정확히 일치해야 한다(REQ-FUNC-022).
  - 비전달 고지를 폼과 요약에 고정 표시한다(REQ-FUNC-023).
  - `HOTEL_OUTBOUND_URL`을 `INFRA-EXTERNAL-LINK-SAFETY`로 새 탭 이동한다(REQ-FUNC-024).
  - URL 오류 시 이동을 차단하고 입력값을 유지한 채 오류를 표시한다(REQ-FUNC-026 축소).

## Visual AC
`CMP-SCR-003-flight-form`과 동일한 좌우 분할/입력 패턴을 재사용한다.

## Security/Privacy AC
**국가·지역·날짜 입력값은 브라우저 메모리 상태로만 처리하고 서버 API·DB·서버 로그·분석 이벤트에 저장하지 않는다(REQ-FUNC-025, REQ-NF-017, CON-01). 이 Task를 위한 서버 API Route를 만들지 않는다.**

## Test Cases
- [Functional AC] 국가/지역(종속)/체크인/체크아웃을 필수 입력으로 제공한다(REQ-FUNC-019, 020). — Verify: TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS
- [Functional AC] 체크인이 오늘 이전이거나 체크아웃이 체크인과 같거나 빠르면 제출을 차단한다(REQ-FUNC-021, `TEST-UNIT-TRAVEL-DATES`). — Verify: TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS
- [Functional AC] 유효 입력 후 요약을 표시하며 폼 값과 정확히 일치해야 한다(REQ-FUNC-022). — Verify: TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS
- [Functional AC] 비전달 고지를 폼과 요약에 고정 표시한다(REQ-FUNC-023). — Verify: TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS
- [Visual AC] `CMP-SCR-003-flight-form`과 동일한 좌우 분할/입력 패턴을 재사용한다. — Verify: TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS
- [Security/Privacy AC] **국가·지역·날짜 입력값은 브라우저 메모리 상태로만 처리하고 서버 API·DB·서버 로그·분석 이벤트에 저장하지 않는다(REQ-FUNC-025, REQ-NF-017, CON-01). 이 Task를 위한 서버 API Route를 만들지 않는다.** — Verify: TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS

## Verify
TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
- 국가·지역·날짜 입력값을 서버 API·DB·서버 로그·분석 이벤트로 전달하지 않는다.
- 이 Task를 위한 서버 API Route를 만들지 않는다.
