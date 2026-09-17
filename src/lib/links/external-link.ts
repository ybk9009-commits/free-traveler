const EXTERNAL_LINK_REL = "noopener noreferrer";

/** 허용목록은 "HTTPS 프로토콜만" 하나의 규칙이다(javascript:/http: 등은 모두 차단). */
export function isHttpsUrl(url: string): boolean {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

export interface OpenExternalResult {
  ok: boolean;
  error?: string;
}

/**
 * REQ-FUNC-016/024/049 — 항공/호텔 외부 이동, 외교부 안전정보 원문 링크, 대표
 * 소개 SNS 링크가 공통으로 사용하는 외부 이동 유틸. `target="_blank"` +
 * `rel="noopener noreferrer"`를 강제하며, 목적지·날짜 쿼리 파라미터를 URL에
 * 추가하지 않는다(CON-02, 입력받은 url 문자열을 그대로만 사용).
 * HTTPS가 아닌 URL이나 `javascript:` 등의 스킴은 열지 않고 오류를 반환한다.
 */
export function openExternal(url: string): OpenExternalResult {
  if (!isHttpsUrl(url)) {
    return { ok: false, error: "HTTPS 링크만 열 수 있습니다." };
  }

  if (typeof window === "undefined") {
    return {
      ok: false,
      error: "브라우저 환경에서만 외부 링크를 열 수 있습니다.",
    };
  }

  window.open(url, "_blank", "noopener,noreferrer");
  return { ok: true };
}

export interface ExternalLinkAttrs {
  href: string;
  target: "_blank";
  rel: string;
}

/**
 * `<a>` 태그로 직접 렌더링할 때 쓰는 속성 빌더. HTTPS 검증을 통과하지 못하면
 * `null`을 반환해 호출부가 렌더링을 막을 수 있게 한다.
 */
export function getExternalLinkAttrs(url: string): ExternalLinkAttrs | null {
  if (!isHttpsUrl(url)) return null;
  return { href: url, target: "_blank", rel: EXTERNAL_LINK_REL };
}
