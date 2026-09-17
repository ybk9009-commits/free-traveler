"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "여행지", href: "/" },
  { label: "여행 준비", href: "/travel-tools" },
  { label: "동행 찾기", href: "/mates" },
  { label: "대표 소개", href: "/about" },
];

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Supabase 환경변수가 아직 없거나 서비스가 응답하지 않아도 공개 탐색이
// 깨지지 않도록, 클라이언트 생성 실패는 로그아웃 상태로 처리한다.
function safeCreateBrowserClient() {
  try {
    return createSupabaseBrowserClient();
  } catch {
    return null;
  }
}

/**
 * CMP-COMMON-HEADER-FOOTER — 전역 Header. D-001 § Header·Footer, REQ-FUNC-064.
 */
export function Header() {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    const supabase = safeCreateBrowserClient();
    if (!supabase) return;

    supabase.auth
      .getUser()
      .then(({ data }) => setUser(data.user ?? null))
      .catch(() => setUser(null));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const supabase = safeCreateBrowserClient();
    if (!supabase) return;

    const client = supabase;
    const userId = user.id;
    let cancelled = false;

    async function loadNickname() {
      try {
        const { data } = await client
          .from("user_profile")
          .select("nickname")
          .eq("user_id", userId)
          .single();
        if (!cancelled) {
          setNickname((data as { nickname?: string } | null)?.nickname ?? null);
        }
      } catch {
        if (!cancelled) setNickname(null);
      }
    }

    void loadNickname();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!isMobileNavOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMobileNavOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileNavOpen]);

  const accountLabel = user ? (nickname ?? "내 계정") : "로그인";

  return (
    <header className="border-b border-[#E3E2DE] bg-white">
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-4 tablet:px-8">
        <Link href="/" className="text-[20px] font-bold text-[#2A2A2E]">
          Free Traveler
        </Link>

        <nav
          aria-label="주요 내비게이션"
          className="hidden items-center gap-8 tablet:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`border-b-2 py-1 text-[15px] font-medium outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
                  active
                    ? "border-[#F4623A] text-[#F4623A]"
                    : "border-transparent text-[#2A2A2E]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden tablet:block">
          <Link
            href="/account"
            className="flex items-center gap-2 text-[15px] font-semibold text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            {user && (
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FEEBE3] text-[13px] font-semibold text-[#F4623A]"
              >
                {accountLabel.slice(0, 1)}
              </span>
            )}
            {accountLabel}
          </Link>
        </div>

        <button
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={isMobileNavOpen}
          onClick={() => setIsMobileNavOpen(true)}
          className="flex h-11 w-11 items-center justify-center outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] tablet:hidden"
        >
          <span aria-hidden="true" className="text-[20px]">
            ☰
          </span>
        </button>
      </div>

      {isMobileNavOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="모바일 내비게이션"
          className="fixed inset-0 z-50 flex flex-col bg-white tablet:hidden"
        >
          <div className="flex h-[72px] items-center justify-between border-b border-[#E3E2DE] px-4">
            <span className="text-[20px] font-bold text-[#2A2A2E]">
              Free Traveler
            </span>
            <button
              type="button"
              aria-label="메뉴 닫기"
              onClick={() => setIsMobileNavOpen(false)}
              className="flex h-11 w-11 items-center justify-center outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              <span aria-hidden="true" className="text-[20px]">
                &times;
              </span>
            </button>
          </div>
          <nav
            aria-label="모바일 내비게이션 메뉴"
            className="flex flex-col gap-1 p-4"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileNavOpen(false)}
                aria-current={
                  isActiveRoute(pathname, item.href) ? "page" : undefined
                }
                className="rounded-[8px] px-4 py-3 text-[16px] font-medium text-[#2A2A2E]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setIsMobileNavOpen(false)}
              className="rounded-[8px] px-4 py-3 text-[16px] font-semibold text-[#F4623A]"
            >
              {accountLabel}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
