# TASK-CMP-SCR003-MATE-WRITE-FORM — 동행 모집글 작성 / 로그인 안내

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-080
- **Screen:** SCR-003
- **Route:** `/travel-tools`
- **Page Entry:** `src/app/travel-tools/page.tsx`(PAGE-SCR003이 조립)
- **Depends On:** CMP-SCR003-INTRO-TABS, API-MATE-POSTS, INFRA-AUTH-SESSION, INFRA-ADULT-VERIFICATION, INFRA-CONTACT-DETECTION, CMP-COMMON-TOAST
- **Expected Files:** `src/components/screens/scr003/MateWriteForm.tsx`
- **Functional AC:**
  - 미인증(비로그인 또는 성인확인 미완료) 시 안내 카드 + "로그인/가입하기" CTA(`/account`)를 표시한다(REQ-FUNC-027, 028).
  - 인증된 사용자에게 제목/국가·지역/기간/인원/선호조건/여행스타일/설명 Form + 안전수칙 동의 체크박스를 표시한다(REQ-FUNC-031).
  - `API-MATE-POSTS` 제출 시 서버 연락처 탐지 결과가 양성이면 인라인 오류와 수정 안내를 표시한다(REQ-FUNC-032).
  - 약관/방침/동행 안전수칙/콘텐츠 면책 고지에 동의해야 제출 가능하며, 동의 시각을 서버에 기록한다(REQ-FUNC-080; 약관 본문 자체는 5개 Screen 외 정적 legal 페이지 — 이 Task 범위는 동의 체크박스와 기록 연동까지).
  - 제출 완료 시 `CMP-COMMON-TOAST` 성공 알림 + `/mates` 작성한 글 상세로 이동한다.
- **Visual AC:** Form 좌우 분할(Desktop)/세로 스택(Mobile).
- **Security/Privacy AC:** 서버 액션에서 이메일 인증·성인확인 세션을 재검증한다(클라이언트 상태만으로 게이트하지 않음).
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1

### 6.4 SCR-004
