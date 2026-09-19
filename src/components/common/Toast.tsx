"use client";

import { useToast } from "@/lib/hooks/useToast";

/**
 * D-001 § Alert·Toast — 우하단(Desktop)/상단(Mobile) 고정, `{rounded.md}`,
 * 3~5초 자동 소멸(useToast에서 처리) + 수동 닫기 버튼.
 */
export function Toast() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      role="status"
      className="fixed inset-x-4 top-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:top-auto sm:right-4 sm:bottom-4 sm:left-auto"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start gap-2 rounded-[12px] border border-[#E3E2DE] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
        >
          <span
            aria-hidden="true"
            className={`mt-0.5 font-semibold ${
              toast.variant === "success" ? "text-[#1F7A52]" : "text-[#C1392B]"
            }`}
          >
            {toast.variant === "success" ? "✓" : "!"}
          </span>
          <p className="flex-1 text-[14px] leading-[1.6] text-[#2A2A2E]">
            {toast.message}
          </p>
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            aria-label="알림 닫기"
            className="flex h-6 w-6 items-center justify-center text-[#6B6B72] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      ))}
    </div>
  );
}
