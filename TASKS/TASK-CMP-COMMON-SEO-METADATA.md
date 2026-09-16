# TASK-CMP-COMMON-SEO-METADATA — Next Metadata API 공통 적용

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-070, REQ-NF-030
- **Screen:** 공통(5개 Screen)
- **Route:** 공통(5개 Route)
- **Page Entry:** 5개 `page.tsx` + `src/app/layout.tsx`
- **Depends On:** —
- **Expected Files:** `src/lib/seo/metadata.ts`, 각 `page.tsx`에 `generateMetadata`/`metadata` export 추가(구현 시)
- **Functional AC:** 5개 공개 페이지 각각에 title, description, canonical, Open Graph, 구조화 데이터를 제공한다(REQ-FUNC-070). SEO 자동 검사에서 필수 메타 누락 0건을 목표로 한다(REQ-NF-030).
- **Visual AC:** 해당 없음(비시각 요소).
- **Security/Privacy AC:** 해당 없음.
- **Verify:** 코드 리뷰(메타 태그 존재 확인)
- **Priority:** P2
