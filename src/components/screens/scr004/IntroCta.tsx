import Link from "next/link";

/**
 * CMP-SCR-004-intro-cta — Intro + 새 글 작성 CTA Banner(SCR-004 §1).
 */
export function IntroCta() {
  return (
    <section
      aria-labelledby="mate-intro-heading"
      className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-8 px-4 py-16 tablet:grid-cols-2 tablet:px-8"
    >
      <div className="flex flex-col gap-3">
        <h1
          id="mate-intro-heading"
          className="text-[28px] font-semibold leading-[1.3] text-[#2A2A2E] tablet:text-[32px]"
        >
          함께 떠날 동행을 찾아보세요
        </h1>
        <p className="text-[16px] leading-[1.6] text-[#54545A]">
          여행 국가·지역·기간이 맞는 동행 모집글을 둘러보고, 마음에 드는 글에
          참가를 신청해 보세요.
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 rounded-[16px] bg-[#F7F6F4] p-8 tablet:items-end">
        <p className="text-[15px] font-semibold text-[#2A2A2E]">
          찾는 조건의 동행이 없나요?
        </p>
        <Link
          href="/travel-tools?tab=mate"
          className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[15px] font-semibold text-white hover:bg-[#D94F2B]"
        >
          새 동행 글 작성하기
        </Link>
      </div>
    </section>
  );
}
