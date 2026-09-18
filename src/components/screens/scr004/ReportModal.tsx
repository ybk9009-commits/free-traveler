"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/common/Modal";
import {
  FormField,
  formFieldInputClassName,
} from "@/components/common/FormField";

const REASON_OPTIONS = [
  { id: "SPAM", label: "스팸/광고" },
  { id: "INAPPROPRIATE_CONTENT", label: "부적절한 콘텐츠" },
  { id: "CONTACT_INFO_EXPOSURE", label: "개인 연락처 노출" },
  { id: "SCAM", label: "사기 의심" },
  { id: "HARASSMENT", label: "괴롭힘/혐오 발언" },
  { id: "OTHER", label: "기타" },
] as const;

export type ReportTargetType = "USER" | "MATE_POST" | "MATE_APPLICATION";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
}

/**
 * CMP-SCR-004-report — 신고 모달(SCR-004). 사유코드 Select + 설명 textarea로
 * `API-REPORTS`(POST `/api/reports`)에 제출하고 접수번호를 표시한다
 * (REQ-FUNC-039). 신고자 정보는 서버 세션에서 자동으로 채워지며 이 모달은
 * 별도로 전달하지 않는다.
 */
export function ReportModal({
  isOpen,
  onClose,
  targetType,
  targetId,
}: ReportModalProps) {
  const [reasonCode, setReasonCode] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  function reset() {
    setReasonCode("");
    setDescription("");
    setErrorMessage(null);
    setReportId(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, reasonCode, description }),
      });
      const body = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(body?.error ?? "신고 접수에 실패했습니다.");
        return;
      }

      setReportId(body.reportId);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="신고하기">
      {reportId ? (
        <div className="flex flex-col gap-3">
          <p className="text-[15px] font-semibold text-[#1F7A52]">
            신고가 접수되었습니다.
          </p>
          <p className="text-[14px] leading-[1.6] text-[#54545A]">
            접수번호: {reportId}
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-11 w-fit items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[15px] font-semibold text-white hover:bg-[#D94F2B]"
          >
            닫기
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="신고 사유" required>
            {(fieldProps) => (
              <select
                {...fieldProps}
                required
                value={reasonCode}
                onChange={(event) => setReasonCode(event.target.value)}
                className={formFieldInputClassName}
              >
                <option value="">사유 선택</option>
                {REASON_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </FormField>

          <FormField label="상세 설명" helpText="최대 2000자(선택)">
            {(fieldProps) => (
              <textarea
                {...fieldProps}
                rows={4}
                maxLength={2000}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className={`${formFieldInputClassName} h-auto py-3`}
              />
            )}
          </FormField>

          {errorMessage && (
            <p role="alert" className="text-[14px] text-[#C1392B]">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 w-fit items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[15px] font-semibold text-white hover:bg-[#D94F2B] disabled:opacity-60"
          >
            {submitting ? "접수 중..." : "신고 제출"}
          </button>
        </form>
      )}
    </Modal>
  );
}
