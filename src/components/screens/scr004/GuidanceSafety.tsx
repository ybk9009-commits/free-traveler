import Link from "next/link";

const STEPS = [
  {
    title: "1. 모집글 확인",
    description: "관심 있는 동행 모집글의 조건과 소개를 확인합니다.",
  },
  {
    title: "2. 비공개 메시지로 참가 요청",
    description: "참가 신청 메시지는 작성자 본인에게만 공개됩니다.",
  },
  {
    title: "3. 작성자 승인 후 대화 시작",
    description: "작성자가 신청을 승인하면 함께 준비를 시작합니다.",
  },
] as const;

const SAFETY_RULES = [
  "전화번호·이메일·메신저 ID 등 개인 연락처는 모집글 본문이나 공개 댓글에 남기지 마세요.",
  "첫 만남은 공개된 장소에서 가지는 것을 권장합니다.",
  "불편한 요청이나 부적절한 행동은 즉시 신고·차단해 주세요.",
];

/**
 * CMP-SCR-004-guidance-safety — 신청 방법 3단계 + 안전 안내 CTA(SCR-004).
 */
export function GuidanceSafety() {
  return (
    <section
      aria-labelledby="mate-guidance-heading"
      className="mx-auto w-full max-w-[1280px] px-4 py-16 tablet:px-8"
    >
      <h2
        id="mate-guidance-heading"
        className="text-[20px] font-semibold text-[#2A2A2E]"
      >
        참가 신청 방법
      </h2>

      <ol className="mt-6 grid grid-cols-1 gap-4 tablet:grid-cols-3">
        {STEPS.map((step) => (
          <li
            key={step.title}
            className="rounded-[16px] border border-[#E3E2DE] bg-white p-5"
          >
            <p className="text-[15px] font-semibold text-[#2A2A2E]">
              {step.title}
            </p>
            <p className="mt-2 text-[14px] leading-[1.6] text-[#54545A]">
              {step.description}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col gap-4 rounded-[16px] bg-[#F7F6F4] p-8 tablet:flex-row tablet:items-center tablet:justify-between">
        <div>
          <p className="text-[15px] font-semibold text-[#2A2A2E]">
            동행 안전수칙
          </p>
          <ul className="mt-2 flex flex-col gap-1 text-[14px] leading-[1.6] text-[#54545A]">
            {SAFETY_RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
        <Link
          href="/travel-tools"
          className="inline-flex h-11 w-fit shrink-0 items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[15px] font-semibold text-white hover:bg-[#D94F2B]"
        >
          항공·숙소도 함께 준비하기
        </Link>
      </div>
    </section>
  );
}
