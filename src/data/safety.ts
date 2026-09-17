export type SafetyScopeType = "COUNTRY" | "REGION";

export type SafetyAdvisoryLevel =
  "없음" | "여행유의" | "여행자제" | "철수권고" | "여행금지";

export interface SafetyCategories {
  /** 치안 */
  security: string;
  /** 흔한 사기 */
  commonScams: string;
  /** 현지 법규 */
  localLaws: string;
  /** 교통 */
  transport: string;
  /** 재난·기후 */
  disasterClimate: string;
  /** 보건 */
  health: string;
  /** 문화·복장 */
  cultureDressCode: string;
  /** 긴급연락처(현지 신고번호) */
  emergencyContacts: string;
}

export interface CountrySafetyInfo {
  /** `Destination.countryCode`와 1:1 매칭된다(REQ-FUNC-046). */
  countryCode: string;
  countryName: string;
  scopeType: SafetyScopeType;
  scopeText: string;
  advisoryLevel: SafetyAdvisoryLevel;
  categories: SafetyCategories;
  /** 긴급전화·영사콜센터(REQ-FUNC-053). 영사콜센터는 국가 무관 동일 번호다. */
  emergency: {
    localEmergencyNumber: string;
    koreanConsularHotline: string;
  };
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
  verifiedBy: string;
}

const KOREAN_CONSULAR_HOTLINE =
  "+82-2-3210-0404(영사콜센터, 해외 어디서나 24시간 연결)";
const MOFA_SOURCE_NAME = "외교부 해외안전여행";
const MOFA_SOURCE_URL = "https://www.0404.go.kr";
const VERIFIED_AT = "2026-09-17";
const VERIFIED_BY = "free_traveler 편집팀";

/**
 * REQ-FUNC-046~048/052/053, REQ-NF-027 — `destinations.ts`의 해외 국가마다
 * 1:1로 존재해야 한다(현재 overseas countryCode 15개: JP/VN/TH/TW/PH/ID/MY/FR/IT/ES/GB/DE/US/AU/TR).
 * 공식 출처(외교부 해외안전여행) URL만 참조한다.
 */
