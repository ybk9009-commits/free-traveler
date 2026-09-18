import { representativeProfile } from "@/data/representative-profile";
import { destinations } from "@/data/destinations";

/**
 * CMP-SCR-002-countries-gallery — 방문 국가 30개 + 사진 Gallery 8개(SCR-002 §5~6).
 * `DATA-REPRESENTATIVE`(이미 완료된 선행 Task, `src/data/representative-profile.ts`)
 * 에는 갤러리 이미지 배열이 없어(대표 사진 1장만 보유), Gallery는 대표가 방문한
 * 국가(`visitedCountries`)와 겹치는 `DATA-DESTINATIONS`의 실제 여행지 사진(alt
 * 포함)을 재사용해 구성한다(데이터 조작 없이 두 정적 데이터 소스를 교차 참조).
 */
export function CountriesGallery() {
  const visitedCountryNames = new Set(
    representativeProfile.visitedCountries.flatMap((group) => group.countries),
  );

  const galleryPhotos = destinations
    .filter((destination) => visitedCountryNames.has(destination.countryName))
    .map((destination) => destination.image)
    .slice(0, 12);

  return (
    <section
      aria-labelledby="countries-gallery-heading"
      className="mx-auto w-full max-w-[1280px] px-4 py-16 tablet:px-8"
    >
      <h2
        id="countries-gallery-heading"
        className="text-[20px] font-semibold text-[#2A2A2E]"
      >
        방문 국가
      </h2>

      <div className="mt-6 flex flex-col gap-6">
        {representativeProfile.visitedCountries.map((group) => (
          <div key={group.region} className="flex flex-col gap-2">
            <p className="text-[14px] font-semibold text-[#54545A]">
              {group.region} · {group.countries.length}개국
            </p>
            <div className="flex flex-wrap gap-2">
              {group.countries.map((country) => (
                <span
                  key={country}
                  className="rounded-full border border-[#E3E2DE] bg-white px-3 py-1 text-[13px] font-medium text-[#2A2A2E]"
                >
                  {country}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 className="mt-10 text-[20px] font-semibold text-[#2A2A2E]">
        여행 사진 Gallery
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
        {galleryPhotos.map((photo) => (
          <div
            key={photo.url}
            className="aspect-square overflow-hidden rounded-[16px] bg-[#F7F6F4]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- next.config.ts에 원격 이미지 도메인이 설정되어 있지 않아(이 Task 범위 밖) next/image 대신 img를 사용한다. */}
            <img
              src={photo.url}
              alt={photo.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
