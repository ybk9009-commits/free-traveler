# TASK-CMP-COMMON-ERROR-BOUNDARIES — 404/500/권한없음/외부연결실패 경계

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-078
- **Screen:** —(기술 Route, Screen 수에 미포함)
- **Route:** 기술 Route(전체 미매칭 경로/렌더 오류/권한없음)
- **Page Entry:** `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/unauthorized.tsx`
- **Depends On:** —
- **Expected Files:** `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/unauthorized.tsx`
- **Functional AC:**
  - 404(`not-found.tsx`)/500(`error.tsx`)/권한없음(`unauthorized.tsx`)/외부연결실패(각 폼 인라인 오류로 처리, `CMP-SCR003-FLIGHT-FORM`/`HOTEL-FORM` 참조) 화면 각각에 홈/이전/재시도 중 최소 1개 복구 행동을 제공한다(REQ-FUNC-078).
- **Visual AC:** 5개 Page Owner와 톤을 공유하되, 어떤 Page Owner의 Expected Files에도 포함하지 않는 독립 파일이다(규칙 16 — 한 Task가 여러 Page Entry를 겸하지 않음: 이 Task는 Page Owner가 아니라 기술 경계 전용 Task).
- **Security/Privacy AC:** 500 화면에 스택 트레이스 등 민감 정보를 노출하지 않는다.
- **Verify:** 코드 리뷰, E2E-PUBLIC-SMOKE(404 시나리오)
- **Priority:** P1
