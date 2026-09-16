# TASK-INFRA-EXTERNAL-LINK-SAFETY — 외부 링크 새 탭·noopener 공용 유틸

- **Category:** Infra
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-016, REQ-FUNC-024, REQ-FUNC-049
- **Screen:** — (SCR-001, SCR-003에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** —
- **Expected Files:** `src/lib/links/external-link.ts`
- **Functional AC:**
  - 항공/호텔 외부 이동, 외교부 안전정보 원문 링크, 대표 소개 SNS 링크가 공통으로 사용할 `openExternal(url)` 유틸을 제공한다.
  - `target="_blank"` + `rel="noopener noreferrer"`를 강제하고, 목적지·날짜 쿼리 파라미터를 URL에 절대 추가하지 않는다(CON-02).
  - 허용목록(HTTPS만) 밖 URL이나 `javascript:` 스킴은 열지 않고 호출부에 오류를 반환한다(REQ-FUNC-018, 026 전제).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** URL이 허용목록의 HTTPS 프로토콜인지 유틸 내부에서 검증한다.
- **Verify:** 코드 리뷰, E2E-TRAVEL-TOOLS(속성 확인)
- **Priority:** P1
