import Link from "next/link";
import { destinations } from "@/data/destinations";

const FAVORITE_DESTINATION_IDS = [
  "kr-jeju",
  "jp-tokyo",
  "fr-paris",
  "us-newyork",
];

/**
 * REQ-FUNC-062 — `docs/PROJECT_SCOPE.md` 130행(정본): 문의·SNS 링크는
 * "정적 설정값 기반 링크"다(Supabase `app_settings`는 항공/숙소 외부 URL
 * 허용목록 전용이라 이 용도로 쓰지 않는다, CLAUDE.md 규칙 13). 현재 실제 SNS
 * 계정 URL이 정해지지 않아 빈 링크는 렌더링하지 않고, `CMP-COMMON-HEADER-FOOTER`
 * (Footer)와 동일한 문의 메일만 노출한다.
 */
const CONTACT_MAILTO = "mailto:hello@freetraveler.app";

/**
 * CMP-SCR-002-favorite-destinations-cta — 기억에 남는 여행지 4개 + CTA
 * Banner(SCR-002 §7). 각 카드는 SCR-001 상세 Drawer로 딥링크한다(`?destination=`
 * 쿼리, REQ-FUNC-063).
 */
export function FavoriteDestinationsCta() {
  const favorites = FAVORITE_DESTINATION_IDS.map((id) =>
    destinations.find((destination) => destination.id === id),
  ).filter((destination): destination is NonNullable<typeof destination> =>
    Boolean(destination),
  );

  return (
    <section
      aria-labelledby="favorite-destinations-heading"
      className="mx-auto w-full max-w-[1280px] px-4 py-16 tablet:px-8"
    >
      <h2
        id="favorite-destinations-heading"
        className="text-[20px] font-semibold text-[#2A2A2E]"
      >
        기억에 남는 여행지
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-6 tablet:grid-cols-2">
        {favorites.map((destination) => (
          <Link
            key={destination.id}
            href={`/?destination=${destination.id}`}
            className="group overflow-hidden rounded-[16px] border border-[#E3E2DE] bg-white transition-shadow hover:shadow-[0_1px_2px_rgba(0,0,0,.04),0_4px_12px_rgba(0,0,0,.08)]"
          >
            <div className="aspect-[4/3] overflow-hidden bg-[#F7F6F4]">
              {/* eslint-disable-next-line @next/next/no-img-element -- next.config.ts에 원격 이미지 도메인이 설정되어 있지 않아(이 Task 범위 밖) next/image 대신 img를 사용한다. */}
              <img
                src={destination.image.url}
                alt={destination.image.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-[18px] font-semibold text-[#2A2A2E]">
                {destination.name}
              </p>
              <p className="text-[14px] text-[#54545A]">
                {destination.countryName}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-4 rounded-[16px] bg-[#F7F6F4] p-8 tablet:flex-row tablet:items-center tablet:justify-between">
        <p className="text-[18px] font-semibold text-[#2A2A2E]">
          다음 여행을 함께 준비해 보세요
        </p>
        <div className="flex flex-col gap-3 tablet:flex-row">
          <Link
            href="/travel-tools"
            className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[15px] font-semibold text-white hover:bg-[#D94F2B]"
          >
            항공·숙소 준비하기
          </Link>
          <Link
            href="/mates"
            className="inline-flex h-11 items-center justify-center rounded-[8px] border border-[#2A2A2E] px-6 text-[15px] font-semibold text-[#2A2A2E] hover:bg-white"
          >
            동행과 함께 떠나기
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <a
          href={CONTACT_MAILTO}
          className="text-[14px] font-semibold text-[#F4623A] hover:text-[#D94F2B]"
        >
          문의하기
        </a>
      </div>
    </section>
  );
}
