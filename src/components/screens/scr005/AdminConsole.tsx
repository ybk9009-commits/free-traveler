"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isHttpsUrl } from "@/lib/links/external-link";

type ReportStatus = "OPEN" | "RESOLVED" | "DISMISSED";

interface ReportRow {
  report_id: string;
  target_type: string;
  target_id: string;
  reason_code: string;
  description: string | null;
  status: ReportStatus;
  created_at: string;
}

type AdminState = "loading" | "forbidden" | "ready";

/**
 * CMP-SCR-005-admin — Admin 관리 영역(SCR-005). Moderator/Admin 역할일 때만
 * 렌더링하며, 클라이언트의 role 판정은 UX 게이트일 뿐이다 — 실제 강제는
 * `report` 테이블 RLS(`report_select_reporter_or_moderator`, Moderator/Admin만
 * 전체 SELECT)와 `API-ADMIN-SETTINGS`의 서버 측 role 검사에 있다. 통계
 * 차트·대시보드는 사용하지 않고 목록 + 상태 변경 액션으로만 구성한다.
 */
export function AdminConsole() {
  const [state, setState] = useState<AdminState>("loading");
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [flightUrl, setFlightUrl] = useState("");
  const [hotelUrl, setHotelUrl] = useState("");
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const supabase = createSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      const role = (
        userData.user?.app_metadata as { role?: string } | undefined
      )?.role;

      if (!active) return;
      if (role !== "MODERATOR" && role !== "ADMIN") {
        setState("forbidden");
        return;
      }

      const { data: reportRows } = await supabase
        .from("report")
        .select(
          "report_id, target_type, target_id, reason_code, description, status, created_at",
        )
        .order("created_at", { ascending: false });

      const settingsResponse = await fetch("/api/admin/settings");
      const settingsBody = await settingsResponse.json().catch(() => null);

      if (!active) return;

      setReports((reportRows as ReportRow[] | null) ?? []);
      const settings = new Map(
        (settingsBody?.settings ?? []).map(
          (row: { key: string; value: string }) => [row.key, row.value],
        ),
      );
      setFlightUrl((settings.get("FLIGHT_OUTBOUND_URL") as string) ?? "");
      setHotelUrl((settings.get("HOTEL_OUTBOUND_URL") as string) ?? "");
      setState("ready");
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  async function updateReportStatus(
    reportId: string,
    status: ReportStatus,
    hideTargetPost: boolean,
  ) {
    const response = await fetch(`/api/admin/reports/${reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, hideTargetPost }),
    });
    if (!response.ok) return;
    setReports((current) =>
      current.map((report) =>
        report.report_id === reportId ? { ...report, status } : report,
      ),
    );
  }

  async function handleSaveSettings() {
    setSettingsError(null);
    setSettingsSaved(false);

    if (flightUrl && !isHttpsUrl(flightUrl)) {
      setSettingsError("항공 외부 URL은 https:// 형식이어야 합니다.");
      return;
    }
    if (hotelUrl && !isHttpsUrl(hotelUrl)) {
      setSettingsError("숙소 외부 URL은 https:// 형식이어야 합니다.");
      return;
    }

    setSavingSettings(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FLIGHT_OUTBOUND_URL: flightUrl,
          HOTEL_OUTBOUND_URL: hotelUrl,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setSettingsError(body?.error ?? "설정 저장에 실패했습니다.");
        return;
      }
      setSettingsSaved(true);
    } finally {
      setSavingSettings(false);
    }
  }

  if (state === "loading" || state === "forbidden") return null;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-[20px] font-semibold text-[#2A2A2E]">
          관리자 콘솔
        </h2>
        <p className="mt-2 text-[14px] leading-[1.6] text-[#54545A]">
          접수된 신고를 처리하고, 항공·숙소 외부 이동 링크를 설정합니다.
        </p>
      </div>

      <section aria-labelledby="admin-reports-heading">
        <h3
          id="admin-reports-heading"
          className="text-[16px] font-semibold text-[#2A2A2E]"
        >
          신고 큐
        </h3>
        {reports.length === 0 ? (
          <p className="mt-3 text-[14px] text-[#83838A]">
            접수된 신고가 없습니다.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {reports.map((report) => (
              <li
                key={report.report_id}
                className="flex flex-col gap-2 rounded-[12px] border border-[#E3E2DE] bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[14px] font-semibold text-[#2A2A2E]">
                    {report.target_type} · {report.reason_code}
                  </p>
                  <span className="rounded-full bg-[#F7F6F4] px-3 py-1 text-[12px] font-medium text-[#54545A]">
                    {report.status}
                  </span>
                </div>
                <p className="text-[13px] text-[#83838A]">
                  대상 ID {report.target_id} · 접수{" "}
                  {report.created_at.slice(0, 10)}
                </p>
                {report.description && (
                  <p className="text-[14px] leading-[1.6] text-[#54545A]">
                    {report.description}
                  </p>
                )}
                {report.status === "OPEN" && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateReportStatus(report.report_id, "RESOLVED", true)
                      }
                      className="h-9 rounded-[8px] border border-[#C7C6C1] px-3 text-[13px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
                    >
                      처리 완료(대상 숨김)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateReportStatus(report.report_id, "RESOLVED", false)
                      }
                      className="h-9 rounded-[8px] border border-[#C7C6C1] px-3 text-[13px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
                    >
                      처리 완료
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateReportStatus(report.report_id, "DISMISSED", false)
                      }
                      className="h-9 rounded-[8px] border border-[#C7C6C1] px-3 text-[13px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
                    >
                      기각
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="admin-settings-heading">
        <h3
          id="admin-settings-heading"
          className="text-[16px] font-semibold text-[#2A2A2E]"
        >
          외부 이동 URL 설정
        </h3>
        <div className="mt-3 flex flex-col gap-3 rounded-[12px] border border-[#E3E2DE] bg-white p-4">
          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-[#2A2A2E]">
              항공 외부 URL
            </span>
            <input
              type="url"
              value={flightUrl}
              onChange={(event) => setFlightUrl(event.target.value)}
              placeholder="https://..."
              className="h-[44px] rounded-[8px] border border-[#E3E2DE] bg-white px-3 text-[14px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-[#2A2A2E]">
              숙소 외부 URL
            </span>
            <input
              type="url"
              value={hotelUrl}
              onChange={(event) => setHotelUrl(event.target.value)}
              placeholder="https://..."
              className="h-[44px] rounded-[8px] border border-[#E3E2DE] bg-white px-3 text-[14px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            />
          </label>

          {settingsError && (
            <p role="alert" className="text-[14px] text-[#C1392B]">
              {settingsError}
            </p>
          )}
          {settingsSaved && (
            <p className="text-[14px] text-[#1F7A52]">저장되었습니다.</p>
          )}

          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="inline-flex h-11 w-fit items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[15px] font-semibold text-white hover:bg-[#D94F2B] disabled:opacity-60"
          >
            {savingSettings ? "저장 중..." : "설정 저장"}
          </button>
        </div>
      </section>
    </div>
  );
}
