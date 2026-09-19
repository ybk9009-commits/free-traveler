"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { destinations } from "@/data/destinations";
import {
  FormField,
  formFieldInputClassName,
} from "@/components/common/FormField";
import { getExternalLinkAttrs } from "@/lib/links/external-link";

interface HotelFormProps {
  /**
   * `PO-SCR-003`(Page Owner)가 서버에서 `app_settings.HOTEL_OUTBOUND_URL`을
   * 읽어 전달한다. 이 컴포넌트는 관리자 설정을 직접 조회하지 않는다
   * (`app_settings`는 RLS로 클라이언트 접근이 전면 차단되어 있음).
   */
  outboundUrl: string | null;
}

const SEARCH_TIPS = [
  "체크인·체크아웃 요일을 바꿔 가며 가격을 비교해 보세요.",
  "역·정류장에서의 거리와 후기 평점을 함께 확인하세요.",
  "취소 정책을 예약 전 반드시 확인하세요.",
];

const NO_TRANSMIT_NOTICE = "입력값은 외부 사이트로 전달되지 않습니다.";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * CMP-SCR-003-hotel-form — 숙소 조건 입력·요약·외부 이동(SCR-003 §3~5, 숙소
 * 탭). `CMP-SCR-003-flight-form`과 동일한 좌우 분할/입력 패턴을 재사용한다.
 * 국가·지역·날짜는 브라우저 메모리 상태로만 처리한다(REQ-FUNC-025, REQ-NF-017,
 * CON-01).
 */
export function HotelForm({ outboundUrl }: HotelFormProps) {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("");
  const [regionCode, setRegionCode] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [step, setStep] = useState<"form" | "summary">("form");
  const [dateError, setDateError] = useState<string | null>(null);

  const countryOptions = useMemo(
    () =>
      Array.from(
        new Map(destinations.map((d) => [d.countryCode, d.countryName])),
      ).sort((a, b) => a[1].localeCompare(b[1], "ko")),
    [],
  );

  const regionOptions = useMemo(
    () =>
      Array.from(
        new Set(
          destinations
            .filter((d) => !countryCode || d.countryCode === countryCode)
            .map((d) => d.name),
        ),
      ),
    [countryCode],
  );

  const countryName =
    countryOptions.find(([code]) => code === countryCode)?.[1] ?? "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (checkIn < todayIsoDate()) {
      setDateError("체크인은 오늘 이후여야 합니다.");
      return;
    }
    if (checkOut <= checkIn) {
      setDateError("체크아웃은 체크인보다 늦어야 합니다.");
      return;
    }
    setDateError(null);
    setStep("summary");
  }

  const outboundLinkAttrs = outboundUrl
    ? getExternalLinkAttrs(outboundUrl)
    : null;

  if (step === "summary") {
    return (
      <div className="flex flex-col gap-6 tablet:grid tablet:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] tablet:gap-8">
        <div className="flex flex-col gap-4 rounded-[16px] border border-[#E3E2DE] bg-white p-6">
          <p className="text-[15px] font-semibold text-[#2A2A2E]">입력 요약</p>
          <dl className="flex flex-col gap-2 text-[14px] leading-[1.6] text-[#54545A]">
            <div className="flex justify-between gap-4">
              <dt>국가</dt>
              <dd>{countryName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>지역</dt>
              <dd>{regionCode || "전체"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>체크인</dt>
              <dd>{checkIn}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>체크아웃</dt>
              <dd>{checkOut}</dd>
            </div>
          </dl>

          <p className="text-[13px] text-[#6B6B72]">{NO_TRANSMIT_NOTICE}</p>

          {outboundLinkAttrs ? (
            <a
              {...outboundLinkAttrs}
              className="inline-flex h-11 w-fit items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[15px] font-semibold text-white hover:bg-[#D94F2B]"
            >
              숙소 보러 가기
            </a>
          ) : (
            <div className="flex flex-col gap-2">
              <p role="alert" className="text-[14px] text-[#C1392B]">
                외부 이동 주소가 아직 설정되지 않았습니다.
              </p>
              <button
                type="button"
                onClick={() => router.refresh()}
                className="inline-flex h-11 w-fit items-center justify-center rounded-[8px] border border-[#2A2A2E] px-6 text-[15px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
              >
                다시 시도
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setStep("form")}
            className="w-fit text-[14px] font-semibold text-[#54545A] underline"
          >
            수정
          </button>
        </div>

        <aside className="flex flex-col gap-3 rounded-[16px] bg-[#F7F6F4] p-6">
          <p className="text-[15px] font-semibold text-[#2A2A2E]">검색 Tip</p>
          <ul className="flex flex-col gap-2 text-[14px] leading-[1.6] text-[#54545A]">
            {SEARCH_TIPS.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </aside>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 tablet:grid tablet:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] tablet:gap-8"
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
          <FormField label="국가" required>
            {(fieldProps) => (
              <select
                {...fieldProps}
                required
                value={countryCode}
                onChange={(event) => {
                  setCountryCode(event.target.value);
                  setRegionCode("");
                }}
                className={formFieldInputClassName}
              >
                <option value="">국가 선택</option>
                {countryOptions.map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </FormField>

          <FormField label="지역">
            {(fieldProps) => (
              <select
                {...fieldProps}
                value={regionCode}
                onChange={(event) => setRegionCode(event.target.value)}
                className={formFieldInputClassName}
              >
                <option value="">지역 선택(선택)</option>
                {regionOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
          <FormField label="체크인" required error={dateError ?? undefined}>
            {(fieldProps) => (
              <input
                {...fieldProps}
                type="date"
                required
                min={todayIsoDate()}
                value={checkIn}
                onChange={(event) => setCheckIn(event.target.value)}
                className={formFieldInputClassName}
              />
            )}
          </FormField>

          <FormField label="체크아웃" required>
            {(fieldProps) => (
              <input
                {...fieldProps}
                type="date"
                required
                min={checkIn || todayIsoDate()}
                value={checkOut}
                onChange={(event) => setCheckOut(event.target.value)}
                className={formFieldInputClassName}
              />
            )}
          </FormField>
        </div>

        <p className="text-[13px] text-[#6B6B72]">{NO_TRANSMIT_NOTICE}</p>

        <button
          type="submit"
          className="inline-flex h-11 w-fit items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[15px] font-semibold text-white hover:bg-[#D94F2B]"
        >
          요약 보기
        </button>
      </div>

      <aside className="flex flex-col gap-3 rounded-[16px] bg-[#F7F6F4] p-6">
        <p className="text-[15px] font-semibold text-[#2A2A2E]">검색 Tip</p>
        <ul className="flex flex-col gap-2 text-[14px] leading-[1.6] text-[#54545A]">
          {SEARCH_TIPS.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </aside>
    </form>
  );
}
