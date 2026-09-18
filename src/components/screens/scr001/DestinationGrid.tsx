"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { destinations } from "@/data/destinations";
import type { Destination } from "@/data/types";
import { DestinationCard } from "@/components/common/DestinationCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useFavorites } from "@/lib/hooks/useFavorites";

const SEASON_OPTIONS = [
  { id: "봄", label: "봄" },
  { id: "여름", label: "여름" },
  { id: "가을", label: "가을" },
  { id: "겨울", label: "겨울" },
] as const;

const ALL_SEASON_LABELS = SEASON_OPTIONS.map((season) => season.id);

interface ThemeDef {
  id: string;
  label: string;
  keywords: string[];
}

/**
 * REQ-FUNC-002 — "테마 Chip(6개)" 요구사항을 만족하는 6개 테마. `DATA-DESTINATIONS`
 * (완료된 선행 Task, `src/data/types.ts`)에는 테마/계절/기간 필드가 없어(원본
 * SRS의 `themes`/`recommended_seasons`/`recommended_days` 컬럼이 정적 데이터
 * 이전 과정에서 빠짐) 이 컴포넌트 안에서만 `highlights`/`overview` 텍스트를
 * 키워드로 매칭해 파생한다. 데이터 스키마 자체(Expected Files 밖)는 바꾸지 않는다.
 */
const THEME_DEFS: ThemeDef[] = [
  {
    id: "nature",
    label: "자연·풍경",
    keywords: [
      "자연",
      "국립공원",
      "호수",
      "협곡",
      "피오르",
      "빙하",
      "설경",
      "폭포",
      "정원",
      "트레킹",
      "하이킹",
      "사막",
      "화산",
    ],
  },
  {
    id: "beach",
    label: "해변·휴양",
    keywords: [
      "해변",
      "해수욕장",
      "바다",
      "섬",
      "리조트",
      "휴양",
      "온천",
      "라군",
    ],
  },
  {
    id: "history",
    label: "역사·문화",
    keywords: [
      "역사",
      "고궁",
      "사원",
      "유적",
      "박물관",
      "고대",
      "문화유산",
      "궁전",
      "성당",
      "유네스코",
      "사찰",
    ],
  },
  {
    id: "urban",
    label: "도심·쇼핑",
    keywords: [
      "쇼핑",
      "도심",
      "야경",
      "타워",
      "번화가",
      "시내",
      "스카이라인",
      "고층",
    ],
  },
  {
    id: "food",
    label: "미식",
    keywords: [
      "시장",
      "맛집",
      "미식",
      "요리",
      "포장마차",
      "레스토랑",
      "노포",
      "국밥",
      "딤섬",
    ],
  },
  {
    id: "activity",
    label: "액티비티",
    keywords: [
      "액티비티",
      "스키",
      "다이빙",
      "서핑",
      "사파리",
      "레저",
      "수상",
      "크루즈",
      "스포츠",
    ],
  },
];

const ALLOWED_QUERY_KEYS = ["country", "city", "season", "theme"] as const;
type AllowedQueryKey = (typeof ALLOWED_QUERY_KEYS)[number];

function deriveSeasons(destination: Destination): string[] {
  const matched = SEASON_OPTIONS.filter((season) =>
    destination.bestTime.includes(season.id),
  ).map((season) => season.id);
  return matched.length > 0 ? matched : ALL_SEASON_LABELS;
}

function deriveThemeIds(destination: Destination): string[] {
  const haystack = `${destination.highlights.join(" ")} ${destination.overview}`;
  return THEME_DEFS.filter((theme) =>
    theme.keywords.some((keyword) => haystack.includes(keyword)),
  ).map((theme) => theme.id);
}

function buildSeasonLabel(seasons: string[]): string {
  if (seasons.length >= ALL_SEASON_LABELS.length) return "연중 추천";
  return `${seasons.join("·")} 추천`;
}

/**
 * CMP-SCR-001-destination-grid — 국내·해외 인기 여행지 Card Grid + 테마 필터
 * (SCR-001 §2~4). 국가·도시·계절·테마 필터를 AND 조건으로 클라이언트에서
 * 적용하고(REQ-FUNC-002), 필터 상태를 `useSearchParams` 기반 URL로 직렬화한다
 * (REQ-FUNC-010, 허용 키 4개만).
 */
