import { representativeProfile } from "@/data/representative-profile";

/**
 * CMP-SCR-002-timeline — 여행 타임라인 6개(SCR-002 §4). `card.timeline-item`
 * (연도 캡션 + 장소 제목 + 2줄 요약) 6개 이상을 시간 순으로 표시한다
 * (REQ-FUNC-060).
 */
export function Timeline() {
  const timeline = [...representativeProfile.timeline].sort(
    (a, b) => a.year - b.year,
  );

  return (
    <section
      aria-labelledby="timeline-heading"
      className="mx-auto w-full max-w-[1280px] px-4 py-16 tablet:px-8"
    >
      <h2
        id="timeline-heading"
        className="text-[20px] font-semibold text-[#2A2A2E]"
      >
        여행 타임라인
      </h2>

      <ol className="mt-6 flex flex-col gap-6 border-l border-[#E3E2DE] pl-6">
        {timeline.map((entry) => (
          <li key={`${entry.year}-${entry.place}`} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-[#F4623A]"
            />
            <p className="text-[13px] font-semibold text-[#83838A]">
              {entry.year}
            </p>
            <p className="mt-1 text-[16px] font-semibold text-[#2A2A2E]">
              {entry.place}
            </p>
            <p className="mt-1 text-[14px] leading-[1.6] text-[#54545A]">
              {entry.summary}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
