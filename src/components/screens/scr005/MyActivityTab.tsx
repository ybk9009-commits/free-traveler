"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { EmptyState } from "@/components/common/EmptyState";
import { Modal } from "@/components/common/Modal";

type SubTab = "posts" | "received" | "sent" | "blocks";

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: "posts", label: "내가 쓴 동행 글" },
  { id: "received", label: "받은 참가 요청" },
  { id: "sent", label: "내가 보낸 참가 신청" },
  { id: "blocks", label: "차단 목록" },
];

interface MatePostRow {
  post_id: string;
  title: string;
  country_code: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface ReceivedApplicationRow {
  application_id: string;
  post_id: string;
  message: string;
  status: string;
  post_title: string;
}

interface SentApplicationRow {
  application_id: string;
  post_id: string;
  message: string;
  status: string;
  post_title: string;
}

interface BlockRow {
  blocked_id: string;
  blocked_nickname: string | null;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function countryNameFor(countryCode: string): string {
  return (
    destinations.find((d) => d.countryCode === countryCode)?.countryName ??
    countryCode
  );
}

function isEffectivelyOpen(post: MatePostRow): boolean {
  return post.status === "OPEN" && post.end_date >= todayIsoDate();
}

/**
 * CMP-SCR-005-my-activity — Member 내 활동 탭(SCR-005). 내가 쓴 글/받은
 * 참가 요청/보낸 참가 신청/차단 목록을 하위 탭으로 제공한다. 모든 조회는
 * RLS(신청자 본인·글 작성자만 SELECT, 차단은 `blocker_id`=본인만)에 의존해
 * 본인 데이터만 노출한다(REQ-FUNC-036, 037, 038, 040).
 */
export function MyActivityTab() {
  const [subTab, setSubTab] = useState<SubTab>("posts");
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<MatePostRow[]>([]);
  const [received, setReceived] = useState<ReceivedApplicationRow[]>([]);
  const [sent, setSent] = useState<SentApplicationRow[]>([]);
  const [blocks, setBlocks] = useState<BlockRow[]>([]);
  const [closeConfirmPostId, setCloseConfirmPostId] = useState<string | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);

  function triggerRefresh() {
    setRefreshKey((key) => key + 1);
  }

  useEffect(() => {
    let active = true;

    async function load() {
      const supabase = createSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) {
        if (active) setLoading(false);
        return;
      }

      const { data: myPosts } = await supabase
        .from("mate_post")
        .select("post_id, title, country_code, start_date, end_date, status")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });
      const postRows = (myPosts as MatePostRow[] | null) ?? [];

      const postIds = postRows.map((post) => post.post_id);
      let receivedRows: ReceivedApplicationRow[] = [];
      if (postIds.length > 0) {
        const { data } = await supabase
          .from("mate_application")
          .select("application_id, post_id, message, status, mate_post(title)")
          .in("post_id", postIds)
          .order("created_at", { ascending: false });
        receivedRows = (
          (data as unknown as Array<{
            application_id: string;
            post_id: string;
            message: string;
            status: string;
            mate_post: { title: string } | null;
          }> | null) ?? []
        ).map((row) => ({
          application_id: row.application_id,
          post_id: row.post_id,
          message: row.message,
          status: row.status,
          post_title: row.mate_post?.title ?? "",
        }));
      }

      const { data: sentRows } = await supabase
        .from("mate_application")
        .select("application_id, post_id, message, status, mate_post(title)")
        .eq("applicant_id", userId)
        .order("created_at", { ascending: false });
      const sentApplications = (
        (sentRows as unknown as Array<{
          application_id: string;
          post_id: string;
          message: string;
          status: string;
          mate_post: { title: string } | null;
        }> | null) ?? []
      ).map((row) => ({
        application_id: row.application_id,
        post_id: row.post_id,
        message: row.message,
        status: row.status,
        post_title: row.mate_post?.title ?? "",
      }));

      const { data: blockRows } = await supabase
        .from("user_block")
        .select("blocked_id, user_profile!user_block_blocked_id_fkey(nickname)")
        .eq("blocker_id", userId);
      const blockList = (
        (blockRows as unknown as Array<{
          blocked_id: string;
          user_profile: { nickname: string } | null;
        }> | null) ?? []
      ).map((row) => ({
        blocked_id: row.blocked_id,
        blocked_nickname: row.user_profile?.nickname ?? null,
      }));

      if (!active) return;
      setPosts(postRows);
      setReceived(receivedRows);
      setSent(sentApplications);
      setBlocks(blockList);
      setLoading(false);
    }

