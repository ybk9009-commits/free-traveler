import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * INFRA-AUTH-SESSION — 모든 요청에서 Supabase Auth 세션 쿠키를 갱신한다.
 * (참고: Next.js 16부터 이 파일 규약은 `proxy.ts`로 이름이 바뀌었지만
 * `middleware.ts`도 하위 호환으로 계속 동작한다 — node_modules/next/dist/docs
 * 확인 결과. Expected Files가 `middleware.ts`를 지정해 이 이름을 그대로 쓴다.)
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // 응답 스트리밍 전에 세션을 읽어야 토큰 갱신이 setAll로 반영된다.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
