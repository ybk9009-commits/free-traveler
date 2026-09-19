"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { destinations } from "@/data/destinations";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useShare } from "@/lib/hooks/useShare";
import { EmptyState } from "@/components/common/EmptyState";

const PAGE_SIZE = 8;

interface MatePostRow {
  post_id: string;
  title: string;
  country_code: string;
  region_code: string | null;
  start_date: string;
  end_date: string;
  capacity: number;
  travel_styles: string[];
  status: string;
  owner_id: string;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function countryNameFor(countryCode: string): string {
  return (
    destinations.find((d) => d.countryCode === countryCode)?.countryName ??
    countryCode
  );
}

function isEffectivelyOpen(post: MatePostRow): boolean {
  return post.status === "OPEN" && post.end_date >= todayIsoDate();
}

function formatDateRange(start: string, end: string): string {
  const format = (iso: string) => iso.replaceAll("-", ".");
  return `${format(start)} - ${format(end)}`;
}

/**
 * CMP-SCR-004-list — 동행 목록 Card Grid(SCR-004). `CMP-SCR-004-filter`와 같은
 * URL 쿼리(country/region/periodStart/periodEnd/status)를 읽어 동일한 조건으로
 * 조회한다. 내가 차단한 사용자(`blocker_id`=본인, RLS로 조회 가능한 방향)의
 * 글만 제외한다 — 나를 차단한 사용자 방향은 `user_block` RLS 제약상 클라이언트
 * 에서 조회할 수 없어(`CMP-SCR-004-filter`와 동일한 한계, 문서화됨) 반영하지
 * 못한다.
 */
export function MateList() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { share } = useShare();

  const [posts, setPosts] = useState<MatePostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [hasMore, setHasMore] = useState(false);

  const country = searchParams.get("country") ?? "";
  const region = searchParams.get("region") ?? "";
  const periodStart = searchParams.get("periodStart") ?? "";
  const periodEnd = searchParams.get("periodEnd") ?? "";
  const status = searchParams.get("status") ?? "";

  const filterKey = `${country}|${region}|${periodStart}|${periodEnd}|${status}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setLimit(PAGE_SIZE);
  }

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      setLoading(true);
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
        .select(
          "post_id, title, country_code, region_code, start_date, end_date, capacity, travel_styles, status, owner_id",
        )
        .neq("status", "DELETED")
        .order("created_at", { ascending: false })
        .limit(limit + 1);

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

      const { data, error } = await query;
      if (!active) return;

      const rows = (error ? [] : (data as MatePostRow[] | null)) ?? [];
      setHasMore(rows.length > limit);
      setPosts(rows.slice(0, limit));
      setLoading(false);
    }

    void loadPosts();
    return () => {
      active = false;
    };
  }, [country, region, periodStart, periodEnd, status, limit]);

  function handleShare(postId: string, title: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    void share({
      title,
      text: `${title} 동행 모집글`,
      url: `${origin}/mates/${postId}`,
    });
  }

  function resetFilters() {
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", pathname);
      window.location.reload();
    }
  }

  if (loading) return null;

  if (posts.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[1280px] px-4 py-8 tablet:px-8">
        <EmptyState
          title="조건에 맞는 동행글이 아직 없어요."
          description="필터를 초기화하거나 첫 동행 글을 작성해 보세요."
          action={{
            label: "첫 동행 글 작성하기",
            href: "/travel-tools?tab=mate",
          }}
        />
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={resetFilters}
            className="text-[14px] font-semibold text-[#54545A] underline"
          >
            필터 초기화
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="동행 모집글 목록"
      className="mx-auto w-full max-w-[1280px] px-4 py-8 tablet:px-8"
    >
      <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
        {posts.map((post) => {
          const open = isEffectivelyOpen(post);
          return (
            <article
              key={post.post_id}
              className="flex flex-col gap-3 rounded-[16px] border border-[#E3E2DE] bg-white p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">
                  {post.title}
                </p>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[13px] font-medium leading-[1.4] ${
                    open
                      ? "bg-[#FEEBE3] text-[#F4623A]"
                      : "bg-[#EFEDE9] text-[#6B6B72]"
                  }`}
                >
                  {open ? "모집중" : "마감"}
                </span>
              </div>

              <p className="text-[14px] leading-[1.6] text-[#54545A]">
                {countryNameFor(post.country_code)}
                {post.region_code ? ` · ${post.region_code}` : ""} ·{" "}
                {formatDateRange(post.start_date, post.end_date)} · 모집 인원{" "}
                {post.capacity}명
              </p>

              {post.travel_styles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.travel_styles.slice(0, 2).map((style) => (
                    <span
                      key={style}
                      className="rounded-full bg-[#F7F6F4] px-3 py-1 text-[13px] font-medium text-[#54545A]"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFavorite(post.post_id)}
                  aria-pressed={isFavorite(post.post_id)}
                  className="h-10 rounded-full border border-[#E3E2DE] px-4 text-[13px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
                >
                  {isFavorite(post.post_id) ? "즐겨찾기 해제" : "즐겨찾기"}
                </button>
                <button
                  type="button"
                  onClick={() => handleShare(post.post_id, post.title)}
                  className="h-10 rounded-full border border-[#E3E2DE] px-4 text-[13px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
                >
                  URL 공유
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((current) => current + PAGE_SIZE)}
            className="h-11 rounded-[8px] border border-[#2A2A2E] px-6 text-[15px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
          >
            더 보기
          </button>
        </div>
      )}
    </section>
  );
}