export const countrySafetyInfo: CountrySafetyInfo[] = [
  {
    countryCode: "JP",
    countryName: "일본",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "없음",
    categories: {
      security:
        "치안이 매우 우수해 강력범죄 발생률이 낮으나, 대도시 유흥가·전철에서는 소지품 관리에 주의한다.",
      commonScams:
        "관광지 인근 호객 술집(캐치바)에서 고액 요금을 청구하는 사례가 있어 낯선 사람의 권유를 따라가지 않는다.",
      localLaws:
        "대마 등 마약류는 소지·투약 모두 엄격히 처벌되며, 온천·목욕 시설 중 문신 노출을 제한하는 곳이 많다.",
      transport:
        "대중교통이 정시성이 높고 안전하나, 지진 시 임시 운행 중단이 잦으니 안내 방송을 따른다.",
      disasterClimate:
        "지진·태풍이 잦은 지역으로 호텔 내 대피 경로를 미리 확인하고 긴급재난문자(J-Alert)를 확인한다.",
      health:
        "의료 수준이 높으나 진료비가 비싼 편이라 해외여행자보험 가입을 권장한다.",
      cultureDressCode:
        "신사·사원 참배 시 정숙을 유지하고, 온천 이용 시 문신이 있으면 사전에 시설 규정을 확인한다.",
      emergencyContacts: "경찰 110, 구급·화재 119.",
    },
    emergency: {
      localEmergencyNumber: "경찰 110 / 구급·화재 119",
      koreanConsularHotline: KOREAN_CONSULAR_HOTLINE,
    },
    sourceName: MOFA_SOURCE_NAME,
    sourceUrl: MOFA_SOURCE_URL,
    verifiedAt: VERIFIED_AT,
    verifiedBy: VERIFIED_BY,
  },
  {
    countryCode: "VN",
    countryName: "베트남",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "없음",
    categories: {
      security:
        "대체로 안전하나 관광지·야시장에서 오토바이를 이용한 날치기가 발생하니 가방을 몸 앞쪽으로 멘다.",
      commonScams:
        "택시 미터기 조작이나 환전 시 위조지폐 거래 사례가 있어 공인 차량 호출 앱과 은행·환전소 이용을 권장한다.",
      localLaws:
        "마약류는 소량 소지도 강력 처벌되며, 국제운전면허증 없이 오토바이를 운전하면 불법이다.",
      transport:
        "오토바이 통행량이 많아 도로 횡단·차량 이용 시 각별한 주의가 필요하다.",
      disasterClimate:
        "우기(5~10월)에는 홍수·태풍 피해가 발생할 수 있어 일정 변경에 대비한다.",
      health: "생수 음용을 권장하며 길거리 음식은 위생 상태를 확인한다.",
      cultureDressCode: "사원 방문 시 어깨·무릎을 가리는 복장을 갖춘다.",
      emergencyContacts: "경찰 113, 구급 115.",
    },
    emergency: {
      localEmergencyNumber: "경찰 113 / 구급 115",
      koreanConsularHotline: KOREAN_CONSULAR_HOTLINE,
    },
    sourceName: MOFA_SOURCE_NAME,
    sourceUrl: MOFA_SOURCE_URL,
    verifiedAt: VERIFIED_AT,
    verifiedBy: VERIFIED_BY,
  },
  {
    countryCode: "TH",
    countryName: "태국",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "없음",
    categories: {
      security:
        "관광지는 대체로 안전하나 야간 유흥가에서는 소지품 관리와 낯선 사람이 권하는 음료에 주의한다.",
      commonScams:
        "보석·투어 상품 사기, 미터기 없는 택시의 과다 요금 청구 사례가 잦아 차량 호출 앱이나 미터기 택시를 이용한다.",
      localLaws:
        "왕실을 모독하는 언행은 엄격히 처벌되며, 전자담배 소지만으로도 처벌 대상이 될 수 있다.",
      transport:
        "툭툭·오토바이 택시 이용 시 헬멧 착용과 요금 사전 협의가 필요하다.",
      disasterClimate:
        "우기(6~10월) 남부 지역은 집중 강우와 해상 기상 악화에 유의한다.",
      health: "뎅기열 등 모기 매개 질병 예방을 위해 방충 스프레이를 사용한다.",
      cultureDressCode: "왕궁·사원 방문 시 노출이 많은 복장은 입장이 제한된다.",
      emergencyContacts: "경찰 191, 구급 1669.",
    },
    emergency: {
      localEmergencyNumber: "경찰 191 / 구급 1669",
      koreanConsularHotline: KOREAN_CONSULAR_HOTLINE,
    },
    sourceName: MOFA_SOURCE_NAME,
    sourceUrl: MOFA_SOURCE_URL,
    verifiedAt: VERIFIED_AT,
    verifiedBy: VERIFIED_BY,
  },
  {
    countryCode: "TW",
    countryName: "대만",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "없음",
    categories: {
      security:
        "치안이 매우 우수한 편이며 야간에도 비교적 안전하게 이동할 수 있다.",
      commonScams:
        "관광지 인근 과도한 시식 권유 후 고액 결제를 유도하는 사례가 드물게 있어 가격을 먼저 확인한다.",
      localLaws: "대중교통 내 음식물 섭취가 금지되며 위반 시 벌금이 부과된다.",
      transport:
        "MRT·고속철도가 매우 발달해 있어 대중교통 이용이 안전하고 편리하다.",
      disasterClimate:
        "태풍(7~9월)과 지진이 발생할 수 있어 기상 특보를 확인한다.",
      health:
        "의료 시스템이 우수하며 여행자보험으로 대부분의 병원 이용이 가능하다.",
      cultureDressCode:
        "사원 참배 시 정숙을 유지하고 신발을 벗고 들어가는 곳이 있다.",
      emergencyContacts: "경찰 110, 구급·화재 119.",
    },
    emergency: {
      localEmergencyNumber: "경찰 110 / 구급·화재 119",
      koreanConsularHotline: KOREAN_CONSULAR_HOTLINE,
    },
    sourceName: MOFA_SOURCE_NAME,
    sourceUrl: MOFA_SOURCE_URL,
    verifiedAt: VERIFIED_AT,
    verifiedBy: VERIFIED_BY,
  },
  {
    countryCode: "PH",
    countryName: "필리핀",
    scopeType: "COUNTRY",
    scopeText:
      "전역(단, 민다나오·술루·바실란·타위타위 등 남부 일부 지역은 별도 강화된 경보 적용)",
    advisoryLevel: "없음",
    categories: {
      security:
        "마닐라·세부 등 주요 관광지는 대체로 안전하나 빈부 격차가 큰 지역에서는 야간 단독 이동을 피한다. 민다나오·술루·바실란 등 남부 일부 지역은 테러 위험으로 별도의 강화된 여행경보가 적용되므로 방문 전 반드시 최신 공식 정보를 확인해야 한다.",
      commonScams:
        "관광안내소를 사칭한 투어 상품 강매, 택시 미터기 미사용 요금 분쟁이 흔해 공식 차량 호출 앱을 이용한다.",
      localLaws:
        "마약류 관련 처벌이 매우 엄격하며 사형까지 가능한 범죄로 분류된다.",
      transport:
        "지프니·트라이시클 등 현지 교통수단은 혼잡하고 사고 위험이 있어 야간 이용을 자제한다.",
      disasterClimate:
        "태풍(6~11월)과 지진 발생 빈도가 높아 기상 정보를 상시 확인한다.",
      health:
        "뎅기열 발생 지역이 있어 모기 기피제를 사용하고, 식수는 생수를 이용한다.",
      cultureDressCode: "성당·교회 방문 시 단정한 복장을 갖춘다.",
      emergencyContacts: "통합 신고번호 911.",
    },
    emergency: {
      localEmergencyNumber: "통합 신고번호 911",
      koreanConsularHotline: KOREAN_CONSULAR_HOTLINE,
    },
    sourceName: MOFA_SOURCE_NAME,
    sourceUrl: MOFA_SOURCE_URL,
    verifiedAt: VERIFIED_AT,
    verifiedBy: VERIFIED_BY,
  },
  {
    countryCode: "ID",
    countryName: "인도네시아",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "없음",
    categories: {
      security:
        "발리·자카르타 관광지는 대체로 안전하나 소매치기·오토바이 날치기에 주의한다.",
      commonScams:
        "환전상의 계산기 조작, 렌터카·오토바이 대여 시 과도한 파손 배상 청구 사례가 있어 계약 전 상태를 사진으로 남긴다.",
      localLaws:
        "마약류 소지·투약은 사형까지 가능한 중범죄로 처벌되며, 라마단 기간에는 공공장소 음주·취식에 제약이 있을 수 있다.",
      transport:
        "오토바이 교통량이 많고 신호 체계가 느슨해 도로 횡단·이동 시 주의가 필요하다.",
      disasterClimate:
        "화산 활동과 지진·해일(쓰나미) 위험 지역이 있어 현지 재난 경보를 확인한다.",
      health: "뎅기열·장티푸스 예방을 위해 생수 음용과 방충을 철저히 한다.",
      cultureDressCode:
        "사원 방문 시 사롱(전통 하의)을 착용해야 하는 곳이 많다.",
      emergencyContacts: "경찰 110, 구급 118.",
    },
    emergency: {
      localEmergencyNumber: "경찰 110 / 구급 118",
      koreanConsularHotline: KOREAN_CONSULAR_HOTLINE,
    },
    sourceName: MOFA_SOURCE_NAME,
    sourceUrl: MOFA_SOURCE_URL,
    verifiedAt: VERIFIED_AT,
    verifiedBy: VERIFIED_BY,
  },
  {
    countryCode: "MY",
    countryName: "말레이시아",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "없음",
    categories: {
      security:
        "쿠알라룸푸르·페낭 관광지는 대체로 안전하나 야간에는 인적이 드문 골목을 피한다.",
      commonScams:
        "신용카드 복제(스키밍) 피해 사례가 있어 ATM은 은행 부속기기를 이용한다.",
      localLaws: "마약류 소지는 매우 엄격히 처벌되며 사형이 가능한 범죄다.",
      transport:
        "LRT·모노레일이 잘 갖춰져 있어 대중교통 이용이 비교적 안전하다.",
      disasterClimate:
        "우기(11~2월 동해안 중심)에는 홍수 피해가 발생할 수 있다.",
      health: "뎅기열 발생 지역이 있어 방충에 유의한다.",
      cultureDressCode: "모스크 방문 시 신발을 벗고 노출이 적은 복장을 갖춘다.",
      emergencyContacts: "통합 신고번호 999.",
    },
    emergency: {
      localEmergencyNumber: "통합 신고번호 999",
      koreanConsularHotline: KOREAN_CONSULAR_HOTLINE,
    },
    sourceName: MOFA_SOURCE_NAME,
    sourceUrl: MOFA_SOURCE_URL,
    verifiedAt: VERIFIED_AT,
    verifiedBy: VERIFIED_BY,
  },
  {
    countryCode: "FR",
    countryName: "프랑스",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "없음",
    categories: {
      security:
        "대도시 관광지·대중교통에서 소매치기가 빈번해 소지품을 항상 주시한다.",
      commonScams:
        "서명 요청 후 기부금을 강요하거나, 가짜 설문조사로 주의를 분산시켜 소지품을 훔치는 수법에 주의한다.",
      localLaws:
        "공공장소 마약 소지는 불법이며, 시위·집회가 잦아 관련 지역은 우회한다.",
      transport:
        "지하철 소매치기 다발 구간이 있어 혼잡 시간대 가방을 앞으로 멘다.",
      disasterClimate: "폭염(7~8월)이 발생할 수 있어 수분 섭취에 유의한다.",
      health: "의료 수준이 높으며 여행자보험으로 응급실 이용이 가능하다.",
      cultureDressCode: "성당 방문 시 노출이 적은 복장을 권장한다.",
      emergencyContacts: "유럽 공통 응급 112, 경찰 17.",
    },
    emergency: {
      localEmergencyNumber: "응급 112 / 경찰 17",
      koreanConsularHotline: KOREAN_CONSULAR_HOTLINE,
    },
    sourceName: MOFA_SOURCE_NAME,
    sourceUrl: MOFA_SOURCE_URL,
    verifiedAt: VERIFIED_AT,
    verifiedBy: VERIFIED_BY,
  },
  {
    countryCode: "IT",
    countryName: "이탈리아",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "없음",
    categories: {
      security:
        "로마·피렌체 등 주요 관광지에서 소매치기·집단 절도 수법이 흔해 혼잡한 지하철·관광명소에서 특히 주의한다.",
      commonScams:
        "가짜 팔찌를 손목에 묶고 돈을 요구하거나, 관광지 인근 레스토랑의 과다 청구 사례가 있어 메뉴 가격을 미리 확인한다.",
      localLaws:
        "주요 유적지 인근에서는 음식물 섭취·좌석 취식이 금지된 곳이 있어 표지판을 확인한다.",
      transport:
        "기차·지하철 내 소지품 분실·도난이 잦아 캐리어·배낭은 항상 시야에 둔다.",
      disasterClimate: "여름철 폭염과 일부 지역의 지진 위험이 있다.",
      health: "의료 수준이 높으며 응급실은 여행자보험으로 이용 가능하다.",
      cultureDressCode:
        "바티칸·성당 방문 시 어깨와 무릎을 가리는 복장이 필수다.",
      emergencyContacts: "유럽 공통 응급 112.",
    },
    emergency: {
      localEmergencyNumber: "응급 112",
      koreanConsularHotline: KOREAN_CONSULAR_HOTLINE,
    },
    sourceName: MOFA_SOURCE_NAME,
    sourceUrl: MOFA_SOURCE_URL,
    verifiedAt: VERIFIED_AT,
    verifiedBy: VERIFIED_BY,
  },
  {
    countryCode: "ES",
    countryName: "스페인",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "없음",
    categories: {
      security:
        "바르셀로나·마드리드 관광지에서 소매치기가 빈번해 가방은 항상 앞으로 멘다.",
      commonScams:
        "축구 티켓·투어 예약 사기, 노상에서의 서명 요구 후 소지품 절도 수법에 주의한다.",
      localLaws:
        "공공장소 음주가 제한되는 지역이 있으며 심야 소음 관련 규제가 엄격하다.",
      transport:
        "지하철·버스 내에서 특히 혼잡한 시간대 소지품 관리에 유의한다.",
      disasterClimate: "여름철 폭염이 심할 수 있어 한낮 야외활동을 자제한다.",
      health: "의료 시스템이 우수하며 여행자보험 가입을 권장한다.",
      cultureDressCode: "성당·수도원 방문 시 단정한 복장을 갖춘다.",
      emergencyContacts: "유럽 공통 응급 112.",
    },
    emergency: {
      localEmergencyNumber: "응급 112",
      koreanConsularHotline: KOREAN_CONSULAR_HOTLINE,
    },
    sourceName: MOFA_SOURCE_NAME,
    sourceUrl: MOFA_SOURCE_URL,
    verifiedAt: VERIFIED_AT,
    verifiedBy: VERIFIED_BY,
  },
  {
    countryCode: "GB",
    countryName: "영국",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "없음",
    categories: {
      security:
        "런던 등 대도시 관광지에서 소매치기·핸드폰 탈취 사례가 있어 혼잡한 곳에서 전자기기 사용에 주의한다.",
      commonScams:
        "가짜 자선단체 기부 요청이나 부정확한 환율의 환전소 이용에 주의한다.",
      localLaws:
        "공공장소 음주 제한 구역이 있으며, 무단횡단은 불법은 아니나 신호를 지킨다.",
      transport: "지하철(튜브) 파업이 잦아 이동 일정에 여유를 둔다.",
      disasterClimate:
        "겨울철 폭풍·홍수가 발생할 수 있어 기상 특보를 확인한다.",
      health: "응급 의료는 NHS를 통해 제공되며 여행자보험 가입을 권장한다.",
      cultureDressCode: "왕실 관련 행사·성당 방문 시 단정한 복장을 갖춘다.",
      emergencyContacts: "응급 999 또는 112.",
    },
    emergency: {
      localEmergencyNumber: "응급 999 / 112",
      koreanConsularHotline: KOREAN_CONSULAR_HOTLINE,
    },
    sourceName: MOFA_SOURCE_NAME,
    sourceUrl: MOFA_SOURCE_URL,
    verifiedAt: VERIFIED_AT,
    verifiedBy: VERIFIED_BY,
  },
  {
    countryCode: "DE",
    countryName: "독일",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "없음",
    categories: {
      security:
        "대체로 치안이 우수하나 대도시 중앙역·관광지에서 소매치기에 주의한다.",
      commonScams:
        "가짜 청원서 서명 후 소지품을 훔치는 수법이나 암표 판매에 주의한다.",
      localLaws:
        "나치 관련 상징물 사용은 엄격히 금지되며, 일요일에는 대부분 상점이 휴무다.",
      transport: "기차 연착이 발생할 수 있어 환승 시간을 여유 있게 잡는다.",
      disasterClimate: "겨울철 폭설로 교통이 지연될 수 있다.",
      health: "의료 수준이 높으며 여행자보험으로 응급 진료가 가능하다.",
      cultureDressCode: "성당 방문 시 단정한 복장을 갖춘다.",
      emergencyContacts: "응급 112, 경찰 110.",
    },
    emergency: {
      localEmergencyNumber: "응급 112 / 경찰 110",
      koreanConsularHotline: KOREAN_CONSULAR_HOTLINE,
    },
    sourceName: MOFA_SOURCE_NAME,
    sourceUrl: MOFA_SOURCE_URL,
    verifiedAt: VERIFIED_AT,
    verifiedBy: VERIFIED_BY,
  },
  {
    countryCode: "US",
    countryName: "미국",
    scopeType: "COUNTRY",
    scopeText: "전역(주·도시별 치안 차이가 크다)",
    advisoryLevel: "없음",
    categories: {
      security:
        "도시별 치안 차이가 크며 대도시 일부 구역은 야간 단독 이동을 피하는 것이 안전하다.",
      commonScams:
        "렌터카 반납 시 과다 파손 청구, 관광지 인근 티켓 재판매 사기에 주의한다.",
      localLaws:
        "주(State)마다 법이 달라 대마초 등 일부 물질의 합법 여부가 지역별로 다르므로 확인이 필요하다.",
      transport:
        "대중교통이 도시별로 발달 정도가 달라 렌터카 이용이 일반적이며, 장거리 이동 시 교통법규를 준수한다.",
      disasterClimate:
        "지역에 따라 허리케인·산불·토네이도 위험이 있어 해당 지역 기상 정보를 확인한다.",
      health: "의료비가 매우 높은 편이라 해외여행자보험 가입이 필수적이다.",
      cultureDressCode:
        "특별한 복장 규정은 적으나 종교시설 방문 시 단정한 옷차림을 권장한다.",
      emergencyContacts: "응급 911.",
    },
    emergency: {
      localEmergencyNumber: "응급 911",
      koreanConsularHotline: KOREAN_CONSULAR_HOTLINE,
    },
    sourceName: MOFA_SOURCE_NAME,
    sourceUrl: MOFA_SOURCE_URL,
    verifiedAt: VERIFIED_AT,
    verifiedBy: VERIFIED_BY,
  },
  {
    countryCode: "AU",
    countryName: "호주",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "없음",
    categories: {
      security:
        "치안이 우수한 편이나 대도시 유흥가 야간 시간대에는 소지품 관리에 유의한다.",
      commonScams:
        "숙박·투어 예약 사기 사이트가 있어 공식 홈페이지나 검증된 플랫폼을 이용한다.",
      localLaws: "야외 음주가 제한되는 구역이 많아 표지판을 확인한다.",
      transport:
        "장거리 이동 시 야생동물 출현으로 인한 도로 위험이 있어 야간 운전을 자제한다.",
      disasterClimate:
        "여름철(12~2월) 산불·폭염 위험이 있어 지역 경보를 확인한다.",
      health:
        "해파리·상어 등 해양 생물 안전 안내를 따르고 자외선이 강해 자외선 차단제를 사용한다.",
      cultureDressCode:
        "특별한 복장 규정은 없으나 원주민 성지 방문 시 안내를 따른다.",
      emergencyContacts: "응급 000.",
    },
    emergency: {
      localEmergencyNumber: "응급 000",
      koreanConsularHotline: KOREAN_CONSULAR_HOTLINE,
    },
    sourceName: MOFA_SOURCE_NAME,
    sourceUrl: MOFA_SOURCE_URL,
    verifiedAt: VERIFIED_AT,
    verifiedBy: VERIFIED_BY,
  },
  {
    countryCode: "TR",
    countryName: "튀르키예",
    scopeType: "COUNTRY",
    scopeText: "전역(단, 시리아 접경 남동부 일부 지역은 별도 강화된 경보 적용)",
    advisoryLevel: "없음",
    categories: {
      security:
        "이스탄불·카파도키아 등 관광지는 대체로 안전하나 대규모 집회·시위 지역은 피한다. 시리아 접경 남동부 일부 지역은 여행자제·철수권고 수준의 별도 경보가 적용되므로 해당 지역 방문 전 반드시 최신 공식 정보를 확인해야 한다.",
      commonScams:
        "환전 시 위조지폐, 관광지 인근 카펫·보석 상점의 고압적인 영업에 주의한다.",
      localLaws:
        "튀르키예 국기·국부 아타튀르크를 모독하는 언행은 처벌 대상이 될 수 있다.",
      transport:
        "대도시 대중교통은 비교적 안전하나 심야 택시 이용 시 요금을 미리 확인한다.",
      disasterClimate:
        "지진 발생 빈도가 높은 국가로 대피 경로를 미리 확인한다.",
      health: "의료 수준이 도시별로 차이가 있어 여행자보험 가입을 권장한다.",
      cultureDressCode:
        "모스크 방문 시 신발을 벗고 여성은 머릿수건을 준비한다.",
      emergencyContacts: "응급 112, 경찰 155.",
    },
    emergency: {
      localEmergencyNumber: "응급 112 / 경찰 155",
      koreanConsularHotline: KOREAN_CONSULAR_HOTLINE,
    },
    sourceName: MOFA_SOURCE_NAME,
    sourceUrl: MOFA_SOURCE_URL,
    verifiedAt: VERIFIED_AT,
    verifiedBy: VERIFIED_BY,
  },
];
