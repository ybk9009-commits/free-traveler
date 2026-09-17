"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * DB-ACCESS — Client Component에서 Auth 세션 구독·로그인/가입 폼 등에 쓰는
 * Supabase 클라이언트. `NEXT_PUBLIC_*` 공개 환경변수만 사용하며,
 * `SUPABASE_SERVICE_ROLE_KEY`는 이 파일 어디에서도 참조하지 않는다(REQ-NF-016).
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