export function DestinationGrid() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isFavorite, toggleFavorite } = useFavorites();

  const enriched = useMemo(
    () =>
      destinations.map((destination) => ({
        destination,
        seasons: deriveSeasons(destination),
        themeIds: deriveThemeIds(destination),
      })),
    [],
  );

  const country = searchParams.get("country") ?? "";
  const city = searchParams.get("city") ?? "";
  const season = searchParams.get("season") ?? "";
  const themeParam = searchParams.get("theme") ?? "";
  const selectedThemeIds = themeParam
    ? themeParam.split(",").filter(Boolean)
    : [];

  const countryOptions = useMemo(
    () =>
      Array.from(new Set(destinations.map((d) => d.countryName))).sort((a, b) =>
        a.localeCompare(b, "ko"),
      ),
    [],
  );

  const cityOptions = useMemo(
    () =>
      Array.from(
        new Set(
          destinations
            .filter((d) => !country || d.countryName === country)
            .map((d) => d.name),
        ),
      ).sort((a, b) => a.localeCompare(b, "ko")),
    [country],
  );

  const hasActiveFilters = Boolean(
    country || city || season || selectedThemeIds.length,
  );

  function applyParams(next: Partial<Record<AllowedQueryKey, string>>) {
    const merged: Record<AllowedQueryKey, string> = {
      country,
      city,
      season,
      theme: themeParam,
      ...next,
    };
    const params = new URLSearchParams();
    for (const key of ALLOWED_QUERY_KEYS) {
      if (merged[key]) params.set(key, merged[key]);
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }

  function handleCountryChange(value: string) {
    applyParams({ country: value, city: "" });
  }

  function handleThemeToggle(themeId: string) {
    const next = new Set(selectedThemeIds);
    if (next.has(themeId)) next.delete(themeId);
    else next.add(themeId);
    applyParams({ theme: Array.from(next).join(",") });
  }

  function resetFilters() {
    router.replace(pathname, { scroll: false });
  }

  const filtered = enriched.filter(({ destination, seasons, themeIds }) => {
    if (country && destination.countryName !== country) return false;
    if (city && destination.name !== city) return false;
    if (season && !seasons.includes(season)) return false;
    if (
      selectedThemeIds.length > 0 &&
      !selectedThemeIds.some((id) => themeIds.includes(id))
    ) {
      return false;
    }
    return true;
  });

  const domestic = filtered.filter(
    (item) => item.destination.region === "domestic",
  );
  const overseas = filtered.filter(
    (item) => item.destination.region === "overseas",
  );

  return (
    <section
      aria-labelledby="destination-grid-heading"
      className="mx-auto w-full max-w-[1280px] px-4 py-16 tablet:px-8"
    >
      <h2 id="destination-grid-heading" className="sr-only">
        국내·해외 인기 여행지
      </h2>

      <div className="flex flex-col gap-4 rounded-[16px] border border-[#E3E2DE] bg-[#F7F6F4] p-4 tablet:flex-row tablet:items-end tablet:gap-6">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-[13px] font-medium text-[#83838A]">국가</span>
          <select
            value={country}
            onChange={(event) => handleCountryChange(event.target.value)}
            className="h-[44px] rounded-[8px] border border-[#E3E2DE] bg-white px-3 text-[14px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            <option value="">전체 국가</option>
            {countryOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-1">
          <span className="text-[13px] font-medium text-[#83838A]">도시</span>
          <select
            value={city}
            onChange={(event) => applyParams({ city: event.target.value })}
            className="h-[44px] rounded-[8px] border border-[#E3E2DE] bg-white px-3 text-[14px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            <option value="">전체 도시</option>
            {cityOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-1">
          <span className="text-[13px] font-medium text-[#83838A]">계절</span>
          <select
            value={season}
            onChange={(event) => applyParams({ season: event.target.value })}
            className="h-[44px] rounded-[8px] border border-[#E3E2DE] bg-white px-3 text-[14px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            <option value="">전체 계절</option>
            {SEASON_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="h-[44px] rounded-[8px] border border-[#C7C6C1] px-4 text-[14px] font-semibold text-[#2A2A2E] outline-none hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            필터 초기화
          </button>
        )}
      </div>

      <div
        role="group"
        aria-label="여행 테마"
        className="mt-4 flex flex-wrap gap-2"
      >
        {THEME_DEFS.map((theme) => {
          const selected = selectedThemeIds.includes(theme.id);
          return (
            <button
              key={theme.id}
              type="button"
              aria-pressed={selected}
              onClick={() => handleThemeToggle(theme.id)}
              className={`h-10 rounded-full px-4 text-[14px] font-medium outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
                selected
                  ? "bg-[#FEEBE3] text-[#F4623A]"
                  : "bg-white text-[#54545A] border border-[#E3E2DE]"
              }`}
            >
              {theme.label}
            </button>
          );
        })}
      </div>

      <div
        data-testid="domestic-destinations"
        className="mt-10 flex flex-col gap-3"
      >
        <h3 className="text-[20px] font-semibold text-[#2A2A2E]">
          국내 인기 여행지
        </h3>
        {domestic.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
            {domestic.map(({ destination, seasons }) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                seasonLabel={buildSeasonLabel(seasons)}
                isFavorite={isFavorite(destination.id)}
                onToggleFavorite={() => toggleFavorite(destination.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="조건에 맞는 국내 여행지가 없어요."
            description="필터를 완화하거나 초기화해서 다시 찾아보세요."
            action={{ label: "필터 초기화", onClick: resetFilters }}
          />
        )}
      </div>

      <div
        data-testid="overseas-destinations"
        className="mt-10 flex flex-col gap-3"
      >
        <h3 className="text-[20px] font-semibold text-[#2A2A2E]">
          해외 인기 여행지
        </h3>
        {overseas.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
            {overseas.map(({ destination, seasons }) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                seasonLabel={buildSeasonLabel(seasons)}
                isFavorite={isFavorite(destination.id)}
                onToggleFavorite={() => toggleFavorite(destination.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="조건에 맞는 해외 여행지가 없어요."
            description="필터를 완화하거나 초기화해서 다시 찾아보세요."
            action={{ label: "필터 초기화", onClick: resetFilters }}
          />
        )}
      </div>
    </section>
  );
}
