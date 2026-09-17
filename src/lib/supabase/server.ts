import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * DB-ACCESS — Server Component/Route Handler/Server Action에서 쓰는 Supabase
 * 클라이언트. `next/headers`의 `cookies()`를 사용하므로 Client Component에서
 * import하면 빌드가 실패해 서버 전용 경계가 자연히 지켜진다.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component 렌더 중에는 쿠키를 쓸 수 없다(정상 동작) —
            // middleware가 세션 갱신 쿠키 기록을 대신 처리한다.
          }
        },
      },
    },
  );
}

/**
 * RLS를 우회해야 하는 관리자 작업(예: 관리자 설정 갱신)에서만 사용한다.
 * `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용이며 어떤 `NEXT_PUBLIC_` 변수로도
 * 노출하지 않는다(CLAUDE.md 규칙 14·15, REQ-NF-016).
 */
export function createSupabaseServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY 환경변수가 설정되지 않았습니다.",
    );
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
