# TASK-DATA-REPRESENTATIVE — 대표 소개 정적 데이터

- **Category:** Data
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059(축소), REQ-FUNC-060, REQ-FUNC-061(축소)
- **Screen:** — (SCR-001, SCR-002에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** —
- **Expected Files:** `src/data/representative-profile.ts`
- **Functional AC:**
  - 단일 정적 객체로 `displayName`("free_traveler"), `tripCountLabel`("50+ Trips"), `countryCountLabel`("30+ Countries")를 고정한다(REQ-FUNC-057). 이 값은 SCR-001/SCR-002 어디서 참조하든 동일해야 한다.
  - `bio`, `philosophy`, `editorialPrinciples` 텍스트 필드를 포함한다(REQ-FUNC-058).
  - `visitedCountries` 30개 이상(권역 4그룹: 아시아/유럽/북미/오세아니아)을 포함한다(REQ-FUNC-059, 지도 대신 목록형).
  - `timeline` 6개 이상(연도/장소/요약)을 포함한다(REQ-FUNC-060).
  - 대표 이미지에 `alt` 텍스트를 포함한다(REQ-FUNC-061).
- **Visual AC:** 해당 없음(비-UI Task).
- **Security/Privacy AC:** 개인정보 없음(공개 프로필 정보만).
- **Verify:** TEST-DATA-VALIDATION, 코드 리뷰
- **Priority:** P0
