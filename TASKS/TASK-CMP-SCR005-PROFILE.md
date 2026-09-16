# TASK-CMP-SCR005-PROFILE — Member 프로필 탭

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-045, REQ-FUNC-068
- **Screen:** SCR-005
- **Route:** `/account`
- **Page Entry:** `src/app/account/page.tsx`(PAGE-SCR005가 조립)
- **Depends On:** INFRA-AUTH-SESSION, INFRA-ADULT-VERIFICATION, INFRA-USER-DELETE, CMP-COMMON-FAVORITES-SHARE
- **Expected Files:** `src/components/screens/scr005/ProfileTab.tsx`
- **Functional AC:**
  - 닉네임, 연령대, 여행 스타일(필수), 성별(선택), 자기소개를 편집한다(REQ-FUNC-029).
  - 성인 확인 상태(완료/미완료) 및 확인 시각을 표시하고, 미완료 시 확인 절차로 안내한다(REQ-FUNC-028).
  - 비밀번호 변경, 즐겨찾기 목록(`localStorage`, REQ-FUNC-068), 회원 탈퇴(`INFRA-USER-DELETE` 호출)를 제공한다(REQ-FUNC-045).
- **Visual AC:** Member 상태로만 렌더링(Guest/Admin과 혼합 렌더링 금지).
- **Security/Privacy AC:** 생년월일 입력 필드를 두지 않는다.
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1
