"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/hooks/useToast";
import { Modal } from "@/components/common/Modal";

/**
 * CMP-SCR-004-block — 차단 버튼·확인(SCR-004). `CMP-SCR-004-detail`과 동일한
 * `?post=<id>` URL 쿼리로 대상 글의 작성자를 독립적으로 조회한다(선택된 글이
 * 없거나 본인 글이면 렌더링하지 않는다). `API-BLOCKS` 호출 후 결과를
 * `CMP-COMMON-TOAST`로 알린다(REQ-FUNC-040).
 */
export function BlockButton() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("post");
  const { showSuccess, showError } = useToast();

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [ownerPostId, setOwnerPostId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (!postId) return;
    let active = true;

    async function loadOwner() {
      const supabase = createSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      if (active) setCurrentUserId(userData.user?.id ?? null);

      const { data: post } = await supabase
        .from("mate_post")
        .select("owner_id")
        .eq("post_id", postId)
        .maybeSingle();

      if (active) {
        setOwnerId((post as { owner_id?: string } | null)?.owner_id ?? null);
        setOwnerPostId(postId);
      }
    }

    void loadOwner();
    return () => {
      active = false;
    };
  }, [postId]);

  async function handleConfirmBlock() {
    if (!ownerId) return;
    setBlocking(true);
    try {
      const response = await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedId: ownerId }),
      });
      const body = await response.json().catch(() => null);

      if (!response.ok) {
        showError(body?.error ?? "차단에 실패했습니다.");
        return;
      }

      setBlocked(true);
      showSuccess("작성자를 차단했습니다.");
    } finally {
      setBlocking(false);
      setIsConfirmOpen(false);
    }
  }

  if (
    !postId ||
    !ownerId ||
    ownerPostId !== postId ||
    ownerId === currentUserId ||
    blocked
  ) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        className="inline-flex h-11 w-fit items-center justify-center rounded-[8px] border border-[#C7C6C1] px-5 text-[14px] font-semibold text-[#2A2A2E] outline-none hover:bg-[#F7F6F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
      >
        작성자 차단
      </button>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="작성자를 차단할까요?"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsConfirmOpen(false)}
              className="h-11 rounded-[8px] border border-[#C7C6C1] px-5 text-[14px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirmBlock}
              disabled={blocking}
              className="h-11 rounded-[8px] bg-[#F4623A] px-5 text-[14px] font-semibold text-white hover:bg-[#D94F2B] disabled:opacity-60"
            >
              {blocking ? "차단 중..." : "차단하기"}
            </button>
          </div>
        }
      >
        <p className="text-[14px] leading-[1.6] text-[#54545A]">
          차단하면 이 작성자의 동행 모집글이 더 이상 목록에 보이지 않습니다. 이
          작업은 계정 설정에서 언제든 해제할 수 있습니다.
        </p>
      </Modal>
    </>
  );
}
