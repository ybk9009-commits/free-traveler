import { isHttpsUrl } from "../links/external-link";

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  issues: ValidationIssue[];
}

interface StringFieldRule {
  field: string;
  value: unknown;
  maxLength: number;
  minLength?: number;
  required?: boolean;
  pattern?: RegExp;
  patternMessage?: string;
}

/**
 * REQ-NF-015 — 모든 문자열 입력은 최대 길이·허용 문자 제약을 여기서 명시한다.
 * React 기본 이스케이프(렌더 시)와 이 서버 쪽 검증을 함께 적용해 저장 XSS를 막는다.
 */
function validateStringField(
  rule: StringFieldRule,
  issues: ValidationIssue[],
): string {
  const {
    field,
    value,
    maxLength,
    minLength = 0,
    required = true,
    pattern,
    patternMessage,
  } = rule;

  if (typeof value !== "string") {
    if (required) {
      issues.push({ field, message: `${field}은 문자열이어야 합니다.` });
    }
    return "";
  }

  const trimmed = value.trim();

  if (required && trimmed.length < Math.max(minLength, 1)) {
    issues.push({ field, message: `${field}을 입력해 주세요.` });
  } else if (trimmed.length > 0 && trimmed.length < minLength) {
    issues.push({
      field,
      message: `${field}은 최소 ${minLength}자 이상이어야 합니다.`,
    });
  }

  if (trimmed.length > maxLength) {
    issues.push({
      field,
      message: `${field}은 최대 ${maxLength}자까지 입력할 수 있습니다.`,
    });
  }

  if (pattern && trimmed.length > 0 && !pattern.test(trimmed)) {
    issues.push({
      field,
      message: patternMessage ?? `${field} 형식이 올바르지 않습니다.`,
    });
  }

  return trimmed;
}

function validateHttpsUrlField(
  field: string,
  value: unknown,
  issues: ValidationIssue[],
  required = true,
): string {
  const trimmed = validateStringField(
    { field, value, maxLength: 2048, required },
    issues,
  );
  if (trimmed.length > 0 && !isHttpsUrl(trimmed)) {
    issues.push({ field, message: `${field}은 https:// URL이어야 합니다.` });
  }
  return trimmed;
}

const COUNTRY_CODE_PATTERN = /^[A-Z]{2}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface MatePostInput {
  title: string;
  description: string;
  countryCode: string;
  regionCode: string;
  startDate: string;
  endDate: string;
  capacity: number;
  travelStyles: string[];
}

/** 모집글 작성/수정 입력(REQ-FUNC-031 전제). */
export function validateMatePostInput(
  input: unknown,
): ValidationResult<MatePostInput> {
  const issues: ValidationIssue[] = [];
  const raw = (input ?? {}) as Record<string, unknown>;

  const title = validateStringField(
    { field: "title", value: raw.title, maxLength: 100 },
    issues,
  );
  const description = validateStringField(
    { field: "description", value: raw.description, maxLength: 2000 },
    issues,
  );
  const countryCode = validateStringField(
    {
      field: "countryCode",
      value: raw.countryCode,
      maxLength: 2,
      pattern: COUNTRY_CODE_PATTERN,
      patternMessage:
        "countryCode는 대문자 2자(ISO 3166-1 alpha-2)여야 합니다.",
    },
    issues,
  );
  const regionCode = validateStringField(
    {
      field: "regionCode",
      value: raw.regionCode,
      maxLength: 50,
      required: false,
    },
    issues,
  );
  const startDate = validateStringField(
    {
      field: "startDate",
      value: raw.startDate,
      maxLength: 10,
      pattern: ISO_DATE_PATTERN,
      patternMessage: "startDate는 YYYY-MM-DD 형식이어야 합니다.",
    },
    issues,
  );
  const endDate = validateStringField(
    {
      field: "endDate",
      value: raw.endDate,
      maxLength: 10,
      pattern: ISO_DATE_PATTERN,
      patternMessage: "endDate는 YYYY-MM-DD 형식이어야 합니다.",
    },
    issues,
  );
  if (startDate && endDate && endDate < startDate) {
    issues.push({
      field: "endDate",
      message: "endDate는 startDate 이후여야 합니다.",
    });
  }

  const capacity = raw.capacity;
  if (
    typeof capacity !== "number" ||
    !Number.isInteger(capacity) ||
    capacity < 1 ||
    capacity > 20
  ) {
    issues.push({
      field: "capacity",
      message: "capacity는 1~20 사이의 정수여야 합니다.",
    });
  }

  const travelStylesRaw = raw.travelStyles;
  const travelStyles: string[] = [];
  if (!Array.isArray(travelStylesRaw)) {
    issues.push({
      field: "travelStyles",
      message: "travelStyles는 문자열 배열이어야 합니다.",
    });
  } else {
    if (travelStylesRaw.length > 5) {
      issues.push({
        field: "travelStyles",
        message: "travelStyles는 최대 5개까지 가능합니다.",
      });
    }
    travelStylesRaw.slice(0, 5).forEach((style, index) => {
      travelStyles.push(
        validateStringField(
          { field: `travelStyles[${index}]`, value: style, maxLength: 20 },
          issues,
        ),
      );
    });
  }

  if (issues.length > 0) return { success: false, issues };

  return {
    success: true,
    issues,
    data: {
      title,
      description,
      countryCode,
      regionCode,
      startDate,
      endDate,
      capacity: capacity as number,
      travelStyles,
    },
  };
}

