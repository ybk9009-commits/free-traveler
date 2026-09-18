import { Suspense } from "react";
import type { Metadata } from "next";
import {
  buildPageMetadata,
  buildWebPageStructuredData,
} from "@/lib/seo/metadata";
import { HeroSearch } from "@/components/screens/scr001/HeroSearch";
import { DestinationGrid } from "@/components/screens/scr001/DestinationGrid";
import { DestinationDetailDrawer } from "@/components/screens/scr001/DestinationDetailDrawer";
import { SafetySection } from "@/components/screens/scr001/SafetySection";
import { RecentMates } from "@/components/screens/scr001/RecentMates";
import { AboutSummary } from "@/components/screens/scr001/AboutSummary";

export const metadata: Metadata = buildPageMetadata({
  title: "국내·해외 여행지 추천과 동행 매칭",
  description:
    "Free Traveler에서 국내외 추천 여행지, 안전정보, 여행 준비 도구와 동행 구하기를 한 곳에서 확인하세요.",
  path: "/",
});

const structuredData = buildWebPageStructuredData({
  name: "Free Traveler",
  description:
    "국내외 추천 여행지, 안전정보, 여행 준비 도구, 동행 매칭을 제공하는 여행 플랫폼.",
  path: "/",
});

/**
 * PO-SCR-001 — 메인 화면 조립(`/`). Section 순서: Hero 검색 → 국내/해외
 * 여행지(테마 Chip 포함) → 국가별 안전정보 → 최근 동행 → 대표 소개 요약.
 * 각 Section은 CMP-SCR-001-* Component Task의 산출물을 그대로 조립하며 이
 * 파일에서 새 시각 요소를 만들지 않는다.
 */
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroSearch />
      <Suspense fallback={null}>
        <DestinationGrid />
      </Suspense>
      <SafetySection />
      <RecentMates />
      <AboutSummary />
      <Suspense fallback={null}>
        <DestinationDetailDrawer />
      </Suspense>
    </>
  );
}
