# CMP-COMMON-HEADER-FOOTER — 전역 Header/Footer(`layout.tsx`)

```task-meta
{
  "task_id": "CMP-COMMON-HEADER-FOOTER",
  "type": "component",
  "depends_on": [
    "INFRA-AUTH-SESSION"
  ],
  "requirements": [
    "REQ-FUNC-064"
  ]
}
```

## Context
이 Task는 공통(5개 Screen) 화면이 필요로 하는 '전역 Header/Footer(`layout.tsx`)' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-064
- 정규화된 Requirement ID: REQ-FUNC-064

## Screen / Route / Page Entry
- Screen: 공통(5개 Screen)
- Route: 공통(5개 Route)
- Page Entry: `src/app/layout.tsx`

## Design Ref
- `design-reference/D-001/DESIGN.md` § Header·Footer

## Depends On
- INFRA-AUTH-SESSION

## Expected Files
`src/components/common/Header.tsx`, `src/components/common/Footer.tsx`, `src/app/layout.tsx`(수정)

## Functional AC
- Header: 좌측 `Free Traveler` 워드마크, 중앙 내비게이션(여행지/여행 준비/동행 찾기/대표 소개), 우측 계정 영역(로그인 전 "로그인" 버튼 / 로그인 후 아바타+닉네임 메뉴). 활성 라우트는 코랄 텍스트+밑줄.
  - Footer: 3열(서비스 소개/정책/안전 정보 출처), legal band, Mobile 1열 스택.
  - 핵심 6개 기능과 정책 페이지에 2회 이내 이동 가능해야 한다(REQ-FUNC-064 AC).

## Visual AC
Desktop 72px 높이, 하단 1px `{colors.hairline}`. Mobile은 로고+햄버거로 축약, 내비게이션은 풀스크린 시트.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] Header: 좌측 `Free Traveler` 워드마크, 중앙 내비게이션(여행지/여행 준비/동행 찾기/대표 소개), 우측 계정 영역(로그인 전 "로그인" 버튼 / 로그인 후 아바타+닉네임 메뉴). 활성 라우트는 코랄 텍스트+밑줄. — Verify: TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- [Functional AC] Footer: 3열(서비스 소개/정책/안전 정보 출처), legal band, Mobile 1열 스택. — Verify: TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- [Functional AC] 핵심 6개 기능과 정책 페이지에 2회 이내 이동 가능해야 한다(REQ-FUNC-064 AC). — Verify: TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- [Visual AC] Desktop 72px 높이, 하단 1px `{colors.hairline}`. Mobile은 로고+햄버거로 축약, 내비게이션은 풀스크린 시트. — Verify: TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE

## Verify
TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
