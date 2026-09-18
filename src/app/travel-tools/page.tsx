import { Suspense } from "react";
import type { Metadata } from "next";
import {
  buildPageMetadata,
  buildWebPageStructuredData,
} from "@/lib/seo/metadata";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { IntroTabs } from "@/components/screens/scr003/IntroTabs";
import { FlightForm } from "@/components/screens/scr003/FlightForm";
import { HotelForm } from "@/components/screens/scr003/HotelForm";
import { MateWriteForm } from "@/components/screens/scr003/MateWriteForm";

export const metadata: Metadata = buildPageMetadata({
  title: "여행 준비",
  description:
    "항공·숙소 조건을 입력해 요약을 확인하고 외부 사이트로 이동하거나, 동행 모집글을 작성해 보세요.",
  path: "/travel-tools",
});

const structuredData = buildWebPageStructuredData({
  name: "여행 준비",
  description:
    "항공·숙소 조건 입력과 동행 모집글 작성을 한 곳에서 제공하는 페이지.",
  path: "/travel-tools",
});

const OUTBOUND_SETTING_KEYS = [
  "FLIGHT_OUTBOUND_URL",
  "HOTEL_OUTBOUND_URL",
] as const;

/**
 * `app_settings`는 RLS로 클라이언트 접근이 전면 차단되어 있어(API-ADMIN-SETTINGS),
 * 이 값을 화면에 노출할 수 있는 유일한 경로는 Page Owner가 Server Component에서
 * Service Role로 직접 읽어 하위 Client Component(`FlightForm`/`HotelForm`)에
 * props로 전달하는 것이다. `CMP-SCR-003-flight-form`/`hotel-form`은 이 Task를
 * 위한 새 API Route를 만들지 않는다는 제약이 있어, 값 조회는 여기서만 한다.
 */
const EMPTY_OUTBOUND_URLS = {
  flightOutboundUrl: null,
  hotelOutboundUrl: null,
} as const;

async function loadOutboundUrls(): Promise<{
  flightOutboundUrl: string | null;
  hotelOutboundUrl: string | null;
}> {
  try {
    const serviceClient = createSupabaseServiceRoleClient();
    const { data, error } = await serviceClient
      .from("app_settings")
      .select("key, value")
      .in("key", OUTBOUND_SETTING_KEYS);

    if (error) return EMPTY_OUTBOUND_URLS;

    const settings = new Map((data ?? []).map((row) => [row.key, row.value]));
    return {
      flightOutboundUrl: settings.get("FLIGHT_OUTBOUND_URL") ?? null,
      hotelOutboundUrl: settings.get("HOTEL_OUTBOUND_URL") ?? null,
    };
  } catch {
    // 서비스 롤 키 미설정 등으로 조회 자체가 불가능해도, 외부 이동 주소 하나가
    // 없다는 이유로 /travel-tools 전체가 죽어서는 안 된다 — FlightForm/HotelForm은
    // outboundUrl=null일 때 "아직 설정되지 않았습니다" 상태를 이미 처리한다.
    return EMPTY_OUTBOUND_URLS;
  }
}

/**
 * PO-SCR-003 — 통합 여행 준비 화면 조립(`/travel-tools`). Section 순서: Intro
 * 3단계 안내 → 탭(항공편/숙소/동행 구하기) → 선택 탭의 Form+Tip → 동행 탭은
 * 작성 Form 또는 로그인 안내. 이 파일에서 새 시각 요소를 만들지 않고
 * CMP-SCR-003-* Component Task 산출물만 조립한다.
 */
export default async function TravelToolsPage() {
  const { flightOutboundUrl, hotelOutboundUrl } = await loadOutboundUrls();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Suspense fallback={null}>
        <IntroTabs
          flightPanel={<FlightForm outboundUrl={flightOutboundUrl} />}
          hotelPanel={<HotelForm outboundUrl={hotelOutboundUrl} />}
          matePanel={<MateWriteForm />}
        />
      </Suspense>
    </>
  );
}
