# TASK-INFRA-INPUT-VALIDATION — 서버 입력 검증·이스케이프 공통 스키마

- **Category:** Infra
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-NF-015
- **Screen:** — (모든 API Task에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** —
- **Expected Files:** `src/lib/validation/schemas.ts`
- **Functional AC:**
  - 모집글/참가요청/신고/관리자 설정 입력에 대한 공용 스키마(zod 등)를 정의하고, 모든 `API-*` Route Handler가 이를 통해 검증한다.
  - React 기본 이스케이프 + 서버 스키마 검증으로 저장 XSS를 차단한다.
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 모든 문자열 입력은 최대 길이·허용 문자 제약을 스키마에 명시한다(REQ-NF-015).
- **Verify:** 코드 리뷰, API 통합 테스트(각 API Task Verify에 포함)
- **Priority:** P1
