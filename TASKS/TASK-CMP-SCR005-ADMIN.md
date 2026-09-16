# TASK-CMP-SCR005-ADMIN — Admin 관리 영역(신고 큐·외부 URL)

- **Category:** Component
- **Implementation Status:** IMPLEMENT(간소화)
- **Requirement Ref:** REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-077
- **Screen:** SCR-005
- **Route:** `/account`
- **Page Entry:** `src/app/account/page.tsx`(PAGE-SCR005가 조립)
- **Depends On:** API-ADMIN-SETTINGS
- **Expected Files:** `src/components/screens/scr005/AdminConsole.tsx`
- **Functional AC:**
  - Moderator/Admin 역할에서만 "관리" 영역을 렌더링한다(일반 Member/Guest에게는 이 컴포넌트 자체를 렌더링하지 않는다 — role 판정은 서버에서 수행).
  - 신고 큐: 대상/사유코드/접수시각/상태 목록 + OPEN→RESOLVED/DISMISSED 상태 변경 + 대상 게시물 숨김 액션(REQ-FUNC-041, 042).
  - 외부 URL 설정: `FLIGHT_OUTBOUND_URL`/`HOTEL_OUTBOUND_URL` 등 HTTPS 허용목록 Form(REQ-FUNC-077).
  - **통계 차트·대시보드 시각화는 사용하지 않고 목록 + 상태 변경 액션으로만 구성한다**(D-001 § Do Not, `docs/PROJECT_SCOPE.md` §2).
- **Visual AC:** 관리 Intro 1~2문장 + 목록형 UI(카드 그리드 아님).
- **Security/Privacy AC:** 클라이언트에서 role을 신뢰하지 않고 `API-ADMIN-SETTINGS` 서버 측 role 검사에 의존한다.
- **Verify:** E2E-MATE-AUTH, TEST-RLS-BASIC
- **Priority:** P2

### 6.6 공통(Common)
