"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import { countrySafetyInfo } from "@/data/safety";

interface SearchResult {
  id: string;
  type: "destination" | "safety";
  typeLabel: string;
  title: string;
  subtitle: string;
  anchorId: string;
  matchedField: string;
}

function highlightMatch(text: string, query: string): ReactNode {
  if (!query) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);
  return (
    <>
      {before}
      <mark className="rounded-[2px] bg-[#FEEBE3] text-[#F4623A]">{match}</mark>
      {after}
    </>
  );
}

function search(query: string): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const lower = trimmed.toLowerCase();

  const destinationMatches: SearchResult[] = destinations
    .filter(
      (destination) =>
        destination.name.toLowerCase().includes(lower) ||
        destination.countryName.toLowerCase().includes(lower) ||
        destination.highlights.some((highlight) =>
          highlight.toLowerCase().includes(lower),
        ),
    )
    .map((destination) => ({
      id: `destination-${destination.id}`,
      type: "destination" as const,
      typeLabel: "여행지",
      title: destination.name,
      subtitle: destination.countryName,
      anchorId: "destination-grid-heading",
      matchedField: destination.name.toLowerCase().includes(lower)
        ? destination.name
        : destination.countryName,
    }));

  const safetyMatches: SearchResult[] = countrySafetyInfo
    .filter((info) => info.countryName.toLowerCase().includes(lower))
    .map((info) => ({
      id: `safety-${info.countryCode}`,
      type: "safety" as const,
      typeLabel: "안전정보",
      title: info.countryName,
      subtitle: info.advisoryLevel,
      anchorId: "safety-section-heading",
      matchedField: info.countryName,
    }));

  return [...destinationMatches, ...safetyMatches].slice(0, 8);
}

/**
 * CMP-SCR-001-hero-search — Hero 통합 검색(SCR-001 §1). 완전 원형 pill 검색바
 * 1개 필드로 여행지·안전정보를 한글 부분 일치로 통합 검색한다(REQ-FUNC-003,
 * 067). 결과 선택 시 같은 페이지의 해당 Section으로 스크롤 이동한다.
 */
export function HeroSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const results = useMemo(() => search(query), [query]);

  function handleSelect(result: SearchResult) {
    setIsOpen(false);
    setQuery("");
    document
      .getElementById(result.anchorId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      aria-label="여행지 검색"
      className="flex min-h-[420px] flex-col items-center justify-center gap-8 bg-[#F7F6F4] px-4 py-16 text-center tablet:min-h-[560px] tablet:px-8"
    >
      <div className="flex flex-col gap-3">
        <h1 className="text-[32px] font-semibold leading-[1.3] text-[#2A2A2E] tablet:text-[40px]">
          다음 여행지를 찾아보세요
        </h1>
        <p className="text-[16px] leading-[1.6] text-[#54545A]">
          여행지·국가·테마 키워드로 여행지와 안전정보를 한 번에 검색해 보세요.
        </p>
      </div>

      <div className="relative w-full max-w-[560px]">
        <div className="flex h-[56px] items-center rounded-full border border-[#E3E2DE] bg-white px-6 shadow-[0_1px_2px_rgba(0,0,0,.04)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#1D4ED8]">
          <label htmlFor="hero-search-input" className="sr-only">
            여행지·국가·테마 검색
          </label>
          <input
            id="hero-search-input"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            placeholder="여행지, 국가, 테마로 검색"
            role="combobox"
            aria-expanded={isOpen && results.length > 0}
            aria-controls="hero-search-results"
            autoComplete="off"
            className="h-full w-full bg-transparent text-[16px] text-[#2A2A2E] outline-none placeholder:text-[#6B6B72]"
          />
        </div>

        {isOpen && results.length > 0 && (
          <ul
            id="hero-search-results"
            role="listbox"
            className="absolute left-0 top-[64px] z-10 w-full overflow-hidden rounded-[16px] border border-[#E3E2DE] bg-white text-left shadow-[0_8px_24px_rgba(0,0,0,.16)]"
          >
            {results.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(result)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left hover:bg-[#F7F6F4]"
                >
                  <span className="flex flex-col">
                    <span className="text-[15px] font-medium text-[#2A2A2E]">
                      {highlightMatch(result.title, query)}
                    </span>
                    <span className="text-[13px] text-[#6B6B72]">
                      {result.subtitle}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-[#F7F6F4] px-3 py-1 text-[12px] font-medium text-[#54545A]">
                    {result.typeLabel}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        href="/travel-tools"
        className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] border border-[#2A2A2E] px-6 text-[16px] font-semibold leading-[1.2] text-[#2A2A2E] outline-none hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
      >
        항공·숙소 준비하기
      </Link>
    </section>
  );
}
