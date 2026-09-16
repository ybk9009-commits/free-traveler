# CMP-SCR-003-flight-form — 항공 조건 입력·요약·외부 이동

```task-meta
{
  "task_id": "CMP-SCR-003-flight-form",
  "type": "component",
  "depends_on": [
    "CMP-SCR-003-intro-tabs",
    "INFRA-EXTERNAL-LINK-SAFETY",
    "CMP-COMMON-TOAST"
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
    "REQ-FUNC-054",
    "REQ-NF-017"
  ],
  "no_server_persistence": true
}
```

## Context
이 Task는 SCR-003 화면이 필요로 하는 '항공 조건 입력·요약·외부 이동' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리 항공·숙소 입력값은 서버로 전달하지 않는 원칙(§1, §3.2/§3.3)을 따른다.

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-054, REQ-NF-017
- 정규화된 Requirement ID: REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-054, REQ-NF-017

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
`src/components/screens/scr003/FlightForm.tsx`

## Functional AC
- 국가/지역(국가 종속 Select, 국가 변경 시 지역 초기화)/출발일/귀국일을 필수 입력으로 제공한다(REQ-FUNC-011, 012).
  - 출발일이 오늘 이전이거나 귀국일이 출발일보다 빠르면 제출을 차단한다(REQ-FUNC-013, `TEST-UNIT-TRAVEL-DATES`로 검증).
  - 유효 입력 후 요약 단계(수정 버튼 포함, 값은 브라우저 세션 동안 유지)를 표시한다(REQ-FUNC-014).
  - "입력값은 외부 사이트로 전달되지 않습니다" 고지를 폼과 요약 모두에 고정 표시한다(REQ-FUNC-015).
  - "항공편 보러 가기" 클릭 시 `INFRA-EXTERNAL-LINK-SAFETY`로 `FLIGHT_OUTBOUND_URL`을 새 탭 이동한다. 목적지·날짜 쿼리는 절대 붙이지 않는다(REQ-FUNC-016).
  - 검색 Tip 3개 이상을 표시한다(콘텐츠 계약).
  - "안전정보는 공식 판단을 대체하지 않습니다" 고지를 공유한다(REQ-FUNC-054).
  - URL 오류(허용목록 밖/네트워크 실패) 시 이동을 차단하고 인라인 오류 + 재시도 버튼을 제공한다(REQ-FUNC-018 축소, 운영 오류 로그 저장 화면은 만들지 않음).

## Visual AC
Form+Tip 좌우 분할(Desktop) / 세로 스택(Mobile). 입력창 52px 높이, 포커스 시 2px `{colors.focus-ring}`.

## Security/Privacy AC
**국가·지역·날짜 입력값은 브라우저 메모리 상태로만 처리하고 서버 API·DB·서버 로그·분석 이벤트에 저장하지 않는다(REQ-FUNC-017, REQ-NF-017, CON-01). 이 Task를 위한 서버 API Route를 만들지 않는다.**

## Test Cases
- [Functional AC] 국가/지역(국가 종속 Select, 국가 변경 시 지역 초기화)/출발일/귀국일을 필수 입력으로 제공한다(REQ-FUNC-011, 012). — Verify: TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS(쿼리 미포함·noopener 속성 확인)
- [Functional AC] 출발일이 오늘 이전이거나 귀국일이 출발일보다 빠르면 제출을 차단한다(REQ-FUNC-013, `TEST-UNIT-TRAVEL-DATES`로 검증). — Verify: TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS(쿼리 미포함·noopener 속성 확인)
- [Functional AC] 유효 입력 후 요약 단계(수정 버튼 포함, 값은 브라우저 세션 동안 유지)를 표시한다(REQ-FUNC-014). — Verify: TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS(쿼리 미포함·noopener 속성 확인)
- [Functional AC] "입력값은 외부 사이트로 전달되지 않습니다" 고지를 폼과 요약 모두에 고정 표시한다(REQ-FUNC-015). — Verify: TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS(쿼리 미포함·noopener 속성 확인)
- [Visual AC] Form+Tip 좌우 분할(Desktop) / 세로 스택(Mobile). 입력창 52px 높이, 포커스 시 2px `{colors.focus-ring}`. — Verify: TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS(쿼리 미포함·noopener 속성 확인)
- [Security/Privacy AC] **국가·지역·날짜 입력값은 브라우저 메모리 상태로만 처리하고 서버 API·DB·서버 로그·분석 이벤트에 저장하지 않는다(REQ-FUNC-017, REQ-NF-017, CON-01). 이 Task를 위한 서버 API Route를 만들지 않는다.** — Verify: TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS(쿼리 미포함·noopener 속성 확인)

## Verify
TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS(쿼리 미포함·noopener 속성 확인)

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-UNIT-TRAVEL-DATES, TEST-E2E-TRAVEL-TOOLS(쿼리 미포함·noopener 속성 확인)`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
- 국가·지역·날짜 입력값을 서버 API·DB·서버 로그·분석 이벤트로 전달하지 않는다.
- 이 Task를 위한 서버 API Route를 만들지 않는다.
