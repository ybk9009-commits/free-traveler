"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "free-traveler:favorites";
const listeners = new Set<() => void>();
const EMPTY_IDS: string[] = [];

let cachedRaw: string | null = null;
let cachedIds: string[] = EMPTY_IDS;

function parseFavoriteIds(raw: string | null): string[] {
  if (!raw) return EMPTY_IDS;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : EMPTY_IDS;
  } catch {
    return EMPTY_IDS;
  }
}

// localStorage read 결과를 캐시해 참조 동일성을 유지한다 — useSyncExternalStore의
// getSnapshot이 매 호출 새 배열을 반환하면 무한 재렌더링을 유발하기 때문이다.
function getSnapshot(): string[] {
  if (typeof window === "undefined") return cachedIds;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedIds;
  cachedRaw = raw;
  cachedIds = parseFavoriteIds(raw);
  return cachedIds;
}

function getServerSnapshot(): string[] {
  return EMPTY_IDS;
}

function writeFavoriteIds(ids: string[]): void {
  cachedRaw = JSON.stringify(ids);
  cachedIds = ids;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, cachedRaw);
    } catch {
      // 프라이빗 모드 등으로 localStorage 접근이 막힌 경우 조용히 무시한다.
    }
  }
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

/**
 * REQ-FUNC-068 — 즐겨찾기는 서버가 아닌 `localStorage`에만 저장하고,
 * 여행지 ID 기준 중복 추가를 방지한다.
 */
export function useFavorites() {
  const favoriteIds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isFavorite = useCallback(
    (destinationId: string) => favoriteIds.includes(destinationId),
    [favoriteIds],
  );

  const addFavorite = useCallback((destinationId: string) => {
    const current = getSnapshot();
    if (current.includes(destinationId)) return;
    writeFavoriteIds([...current, destinationId]);
  }, []);

  const removeFavorite = useCallback((destinationId: string) => {
    writeFavoriteIds(getSnapshot().filter((id) => id !== destinationId));
  }, []);

  const toggleFavorite = useCallback(
    (destinationId: string) => {
      if (getSnapshot().includes(destinationId)) {
        removeFavorite(destinationId);
      } else {
        addFavorite(destinationId);
      }
    },
    [addFavorite, removeFavorite],
  );

  return {
    favoriteIds,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
}
