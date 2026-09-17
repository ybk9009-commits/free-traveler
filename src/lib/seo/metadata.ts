import type { Metadata } from "next";

const SITE_NAME = "Free Traveler";
const DEFAULT_SITE_URL = "http://localhost:3000";

// 실제 배포 도메인은 NEXT_PUBLIC_SITE_URL로 주입한다(배포 Task에서 설정, 이 Task의 Expected Files 밖).
function resolveSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(
    /\/$/,
    "",
  );
}

export interface PageMetadataInput {
  title: string;
  description: string;
  /** 예: "/", "/about" */
  path: string;
  ogImage?: {
    url: string;
    alt: string;
  };
}

/**
 * REQ-FUNC-070/REQ-NF-030 — 5개 공개 페이지 각각에 title/description/canonical/
 * Open Graph를 일관되게 제공하는 공용 빌더.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  ogImage,
}: PageMetadataInput): Metadata {
  const siteUrl = resolveSiteUrl();
  const canonicalUrl = new URL(path, siteUrl).toString();
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      images: ogImage ? [{ url: ogImage.url, alt: ogImage.alt }] : undefined,
    },
  };
}

export interface WebPageStructuredDataInput {
  name: string;
  description: string;
  path: string;
}

/**
 * REQ-FUNC-070 — 공개 페이지의 최소 구조화 데이터(schema.org WebPage).
 * 각 page.tsx에서 `<script type="application/ld+json">`으로 직렬화해 삽입한다.
 */
export function buildWebPageStructuredData({
  name,
  description,
  path,
}: WebPageStructuredDataInput): Record<string, unknown> {
  const siteUrl = resolveSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: new URL(path, siteUrl).toString(),
  };
}
