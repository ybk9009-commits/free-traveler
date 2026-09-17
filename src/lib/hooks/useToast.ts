"use client";

import { useCallback, useSyncExternalStore } from "react";

export type ToastVariant = "success" | "error";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
}

let toasts: ToastItem[] = [];
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getSnapshot(): ToastItem[] {
  return toasts;
}

function removeToast(id: string): void {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
}

function createToastId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function addToast(
  variant: ToastVariant,
  message: string,
  durationMs = 4000,
): string {
  const id = createToastId();
  toasts = [...toasts, { id, variant, message }];
  emit();
  if (durationMs > 0 && typeof window !== "undefined") {
    window.setTimeout(() => removeToast(id), durationMs);
  }
  return id;
}

/**
 * REQ-FUNC-043(축소) — 참가 요청 접수·승인·거절·신고 처리 결과 등은 인앱 Toast로만
 * 알린다(이메일 발송 없음). 3~5초 자동 소멸 + 수동 닫기를 지원한다.
 */
export function useToast() {
  const toastList = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const showSuccess = useCallback(
    (message: string) => addToast("success", message),
    [],
  );
  const showError = useCallback(
    (message: string) => addToast("error", message),
    [],
  );
  const dismiss = useCallback((id: string) => removeToast(id), []);

  return { toasts: toastList, showSuccess, showError, dismiss };
}
