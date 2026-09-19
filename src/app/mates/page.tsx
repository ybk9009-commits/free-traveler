import { Suspense } from "react";
import type { Metadata } from "next";
import {
  buildPageMetadata,
  buildWebPageStructuredData,
} from "@/lib/seo/metadata";
import { IntroCta } from "@/components/screens/scr004/IntroCta";
import { Filter } from "@/components/screens/scr004/Filter";
import { MateList } from "@/components/screens/scr004/MateList";
import { MateDetailPanel } from "@/components/screens/scr004/MateDetailPanel";
import { ApplyForm } from "@/components/screens/scr004/ApplyForm";
import { BlockButton } from "@/components/screens/scr004/BlockButton";
import { ReportModal } from "@/components/screens/scr004/ReportModal";
import { GuidanceSafety } from "@/components/screens/scr004/GuidanceSafety";

export const metadata: Metadata = buildPageMetadata({
  title: "동행 찾기",
  description:
    "여행 국가·지역·기간이 맞는 동행 모집글을 찾아보고 참가를 신청해 보세요.",
  path: "/mates",
});

const structuredData = buildWebPageStructuredData({
  name: "동행 찾기",
  description: "동행 모집글 검색, 상세 확인, 참가 신청을 제공하는 페이지.",
  path: "/mates",
});

/**
 * PO-SCR-004 — 동행 조회 화면 조립(`/mates`). Section 순서: Intro+CTA → 검색
 * Filter·결과 요약 → 동행 목록 → 상세(신청/차단/신고) → 신청 방법·안전 안내.
 * Desktop은 목록(좌)+상세(우) 영역을 함께 보여주고, Mobile은 목록 아래 상세가
 * 하단 시트로 열린다(각 Component가 자체적으로 처리). 이 파일에서 새 시각
 * 요소를 만들지 않고 CMP-SCR-004-* Component Task 산출물만 조립한다.
 */
export default function MatesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <IntroCta />
      <Suspense fallback={null}>
        <Filter />

        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-8 px-4 pb-16 tablet:grid-cols-[2fr_1fr] tablet:px-8">
          <MateList />

          <div className="flex flex-col gap-4">
            <MateDetailPanel />
            <ApplyForm />
            <div className="flex flex-wrap gap-3">
              <BlockButton />
              <ReportModal />
            </div>
          </div>
        </div>
      </Suspense>
      <GuidanceSafety />
    </>
  );
}
