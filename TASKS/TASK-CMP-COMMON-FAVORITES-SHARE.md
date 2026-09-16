# TASK-CMP-COMMON-FAVORITES-SHARE — 즐겨찾기(localStorage) + URL 공유 훅

- **Category:** Component
- **Implementation Status:** IMPLEMENT(축소)
- **Requirement Ref:** REQ-FUNC-068, REQ-FUNC-069
- **Screen:** 공통(SCR-001, SCR-004, SCR-005에서 소비)
- **Route:** 공통
- **Page Entry:** —(훅/유틸, 특정 Page Entry 소유 없음)
- **Depends On:** —
- **Expected Files:** `src/lib/hooks/useFavorites.ts`, `src/lib/hooks/useShare.ts`
- **Functional AC:**
  - **즐겨찾기는 서버 저장이 아닌 `localStorage`에만 저장한다**(`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙). 여행지 ID 기준 중복 추가를 방지한다(REQ-FUNC-068).
  - URL 공유는 Web Share API를 우선 사용하고, 미지원 브라우저에서는 클립보드 복사로 폴백한다(REQ-FUNC-069).
- **Visual AC:** 해당 없음(소비 컴포넌트의 Visual AC를 따름).
- **Security/Privacy AC:** `localStorage` 값에 개인정보를 저장하지 않는다(여행지 ID만 저장).
- **Verify:** E2E-PUBLIC-SMOKE(중복 방지 assertion)
- **Priority:** P1
