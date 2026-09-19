"use client";

import { useEffect, useId, useMemo, useRef, type MouseEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { destinations } from "@/data/destinations";
import type { Destination } from "@/data/types";
import { DestinationCard } from "@/components/common/DestinationCard";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useShare } from "@/lib/hooks/useShare";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SEASON_KEYWORDS = ["봄", "여름", "가을", "겨울"];

function seasonLabelFor(destination: Destination): string {
  const matched = SEASON_KEYWORDS.filter((season) =>
    destination.bestTime.includes(season),
  );
  return matched.length > 0 ? `${matched.join("·")} 추천` : "연중 추천";
}

/** highlights 키워드가 많이 겹치는 여행지를 "같은 테마"로 간주한다(경량 근사치). */
function overlapScore(a: Destination, b: Destination): number {
  const aWords = new Set(a.highlights.flatMap((h) => h.split(/\s+/)));
  return b.highlights.reduce(
    (count, highlight) =>
      count + highlight.split(/\s+/).filter((word) => aWords.has(word)).length,
    0,
  );
}

function findRelated(current: Destination): Destination[] {
  return destinations
    .filter((d) => d.id !== current.id)
    .map((d) => ({
      destination: d,
      sameCountry: d.countryCode === current.countryCode,
      score: overlapScore(current, d),
    }))
    .sort((a, b) => {
      if (a.sameCountry !== b.sameCountry) return a.sameCountry ? -1 : 1;
      return b.score - a.score;
    })
    .slice(0, 6)
    .map((entry) => entry.destination);
}

/**
 * CMP-SCR-001-destination-detail-drawer — 여행지 상세 Drawer(SCR-001).
 * `?destination=<id>` URL 쿼리로 열림 상태를 관리한다 — `CMP-SCR-001-destination-grid`
 * (이미 완료된 선행 Task, Expected Files 밖이라 수정 불가)의 카드가 아직 이
 * 쿼리를 설정하도록 연결되어 있지 않아, 현재는 이 URL을 직접 열거나
 * 공유 링크로 전달했을 때만 열린다(딥링크 자체는 REQ-FUNC-069 URL 공유에
 * 그대로 부합). 관련 여행지 카드 클릭으로 같은 Drawer 안에서 다른 여행지로
 * 전환할 수 있다.
 */
