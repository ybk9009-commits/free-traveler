import Link from "next/link";

// Next.js `unauthorized()` 함수를 호출하려면 next.config.ts에
// `experimental.authInterrupts: true`가 필요하다(이 Task의 Expected Files 밖이라
// 여기서는 활성화하지 않았다 — 인증 관련 Task에서 필요 시 별도로 설정해야 한다).
export default function Unauthorized() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-[26px] font-bold leading-[1.35] text-[#2A2A2E]">
        접근 권한이 없습니다
      </p>
      <p className="max-w-[420px] text-[16px] leading-[1.65] text-[#54545A]">
        이 페이지를 보려면 로그인이 필요합니다.
      </p>
      <Link
        href="/account"
        className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[16px] font-semibold leading-[1.2] text-white outline-none hover:bg-[#D94F2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
      >
        로그인하러 가기
      </Link>
    </main>
  );
}
