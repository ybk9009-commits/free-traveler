# TASK-DATA-SAFETY — 국가 안전정보 정적 데이터

- **Category:** Data
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-046, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-052, REQ-FUNC-053, REQ-NF-027
- **Screen:** — (SCR-001에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** DATA-DESTINATIONS(국가 코드 매칭)
- **Expected Files:** `src/data/safety.ts`
- **Functional AC:**
  - `DATA-DESTINATIONS`에 등장하는 모든 해외 국가에 대해 안전정보 항목이 1:1로 존재한다(REQ-FUNC-046, `country_code` 매칭).
  - 8개 필수 카테고리(치안, 흔한 사기, 현지 법규, 교통, 재난·기후, 보건, 문화·복장, 긴급연락처)를 모두 포함한다(REQ-FUNC-047).
  - `scopeType`(COUNTRY/REGION), `scopeText`, `advisoryLevel`, `sourceName`, `sourceUrl`, `verifiedAt`, `verifiedBy`를 필드로 둔다(REQ-FUNC-048, 052).
  - 긴급전화·영사콜센터 연결 정보를 포함한다(REQ-FUNC-053).
- **Visual AC:** 해당 없음(비-UI Task).
- **Security/Privacy AC:** 공식 출처(외교부 해외안전여행) URL만 참조한다.
- **Verify:** TEST-DATA-VALIDATION, 코드 리뷰
- **Priority:** P0
