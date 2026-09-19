"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  signInWithEmail,
  signUpWithEmail,
  requestPasswordReset,
} from "@/lib/auth/session";
import { useToast } from "@/lib/hooks/useToast";

type AuthCheckState = "loading" | "guest" | "authenticated";
type SubTab = "login" | "signup" | "reset";

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: "login", label: "로그인" },
  { id: "signup", label: "회원가입" },
  { id: "reset", label: "비밀번호 재설정" },
];

const MEMBER_BENEFITS = [
  "동행 모집글 작성과 참가 요청",
  "여행지 즐겨찾기 저장",
  "내 활동에서 신청·차단 내역 확인",
];

/**
 * CMP-SCR-005-auth — Guest 인증 Card(SCR-005). Guest(비로그인) 상태에서만
 * 렌더링하며(로그인 상태면 `null`), 로그인/회원가입/비밀번호 재설정 서브탭 +
 * 이메일+비밀번호 Form을 제공한다(REQ-FUNC-066).
 */
export function AuthCard() {
  const { showSuccess } = useToast();
  const [authState, setAuthState] = useState<AuthCheckState>("loading");
  const [subTab, setSubTab] = useState<SubTab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      if (active) setAuthState(data.user ? "authenticated" : "guest");
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (active) setAuthState(session ? "authenticated" : "guest");
      },
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  function switchTab(tab: SubTab) {
    setSubTab(tab);
    setErrorMessage(null);
    setInfoMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      if (subTab === "login") {
        const result = await signInWithEmail(email, password);
        if (!result.ok) {
          setErrorMessage("이메일 또는 비밀번호를 확인해 주세요.");
          return;
        }
        showSuccess("로그인되었습니다.");
        window.location.reload();
        return;
      }

      if (subTab === "signup") {
        const result = await signUpWithEmail(email, password);
        if (!result.ok) {
          setErrorMessage("가입에 실패했습니다. 잠시 후 다시 시도해 주세요.");
          return;
        }
        setInfoMessage(
          "가입 확인 이메일을 보냈습니다. 메일함을 확인해 주세요.",
        );
        return;
      }

      const result = await requestPasswordReset(email);
      if (!result.ok) {
        setErrorMessage("요청에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      setInfoMessage("비밀번호 재설정 메일을 보냈습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authState !== "guest") return null;

  return (
    <div className="grid grid-cols-1 gap-8 tablet:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div role="tablist" className="flex gap-6 border-b border-[#E3E2DE]">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={subTab === tab.id}
              onClick={() => switchTab(tab.id)}
              className={`h-11 border-b-2 px-1 text-[15px] font-semibold outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
                subTab === tab.id
                  ? "border-[#F4623A] text-[#2A2A2E]"
                  : "border-transparent text-[#6B6B72]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-[#2A2A2E]">
              이메일
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-[52px] rounded-[8px] border border-[#E3E2DE] bg-white px-4 text-[16px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            />
          </label>

          {subTab !== "reset" && (
            <label className="flex flex-col gap-1">
              <span className="text-[13px] font-medium text-[#2A2A2E]">
                비밀번호
              </span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-[52px] rounded-[8px] border border-[#E3E2DE] bg-white px-4 text-[16px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
              />
            </label>
          )}

          {errorMessage && (
            <p role="alert" className="text-[14px] text-[#C1392B]">
              {errorMessage}
            </p>
          )}
          {infoMessage && (
            <p className="text-[14px] text-[#1F7A52]">{infoMessage}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 w-fit items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[15px] font-semibold text-white hover:bg-[#D94F2B] disabled:opacity-60"
          >
            {submitting
              ? "처리 중..."
              : subTab === "login"
                ? "로그인"
                : subTab === "signup"
                  ? "회원가입"
                  : "재설정 메일 보내기"}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-4 rounded-[16px] bg-[#F7F6F4] p-6">
        <div>
          <p className="text-[15px] font-semibold text-[#2A2A2E]">
            로그인하면 이런 것을 할 수 있어요
          </p>
          <ul className="mt-2 flex flex-col gap-1 text-[14px] leading-[1.6] text-[#54545A]">
            {MEMBER_BENEFITS.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>
        <p className="text-[13px] leading-[1.6] text-[#6B6B72]">
          비밀번호는 암호화되어 저장됩니다. Free Traveler는 회원의 신원을 별도로
          보증하지 않으니, 동행 만남 시 안전 수칙을 꼭 지켜 주세요.
        </p>
      </div>
    </div>
  );
}
