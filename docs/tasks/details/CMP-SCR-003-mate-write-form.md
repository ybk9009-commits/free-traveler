# CMP-SCR-003-mate-write-form — 동행 모집글 작성 / 로그인 안내

```task-meta
{
  "task_id": "CMP-SCR-003-mate-write-form",
  "type": "component",
  "depends_on": [
    "CMP-SCR-003-intro-tabs",
    "API-MATE-POSTS",
    "INFRA-AUTH-SESSION",
    "INFRA-ADULT-VERIFICATION",
    "INFRA-CONTACT-DETECTION",
    "CMP-COMMON-TOAST"
  ],
  "requirements": [
    "REQ-FUNC-027",
    "REQ-FUNC-028",
    "REQ-FUNC-031",
    "REQ-FUNC-032",
    "REQ-FUNC-080"
  ]
}
```

## Context
이 Task는 SCR-003 화면이 필요로 하는 '동행 모집글 작성 / 로그인 안내' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-080
- 정규화된 Requirement ID: REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-080

## Screen / Route / Page Entry
- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: `src/app/travel-tools/page.tsx`(PO-SCR-003이 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬
- `design-reference/UI_CONTRACT.md` SCR-003 영역 순서·주요 Component·금지 기능 표

## Depends On
- CMP-SCR-003-intro-tabs
- API-MATE-POSTS
- INFRA-AUTH-SESSION
- INFRA-ADULT-VERIFICATION
- INFRA-CONTACT-DETECTION
- CMP-COMMON-TOAST

## Expected Files
`src/components/screens/scr003/MateWriteForm.tsx`

## Functional AC
- 미인증(비로그인 또는 성인확인 미완료) 시 안내 카드 + "로그인/가입하기" CTA(`/account`)를 표시한다(REQ-FUNC-027, 028).
  - 인증된 사용자에게 제목/국가·지역/기간/인원/선호조건/여행스타일/설명 Form + 안전수칙 동의 체크박스를 표시한다(REQ-FUNC-031).
  - `API-MATE-POSTS` 제출 시 서버 연락처 탐지 결과가 양성이면 인라인 오류와 수정 안내를 표시한다(REQ-FUNC-032).
  - 약관/방침/동행 안전수칙/콘텐츠 면책 고지에 동의해야 제출 가능하며, 동의 시각을 서버에 기록한다(REQ-FUNC-080; 약관 본문 자체는 5개 Screen 외 정적 legal 페이지 — 이 Task 범위는 동의 체크박스와 기록 연동까지).
  - 제출 완료 시 `CMP-COMMON-TOAST` 성공 알림 + `/mates` 작성한 글 상세로 이동한다.

## Visual AC
Form 좌우 분할(Desktop)/세로 스택(Mobile).

## Security/Privacy AC
서버 액션에서 이메일 인증·성인확인 세션을 재검증한다(클라이언트 상태만으로 게이트하지 않음).

## Test Cases
- [Functional AC] 미인증(비로그인 또는 성인확인 미완료) 시 안내 카드 + "로그인/가입하기" CTA(`/account`)를 표시한다(REQ-FUNC-027, 028). — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] 인증된 사용자에게 제목/국가·지역/기간/인원/선호조건/여행스타일/설명 Form + 안전수칙 동의 체크박스를 표시한다(REQ-FUNC-031). — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] `API-MATE-POSTS` 제출 시 서버 연락처 탐지 결과가 양성이면 인라인 오류와 수정 안내를 표시한다(REQ-FUNC-032). — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] 약관/방침/동행 안전수칙/콘텐츠 면책 고지에 동의해야 제출 가능하며, 동의 시각을 서버에 기록한다(REQ-FUNC-080; 약관 본문 자체는 5개 Screen 외 정적 legal 페이지 — 이 Task 범위는 동의 체크박스와 기록 연동까지). — Verify: TEST-E2E-MATE-AUTH
- [Visual AC] Form 좌우 분할(Desktop)/세로 스택(Mobile). — Verify: TEST-E2E-MATE-AUTH
- [Security/Privacy AC] 서버 액션에서 이메일 인증·성인확인 세션을 재검증한다(클라이언트 상태만으로 게이트하지 않음). — Verify: TEST-E2E-MATE-AUTH

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
