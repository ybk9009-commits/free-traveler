import type { Metadata } from "next";
import {
  buildPageMetadata,
  buildWebPageStructuredData,
} from "@/lib/seo/metadata";
import { HeroProfile } from "@/components/screens/scr002/HeroProfile";
import { StatsStory } from "@/components/screens/scr002/StatsStory";
import { Timeline } from "@/components/screens/scr002/Timeline";
import { CountriesGallery } from "@/components/screens/scr002/CountriesGallery";
import { FavoriteDestinationsCta } from "@/components/screens/scr002/FavoriteDestinationsCta";

export const metadata: Metadata = buildPageMetadata({
  title: "대표 소개",
  description:
    "Free Traveler를 만든 free_traveler의 여행 이야기, 방문 국가, 여행 타임라인을 소개합니다.",
  path: "/about",
});

const structuredData = buildWebPageStructuredData({
  name: "대표 소개",
  description:
    "free_traveler의 여행 지표, 소개, 타임라인, 방문 국가와 사진 갤러리를 소개하는 페이지.",
  path: "/about",
});

/**
 * PO-SCR-002 — 대표 소개 화면 조립(`/about`). Section 순서: Hero Profile →
 * 여행 지표·소개(StatsStory) → Timeline → 방문 국가·사진 Gallery
 * (CountriesGallery) → 기억에 남는 여행지+CTA. 이 파일에서 새 시각 요소를
 * 만들지 않고 CMP-SCR-002-* Component Task 산출물만 조립한다.
 */
export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroProfile />
      <StatsStory />
      <Timeline />
      <CountriesGallery />
      <FavoriteDestinationsCta />
    </>
  );
}
