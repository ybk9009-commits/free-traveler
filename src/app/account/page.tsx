import Link from "next/link";
import type { Metadata } from "next";
import {
  buildPageMetadata,
  buildWebPageStructuredData,
} from "@/lib/seo/metadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AuthCard } from "@/components/screens/scr005/AuthCard";
import { ProfileTab } from "@/components/screens/scr005/ProfileTab";
import { MyActivityTab } from "@/components/screens/scr005/MyActivityTab";
import { AdminConsole } from "@/components/screens/scr005/AdminConsole";

export const metadata: Metadata = buildPageMetadata({
  title: "계정",
  description: "로그인, 프로필 관리, 내 동행 활동을 확인하는 계정 페이지.",
  path: "/account",
});

const structuredData = buildWebPageStructuredData({
  name: "계정",
  description:
    "로그인·회원가입, 프로필 관리, 내 활동, 관리자 기능을 제공하는 페이지.",
  path: "/account",
});

type MemberSection = "profile" | "activity" | "admin";

function isMemberSection(value: string | undefined): value is MemberSection {
  return value === "profile" || value === "activity" || value === "admin";
}

/**
 * PO-SCR-005 — 계정·관리 화면 조립(`/account`). 현재 세션 역할(Guest/Member/
 * Admin)을 **서버에서** 판정해 해당하지 않는 Component는 렌더링 트리에서
 * 아예 제외한다(CSS로 숨기지 않음). 탭 전환은 `?section=` URL 쿼리 기반의
 * 순수 서버 렌더링 링크로 처리해 별도 클라이언트 상태를 두지 않는다.
 */
export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  const role = (user?.app_metadata as { role?: string } | undefined)?.role;
  const isAdmin = role === "MODERATOR" || role === "ADMIN";

  const activeSection: MemberSection =
    isMemberSection(section) && (section !== "admin" || isAdmin)
      ? section
      : "profile";

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-16 tablet:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <h1 className="text-[28px] font-semibold text-[#2A2A2E]">계정</h1>

      {!user ? (
        <>
          <p className="mt-2 text-[16px] leading-[1.6] text-[#54545A]">
            로그인하면 동행 모집글 작성, 참가 신청, 즐겨찾기 저장을 할 수
            있어요.
          </p>
          <div className="mt-8">
            <AuthCard />
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-[16px] leading-[1.6] text-[#54545A]">
            프로필을 관리하고 동행 활동을 확인하세요.
          </p>

          <div
            role="tablist"
            aria-label="계정 메뉴"
            className="mt-8 flex gap-6 border-b border-[#E3E2DE]"
          >
            <Link
              href="/account?section=profile"
              role="tab"
              aria-selected={activeSection === "profile"}
              className={`h-11 border-b-2 px-1 text-[15px] font-semibold leading-[44px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
                activeSection === "profile"
                  ? "border-[#F4623A] text-[#2A2A2E]"
                  : "border-transparent text-[#6B6B72]"
              }`}
            >
              프로필
            </Link>
            <Link
              href="/account?section=activity"
              role="tab"
              aria-selected={activeSection === "activity"}
              className={`h-11 border-b-2 px-1 text-[15px] font-semibold leading-[44px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
                activeSection === "activity"
                  ? "border-[#F4623A] text-[#2A2A2E]"
                  : "border-transparent text-[#6B6B72]"
              }`}
            >
              내 활동
            </Link>
            {isAdmin && (
              <Link
                href="/account?section=admin"
                role="tab"
                aria-selected={activeSection === "admin"}
                className={`h-11 border-b-2 px-1 text-[15px] font-semibold leading-[44px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
                  activeSection === "admin"
                    ? "border-[#F4623A] text-[#2A2A2E]"
                    : "border-transparent text-[#6B6B72]"
                }`}
              >
                관리
              </Link>
            )}
          </div>

          <div className="mt-8">
            {activeSection === "profile" && <ProfileTab />}
            {activeSection === "activity" && (
              <>
                <MyActivityTab />
                <div className="mt-8">
                  <Link
                    href="/travel-tools?tab=mate"
                    className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[15px] font-semibold text-white hover:bg-[#D94F2B]"
                  >
                    새 동행 글 작성하기
                  </Link>
                </div>
              </>
            )}
            {activeSection === "admin" && isAdmin && <AdminConsole />}
          </div>
        </>
      )}
    </div>
  );
}
