# TASK-CMP-COMMON-HEADER-FOOTER — 전역 Header/Footer(`layout.tsx`)

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-064
- **Screen:** 공통(5개 Screen)
- **Route:** 공통(5개 Route)
- **Page Entry:** `src/app/layout.tsx`
- **Depends On:** INFRA-AUTH-SESSION
- **Expected Files:** `src/components/common/Header.tsx`, `src/components/common/Footer.tsx`, `src/app/layout.tsx`(수정)
- **Functional AC:**
  - Header: 좌측 `Free Traveler` 워드마크, 중앙 내비게이션(여행지/여행 준비/동행 찾기/대표 소개), 우측 계정 영역(로그인 전 "로그인" 버튼 / 로그인 후 아바타+닉네임 메뉴). 활성 라우트는 코랄 텍스트+밑줄.
  - Footer: 3열(서비스 소개/정책/안전 정보 출처), legal band, Mobile 1열 스택.
  - 핵심 6개 기능과 정책 페이지에 2회 이내 이동 가능해야 한다(REQ-FUNC-064 AC).
- **Visual AC:** Desktop 72px 높이, 하단 1px `{colors.hairline}`. Mobile은 로고+햄버거로 축약, 내비게이션은 풀스크린 시트.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- **Priority:** P0