export function DestinationDetailDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { share } = useShare();

  const destinationId = searchParams.get("destination");
  const destination = useMemo(
    () => destinations.find((d) => d.id === destinationId) ?? null,
    [destinationId],
  );

  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  function close() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("destination");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  }

  function openDestination(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("destination", id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  useEffect(() => {
    if (!destination) return;

    previouslyFocusedElement.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable =
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close()/pathname/searchParams는 destination이 바뀔 때만 재바인딩하면 충분하다.
  }, [destination]);

  if (!destination) return null;

  const activeDestination: Destination = destination;

  function handleScrimMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) close();
  }

  function handleShare() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    void share({
      title: activeDestination.name,
      text: `${activeDestination.name} 여행지 정보`,
      url: `${origin}${pathname}?destination=${activeDestination.id}`,
    });
  }

  function handleViewSafetyInfo() {
    close();
    document
      .getElementById("safety-section-heading")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const related = findRelated(activeDestination);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[rgba(20,20,20,0.5)]"
      onMouseDown={handleScrimMouseDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-full flex-col overflow-hidden bg-white shadow-[0_8px_24px_rgba(0,0,0,0.16)] tablet:w-[520px] tablet:max-w-[560px]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#E3E2DE] px-6 py-4">
          <h2
            id={titleId}
            className="text-[20px] font-semibold leading-[1.4] text-[#2A2A2E]"
          >
            {destination.name}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="닫기"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#54545A] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="aspect-[4/3] w-full bg-[#F7F6F4]">
            {/* eslint-disable-next-line @next/next/no-img-element -- next.config.ts에 원격 이미지 도메인이 설정되어 있지 않아(이 Task 범위 밖) next/image 대신 img를 사용한다. */}
            <img
              src={destination.image.url}
              alt={destination.image.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-6 px-6 py-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[14px] text-[#54545A]">
                {destination.countryName} · {seasonLabelFor(destination)}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFavorite(destination.id)}
                  aria-pressed={isFavorite(destination.id)}
                  className="h-11 rounded-full border border-[#E3E2DE] px-4 text-[13px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
                >
                  {isFavorite(destination.id) ? "즐겨찾기 해제" : "즐겨찾기"}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="h-11 rounded-full border border-[#E3E2DE] px-4 text-[13px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
                >
                  URL 공유
                </button>
              </div>
            </div>

            <p className="text-[15px] leading-[1.7] text-[#54545A]">
              {destination.overview}
            </p>

            <section>
              <h3 className="text-[15px] font-semibold text-[#2A2A2E]">
                명소·체험
              </h3>
              <ul className="mt-2 list-disc pl-5 text-[14px] leading-[1.7] text-[#54545A]">
                {destination.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </section>

            <section className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
              <div>
                <h3 className="text-[15px] font-semibold text-[#2A2A2E]">
                  추천 시기
                </h3>
                <p className="mt-1 text-[14px] leading-[1.6] text-[#54545A]">
                  {destination.bestTime}
                </p>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#2A2A2E]">
                  예상 예산
                </h3>
                <p className="mt-1 text-[14px] leading-[1.6] text-[#54545A]">
                  {destination.budget}
                </p>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#2A2A2E]">
                  1일 일정
                </h3>
                <p className="mt-1 text-[14px] leading-[1.6] text-[#54545A]">
                  {destination.itinerary1d}
                </p>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#2A2A2E]">
                  3일 일정
                </h3>
                <p className="mt-1 text-[14px] leading-[1.6] text-[#54545A]">
                  {destination.itinerary3d}
                </p>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#2A2A2E]">
                  교통
                </h3>
                <p className="mt-1 text-[14px] leading-[1.6] text-[#54545A]">
                  {destination.transport}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-[15px] font-semibold text-[#2A2A2E]">음식</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {destination.foods.map((food) => (
                  <span
                    key={food}
                    className="rounded-full bg-[#F7F6F4] px-3 py-1 text-[13px] font-medium text-[#54545A]"
                  >
                    {food}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[15px] font-semibold text-[#2A2A2E]">
                문화·에티켓
              </h3>
              <ul className="mt-2 list-disc pl-5 text-[14px] leading-[1.7] text-[#54545A]">
                {destination.etiquette.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </section>

            {destination.region === "overseas" && (
              <button
                type="button"
                onClick={handleViewSafetyInfo}
                className="h-11 w-fit rounded-[8px] bg-[#F4623A] px-5 text-[15px] font-semibold text-white hover:bg-[#D94F2B]"
              >
                이 나라 안전정보 보기
              </button>
            )}

            <section className="border-t border-[#E3E2DE] pt-4 text-[13px] text-[#6B6B72]">
              <p className="font-semibold text-[#2A2A2E]">출처</p>
              <ul className="mt-1 flex flex-col gap-1">
                {destination.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F4623A] hover:text-[#D94F2B]"
                    >
                      {source.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            {related.length > 0 && (
              <section>
                <h3 className="text-[15px] font-semibold text-[#2A2A2E]">
                  관련 여행지
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-4 tablet:grid-cols-2">
                  {related.map((relatedDestination) => (
                    <DestinationCard
                      key={relatedDestination.id}
                      destination={relatedDestination}
                      seasonLabel={seasonLabelFor(relatedDestination)}
                      isFavorite={isFavorite(relatedDestination.id)}
                      onToggleFavorite={() =>
                        toggleFavorite(relatedDestination.id)
                      }
                      onSelect={() => openDestination(relatedDestination.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
