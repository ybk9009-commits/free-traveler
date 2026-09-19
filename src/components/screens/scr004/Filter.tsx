"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { destinations } from "@/data/destinations";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const STATUS_OPTIONS = [
  { id: "", label: "전체" },
  { id: "OPEN", label: "모집중" },
  { id: "CLOSED", label: "마감" },
] as const;

const ALLOWED_QUERY_KEYS = [
  "country",
  "region",
  "periodStart",
  "periodEnd",
  "status",
] as const;
type FilterKey = (typeof ALLOWED_QUERY_KEYS)[number];

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * CMP-SCR-004-filter — 검색 Filter + 결과 요약(SCR-004). 필터 상태는 `?country=
 * &region=&periodStart=&periodEnd=&status=` URL 쿼리로 관리해 `CMP-SCR-004-list`
 * 가 같은 쿼리를 읽어 동일한 조건으로 목록을 조회한다(REQ-FUNC-030). 결과
 * 요약(count)은 내가 차단한 사용자(`blocker_id`=본인, RLS로 조회 가능한 방향)
 * 글만 우선 제외해 계산한다 — 나를 차단한 사용자 방향은 `user_block` RLS가
 * `blocker_id`=본인 행만 SELECT를 허용해 클라이언트에서 조회할 수 없으므로,
 * 실제 목록 렌더링(`CMP-SCR-004-list`)에서 서버 쪽으로 양방향 제외를 적용한다.
 */
export function Filter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [count, setCount] = useState<number | null>(null);

  const country = searchParams.get("country") ?? "";
  const region = searchParams.get("region") ?? "";
  const periodStart = searchParams.get("periodStart") ?? "";
  const periodEnd = searchParams.get("periodEnd") ?? "";
  const status = searchParams.get("status") ?? "";

  const countryOptions = useMemo(
    () =>
      Array.from(
        new Map(destinations.map((d) => [d.countryCode, d.countryName])),
      ).sort((a, b) => a[1].localeCompare(b[1], "ko")),
    [],
  );

  const regionOptions = useMemo(
    () =>
      Array.from(
        new Set(
          destinations
            .filter((d) => !country || d.countryCode === country)
            .map((d) => d.name),
        ),
      ),
    [country],
  );

  const hasActiveFilters = Boolean(
    country || region || periodStart || periodEnd || status,
  );

  function applyParams(next: Partial<Record<FilterKey, string>>) {
    const merged: Record<FilterKey, string> = {
      country,
      region,
      periodStart,
      periodEnd,
      status,
      ...next,
    };
    const params = new URLSearchParams();
    for (const key of ALLOWED_QUERY_KEYS) {
      if (merged[key]) params.set(key, merged[key]);
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  }

  function resetFilters() {
    router.replace(pathname, { scroll: false });
  }

  useEffect(() => {
    let active = true;

    async function loadCount() {
      const supabase = createSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();

      let blockedOwnerIds: string[] = [];
      if (userData.user) {
        const { data: blocks } = await supabase
          .from("user_block")
          .select("blocked_id")
          .eq("blocker_id", userData.user.id);
        blockedOwnerIds = (blocks ?? []).map(
          (row) => (row as { blocked_id: string }).blocked_id,
        );
      }

      let query = supabase
        .from("mate_post")
        .select("post_id", { count: "exact", head: true })
        .neq("status", "DELETED");

      if (country) query = query.eq("country_code", country);
      if (region) query = query.eq("region_code", region);
      if (periodStart) query = query.gte("end_date", periodStart);
      if (periodEnd) query = query.lte("start_date", periodEnd);
      if (status === "OPEN") {
        query = query.eq("status", "OPEN").gte("end_date", todayIsoDate());
      } else if (status === "CLOSED") {
        query = query.or(
          `status.eq.CLOSED,and(status.eq.OPEN,end_date.lt.${todayIsoDate()})`,
        );
      }
      if (blockedOwnerIds.length > 0) {
        query = query.not("owner_id", "in", `(${blockedOwnerIds.join(",")})`);
      }

      const { count: resultCount, error } = await query;
      if (active) setCount(error ? null : (resultCount ?? 0));
    }

    void loadCount();
    return () => {
      active = false;
    };
  }, [country, region, periodStart, periodEnd, status]);

  return (
    <section
      aria-labelledby="mate-filter-heading"
      className="mx-auto w-full max-w-[1280px] px-4 py-10 tablet:px-8"
    >
      <h2 id="mate-filter-heading" className="sr-only">
        동행 검색 필터
      </h2>

      <div className="flex flex-col gap-6 tablet:flex-row tablet:items-start tablet:justify-between">
        <div className="flex flex-col gap-4 rounded-[16px] border border-[#E3E2DE] bg-[#F7F6F4] p-4 tablet:flex-row tablet:flex-wrap tablet:items-end tablet:gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-[#6B6B72]">국가</span>
            <select
              value={country}
              onChange={(event) =>
                applyParams({ country: event.target.value, region: "" })
              }
              className="h-[44px] rounded-[8px] border border-[#E3E2DE] bg-white px-3 text-[14px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              <option value="">전체 국가</option>
              {countryOptions.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-[#6B6B72]">지역</span>
            <select
              value={region}
              onChange={(event) => applyParams({ region: event.target.value })}
              className="h-[44px] rounded-[8px] border border-[#E3E2DE] bg-white px-3 text-[14px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              <option value="">전체 지역</option>
              {regionOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-[#6B6B72]">
              여행 시작
            </span>
            <input
              type="date"
              value={periodStart}
              onChange={(event) =>
                applyParams({ periodStart: event.target.value })
              }
              className="h-[44px] rounded-[8px] border border-[#E3E2DE] bg-white px-3 text-[14px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-[#6B6B72]">
              여행 종료
            </span>
            <input
              type="date"
              value={periodEnd}
              onChange={(event) =>
                applyParams({ periodEnd: event.target.value })
              }
              className="h-[44px] rounded-[8px] border border-[#E3E2DE] bg-white px-3 text-[14px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-[#6B6B72]">
              모집상태
            </span>
            <select
              value={status}
              onChange={(event) => applyParams({ status: event.target.value })}
              className="h-[44px] rounded-[8px] border border-[#E3E2DE] bg-white px-3 text-[14px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              {STATUS_OPTIONS.map((option) => (
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

        <p
          className="text-[15px] font-semibold text-[#2A2A2E]"
          aria-live="polite"
        >
          {count === null ? "결과를 불러오는 중" : `${count}건의 동행글`}
        </p>
      </div>
    </section>
  );
}
