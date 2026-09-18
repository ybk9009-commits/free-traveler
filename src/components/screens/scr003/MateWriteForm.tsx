"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { destinations } from "@/data/destinations";
import {
  FormField,
  formFieldInputClassName,
} from "@/components/common/FormField";
import { useToast } from "@/lib/hooks/useToast";

type AuthState = "loading" | "unauthenticated" | "ready";

const TRAVEL_STYLE_OPTIONS = [
  "자연",
  "도심",
  "휴양",
  "미식",
  "액티비티",
  "역사문화",
];

const COUNTRY_OPTIONS = Array.from(
  new Map(destinations.map((d) => [d.countryCode, d.countryName])).entries(),
).sort((a, b) => a[1].localeCompare(b[1], "ko"));

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * CMP-SCR-003-mate-write-form — 동행 모집글 작성 / 로그인 안내(SCR-003 §7).
 * 비로그인·성인확인 미완료는 안내 카드로 대체하고(REQ-FUNC-027, 028), 인증된
 * 사용자에게만 Form을 노출한다. 여기서의 인증 확인은 UX 게이트일 뿐이며,
 * 실제 강제는 `API-MATE-POSTS`(POST `/api/mates`)가 서버에서 재검증한다
 * (Security AC — 클라이언트 상태만으로 게이트하지 않음).
 */
export function MateWriteForm() {
  const router = useRouter();
  const { showSuccess } = useToast();

  const [authState, setAuthState] = useState<AuthState>("loading");
  const [countryCode, setCountryCode] = useState("");
  const [regionCode, setRegionCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [preferencesNote, setPreferencesNote] = useState("");
  const [travelStyles, setTravelStyles] = useState<string[]>([]);
  const [safetyAgreement, setSafetyAgreement] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function checkAuth() {
      const supabase = createSupabaseBrowserClient();
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (!active) return;
      if (userError || !userData.user || !userData.user.email_confirmed_at) {
        setAuthState("unauthenticated");
        return;
      }

      const { data: profile } = await supabase
        .from("user_profile")
        .select("is_adult")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (!active) return;
      const isAdult = (profile as { is_adult?: boolean } | null)?.is_adult;
      setAuthState(isAdult ? "ready" : "unauthenticated");
    }
    void checkAuth();
    return () => {
      active = false;
    };
  }, []);

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

  function toggleTravelStyle(style: string) {
    setTravelStyles((current) =>
      current.includes(style)
        ? current.filter((item) => item !== style)
        : current.length < 5
          ? [...current, style]
          : current,
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/mates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          countryCode,
          regionCode,
          startDate,
          endDate,
          capacity,
          travelStyles,
          preferences: { note: preferencesNote },
          safetyAgreement,
        }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        const issues = Array.isArray(body?.issues)
          ? body.issues
              .map((issue: { message: string }) => issue.message)
              .join(" ")
          : null;
        setErrorMessage(issues || body?.error || "제출에 실패했습니다.");
        return;
      }

      showSuccess("동행 모집글을 등록했습니다.");
      router.push("/mates");
    } finally {
      setSubmitting(false);
    }
  }

  if (authState === "loading") {
    return null;
  }

  if (authState === "unauthenticated") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-[16px] border border-[#E3E2DE] bg-[#F7F6F4] p-8">
        <p className="text-[16px] leading-[1.6] text-[#54545A]">
          동행 모집글을 작성하려면 로그인과 성인(만 19세 이상) 확인이
          필요합니다.
        </p>
        <Link
          href="/account"
          className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[15px] font-semibold text-white hover:bg-[#D94F2B]"
        >
          로그인/가입하기
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-8 tablet:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
    >
      <div className="flex flex-col gap-5">
        <FormField label="제목" required>
          {(fieldProps) => (
            <input
              {...fieldProps}
              type="text"
              required
              maxLength={100}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={formFieldInputClassName}
            />
          )}
        </FormField>

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
                {COUNTRY_OPTIONS.map(([code, name]) => (
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
          <FormField label="시작일" required>
            {(fieldProps) => (
              <input
                {...fieldProps}
                type="date"
                required
                min={todayIsoDate()}
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className={formFieldInputClassName}
              />
            )}
          </FormField>

          <FormField label="종료일" required>
            {(fieldProps) => (
              <input
                {...fieldProps}
                type="date"
                required
                min={startDate || todayIsoDate()}
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className={formFieldInputClassName}
              />
            )}
          </FormField>
        </div>

        <FormField label="모집 인원" required helpText="1~20명">
          {(fieldProps) => (
            <input
              {...fieldProps}
              type="number"
              required
              min={1}
              max={20}
              value={capacity}
              onChange={(event) => setCapacity(Number(event.target.value))}
              className={formFieldInputClassName}
            />
          )}
        </FormField>

        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-medium text-[#2A2A2E]">
            여행 스타일(최대 5개)
          </p>
          <div className="flex flex-wrap gap-2">
            {TRAVEL_STYLE_OPTIONS.map((style) => {
              const selected = travelStyles.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleTravelStyle(style)}
                  className={`h-10 rounded-full px-4 text-[14px] font-medium ${
                    selected
                      ? "bg-[#FEEBE3] text-[#F4623A]"
                      : "border border-[#E3E2DE] bg-white text-[#54545A]"
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        <FormField
          label="선호 조건"
          required
          helpText="함께할 동행에게 바라는 조건을 적어 주세요."
        >
          {(fieldProps) => (
            <textarea
              {...fieldProps}
              required
              rows={2}
              maxLength={500}
              value={preferencesNote}
              onChange={(event) => setPreferencesNote(event.target.value)}
              className={`${formFieldInputClassName} h-auto py-3`}
            />
          )}
        </FormField>

        <FormField label="설명" required helpText="최대 2000자">
          {(fieldProps) => (
            <textarea
              {...fieldProps}
              required
              rows={6}
              maxLength={2000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={`${formFieldInputClassName} h-auto py-3`}
            />
          )}
        </FormField>

        {errorMessage && (
          <p role="alert" className="text-[14px] leading-[1.6] text-[#C1392B]">
            {errorMessage}
          </p>
        )}

        <label className="flex items-start gap-2 text-[14px] leading-[1.6] text-[#54545A]">
          <input
            type="checkbox"
            required
            checked={safetyAgreement}
            onChange={(event) => setSafetyAgreement(event.target.checked)}
            className="mt-1 h-4 w-4"
          />
          이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책에 동의합니다.
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 w-fit items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[15px] font-semibold text-white hover:bg-[#D94F2B] disabled:opacity-60"
        >
          {submitting ? "등록 중..." : "동행 모집글 등록"}
        </button>
      </div>

      <aside className="flex flex-col gap-3 rounded-[16px] bg-[#F7F6F4] p-6">
        <p className="text-[15px] font-semibold text-[#2A2A2E]">
          안전한 동행을 위한 안내
        </p>
        <ul className="flex flex-col gap-2 text-[14px] leading-[1.6] text-[#54545A]">
          <li>
            전화번호·이메일·메신저 ID 등 개인 연락처는 본문에 적지 마세요.
          </li>
          <li>연락처 교환은 참가 신청의 비공개 메시지로만 진행해 주세요.</li>
          <li>첫 만남은 공개된 장소에서 가지는 것을 권장합니다.</li>
        </ul>
      </aside>
    </form>
  );
}
