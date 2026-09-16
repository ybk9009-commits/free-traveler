# TASK-CMP-SCR004-GUIDANCE-SAFETY — 신청 방법 3단계 + 안전 안내 CTA

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** —(디자인 계약: 콘텐츠 계약 "신청 방법 3단계")
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(PAGE-SCR004가 조립)
- **Depends On:** —
- **Expected Files:** `src/components/screens/scr004/GuidanceSafety.tsx`
- **Functional AC:**
  - "모집글 확인 → 비공개 메시지로 참가 요청 → 작성자 승인 후 대화 시작" 3단계 안내를 표시한다.
  - 안전수칙 요약 + 신고/차단 안내 + "항공·숙소도 함께 준비하기" CTA(`/travel-tools`)를 CTA Banner로 표시한다.
- **Visual AC:** 3단계 안내 + CTA Banner.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-MATE-AUTH
- **Priority:** P2

### 6.5 SCR-005