    void load();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  async function closePost(postId: string) {
    await fetch(`/api/mates/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "CLOSE" }),
    });
    setCloseConfirmPostId(null);
    triggerRefresh();
  }

  function handleCloseClick(postId: string) {
    const hasAcceptedApplicant = received.some(
      (application) =>
        application.post_id === postId && application.status === "ACCEPTED",
    );
    if (hasAcceptedApplicant) {
      setCloseConfirmPostId(postId);
      return;
    }
    void closePost(postId);
  }

  async function deletePost(postId: string) {
    await fetch(`/api/mates/${postId}`, { method: "DELETE" });
    triggerRefresh();
  }

  async function decideApplication(
    applicationId: string,
    status: "ACCEPTED" | "REJECTED",
  ) {
    await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    triggerRefresh();
  }

  async function unblock(blockedId: string) {
    await fetch(`/api/blocks/${blockedId}`, { method: "DELETE" });
    triggerRefresh();
  }

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-6 border-b border-[#E3E2DE]">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSubTab(tab.id)}
            className={`h-11 border-b-2 px-1 text-[15px] font-semibold outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
              subTab === tab.id
                ? "border-[#F4623A] text-[#2A2A2E]"
                : "border-transparent text-[#83838A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === "posts" &&
        (posts.length === 0 ? (
          <EmptyState
            title="아직 작성한 동행 글이 없어요."
            description="여행 일정을 정했다면 동행 글을 작성해 함께할 사람을 찾아보세요."
            action={{
              label: "동행 글 작성하기",
              href: "/travel-tools?tab=mate",
            }}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map((post) => {
              const open = isEffectivelyOpen(post);
              return (
                <div
                  key={post.post_id}
                  className="flex flex-col gap-2 rounded-[12px] border border-[#E3E2DE] bg-white p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[15px] font-semibold text-[#2A2A2E]">
                      {post.title}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-[12px] font-medium ${
                        open
                          ? "bg-[#FEEBE3] text-[#F4623A]"
                          : "bg-[#EFEDE9] text-[#83838A]"
                      }`}
                    >
                      {open ? "모집중" : "마감"}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#83838A]">
                    {countryNameFor(post.country_code)} · {post.start_date} -{" "}
                    {post.end_date}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/travel-tools?tab=mate"
                      className="h-9 rounded-[8px] border border-[#C7C6C1] px-3 text-[13px] font-semibold leading-9 text-[#2A2A2E] hover:bg-[#F7F6F4]"
                    >
                      수정
                    </Link>
                    {open && (
                      <button
                        type="button"
                        onClick={() => handleCloseClick(post.post_id)}
                        className="h-9 rounded-[8px] border border-[#C7C6C1] px-3 text-[13px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
                      >
                        마감
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deletePost(post.post_id)}
                      className="h-9 rounded-[8px] border border-[#C7C6C1] px-3 text-[13px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      {subTab === "received" &&
        (received.length === 0 ? (
          <EmptyState
            title="아직 받은 참가 요청이 없어요."
            description="동행 글을 작성하면 참가 요청을 받을 수 있어요."
            action={{
              label: "동행 글 작성하기",
              href: "/travel-tools?tab=mate",
            }}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {received.map((application) => (
              <div
                key={application.application_id}
                className="flex flex-col gap-2 rounded-[12px] border border-[#E3E2DE] bg-white p-4"
              >
                <p className="text-[14px] font-semibold text-[#2A2A2E]">
                  {application.post_title}
                </p>
                <p className="text-[14px] leading-[1.6] text-[#54545A]">
                  {application.message}
                </p>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#F7F6F4] px-3 py-1 text-[12px] font-medium text-[#54545A]">
                    {application.status}
                  </span>
                  {application.status === "PENDING" && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          decideApplication(
                            application.application_id,
                            "ACCEPTED",
                          )
                        }
                        className="h-9 rounded-[8px] bg-[#F4623A] px-3 text-[13px] font-semibold text-white hover:bg-[#D94F2B]"
                      >
                        승인
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          decideApplication(
                            application.application_id,
                            "REJECTED",
                          )
                        }
                        className="h-9 rounded-[8px] border border-[#C7C6C1] px-3 text-[13px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
                      >
                        거절
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

      {subTab === "sent" &&
        (sent.length === 0 ? (
          <EmptyState
            title="아직 보낸 참가 신청이 없어요."
            description="마음에 드는 동행 글에 참가를 신청해 보세요."
            action={{ label: "동행 찾아보기", href: "/mates" }}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {sent.map((application) => (
              <div
                key={application.application_id}
                className="flex flex-col gap-2 rounded-[12px] border border-[#E3E2DE] bg-white p-4"
              >
                <p className="text-[14px] font-semibold text-[#2A2A2E]">
                  {application.post_title}
                </p>
                <p className="text-[14px] leading-[1.6] text-[#54545A]">
                  {application.message}
                </p>
                <span className="w-fit rounded-full bg-[#F7F6F4] px-3 py-1 text-[12px] font-medium text-[#54545A]">
                  {application.status}
                </span>
              </div>
            ))}
          </div>
        ))}

      {subTab === "blocks" &&
        (blocks.length === 0 ? (
          <EmptyState
            title="차단한 사용자가 없어요."
            description="불편한 사용자를 차단하면 이곳에 표시됩니다."
            action={{ label: "동행 찾아보기", href: "/mates" }}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {blocks.map((block) => (
              <div
                key={block.blocked_id}
                className="flex items-center justify-between gap-2 rounded-[12px] border border-[#E3E2DE] bg-white p-4"
              >
                <p className="text-[14px] font-medium text-[#2A2A2E]">
                  {block.blocked_nickname ?? "알 수 없는 사용자"}
                </p>
                <button
                  type="button"
                  onClick={() => unblock(block.blocked_id)}
                  className="h-9 rounded-[8px] border border-[#C7C6C1] px-3 text-[13px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
                >
                  차단 해제
                </button>
              </div>
            ))}
          </div>
        ))}

      <Modal
        isOpen={closeConfirmPostId !== null}
        onClose={() => setCloseConfirmPostId(null)}
        title="마감할까요?"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setCloseConfirmPostId(null)}
              className="h-11 rounded-[8px] border border-[#C7C6C1] px-5 text-[14px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() =>
                closeConfirmPostId && closePost(closeConfirmPostId)
              }
              className="h-11 rounded-[8px] bg-[#F4623A] px-5 text-[14px] font-semibold text-white hover:bg-[#D94F2B]"
            >
              마감하기
            </button>
          </div>
        }
      >
        <p className="text-[14px] leading-[1.6] text-[#54545A]">
          이미 승인된 참가자가 있습니다. 그래도 이 글을 마감하시겠습니까?
        </p>
      </Modal>
    </div>
  );
}
