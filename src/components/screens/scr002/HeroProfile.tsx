import { representativeProfile } from "@/data/representative-profile";

/**
 * CMP-SCR-002-hero-profile — 대표 소개 Hero(SCR-002 §1). `CMP-SCR-001-about-summary`
 * 와 동일한 `displayName`/지표 라벨을 `representativeProfile` 단일 데이터
 * 소스에서 그대로 표시해 값이 100% 일치하도록 보증한다(REQ-FUNC-057).
 */
export function HeroProfile() {
  const { displayName, tripCountLabel, countryCountLabel, heroImage } =
    representativeProfile;

  return (
    <section
      aria-labelledby="hero-profile-heading"
      className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-8 px-4 py-16 tablet:min-h-[560px] tablet:grid-cols-2 tablet:items-center tablet:px-8"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-[16px] bg-[#F7F6F4]">
        {/* eslint-disable-next-line @next/next/no-img-element -- next.config.ts에 원격 이미지 도메인이 설정되어 있지 않아(이 Task 범위 밖) next/image 대신 img를 사용한다. */}
        <img
          src={heroImage.url}
          alt={heroImage.alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-[14px] font-semibold uppercase tracking-wide text-[#F4623A]">
          대표 소개
        </p>
        <h1
          id="hero-profile-heading"
          className="text-[32px] font-semibold leading-[1.3] text-[#2A2A2E] tablet:text-[40px]"
        >
          {displayName}
        </h1>
        <p className="text-[16px] leading-[1.6] text-[#54545A]">
          여행지의 속도에 맞춰 걸으며 기록해온 {tripCountLabel},{" "}
          {countryCountLabel}의 이야기를 소개합니다.
        </p>
      </div>
    </section>
  );
}
