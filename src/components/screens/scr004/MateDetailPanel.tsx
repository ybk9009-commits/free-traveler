"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { destinations } from "@/data/destinations";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface MateDetail {
  post_id: string;
  title: string;
  description: string;
  country_code: string;
  region_code: string | null;
  start_date: string;
  end_date: string;
  capacity: number;
  preferences: { note?: string } | null;
  travel_styles: string[];
  status: string;
  owner_id: string;
  owner_nickname: string | null;
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

function isEffectivelyOpen(post: MateDetail): boolean {
  return post.status === "OPEN" && post.end_date >= todayIsoDate();
}

function formatDateRange(start: string, end: string): string {
  const format = (iso: string) => iso.replaceAll("-", ".");
  return `${format(start)} - ${format(end)}`;
}

/**
 * CMP-SCR-004-detail — 동행 상세 패널(SCR-004). `?post=<id>` URL 쿼리로 선택된
 * 글을 표시한다 — `CMP-SCR-004-list`(이미 완료된 선행 Task, Expected Files
 * 밖이라 수정 불가)의 카드가 아직 이 쿼리를 설정하도록 연결되어 있지 않아,
 * 현재는 딥링크로 직접 열거나 향후 Page Owner가 연결해야 한다. 응답에
 * 이메일·전화번호는 어떤 필드에도 포함하지 않는다(REQ-FUNC-033).
 */
export function MateDetailPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("post");

  const [detail, setDetail] = useState<MateDetail | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) return;

    let active = true;

    async function loadDetail() {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      if (active) setCurrentUserId(userData.user?.id ?? null);

      const { data: post, error } = await supabase
        .from("mate_post")
        .select(
          "post_id, title, description, country_code, region_code, start_date, end_date, capacity, preferences, travel_styles, status, owner_id",
        )
        .eq("post_id", postId)
        .neq("status", "DELETED")
        .single();

      if (!active) return;

      if (error || !post) {
        setDetail(null);
        setLoading(false);
        return;
      }

      const { data: owner } = await supabase
        .from("user_profile")
        .select("nickname")
        .eq("user_id", post.owner_id)
        .maybeSingle();

      if (!active) return;

      setDetail({
        ...(post as Omit<MateDetail, "owner_nickname">),
        owner_nickname:
          (owner as { nickname?: string } | null)?.nickname ?? null,
      });
      setLoading(false);
    }

    void loadDetail();
    return () => {
      active = false;
    };
  }, [postId]);

  function close() {
    router.back();
  }

  function renderContent() {
    if (!postId) {
      return (
        <p className="text-[14px] leading-[1.6] text-[#6B6B72]">
          목록에서 동행 글을 선택하면 상세 내용이 여기에 표시됩니다.
        </p>
      );
    }

    if (loading || !detail || detail.post_id !== postId) {
      return (
        <p className="text-[14px] leading-[1.6] text-[#6B6B72]">
          불러오는 중입니다.
        </p>
      );
    }

    const open = isEffectivelyOpen(detail);
    const isOwner = currentUserId === detail.owner_id;

    return (
      <div className="flex flex-col gap-4">
        {isOwner && (
          <div className="rounded-[8px] bg-[#FEEBE3] px-4 py-3 text-[13px] font-medium text-[#F4623A]">
            내 글이에요. 수정·마감·신청 관리는{" "}
            <Link href="/account" className="underline">
              계정 &gt; 내 활동
            </Link>
            에서 할 수 있어요.
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <p className="text-[20px] font-semibold leading-[1.4] text-[#2A2A2E]">
            {detail.title}
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

        <p className="text-[14px] text-[#54545A]">
          작성자 {detail.owner_nickname ?? "알 수 없음"}
        </p>

        <p className="text-[14px] leading-[1.6] text-[#54545A]">
          {countryNameFor(detail.country_code)}
          {detail.region_code ? ` · ${detail.region_code}` : ""} ·{" "}
          {formatDateRange(detail.start_date, detail.end_date)} · 모집 인원{" "}
          {detail.capacity}명
        </p>

        {detail.travel_styles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {detail.travel_styles.map((style) => (
              <span
                key={style}
                className="rounded-full bg-[#F7F6F4] px-3 py-1 text-[13px] font-medium text-[#54545A]"
              >
                {style}
              </span>
            ))}
          </div>
        )}

        {detail.preferences?.note && (
          <div>
            <p className="text-[15px] font-semibold text-[#2A2A2E]">
              선호 조건
            </p>
            <p className="mt-1 text-[14px] leading-[1.6] text-[#54545A]">
              {detail.preferences.note}
            </p>
          </div>
        )}

        <div>
          <p className="text-[15px] font-semibold text-[#2A2A2E]">설명</p>
          <p className="mt-1 whitespace-pre-line text-[14px] leading-[1.6] text-[#54545A]">
            {detail.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden rounded-[16px] border border-[#E3E2DE] bg-white p-6 tablet:block">
        {renderContent()}
      </div>

      {postId && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-[rgba(20,20,20,0.5)] tablet:hidden">
          <div className="flex max-h-[80vh] flex-col overflow-y-auto rounded-t-[16px] bg-white p-6">
            <button
              type="button"
              onClick={close}
              aria-label="닫기"
              className="mb-2 flex h-11 w-11 items-center justify-center self-end rounded-full text-[#54545A] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
}
