"use client";

import { useState } from "react";
import { countrySafetyInfo } from "@/data/safety";
import type { CountrySafetyInfo, SafetyAdvisoryLevel } from "@/data/safety";
import { SafetyDetailDrawer } from "./SafetyDetailDrawer";

const ADVISORY_BADGE: Record<
  SafetyAdvisoryLevel,
  { color: string; label: string } | null
> = {
  없음: null,
  여행유의: { color: "#2C5FA8", label: "여행유의" },
  여행자제: { color: "#C77700", label: "여행자제" },
  철수권고: { color: "#C1352B", label: "철수권고" },
  여행금지: { color: "#1F1F1F", label: "여행금지" },
};

function isStale(verifiedAt: string): boolean {
  const verifiedTime = new Date(verifiedAt).getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - verifiedTime > sevenDaysMs;
}

/**
 * CMP-SCR-001-safety-section — 국가별 안전정보 Card(SCR-001 §5). `stale` 배지는
 * 배치 없이 렌더링 시점에 `verifiedAt` 기준 7일 초과 여부를 계산한다
 * (REQ-FUNC-050, REQ-NF-028). 안전정보 재확인 고지를 항상 고정 표시한다
 * (REQ-FUNC-054).
 */
export function SafetySection() {
  const [selected, setSelected] = useState<CountrySafetyInfo | null>(null);

  return (
    <section
      aria-labelledby="safety-section-heading"
      className="mx-auto w-full max-w-[1280px] px-4 py-16 tablet:px-8"
    >
      <h2
        id="safety-section-heading"
        className="text-[20px] font-semibold text-[#2A2A2E]"
      >
        국가별 안전정보
      </h2>
      <p className="mt-2 text-[14px] leading-[1.6] text-[#6B6B72]">
        이 정보는 공식 판단을 대체하지 않습니다. 출국 전 공식 출처 재확인이
        필요합니다.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
        {countrySafetyInfo.map((info) => {
          const advisory = ADVISORY_BADGE[info.advisoryLevel];
          const stale = isStale(info.verifiedAt);

          return (
            <button
              key={info.countryCode}
              type="button"
              onClick={() => setSelected(info)}
              className="flex flex-col gap-3 rounded-[16px] border border-[#E3E2DE] bg-white p-5 text-left outline-none transition-shadow hover:shadow-[0_1px_2px_rgba(0,0,0,.04),0_4px_12px_rgba(0,0,0,.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">
                  {info.countryName}
                </p>
                {advisory ? (
                  <span
                    className="shrink-0 rounded-full border px-3 py-1 text-[13px] font-semibold leading-[1.4]"
                    style={{
                      color: advisory.color,
                      borderColor: advisory.color,
                    }}
                  >
                    {advisory.label}
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-[#F7F6F4] px-3 py-1 text-[13px] font-medium leading-[1.4] text-[#6B6B72]">
                    특별경보 없음
                  </span>
                )}
              </div>

              <p className="text-[13px] text-[#6B6B72]">
                최종 확인일 {info.verifiedAt}
                {stale && (
                  <span className="ml-2 rounded-full bg-[#FBEEDA] px-2 py-0.5 text-[#B4700A]">
                    최신 확인 필요
                  </span>
                )}
              </p>
            </button>
          );
        })}
      </div>

      <SafetyDetailDrawer info={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
