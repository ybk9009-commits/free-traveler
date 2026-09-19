"use client";

import { useId, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export type TravelToolsTab = "flight" | "hotel" | "mate";

const TABS: { id: TravelToolsTab; label: string }[] = [
  { id: "flight", label: "항공편" },
  { id: "hotel", label: "숙소" },
  { id: "mate", label: "동행 구하기" },
];

interface IntroTabsProps {
  flightPanel: ReactNode;
  hotelPanel: ReactNode;
  matePanel: ReactNode;
}

function isTravelToolsTab(value: string | null): value is TravelToolsTab {
  return value === "flight" || value === "hotel" || value === "mate";
}

/**
 * CMP-SCR-003-intro-tabs — Intro 3단계 안내 + 탭 Shell(SCR-003 §2~3). `?tab=`
 * URL 쿼리로 선택 탭을 관리하며, 비활성 탭 패널은 `hidden` 속성으로만 감춰
 * 마운트를 유지한다 — 탭 전환 시 다른 탭의 입력 상태가 세션 동안 유지되도록
 * 한다(D-001 § Form·Tabs). 실제 탭별 내용은 `PO-SCR-003`이 각 Component Task
 * 산출물을 `flightPanel`/`hotelPanel`/`matePanel`로 조립해 전달한다.
 *
 * 활성 탭은 `useState`(초기값만 URL에서 읽음)로 관리하고, URL 동기화는
 * `router.replace` 대신 `window.history.replaceState`로 직접 처리한다 —
 * `router.replace`는 Next.js가 이 Route Segment의 RSC 페이로드를 다시
 * 가져오게 만들어 `flightPanel`/`hotelPanel`이 새 인스턴스로 교체되며,
 * 그 결과 탭 전환 약 200ms 후 FlightForm/HotelForm이 통째로 리마운트되어
 * 사용자가 입력하던 값이 사라지는 문제가 있었다(위 "입력 상태 유지" 목표에
 * 정면으로 위배). 이 탭 상태는 서버 데이터에 의존하지 않는 순수 클라이언트
 * UI 상태라 라우터를 거칠 필요가 없다.
 */
export function IntroTabs({
  flightPanel,
  hotelPanel,
  matePanel,
}: IntroTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabIdPrefix = useId();

  const rawTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<TravelToolsTab>(
    isTravelToolsTab(rawTab) ? rawTab : "flight",
  );

  function selectTab(tab: TravelToolsTab) {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${pathname}${query ? `?${query}` : ""}`,
    );
  }

  const panels: Record<TravelToolsTab, ReactNode> = {
    flight: flightPanel,
    hotel: hotelPanel,
    mate: matePanel,
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-16 tablet:px-8">
      <ol className="flex flex-col gap-2 tablet:flex-row tablet:gap-8">
        <li className="text-[14px] leading-[1.6] text-[#54545A]">
          <span className="font-semibold text-[#2A2A2E]">1. 조건 입력</span> —
          국가·지역·날짜를 입력합니다.
        </li>
        <li className="text-[14px] leading-[1.6] text-[#54545A]">
          <span className="font-semibold text-[#2A2A2E]">2. 요약 확인</span> —
          입력한 조건을 요약으로 확인합니다.
        </li>
        <li className="text-[14px] leading-[1.6] text-[#54545A]">
          <span className="font-semibold text-[#2A2A2E]">3. 이동/작성</span> —
          외부 사이트로 이동하거나 동행 글을 작성합니다.
        </li>
      </ol>

      <div
        role="tablist"
        aria-label="여행 준비 방법"
        className="mt-8 flex gap-6 border-b border-[#E3E2DE]"
      >
        {TABS.map((tab) => {
          const selected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              id={`${tabIdPrefix}-${tab.id}-tab`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${tabIdPrefix}-${tab.id}-panel`}
              onClick={() => selectTab(tab.id)}
              className={`h-11 border-b-2 px-1 text-[15px] font-semibold outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
                selected
                  ? "border-[#F4623A] text-[#2A2A2E]"
                  : "border-transparent text-[#83838A]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {TABS.map((tab) => (
        <div
          key={tab.id}
          id={`${tabIdPrefix}-${tab.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabIdPrefix}-${tab.id}-tab`}
          hidden={tab.id !== activeTab}
          className="mt-8"
        >
          {panels[tab.id]}
        </div>
      ))}
    </div>
  );
}
