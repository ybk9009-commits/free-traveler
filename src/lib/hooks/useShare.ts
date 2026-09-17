"use client";

import { useCallback, useState } from "react";

interface ShareData {
  title: string;
  text?: string;
  url: string;
}

type ShareStatus = "idle" | "shared" | "copied" | "error";

/**
 * REQ-FUNC-069 — Web Share API를 우선 사용하고, 미지원 브라우저(또는 사용자가
 * 공유를 취소하지 않은 실패 상황)에서는 클립보드 복사로 폴백한다.
 */
export function useShare() {
  const [status, setStatus] = useState<ShareStatus>("idle");

  const share = useCallback(async (data: ShareData) => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share(data);
        setStatus("shared");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setStatus("idle");
          return;
        }
        // Web Share가 지원되지만 실패한 경우 클립보드 복사로 폴백한다.
      }
    }

    try {
      await navigator.clipboard.writeText(data.url);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }, []);

  return { share, status };
}
