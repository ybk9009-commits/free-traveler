# TASK-CMP-SCR005-MY-ACTIVITY — Member 내 활동 탭

- **Category:** Component
- **Implementation Status:** IMPLEMENT / IMPLEMENT(축소, 자동마감표시)
- **Requirement Ref:** REQ-FUNC-036, REQ-FUNC-037(축소), REQ-FUNC-038, REQ-FUNC-040
- **Screen:** SCR-005
- **Route:** `/account`
- **Page Entry:** `src/app/account/page.tsx`(PAGE-SCR005가 조립)
- **Depends On:** API-MATE-POSTS, API-MATE-APPLICATIONS, API-BLOCKS, CMP-COMMON-EMPTY-STATE
- **Expected Files:** `src/components/screens/scr005/MyActivityTab.tsx`
- **Functional AC:**
  - "내가 쓴 동행 글" 목록(상태 배지, 수정·마감·삭제 액션) + "받은 참가 요청"(승인/거절, REQ-FUNC-036) + "내가 보낸 참가 신청"(상태별 목록, REQ-FUNC-034) + "차단 목록"(해제 버튼, REQ-FUNC-040) + "새 동행 글 작성" CTA(`/travel-tools`)를 표시한다.
  - 승인된 신청자가 있는 글을 수정/마감하면 확인 모달로 경고한다(REQ-FUNC-038).
  - 각 목록이 0건이면 상황별 문구("아직 작성한 동행 글이 없어요" 등) + "동행 글 작성하기"/"동행 찾아보기" CTA의 Empty State로 대체한다.
- **Visual AC:** 탭 구조, `card.mate` 관리형 변형.
- **Security/Privacy AC:** 본인 글/신청만 노출(RLS 의존).
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1
