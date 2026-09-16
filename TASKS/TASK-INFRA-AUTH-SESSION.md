# TASK-INFRA-AUTH-SESSION — Supabase Auth 세션·이메일 인증

- **Category:** Infra
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-027, REQ-FUNC-066, REQ-NF-014
- **Screen:** — (SCR-003, SCR-005에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-ACCESS
- **Expected Files:** `src/lib/auth/session.ts`, `src/app/auth/callback/route.ts`, `middleware.ts`
- **Functional AC:**
  - 이메일 가입/인증/로그인/로그아웃/비밀번호 재설정을 Supabase Auth로 구현한다(REQ-FUNC-066).
  - 이메일 인증 미완료 세션은 동행 쓰기 작업(API-MATE-POSTS, API-MATE-APPLICATIONS 등) 호출 시 서버에서 401/리다이렉트로 차단한다(REQ-FUNC-027).
  - 인증 콜백은 Screen 5개와 별개의 **기술 Route**(`src/app/auth/callback/route.ts`)로 처리하며 어떤 Page Owner의 Expected Files에도 포함하지 않는다.
- **Visual AC:** 해당 없음(로그인 UI는 CMP-SCR005-AUTH에서 정의).
- **Security/Privacy AC:** CSRF 방어·SameSite 쿠키를 Next.js Server Actions 기본 보호 + Supabase Auth 쿠키 설정으로 충족한다(REQ-NF-014).
- **Verify:** E2E-MATE-AUTH, 코드 리뷰
- **Priority:** P0
