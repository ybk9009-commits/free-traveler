"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-[26px] font-bold leading-[1.35] text-[#2A2A2E]">
        페이지를 찾을 수 없습니다
      </p>
      <p className="max-w-[420px] text-[16px] leading-[1.65] text-[#54545A]">
        주소가 바뀌었거나 삭제된 페이지일 수 있습니다.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] border border-[#C7C6C1] px-6 text-[16px] font-semibold leading-[1.2] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          이전 페이지로
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[16px] font-semibold leading-[1.2] text-white outline-none hover:bg-[#D94F2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          홈으로 가기
        </Link>
      </div>
    </main>
  );
}
