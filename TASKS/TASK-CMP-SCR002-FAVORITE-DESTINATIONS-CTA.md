# TASK-CMP-SCR002-FAVORITE-DESTINATIONS-CTA — 기억에 남는 여행지 4개 + CTA

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-062, REQ-FUNC-063
- **Screen:** SCR-002
- **Route:** `/about`
- **Page Entry:** `src/app/about/page.tsx`(PAGE-SCR002가 조립)
- **Depends On:** DATA-DESTINATIONS, CMP-SCR001-DESTINATION-DETAIL-DRAWER
- **Expected Files:** `src/components/screens/scr002/FavoriteDestinationsCta.tsx`
- **Functional AC:**
  - `card.destination` 4개(비공개 여행지는 자동 제외, 대체 후보 표시)를 SCR-001 상세 Drawer로 딥링크한다(REQ-FUNC-063).
  - CTA Banner "항공·숙소 준비하기"(`/travel-tools`), "동행과 함께 떠나기"(`/mates`)를 표시한다.
  - 관리자 설정 기반 문의·SNS 링크를 제공하며, 빈 링크는 렌더링하지 않고 허용 프로토콜(https)만 연다(REQ-FUNC-062).
- **Visual AC:** Card Grid(2×2) + CTA Banner.
- **Security/Privacy AC:** SNS 링크는 `INFRA-EXTERNAL-LINK-SAFETY` 규칙(허용 프로토콜만)을 따른다.
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P2

### 6.3 SCR-003
