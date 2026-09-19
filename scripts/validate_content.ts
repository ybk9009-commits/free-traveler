/**
 * TEST-DATA-VALIDATION — 정적 데이터 완전성·수량 검증 스크립트.
 * `src/data`의 여행지·안전정보 콘텐츠가 REQ-FUNC-008/046/074, REQ-NF-026/027
 * 기준을 충족하는지 검사한다. 누락 목록을 모두 모아 출력하고, 하나라도
 * 미충족이면 종료 코드 1로 CI를 실패시킨다(REQ-FUNC-074 게시 전 완전성 게이트).
 *
 * 실행: `npx tsx scripts/validate_content.ts`(tsconfig의 `moduleResolution:
 * "bundler"`가 확장자 없는 상대 경로 import를 허용하므로, `tsc --noEmit`과
 * 호환되도록 실행기도 같은 방식으로 모듈을 해석하는 tsx를 사용한다 — Node
 * 기본 ESM 로더는 상대 경로에 `.ts` 확장자를 요구해 두 요구사항이 충돌한다).
 */
import { destinations } from "../src/data/destinations";
import { countrySafetyInfo } from "../src/data/safety";

const REQUIRED_SAFETY_CATEGORIES = [
  "security",
  "commonScams",
  "localLaws",
  "transport",
  "disasterClimate",
  "health",
  "cultureDressCode",
  "emergencyContacts",
] as const;

const issues: string[] = [];

function check(condition: boolean, message: string): void {
  if (!condition) issues.push(message);
}

// REQ-FUNC-008 — 국내 10개 이상, 해외 15개국 30개 도시 이상.
const domestic = destinations.filter((d) => d.region === "domestic");
const overseas = destinations.filter((d) => d.region === "overseas");
const overseasCountryCodes = new Set(overseas.map((d) => d.countryCode));

check(
  domestic.length >= 10,
  `국내 여행지가 ${domestic.length}개입니다(10개 이상 필요).`,
);
check(
  overseasCountryCodes.size >= 15,
  `해외 국가가 ${overseasCountryCodes.size}개입니다(15개 이상 필요).`,
);
check(
  overseas.length >= 30,
  `해외 도시가 ${overseas.length}개입니다(30개 이상 필요).`,
);

// REQ-NF-026 — 여행지 필수 필드(명소 5+, 음식 3+, 에티켓 3+, 출처 1+).
for (const destination of destinations) {
  check(
    destination.highlights.length >= 5,
    `${destination.id}: highlights가 ${destination.highlights.length}개입니다(5개 이상 필요).`,
  );
  check(
    destination.foods.length >= 3,
    `${destination.id}: foods가 ${destination.foods.length}개입니다(3개 이상 필요).`,
  );
  check(
    destination.etiquette.length >= 3,
    `${destination.id}: etiquette가 ${destination.etiquette.length}개입니다(3개 이상 필요).`,
  );
  check(
    destination.sources.length >= 1,
    `${destination.id}: sources가 ${destination.sources.length}개입니다(1개 이상 필요).`,
  );
}

// REQ-FUNC-046 — 해외 국가와 안전정보 1:1 매핑.
const safetyCountryCodes = new Set(
  countrySafetyInfo.map((info) => info.countryCode),
);

for (const countryCode of overseasCountryCodes) {
  check(
    safetyCountryCodes.has(countryCode),
    `해외 국가 ${countryCode}에 대응하는 안전정보가 없습니다.`,
  );
}
for (const countryCode of safetyCountryCodes) {
  check(
    overseasCountryCodes.has(countryCode),
    `안전정보 ${countryCode}에 대응하는 해외 여행지가 없습니다.`,
  );
}

// REQ-NF-027 — 안전정보 8개 카테고리 존재.
for (const info of countrySafetyInfo) {
  for (const category of REQUIRED_SAFETY_CATEGORIES) {
    check(
      Boolean(info.categories[category]?.trim()),
      `${info.countryCode}: categories.${category}가 비어 있습니다.`,
    );
  }
}

if (issues.length > 0) {
  console.error(`데이터 검증 실패: ${issues.length}건\n`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(
  `데이터 검증 통과: 국내 ${domestic.length}개, 해외 ${overseas.length}개 도시(${overseasCountryCodes.size}개국), 안전정보 ${countrySafetyInfo.length}개국.`,
);
