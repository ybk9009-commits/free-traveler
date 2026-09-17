"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// digest는 Next.js가 생성하는 불투명 참조 ID일 뿐, 스택 트레이스나 메시지 등
// 민감한 오류 상세는 화면에 노출하지 않는다(CLAUDE.md 규칙 23, Security AC).
export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-[26px] font-bold leading-[1.35] text-[#2A2A2E]">
        문제가 발생했습니다
      </p>
      <p className="max-w-[420px] text-[16px] leading-[1.65] text-[#54545A]">
        페이지를 표시하는 중 오류가 발생했습니다. 다시 시도해 주세요.
      </p>
      {error.digest && (
        <p className="text-[13px] leading-[1.4] text-[#83838A]">
          문제 코드: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[16px] font-semibold leading-[1.2] text-white outline-none hover:bg-[#D94F2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] border border-[#C7C6C1] px-6 text-[16px] font-semibold leading-[1.2] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          홈으로 가기
        </Link>
      </div>
    </main>
  );
}
