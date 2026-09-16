# TASK-DATA-DESTINATIONS — 여행지 정적 데이터

- **Category:** Data
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-007(축소), REQ-FUNC-008, REQ-NF-026
- **Screen:** — (SCR-001, SCR-002에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** —
- **Expected Files:** `src/data/destinations.ts`, `src/data/types.ts`(공용 타입)
- **Functional AC:**
  - `docs/PROJECT_SCOPE.md` §1 원칙대로 Supabase 테이블이 아닌 **정적 TypeScript 배열/객체**로 작성한다(DB 미사용).
  - 국내 10개 이상, 해외 15개국 30개 도시 이상을 포함한다(REQ-FUNC-008).
  - 각 항목은 `overview`(300자 이상), `highlights`(5개 이상), `bestTime`, `itinerary1d`, `itinerary3d`, `budget`, `transport`, `foods`(3개 이상), `etiquette`(3개 이상), `sources`(1개 이상)를 모두 채운다(REQ-FUNC-004의 데이터 전제).
  - 모든 이미지 URL에 실제 장소를 설명하는 `alt` 텍스트를 함께 저장한다(REQ-FUNC-007, alt만 필수 보증하고 출처·작가·라이선스는 참고 기록만 한다).
- **Visual AC:** 해당 없음(비-UI Task, 소비 측 Visual AC는 CMP-SCR001-DESTINATION-GRID/DETAIL-DRAWER에서 정의).
- **Security/Privacy AC:** 개인정보 없음. 외부 이미지 URL은 HTTPS만 허용한다.
- **Verify:** TEST-DATA-VALIDATION(수량·필드 완전성), 코드 리뷰(alt 텍스트 존재 확인)
- **Priority:** P0
