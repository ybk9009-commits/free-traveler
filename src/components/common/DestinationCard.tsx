import type { Destination } from "@/data/types";

interface DestinationCardProps {
  destination: Destination;
  seasonLabel: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect?: () => void;
}

/** ISO 3166-1 alpha-2 코드를 국기 이모지로 변환한다(해외 카드 국기 배지용). */
function countryCodeToFlagEmoji(countryCode: string): string {
  if (!/^[A-Z]{2}$/.test(countryCode)) return "";
  const codePoints = countryCode
    .split("")
    .map((char) => 0x1f1e6 - 65 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * `card-destination`(D-001 § Destination Card) — 이미지 4:3 + `{rounded.lg}`,
 * 제목/지역 메타, 추천 시기 캡션 칩, 우상단 즐겨찾기 아이콘 버튼(44×44 히트
 * 영역). 정지 상태 그림자 없음, hover 시 1단계 그림자만 얹는다. 해외 카드는
 * 국기 배지를 추가로 포함한다.
 */
export function DestinationCard({
  destination,
  seasonLabel,
  isFavorite,
  onToggleFavorite,
  onSelect,
}: DestinationCardProps) {
  const flag =
    destination.region === "overseas"
      ? countryCodeToFlagEmoji(destination.countryCode)
      : "";

  return (
    <article
      data-testid="destination-card"
      className="group overflow-hidden rounded-[16px] border border-[#E3E2DE] bg-white transition-shadow hover:shadow-[0_1px_2px_rgba(0,0,0,.04),0_4px_12px_rgba(0,0,0,.08)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F6F4]">
        {/* eslint-disable-next-line @next/next/no-img-element -- next.config.ts에 원격 이미지 도메인이 설정되어 있지 않아(이 Task 범위 밖) next/image 대신 img를 사용한다. */}
        <img
          src={destination.image.url}
          alt={destination.image.alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />

        {flag && (
          <span
            aria-hidden="true"
            className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[16px] shadow-[0_1px_2px_rgba(0,0,0,.16)]"
          >
            {flag}
          </span>
        )}

        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `${destination.name} 즐겨찾기 해제`
              : `${destination.name} 즐겨찾기 추가`
          }
          className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-full text-white outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-6 w-6 drop-shadow-[0_1px_2px_rgba(0,0,0,.5)]"
            fill={isFavorite ? "#F4623A" : "rgba(255,255,255,0.85)"}
            stroke={isFavorite ? "#F4623A" : "#2A2A2E"}
            strokeWidth={1.5}
          >
            <path d="M12 20.5s-7.5-4.6-9.8-9C.6 8.1 1.7 4.6 5 3.6c2-.6 3.9.2 5 1.8 1.1-1.6 3-2.4 5-1.8 3.3 1 4.4 4.5 2.8 7.9-2.3 4.4-9.8 9-9.8 9Z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-1 p-4">
        {onSelect ? (
          <button
            type="button"
            onClick={onSelect}
            className="text-left text-[18px] font-semibold leading-[1.4] text-[#2A2A2E] outline-none hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            {destination.name}
          </button>
        ) : (
          <p className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">
            {destination.name}
          </p>
        )}
        <p className="text-[14px] leading-[1.6] text-[#54545A]">
          {destination.countryName}
        </p>
        <span className="mt-1 inline-flex w-fit items-center rounded-full bg-[#F7F6F4] px-3 py-1 text-[13px] font-medium leading-[1.4] text-[#83838A]">
          {seasonLabel}
        </span>
      </div>
    </article>
  );
}
