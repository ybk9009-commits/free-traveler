import Link from "next/link";
import { getExternalLinkAttrs } from "@/lib/links/external-link";

const MOFA_SAFETY_URL = "https://www.0404.go.kr";
// TODO: 실제 문의 채널(이메일/폼)이 정해지면 교체한다.
const CONTACT_MAILTO = "mailto:hello@freetraveler.app";

/**
 * CMP-COMMON-HEADER-FOOTER — 전역 Footer. D-001 § Header·Footer, REQ-FUNC-064.
 * 정책 링크(이용약관/개인정보처리방침/동행 안전수칙/콘텐츠 면책)는 REQ-FUNC-080에
 * 따라 별도 화면이 아니라 `/travel-tools` 안에 고지·동의 형태로 구현되므로,
 * 고정 5개 화면 범위를 벗어난 새 Route를 만들지 않고 그 페이지로 연결한다.
 */
export function Footer() {
  const mofaLinkAttrs = getExternalLinkAttrs(MOFA_SAFETY_URL);

  return (
    <footer className="border-t border-[#E3E2DE] bg-[#F7F6F4]">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-8 px-4 py-12 tablet:grid-cols-3 tablet:px-8">
        <div className="flex flex-col gap-3">
          <p className="text-[15px] font-semibold text-[#2A2A2E]">
            Free Traveler
          </p>
          <p className="text-[14px] leading-[1.6] text-[#54545A]">
            여행지 추천부터 동행 매칭까지, 여행 준비의 모든 단계를 함께합니다.
          </p>
          <nav aria-label="서비스 소개 링크" className="flex flex-col gap-2">
            <Link
              href="/travel-tools"
              className="text-[14px] text-[#54545A] hover:text-[#2A2A2E]"
            >
              여행 준비
            </Link>
            <Link
              href="/mates"
              className="text-[14px] text-[#54545A] hover:text-[#2A2A2E]"
            >
              동행 찾기
            </Link>
            <Link
              href="/about"
              className="text-[14px] text-[#54545A] hover:text-[#2A2A2E]"
            >
              대표 소개
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[15px] font-semibold text-[#2A2A2E]">정책</p>
          <nav aria-label="정책 링크" className="flex flex-col gap-2">
            <Link
              href="/travel-tools"
              className="text-[14px] text-[#54545A] hover:text-[#2A2A2E]"
            >
              이용약관
            </Link>
            <Link
              href="/travel-tools"
              className="text-[14px] text-[#54545A] hover:text-[#2A2A2E]"
            >
              개인정보 처리방침
            </Link>
            <Link
              href="/travel-tools"
              className="text-[14px] text-[#54545A] hover:text-[#2A2A2E]"
            >
              동행 안전수칙
            </Link>
            <Link
              href="/travel-tools"
              className="text-[14px] text-[#54545A] hover:text-[#2A2A2E]"
            >
              콘텐츠 면책
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[15px] font-semibold text-[#2A2A2E]">
            안전 정보 출처
          </p>
          {mofaLinkAttrs && (
            <a
              {...mofaLinkAttrs}
              className="text-[14px] text-[#54545A] hover:text-[#2A2A2E]"
            >
              외교부 해외안전여행
            </a>
          )}
          <p className="text-[13px] leading-[1.4] text-[#83838A]">
            정보는 참고용이며 출국 전 공식 출처 재확인이 필요합니다.
          </p>
        </div>
      </div>

      <div className="border-t border-[#E3E2DE]">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-2 px-4 py-6 text-[13px] text-[#83838A] tablet:flex-row tablet:px-8">
          <p>© Free Traveler</p>
          <a href={CONTACT_MAILTO} className="hover:text-[#2A2A2E]">
            문의하기
          </a>
        </div>
      </div>
    </footer>
  );
}
