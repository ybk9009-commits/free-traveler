# TASK-DB-ACCESS — Supabase Client/Server 접근 유틸

- **Category:** DB
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** (모든 Supabase 쓰기 Task의 공통 기반)
- **Screen:** —
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE
- **Expected Files:** `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`
- **Functional AC:**
  - Server Component/Route Handler용 클라이언트와 Client Component용 클라이언트를 분리 제공한다.
  - 환경변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)는 서버 전용 변수와 공개 변수를 명확히 분리한다.
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** `SUPABASE_SERVICE_ROLE_KEY`는 클라이언트 번들에 포함되지 않는다(REQ-NF-016).
- **Verify:** 코드 리뷰, 빌드 산출물에서 시크릿 노출 검사
- **Priority:** P0
