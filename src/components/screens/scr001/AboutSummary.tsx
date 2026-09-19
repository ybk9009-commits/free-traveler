import Link from "next/link";
import { representativeProfile } from "@/data/representative-profile";

/**
 * CMP-SCR-001-about-summary — 대표 소개 요약 카드(SCR-001 §7).
 * `representativeProfile`을 그대로 노출해 `/about`(CMP-SCR-002-hero-profile)과
 * 값이 100% 일치하도록 단일 데이터 소스만 참조한다(REQ-FUNC-057).
 */
export function AboutSummary() {
  const { displayName, tripCountLabel, countryCountLabel, bio, heroImage } =
    representativeProfile;

  return (
    <section
      aria-labelledby="about-summary-heading"
      className="mx-auto w-full max-w-[1280px] px-4 py-16 tablet:px-8"
    >
      <div className="grid grid-cols-1 gap-10 tablet:grid-cols-2 tablet:items-center">
        <div className="aspect-[4/3] overflow-hidden rounded-[8px] bg-[#F7F6F4]">
          {/* eslint-disable-next-line @next/next/no-img-element -- next.config.ts에 원격 이미지 도메인이 설정되어 있지 않아(이 Task 범위 밖) next/image 대신 img를 사용한다. */}
          <img
            src={heroImage.url}
            alt={heroImage.alt}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-wide text-[#F4623A]">
              대표 소개
            </p>
            <h2
              id="about-summary-heading"
              className="mt-2 text-[28px] font-semibold leading-[1.3] text-[#2A2A2E]"
            >
              {displayName}
            </h2>
          </div>

          <p className="text-[15px] leading-[1.7] text-[#54545A]">{bio}</p>

          <div className="flex gap-4">
            <div className="flex-1 rounded-[8px] border border-[#E3E2DE] bg-[#F7F6F4] px-5 py-4">
              <p className="text-[20px] font-semibold text-[#2A2A2E]">
                {tripCountLabel}
              </p>
              <p className="text-[13px] text-[#6B6B72]">여행 경험</p>
            </div>
            <div className="flex-1 rounded-[8px] border border-[#E3E2DE] bg-[#F7F6F4] px-5 py-4">
              <p className="text-[20px] font-semibold text-[#2A2A2E]">
                {countryCountLabel}
              </p>
              <p className="text-[13px] text-[#6B6B72]">방문 국가</p>
            </div>
          </div>

          <div>
            <Link
              href="/about"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[16px] font-semibold leading-[1.2] text-white outline-none hover:bg-[#D94F2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              대표 소개 더 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