export interface MateApplicationInput {
  message: string;
}

/** 참가 신청 입력(REQ-FUNC-034 전제, 비공개 메시지 500자 제한). */
export function validateMateApplicationInput(
  input: unknown,
): ValidationResult<MateApplicationInput> {
  const issues: ValidationIssue[] = [];
  const raw = (input ?? {}) as Record<string, unknown>;

  const message = validateStringField(
    { field: "message", value: raw.message, maxLength: 500, minLength: 1 },
    issues,
  );

  if (issues.length > 0) return { success: false, issues };
  return { success: true, issues, data: { message } };
}

const REPORT_TARGET_TYPES = ["USER", "MATE_POST", "MATE_APPLICATION"] as const;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface ReportInput {
  targetType: (typeof REPORT_TARGET_TYPES)[number];
  targetId: string;
  reasonCode: string;
  description: string;
}

/** 신고 입력(REQ-FUNC-039 전제). */
export function validateReportInput(
  input: unknown,
): ValidationResult<ReportInput> {
  const issues: ValidationIssue[] = [];
  const raw = (input ?? {}) as Record<string, unknown>;

  const targetType = raw.targetType;
  if (
    typeof targetType !== "string" ||
    !REPORT_TARGET_TYPES.includes(
      targetType as (typeof REPORT_TARGET_TYPES)[number],
    )
  ) {
    issues.push({
      field: "targetType",
      message: `targetType은 ${REPORT_TARGET_TYPES.join("/")} 중 하나여야 합니다.`,
    });
  }

  const targetId = validateStringField(
    {
      field: "targetId",
      value: raw.targetId,
      maxLength: 36,
      pattern: UUID_PATTERN,
      patternMessage: "targetId는 UUID 형식이어야 합니다.",
    },
    issues,
  );
  const reasonCode = validateStringField(
    { field: "reasonCode", value: raw.reasonCode, maxLength: 50 },
    issues,
  );
  const description = validateStringField(
    {
      field: "description",
      value: raw.description,
      maxLength: 2000,
      required: false,
    },
    issues,
  );

  if (issues.length > 0) return { success: false, issues };

  return {
    success: true,
    issues,
    data: {
      targetType: targetType as (typeof REPORT_TARGET_TYPES)[number],
      targetId,
      reasonCode,
      description,
    },
  };
}

export interface AdminSettingsInput {
  flightOutboundUrl: string;
  hotelOutboundUrl: string;
}

/** 관리자 설정 입력(외부 이동 URL 등, CLAUDE.md 규칙 13 범위). */
export function validateAdminSettingsInput(
  input: unknown,
): ValidationResult<AdminSettingsInput> {
  const issues: ValidationIssue[] = [];
  const raw = (input ?? {}) as Record<string, unknown>;

  const flightOutboundUrl = validateHttpsUrlField(
    "flightOutboundUrl",
    raw.flightOutboundUrl,
    issues,
  );
  const hotelOutboundUrl = validateHttpsUrlField(
    "hotelOutboundUrl",
    raw.hotelOutboundUrl,
    issues,
  );

  if (issues.length > 0) return { success: false, issues };
  return {
    success: true,
    issues,
    data: { flightOutboundUrl, hotelOutboundUrl },
  };
}
