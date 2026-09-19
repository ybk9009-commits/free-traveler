import { describe, it, expect } from "vitest";
import { detectContactInfo } from "@/lib/mate/contact-detection";

/**
 * TEST-UNIT-CONTACT-DETECTION — REQ-FUNC-032. 실제 개인 연락처는 쓰지 않고
 * 가짜 패턴만 사용한다(Security/Privacy AC).
 */
const POSITIVE_CASES = [
  "연락처는 010-1234-5678 입니다.",
  "01012345678로 문자 주세요.",
  "+82 10 1234 5678 로 연락주세요.",
  "핸드폰 번호: 011 234 5678",
  "이메일 test.user@example.com 으로 보내주세요.",
  "contact+mate@sample.co.kr 로 메일 주세요.",
  "카카오톡 아이디는 travelmate01 입니다.",
  "카톡: hiking_buddy",
  "텔레그램 id: nomad_walker",
  "라인 아이디: line_traveler99",
  "인스타그램 wanderlust_kim",
  "디스코드 discordUser123",
  "위챗 wechat_id01",
  "왓츠앱 whatsapp_kr",
  "예약번호는 1234-5678-9012 입니다.",
  "연락 가능한 번호 010.9876.5432",
  "가입코드 87654321 을 입력해 주세요.",
  "@backpacker_seoul 팔로우 해주세요.",
  "kakao talk id: seoul_trip2024",
  "telegram tester_kim",
  "instagram travel_with_me",
  "second_mail@travel.org 로 연락주세요.",
  "번호 010-0000-1111 남겨주세요.",
  "문의: help.desk@service.net",
];

const NEGATIVE_CASES = [
  "함께 여행 갈 동행을 구합니다.",
  "일정은 3박 4일로 계획하고 있어요.",
  "숙소는 2인실을 예약했어요.",
  "아침 9시에 출발할 예정입니다.",
  "예산은 1인당 30만원 정도로 생각하고 있어요.",
  "배낭여행을 좋아하는 분이면 좋겠습니다.",
  "맛집 투어 위주로 다닐 예정이에요.",
  "나이는 20대에서 30대 사이면 좋겠어요.",
  "사진 찍는 걸 좋아해서 명소 위주로 다닐 것 같아요.",
  "연락은 참가 신청 메시지로 편하게 주세요.",
  "안전 수칙을 꼭 지켜주시길 부탁드립니다.",
  "10명 정도 모집할 예정입니다.",
  "체크인은 오후 3시부터 가능해요.",
  "환전은 미리 해두는 게 좋을 것 같아요.",
  "현지 교통편은 지하철을 주로 이용할 계획이에요.",
  "짐은 최대한 가볍게 챙기려고요.",
  "날씨가 선선해서 걷기 좋은 계절이에요.",
  "같이 시장 구경도 하고 싶어요.",
  "여행 스타일이 비슷한 분을 찾고 있어요.",
  "일정 변경 가능성도 있으니 참고해 주세요.",
  "야경이 예쁜 곳을 위주로 돌아볼 예정입니다.",
  "현지 음식 도전해보는 걸 좋아해요.",
  "박물관과 미술관 관람을 좋아합니다.",
  "느긋하게 힐링하는 여행을 원해요.",
];

describe("detectContactInfo — REQ-FUNC-032", () => {
  it(`기준 양성 케이스(${POSITIVE_CASES.length}건)의 탐지율이 95% 이상이다`, () => {
    const results = POSITIVE_CASES.map((text) => detectContactInfo(text));
    const detected = results.filter((result) => result.detected);
    const missed = POSITIVE_CASES.filter(
      (_, index) => !results[index].detected,
    );

    const detectionRate = detected.length / POSITIVE_CASES.length;
    expect(
      detectionRate,
      `탐지 실패 케이스: ${missed.join(" | ")}`,
    ).toBeGreaterThanOrEqual(0.95);
  });

  it(`기준 정상 문장(${NEGATIVE_CASES.length}건)의 오탐률이 5% 이하다`, () => {
    const results = NEGATIVE_CASES.map((text) => detectContactInfo(text));
    const falsePositives = NEGATIVE_CASES.filter(
      (_, index) => results[index].detected,
    );

    const falsePositiveRate = falsePositives.length / NEGATIVE_CASES.length;
    expect(
      falsePositiveRate,
      `오탐 케이스: ${falsePositives.join(" | ")}`,
    ).toBeLessThanOrEqual(0.05);
  });

  it("탐지 시 안내 메시지에 연락처 교환 대안을 포함한다", () => {
    const result = detectContactInfo("연락처는 010-1234-5678 입니다.");
    expect(result.detected).toBe(true);
    expect(result.message).toContain("비공개 메시지");
  });

  it("탐지되지 않은 문장은 message가 없다", () => {
    const result = detectContactInfo("함께 여행 갈 동행을 구합니다.");
    expect(result.detected).toBe(false);
    expect(result.message).toBeUndefined();
  });
});
