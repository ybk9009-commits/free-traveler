export type ContactDetectionType =
  "PHONE" | "EMAIL" | "MESSENGER_ID" | "SNS_HANDLE";

export interface ContactDetectionMatch {
  type: ContactDetectionType;
  matchedText: string;
}

export interface ContactDetectionResult {
  detected: boolean;
  matches: ContactDetectionMatch[];
  /** 탐지 시 제출을 막는 서버 쪽에서 그대로 사용할 구체적 수정 안내 문구. */
  message?: string;
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// 한국 휴대전화 접두(010/011/016/017/018/019) 우선 매칭 + 국가번호 표기 허용.
const KOREAN_MOBILE_REGEX =
  /(?:\+?\d{1,3}[\s.-]?)?0?1[016789][\s.-]?\d{3,4}[\s.-]?\d{4}\b/g;

// 위 패턴에 걸리지 않는 일반 장문 숫자열(구분자 포함 8자리 이상)도 전화번호로 간주한다.
const GENERIC_DIGIT_RUN_REGEX = /\b\d[\d\s\-.]{6,}\d\b/g;

const MESSENGER_KEYWORD_REGEX =
  /(카카오\s?톡|카톡|카카오|텔레그램|라인|인스타(?:그램)?|디스코드|위챗|왓츠앱|kakao\s?talk|kakao|telegram|line|instagram|discord|wechat|whats\s?app)\s*(?:아이디|id)?\s*[:@]?\s*([a-zA-Z0-9._-]{3,20})/gi;

// 이메일에 이미 포함된 @는 EMAIL_REGEX가 처리하므로, 뒤에 도메인 형태(.xx)가
// 이어지지 않는 @handle만 SNS 계정으로 추가 탐지한다.
const AT_HANDLE_REGEX = /(?<![\w@.])@[a-zA-Z0-9_]{4,20}\b(?!\.[a-zA-Z])/g;

const TYPE_LABELS: Record<ContactDetectionType, string> = {
  PHONE: "전화번호",
  EMAIL: "이메일 주소",
  MESSENGER_ID: "메신저 아이디",
  SNS_HANDLE: "SNS 계정",
};

function collectMatches(
  text: string,
  regex: RegExp,
  type: ContactDetectionType,
): ContactDetectionMatch[] {
  return Array.from(text.matchAll(regex), (match) => ({
    type,
    matchedText: match[0].trim(),
  }));
}

function dedupeMatches(
  matches: ContactDetectionMatch[],
): ContactDetectionMatch[] {
  const seen = new Set<string>();
  const result: ContactDetectionMatch[] = [];
  for (const match of matches) {
    const key = `${match.type}:${match.matchedText}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(match);
  }
  return result;
}

function buildGuidanceMessage(matches: ContactDetectionMatch[]): string {
  const labels = Array.from(
    new Set(matches.map((match) => TYPE_LABELS[match.type])),
  );
  return `${labels.join(", ")}로 보이는 내용이 포함되어 있어 등록할 수 없습니다. 연락처 교환은 참가 신청의 비공개 메시지 기능을 이용해 주세요.`;
}

/**
 * REQ-FUNC-032 — 전화번호·이메일·카카오톡/텔레그램 등 메신저 ID 패턴을
 * 정규식/휴리스틱으로 탐지한다. 순수 함수이며 요청 단위로만 검사하고
 * 어떤 입력값도 저장·로깅하지 않는다(Security/Privacy AC).
 */
export function detectContactInfo(text: string): ContactDetectionResult {
  const rawMatches: ContactDetectionMatch[] = [
    ...collectMatches(text, EMAIL_REGEX, "EMAIL"),
    ...collectMatches(text, KOREAN_MOBILE_REGEX, "PHONE"),
    ...collectMatches(text, GENERIC_DIGIT_RUN_REGEX, "PHONE").filter(
      (match) => match.matchedText.replace(/\D/g, "").length >= 8,
    ),
    ...collectMatches(text, MESSENGER_KEYWORD_REGEX, "MESSENGER_ID"),
    ...collectMatches(text, AT_HANDLE_REGEX, "SNS_HANDLE"),
  ];

  const matches = dedupeMatches(rawMatches);

  return {
    detected: matches.length > 0,
    matches,
    message: matches.length > 0 ? buildGuidanceMessage(matches) : undefined,
  };
}
