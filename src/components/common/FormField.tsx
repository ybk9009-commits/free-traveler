import { useId, type ReactNode } from "react";

type FormFieldRenderProps = {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": boolean | undefined;
};

interface FormFieldProps {
  label: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  children: (fieldProps: FormFieldRenderProps) => ReactNode;
}

/**
 * D-001 § Form Input 토큰(52px 높이, 8px radius, hairline 테두리, 2px focus-ring,
 * 오류 시 danger 테두리)을 그대로 사용하는 공용 입력 클래스.
 */
export const formFieldInputClassName =
  "h-[52px] w-full rounded-[8px] border border-[#E3E2DE] bg-white px-4 text-[16px] leading-[1.65] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] aria-invalid:border-[#C1392B]";

export function FormField({
  label,
  required = false,
  helpText,
  error,
  children,
}: FormFieldProps) {
  const id = useId();
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[13px] font-medium leading-[1.4] text-[#2A2A2E]"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-[#C1392B]">
            {" "}
            *
          </span>
        )}
      </label>

      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}

      {helpText && (
        <p id={helpId} className="text-[14px] leading-[1.6] text-[#83838A]">
          {helpText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-[14px] leading-[1.6] text-[#C1392B]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
