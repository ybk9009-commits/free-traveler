"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { verifyAdult } from "@/lib/mate/adult-verification";
import { deleteAccount } from "@/lib/account/delete";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { destinations } from "@/data/destinations";
import { Modal } from "@/components/common/Modal";

const AGE_BAND_OPTIONS = ["10s", "20s", "30s", "40s", "50s", "60+"] as const;
const TRAVEL_STYLE_OPTIONS = [
  "자연",
  "도심",
  "휴양",
  "미식",
  "액티비티",
  "역사문화",
];

interface ProfileRow {
  nickname: string;
  age_band: string | null;
  gender: string | null;
  travel_styles: string[];
  bio: string | null;
  is_adult: boolean;
  adult_verified_at: string | null;
}

type LoadState = "loading" | "guest" | "ready";

/**
 * CMP-SCR-005-profile — Member 프로필 탭(SCR-005). Member(로그인) 상태에서만
 * 렌더링한다(Guest/Admin과 혼합 렌더링하지 않음). 닉네임·연령대·여행
 * 스타일·성별·자기소개 편집, 성인확인 상태 표시, 비밀번호 변경, 즐겨찾기
 * 목록, 회원 탈퇴를 제공한다(REQ-FUNC-028, 029, 045, 068).
 */
export function ProfileTab() {
  const router = useRouter();
  const { favoriteIds, removeFavorite } = useFavorites();

  const [state, setState] = useState<LoadState>("loading");
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [nickname, setNickname] = useState("");
  const [ageBand, setAgeBand] = useState("");
  const [gender, setGender] = useState("");
  const [travelStyles, setTravelStyles] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const [verifyingAdult, setVerifyingAdult] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const supabase = createSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        if (active) setState("guest");
        return;
      }

      const { data: profileRow } = await supabase
        .from("user_profile")
        .select(
          "nickname, age_band, gender, travel_styles, bio, is_adult, adult_verified_at",
        )
        .eq("user_id", userData.user.id)
        .single();

      if (!active) return;
      const row = profileRow as ProfileRow | null;
      if (row) {
        setProfile(row);
        setNickname(row.nickname);
        setAgeBand(row.age_band ?? "");
        setGender(row.gender ?? "");
        setTravelStyles(row.travel_styles ?? []);
        setBio(row.bio ?? "");
      }
      setState("ready");
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  function toggleTravelStyle(style: string) {
    setTravelStyles((current) =>
      current.includes(style)
        ? current.filter((item) => item !== style)
        : current.length < 5
          ? [...current, style]
          : current,
    );
  }

  async function handleSaveProfile() {
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { error } = await supabase
        .from("user_profile")
        .update({
          nickname,
          age_band: ageBand || null,
          gender: gender || null,
          travel_styles: travelStyles,
          bio: bio || null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userData.user.id);

      if (!error) setProfileSaved(true);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleVerifyAdult() {
    setVerifyingAdult(true);
    try {
      const result = await verifyAdult();
      if (result.ok) {
        setProfile((current) =>
          current
            ? {
                ...current,
                is_adult: true,
                adult_verified_at: new Date().toISOString(),
              }
            : current,
        );
      }
    } finally {
      setVerifyingAdult(false);
    }
  }

  async function handleChangePassword() {
    setChangingPassword(true);
    setPasswordMessage(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      setPasswordMessage(
        error ? "비밀번호 변경에 실패했습니다." : "비밀번호가 변경되었습니다.",
      );
      if (!error) setNewPassword("");
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      const result = await deleteAccount();
      if (result.ok) {
        router.push("/");
      }
    } finally {
      setDeleting(false);
      setIsDeleteConfirmOpen(false);
    }
  }

  if (state !== "ready" || !profile) return null;

  const favoriteDestinations = favoriteIds
    .map((id) => destinations.find((destination) => destination.id === id))
    .filter((destination): destination is NonNullable<typeof destination> =>
      Boolean(destination),
    );

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="text-[18px] font-semibold text-[#2A2A2E]">기본 정보</h2>
        <div className="mt-3 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-[#2A2A2E]">
              닉네임
            </span>
            <input
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              className="h-[44px] rounded-[8px] border border-[#E3E2DE] bg-white px-3 text-[14px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-[13px] font-medium text-[#2A2A2E]">
                연령대
              </span>
              <select
                value={ageBand}
                onChange={(event) => setAgeBand(event.target.value)}
                className="h-[44px] rounded-[8px] border border-[#E3E2DE] bg-white px-3 text-[14px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
              >
                <option value="">선택 안 함</option>
                {AGE_BAND_OPTIONS.map((band) => (
                  <option key={band} value={band}>
                    {band}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[13px] font-medium text-[#2A2A2E]">
                성별(선택)
              </span>
              <select
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                className="h-[44px] rounded-[8px] border border-[#E3E2DE] bg-white px-3 text-[14px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
              >
                <option value="">선택 안 함</option>
                <option value="female">여성</option>
                <option value="male">남성</option>
                <option value="other">기타</option>
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-medium text-[#2A2A2E]">
              여행 스타일(필수, 최대 5개)
            </span>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_STYLE_OPTIONS.map((style) => {
                const selected = travelStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleTravelStyle(style)}
                    className={`h-10 rounded-full px-4 text-[14px] font-medium ${
                      selected
                        ? "bg-[#FEEBE3] text-[#F4623A]"
                        : "border border-[#E3E2DE] bg-white text-[#54545A]"
                    }`}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-[#2A2A2E]">
              자기소개
            </span>
            <textarea
              rows={3}
              maxLength={1000}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="rounded-[8px] border border-[#E3E2DE] bg-white px-3 py-3 text-[14px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            />
          </label>

          {profileSaved && (
            <p className="text-[14px] text-[#1F7A52]">저장되었습니다.</p>
          )}

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={savingProfile || travelStyles.length === 0}
            className="inline-flex h-11 w-fit items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[15px] font-semibold text-white hover:bg-[#D94F2B] disabled:opacity-60"
          >
            {savingProfile ? "저장 중..." : "프로필 저장"}
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-[18px] font-semibold text-[#2A2A2E]">성인 확인</h2>
        {profile.is_adult ? (
          <p className="mt-2 text-[14px] text-[#54545A]">
            성인 확인 완료
            {profile.adult_verified_at &&
              ` · ${profile.adult_verified_at.slice(0, 10)}`}
          </p>
        ) : (
          <div className="mt-2 flex flex-col items-start gap-2">
            <p className="text-[14px] text-[#54545A]">
              동행 글 작성·참가 신청을 하려면 성인(만 19세 이상) 확인이
              필요합니다.
            </p>
            <button
              type="button"
              onClick={handleVerifyAdult}
              disabled={verifyingAdult}
              className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#F4623A] px-6 text-[15px] font-semibold text-white hover:bg-[#D94F2B] disabled:opacity-60"
            >
              {verifyingAdult ? "확인 중..." : "만 19세 이상입니다"}
            </button>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-[18px] font-semibold text-[#2A2A2E]">
          비밀번호 변경
        </h2>
        <div className="mt-2 flex flex-col items-start gap-3">
          <input
            type="password"
            minLength={8}
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="h-[44px] w-full max-w-[320px] rounded-[8px] border border-[#E3E2DE] bg-white px-3 text-[14px] text-[#2A2A2E] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          />
          {passwordMessage && (
            <p className="text-[14px] text-[#54545A]">{passwordMessage}</p>
          )}
          <button
            type="button"
            onClick={handleChangePassword}
            disabled={changingPassword || newPassword.length < 8}
            className="inline-flex h-11 items-center justify-center rounded-[8px] border border-[#2A2A2E] px-6 text-[15px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4] disabled:opacity-60"
          >
            {changingPassword ? "변경 중..." : "비밀번호 변경"}
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-[18px] font-semibold text-[#2A2A2E]">
          즐겨찾기 여행지
        </h2>
        {favoriteDestinations.length === 0 ? (
          <p className="mt-2 text-[14px] text-[#83838A]">
            즐겨찾기한 여행지가 없어요.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {favoriteDestinations.map((destination) => (
              <li
                key={destination.id}
                className="flex items-center justify-between gap-2 rounded-[8px] border border-[#E3E2DE] bg-white p-3"
              >
                <span className="text-[14px] text-[#2A2A2E]">
                  {destination.name} · {destination.countryName}
                </span>
                <button
                  type="button"
                  onClick={() => removeFavorite(destination.id)}
                  className="h-9 rounded-[8px] border border-[#C7C6C1] px-3 text-[13px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
                >
                  해제
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-[18px] font-semibold text-[#C1392B]">회원 탈퇴</h2>
        <p className="mt-2 text-[14px] leading-[1.6] text-[#54545A]">
          탈퇴하면 닉네임·자기소개 등 공개 정보가 즉시 비식별화되며 되돌릴 수
          없습니다.
        </p>
        <button
          type="button"
          onClick={() => setIsDeleteConfirmOpen(true)}
          className="mt-3 inline-flex h-11 items-center justify-center rounded-[8px] border border-[#C1392B] px-6 text-[15px] font-semibold text-[#C1392B] hover:bg-[#FBE4E1]"
        >
          회원 탈퇴
        </button>
      </section>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="정말 탈퇴하시겠습니까?"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="h-11 rounded-[8px] border border-[#C7C6C1] px-5 text-[14px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F4]"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="h-11 rounded-[8px] bg-[#C1392B] px-5 text-[14px] font-semibold text-white hover:bg-[#a52f21] disabled:opacity-60"
            >
              {deleting ? "처리 중..." : "탈퇴하기"}
            </button>
          </div>
        }
      >
        <p className="text-[14px] leading-[1.6] text-[#54545A]">
          이 작업은 되돌릴 수 없습니다. 닉네임·자기소개가 즉시 비식별화되고
          로그아웃됩니다.
        </p>
      </Modal>
    </div>
  );
}
