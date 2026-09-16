# TASK-PAGE-SCR004 — 동행 조회 화면 조립 (`/mates`)

- **Category:** Page Owner
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-030, 033~040, 064, 065, 069
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`
- **Depends On:** CMP-SCR004-INTRO-CTA, CMP-SCR004-FILTER, CMP-SCR004-LIST, CMP-SCR004-DETAIL, CMP-SCR004-APPLY, CMP-SCR004-REPORT, CMP-SCR004-BLOCK, CMP-SCR004-GUIDANCE-SAFETY, CMP-COMMON-HEADER-FOOTER, CMP-COMMON-EMPTY-STATE, API-MATE-APPLICATIONS, API-REPORTS, API-BLOCKS
- **Expected Files:** `src/app/mates/page.tsx`(신규 생성)
- **Functional AC:**
  - **Section 순서**: 1) Intro 2) Filter·결과 요약 3) 동행 목록(최대 8+더보기) 4) 상세 5) 신청 방법 3단계 6) 안전·신고·차단 안내와 CTA.
  - **데이터 출처**: Supabase `mate_posts`/`mate_applications`/`blocks`(`DB-ACCESS`).
  - **반응형 콘텐츠 밀도**: Desktop 좌(목록)+우(상세) 동시 분할, Mobile은 목록 단일 컬럼 + 상세 하단 Drawer(좌우 분할 유지 금지).
- **Visual AC:**
  - Lorem ipsum·"준비 중"·빈 카드 금지.
  - 검색 결과 0건/전체 글 0건은 `CMP-COMMON-EMPTY-STATE`(상황 설명+필터 초기화+"첫 동행 글 작성하기" CTA)로 대체한다.
- **Security/Privacy AC:** 목록·상세 응답에 이메일·전화번호를 포함하지 않는다. 참가 신청은 로그인·성인확인 세션을 서버에서 재검증한다.
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1
