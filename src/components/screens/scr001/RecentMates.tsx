import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/common/EmptyState";
import { destinations } from "@/data/destinations";

interface RecentMatePost {
  post_id: string;
  title: string;
  country_code: string;
  start_date: string;
  end_date: string;
  capacity: number;
  travel_styles: string[];
  status: string;
}

function countryNameFor(countryCode: string): string {
  return (
    destinations.find((d) => d.countryCode === countryCode)?.countryName ??
    countryCode
  );
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** REQ-FUNC-037(축소)와 동일 원칙 — 종료일이 지난 OPEN 글은 배치 없이 표시 시점에 마감으로 계산한다. */
function isEffectivelyOpen(post: RecentMatePost): boolean {
  return post.status === "OPEN" && post.end_date >= todayIsoDate();
}

function formatDateRange(start: string, end: string): string {
  const format = (iso: string) => iso.replaceAll("-", ".");
  return `${format(start)} - ${format(end)}`;
}

/**
 * CMP-SCR-001-recent-mates — 최근 동행 카드 3개/Empty State(SCR-001 §6).
 * `MATE_POST`에서 `status=OPEN`인 최신 3건을 `card.mate`로 표시하며, 작성자
 * 연락처는 어떤 필드에도 조회·노출하지 않는다(REQ-FUNC-033과 동일 원칙).
 */
export async function RecentMates() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("mate_post")
    .select(
      "post_id, title, country_code, start_date, end_date, capacity, travel_styles, status",
    )
    .eq("status", "OPEN")
    .order("created_at", { ascending: false })
    .limit(3);

  const posts = (error ? [] : (data ?? [])) as RecentMatePost[];

  return (
    <section
      aria-labelledby="recent-mates-heading"
      className="mx-auto w-full max-w-[1280px] px-4 py-16 tablet:px-8"
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id="recent-mates-heading"
          className="text-[20px] font-semibold text-[#2A2A2E]"
        >
          최근 동행
        </h2>
        <Link
          href="/mates"
          className="text-[14px] font-semibold text-[#F4623A] hover:text-[#D94F2B]"
        >
          전체 동행 보기
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
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
                        : "bg-[#EFEDE9] text-[#83838A]"
                    }`}
                  >
                    {open ? "모집중" : "마감"}
                  </span>
                </div>

                <p className="text-[14px] leading-[1.6] text-[#54545A]">
                  {countryNameFor(post.country_code)} ·{" "}
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
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="아직 등록된 동행이 없어요."
            description="동행은 여행 일정·인원을 정한 뒤 글을 올리면 다른 여행자가 참가를 신청하고, 작성자가 신청을 승인하면 매칭이 완료돼요."
            action={{
              label: "동행 글 작성하기",
              href: "/travel-tools?tab=mate",
            }}
          />
        </div>
      )}
    </section>
  );
}
