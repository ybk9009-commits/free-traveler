export interface RepresentativeTimelineEntry {
  year: number;
  place: string;
  summary: string;
}

export type RepresentativeRegion = "아시아" | "유럽" | "북미" | "오세아니아";

export interface RepresentativeCountryGroup {
  region: RepresentativeRegion;
  countries: string[];
}

export interface RepresentativeProfile {
  displayName: string;
  tripCountLabel: string;
  countryCountLabel: string;
  bio: string;
  philosophy: string;
  editorialPrinciples: string;
  /** 30개 이상, 지도 대신 권역별 목록형으로 표기한다(REQ-FUNC-059). */
  visitedCountries: RepresentativeCountryGroup[];
  /** 6개 이상. */
  timeline: RepresentativeTimelineEntry[];
  heroImage: {
    url: string;
    alt: string;
  };
}

/**
 * REQ-FUNC-057~061 — SCR-001/SCR-002 어디서 참조하든 동일한 단일 정적 객체.
 * 개인정보 없음(공개 프로필 정보만), Supabase가 아닌 정적 데이터로 관리한다.
 */
export const representativeProfile: RepresentativeProfile = {
  displayName: "free_traveler",
  tripCountLabel: "50+ Trips",
  countryCountLabel: "30+ Countries",
  bio: "free_traveler는 10년 가까이 세계 곳곳을 다니며 여행기를 기록해온 여행 콘텐츠 크리에이터다. 배낭 하나로 떠난 동남아시아 첫 여행을 시작으로 아시아·유럽·북미·오세아니아까지 발을 넓혀왔고, 화려한 관광지보다는 실제로 걸어본 골목과 대화를 나눈 사람들의 이야기를 담는 데 집중해왔다. Free Traveler 서비스의 여행지 추천과 안전정보, 동행 매칭 콘텐츠는 이 같은 실제 경험을 바탕으로 기획됐다.",
  philosophy:
    "여행은 목적지를 소비하는 것이 아니라 그 지역의 속도에 맞춰 걸어보는 과정이라고 믿는다. 유명한 명소를 빠르게 훑기보다 하루 이틀 더 머물며 현지인의 하루를 관찰하는 것을 선호하며, 이러한 태도가 결과적으로 더 안전하고 더 깊은 여행 경험으로 이어진다고 생각한다.",
  editorialPrinciples:
    "모든 여행지 소개는 직접 방문하거나 신뢰할 수 있는 공식 출처를 확인한 정보만을 담는다. 안전정보는 과장하거나 축소하지 않고 외교부 해외안전여행 등 공식 출처를 그대로 인용하며, 특정 숙소·항공사·상품을 홍보하는 협찬성 콘텐츠는 다루지 않는다.",
  visitedCountries: [
    {
      region: "아시아",
      countries: [
        "대한민국",
        "일본",
        "대만",
        "태국",
        "베트남",
        "필리핀",
        "인도네시아",
        "말레이시아",
        "싱가포르",
        "캄보디아",
        "인도",
        "네팔",
      ],
    },
    {
      region: "유럽",
      countries: [
        "프랑스",
        "이탈리아",
        "스페인",
        "영국",
        "독일",
        "스위스",
        "오스트리아",
        "체코",
        "네덜란드",
        "포르투갈",
        "그리스",
        "튀르키예",
      ],
    },
    {
      region: "북미",
      countries: ["미국", "캐나다", "멕시코", "쿠바"],
    },
    {
      region: "오세아니아",
      countries: ["호주", "뉴질랜드", "피지"],
    },
  ],
  timeline: [
    {
      year: 2016,
      place: "일본 도쿄·오사카",
      summary:
        "첫 해외 배낭여행으로 간사이·간토 지역을 2주간 돌며 여행 기록을 시작했다.",
    },
    {
      year: 2017,
      place: "베트남·태국·캄보디아",
      summary:
        "동남아시아 3개국을 잇는 육로 배낭여행으로 저예산 장기여행의 기틀을 다졌다.",
    },
    {
      year: 2018,
      place: "프랑스·이탈리아·스페인",
      summary:
        "첫 유럽 여행에서 예술과 건축 중심의 도시 탐방 스타일을 정립했다.",
    },
    {
      year: 2019,
      place: "인도·네팔",
      summary:
        "히말라야 트레킹과 인도 북부를 여행하며 안전정보의 중요성을 절감했다.",
    },
    {
      year: 2020,
      place: "대한민국 국내 전역",
      summary:
        "해외 이동이 어려운 시기에 국내 10여 개 도시를 재발견하는 여행으로 전환했다.",
    },
    {
      year: 2021,
      place: "대한민국 제주·강원",
      summary:
        "국내 자연 여행지를 심화 취재하며 안전정보·안내 콘텐츠의 표준을 다듬었다.",
    },
    {
      year: 2022,
      place: "영국·독일·체코",
      summary:
        "여행 재개 이후 유럽 중북부를 다시 방문해 이전 기록을 최신화했다.",
    },
    {
      year: 2023,
      place: "미국·캐나다",
      summary: "북미 서안과 동안을 오가며 대도시와 국립공원을 함께 취재했다.",
    },
    {
      year: 2024,
      place: "호주·뉴질랜드",
      summary: "남반구 여행으로 오세아니아 지역 콘텐츠를 처음으로 확보했다.",
    },
    {
      year: 2025,
      place: "대만·필리핀",
      summary:
        "아시아 인기 여행지를 다시 찾아 최신 물가와 안전정보를 업데이트했다.",
    },
  ],
  heroImage: {
    url: "https://picsum.photos/seed/free-traveler-profile/1200/900",
    alt: "배낭을 멘 free_traveler가 전망대에서 도시 전경을 바라보는 모습",
  },
};
