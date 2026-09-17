import type { ReactNode } from "react";

interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface EmptyStateProps {
  /** 상황 설명 한 문장 — 왜 비어 있는지(자리표시 문구 금지, 항상 실제 문구를 전달해야 한다) */
  title: string;
  /** 이용 방법 또는 조건 안내 */
  description: string;
  /** 다음 행동 CTA. href가 있으면 링크로, 없으면 버튼으로 렌더한다 */
  action: EmptyStateAction;
  /** 장식용 아이콘/일러스트(선택). 텍스트 없이 아이콘만 두는 사용은 이 컴포넌트 구조상 불가능하다 */
  icon?: ReactNode;
}

const ctaClassName =
  "inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[16px] font-semibold leading-[1.2] text-white outline-none hover:bg-[#D94F2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]";

/**
 * D-001 § Empty State 블록 — 상황 설명·이용 방법 안내·CTA 3요소를 항상 강제한다.
 * `title`/`description`/`action.label`은 기본값을 두지 않아 호출부가 반드시
 * 실제 문구를 전달해야 한다("준비 중" 등 자리표시 문구를 방지).
 */
export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      {icon && <div aria-hidden="true">{icon}</div>}
      <p className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">
        {title}
      </p>
      <p className="max-w-[420px] text-[14px] leading-[1.6] text-[#83838A]">
        {description}
      </p>
      {action.href ? (
        <a href={action.href} className={ctaClassName}>
          {action.label}
        </a>
      ) : (
        <button type="button" onClick={action.onClick} className={ctaClassName}>
          {action.label}
        </button>
      )}
    </div>
  );
}
