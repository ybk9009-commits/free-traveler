import { representativeProfile } from "@/data/representative-profile";

/**
 * CMP-SCR-002-stats-story — 여행 지표 + 소개·철학(SCR-002 §2~3). 지표 카드
 * 3개("50+ Trips"/"30+ Countries"/대륙 수)와 소개·여행 철학·편집 원칙 문단을
 * 표시한다(REQ-FUNC-058).
 */
export function StatsStory() {
  const {
    tripCountLabel,
    countryCountLabel,
    visitedCountries,
    bio,
    philosophy,
    editorialPrinciples,
  } = representativeProfile;
  const continentCount = visitedCountries.length;

  const stats = [
    { label: "여행 경험", value: tripCountLabel },
    { label: "방문 국가", value: countryCountLabel },
    { label: "방문 대륙", value: `${continentCount}개 권역` },
  ];

  return (
    <section
      aria-labelledby="stats-story-heading"
      className="mx-auto w-full max-w-[1280px] px-4 py-16 tablet:px-8"
    >
      <h2 id="stats-story-heading" className="sr-only">
        여행 지표와 소개
      </h2>

      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[16px] border border-[#E3E2DE] bg-[#F7F6F4] px-6 py-5 text-center"
          >
            <p className="text-[24px] font-semibold text-[#2A2A2E]">
              {stat.value}
            </p>
            <p className="mt-1 text-[13px] text-[#6B6B72]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 tablet:grid-cols-2">
        <div>
          <h3 className="text-[15px] font-semibold text-[#2A2A2E]">소개</h3>
          <p className="mt-2 text-[15px] leading-[1.7] text-[#54545A]">{bio}</p>
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-[#2A2A2E]">
            여행 철학
          </h3>
          <p className="mt-2 text-[15px] leading-[1.7] text-[#54545A]">
            {philosophy}
          </p>
        </div>
        <div className="tablet:col-span-2">
          <h3 className="text-[15px] font-semibold text-[#2A2A2E]">
            편집 원칙
          </h3>
          <p className="mt-2 text-[15px] leading-[1.7] text-[#54545A]">
            {editorialPrinciples}
          </p>
        </div>
      </div>
    </section>
  );
}
