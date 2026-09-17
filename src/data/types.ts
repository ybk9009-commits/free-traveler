export type DestinationRegion = "domestic" | "overseas";

export interface DestinationImage {
  url: string;
  /** 실제 장소를 설명하는 alt 텍스트(REQ-FUNC-007). "이미지"/"사진" 같은 일반 라벨 금지. */
  alt: string;
}

export interface DestinationSource {
  name: string;
  url: string;
}

export interface Destination {
  /** slug, 예: "kr-seoul", "jp-tokyo" */
  id: string;
  /** 화면에 표시되는 이름, 예: "서울" */
  name: string;
  /** ISO 3166-1 alpha-2. DATA-SAFETY가 이 값으로 안전정보를 1:1 매칭한다. */
  countryCode: string;
  countryName: string;
  region: DestinationRegion;
  image: DestinationImage;
  /** 300자 이상 */
  overview: string;
  /** 5개 이상 */
  highlights: string[];
  bestTime: string;
  itinerary1d: string;
  itinerary3d: string;
  budget: string;
  transport: string;
  /** 3개 이상 */
  foods: string[];
  /** 3개 이상 */
  etiquette: string[];
  /** 1개 이상 */
  sources: DestinationSource[];
}
