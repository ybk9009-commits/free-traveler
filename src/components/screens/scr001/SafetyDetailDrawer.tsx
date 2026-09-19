"use client";

import { useEffect, useId, useRef, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import type { CountrySafetyInfo, SafetyAdvisoryLevel } from "@/data/safety";
import { getExternalLinkAttrs } from "@/lib/links/external-link";

interface SafetyDetailDrawerProps {
  info: CountrySafetyInfo | null;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const CATEGORY_LABELS: Record<keyof CountrySafetyInfo["categories"], string> = {
  security: "치안",
  commonScams: "흔한 사기",
  localLaws: "현지 법규",
  transport: "교통",
  disasterClimate: "재난·기후",
  health: "보건",
  cultureDressCode: "문화·복장",
  emergencyContacts: "긴급연락처",
};

const ADVISORY_STYLES: Record<
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
 * CMP-SCR-001-safety-section — 국가별 안전정보 상세 Drawer. D-001 § Drawer·Modal
 * 규칙(Desktop 우측 슬라이드 480-560px / Mobile 하단 풀스크린 시트, 포커스
 * 트랩, Esc·배경 클릭 닫힘)을 이 Task 전용으로 구현한다(`CMP-COMMON-*` 공용
 * Modal은 중앙 정렬 Dialog 전용이라 이 화면별 시각 변형은 재사용하지 않는다).
 */
export function SafetyDetailDrawer({ info, onClose }: SafetyDetailDrawerProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!info) return;

    previouslyFocusedElement.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable =
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement.current?.focus();
    };
  }, [info, onClose]);

  if (!info || typeof document === "undefined") return null;

  function handleScrimMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  const advisory = ADVISORY_STYLES[info.advisoryLevel];
  const mofaLinkAttrs = getExternalLinkAttrs(info.sourceUrl);
  const stale = isStale(info.verifiedAt);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[rgba(20,20,20,0.5)] tablet:items-stretch"
      onMouseDown={handleScrimMouseDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-full flex-col overflow-hidden bg-white shadow-[0_8px_24px_rgba(0,0,0,0.16)] tablet:w-[520px] tablet:max-w-[560px]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#E3E2DE] px-6 py-4">
          <div>
            <h2
              id={titleId}
              className="text-[20px] font-semibold leading-[1.4] text-[#2A2A2E]"
            >
              {info.countryName} 안전정보
            </h2>
            <p className="mt-1 text-[13px] text-[#6B6B72]">
              적용 범위:{" "}
              {info.scopeType === "COUNTRY" ? "국가 전체" : "일부 지역"} (
              {info.scopeText})
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#54545A] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {advisory ? (
            <p
              className="mb-4 rounded-[8px] border px-4 py-3 text-[15px] font-semibold"
              style={{ color: advisory.color, borderColor: advisory.color }}
            >
              외교부 여행경보: {advisory.label}
            </p>
          ) : (
            <p className="mb-4 rounded-[8px] border border-[#E3E2DE] bg-[#F7F6F4] px-4 py-3 text-[15px] font-medium text-[#54545A]">
              현재 특별 경보 없음
            </p>
          )}

          <dl className="flex flex-col gap-4">
            {(
              Object.keys(CATEGORY_LABELS) as Array<
                keyof CountrySafetyInfo["categories"]
              >
            ).map((key) => (
              <div key={key}>
                <dt className="text-[14px] font-semibold text-[#2A2A2E]">
                  {CATEGORY_LABELS[key]}
                </dt>
                <dd className="mt-1 text-[14px] leading-[1.6] text-[#54545A]">
                  {info.categories[key]}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-col gap-1 border-t border-[#E3E2DE] pt-4">
            <p className="text-[14px] font-semibold text-[#2A2A2E]">
              긴급연락처
            </p>
            <p className="text-[14px] leading-[1.6] text-[#54545A]">
              현지: {info.emergency.localEmergencyNumber}
            </p>
            <p className="text-[14px] leading-[1.6] text-[#54545A]">
              영사콜센터: {info.emergency.koreanConsularHotline}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-1 border-t border-[#E3E2DE] pt-4 text-[13px] text-[#6B6B72]">
            <p>
              출처: {info.sourceName} · 최종 확인일 {info.verifiedAt} · 편집:{" "}
              {info.verifiedBy}
              {stale && (
                <span className="ml-2 rounded-full bg-[#FBEEDA] px-2 py-0.5 text-[#B4700A]">
                  최신 확인 필요
                </span>
              )}
            </p>
            {mofaLinkAttrs && (
              <a
                {...mofaLinkAttrs}
                className="font-semibold text-[#F4623A] hover:text-[#D94F2B]"
              >
                외교부 해외안전여행 원문 보기
              </a>
            )}
            <p>
              이 정보는 공식 판단을 대체하지 않습니다. 출국 전 공식 출처
              재확인이 필요합니다.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
