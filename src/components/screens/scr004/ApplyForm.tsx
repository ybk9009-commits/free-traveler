"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  FormField,
  formFieldInputClassName,
} from "@/components/common/FormField";

type AuthState = "loading" | "unauthenticated" | "ready";

/**
 * CMP-SCR-004-apply — 참가 메시지 신청 폼(SCR-004). `CMP-SCR-004-detail`과
 * 동일한 `?post=<id>` URL 쿼리로 대상 글을 식별하는 독립 컴포넌트다(선택된
 * 글이 없으면 아무것도 렌더링하지 않는다). 로그인·성인확인 여부는 UX 게이트
 * 일 뿐이며, 실제 강제는 `API-MATE-APPLICATIONS`가 서버에서 재검증한다.
 */
export function ApplyForm() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("post");

  const [authState, setAuthState] = useState<AuthState>("loading");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!postId) return;
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
  }, [postId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!postId) return;
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/mates/${postId}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const body = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(body?.error ?? "참가 신청에 실패했습니다.");
        return;
      }

      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (!postId) return null;

  if (authState === "loading") return null;

  if (authState === "unauthenticated") {
    return (
      <div className="mt-6 flex flex-col items-start gap-3 rounded-[16px] border border-[#E3E2DE] bg-[#F7F6F4] p-6">
        <p className="text-[14px] leading-[1.6] text-[#54545A]">
          참가 신청을 하려면 로그인과 성인(만 19세 이상) 확인이 필요합니다.
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

  if (submitted) {
    return (
      <div className="mt-6 rounded-[16px] border border-[#E3E2DE] bg-[#F7F6F4] p-6">
        <p className="text-[15px] font-semibold text-[#1F7A52]">
          참가 신청을 보냈습니다. 작성자가 승인하면 대화를 시작할 수 있어요.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex flex-col gap-3 rounded-[16px] border border-[#E3E2DE] bg-white p-6"
    >
      <p className="text-[15px] font-semibold text-[#2A2A2E]">참가 신청</p>
      <FormField
        label="신청 메시지"
        required
        helpText="최대 500자, 작성자와 본인만 볼 수 있어요."
      >
        {(fieldProps) => (
          <textarea
            {...fieldProps}
            required
            rows={3}
            maxLength={500}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className={`${formFieldInputClassName} h-auto py-3`}
          />
        )}
      </FormField>

      {errorMessage && (
        <p role="alert" className="text-[14px] text-[#C1392B]">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-11 w-fit items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[15px] font-semibold text-white hover:bg-[#D94F2B] disabled:opacity-60"
      >
        {submitting ? "신청 중..." : "참가 신청 보내기"}
      </button>
    </form>
  );
}
