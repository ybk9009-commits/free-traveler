# TASK-CMP-COMMON-RESPONSIVE-LAYOUT — 320px~Desktop 반응형 레이아웃 규칙

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-065, REQ-NF-006
- **Screen:** 공통(5개 Screen)
- **Route:** 공통(5개 Route)
- **Page Entry:** `src/app/layout.tsx`, `src/app/globals.css`
- **Depends On:** —
- **Expected Files:** `src/app/globals.css`(Tailwind 기반 토큰/브레이크포인트 정의), `tailwind.config.ts`(필요 시)
- **Functional AC:**
  - `design-reference/D-001/DESIGN.md`의 Color/Typography/Spacing/Radius/Shadow 토큰을 Tailwind 테마로 등록한다.
  - Desktop 1440px 기준·콘텐츠 1200-1280px 중앙 정렬, Mobile 390px·좌우 16-20px 여백, Tablet 744-1279px 2열 전환 규칙을 전역 유틸로 제공한다.
  - 320px부터 가로 스크롤·겹침 없이 핵심 기능이 동작해야 한다(REQ-FUNC-065 AC).
- **Visual AC:** 모든 화면이 D-001 토큰만 사용하고 임의 색상을 추가하지 않는다(D-001 § Do Not).
- **Security/Privacy AC:** 해당 없음.
- **Verify:** TEST-A11Y-AXE(뷰포트 포함), E2E-PUBLIC-SMOKE(모바일 뷰포트)
- **Priority:** P0
