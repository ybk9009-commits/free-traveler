import { describe, it, expect } from "vitest";
import { validateFlightDates } from "@/components/screens/scr003/FlightForm";
import { validateHotelDates } from "@/components/screens/scr003/HotelForm";

/**
 * TEST-UNIT-TRAVEL-DATES — REQ-FUNC-013/021. `validateFlightDates`/
 * `validateHotelDates`는 CMP-SCR-003-flight-form/hotel-form의 순수 검증
 * 로직이라(이번 Task에서 export로 전환, 동작 변경 없음) 직접 import해
 * 경계값을 검증한다.
 */
const TODAY = "2026-06-15";
const YESTERDAY = "2026-06-14";
const TOMORROW = "2026-06-16";

describe("validateFlightDates — REQ-FUNC-013", () => {
  it("출발일이 오늘이면 통과한다(경계값)", () => {
    expect(validateFlightDates(TODAY, TOMORROW, TODAY)).toBeNull();
  });

  it("출발일이 오늘-1(어제)이면 차단한다(경계값)", () => {
    expect(validateFlightDates(YESTERDAY, TOMORROW, TODAY)).toBe(
      "출발일은 오늘 이후여야 합니다.",
    );
  });

  it("출발일이 오늘보다 이전이면 차단한다", () => {
    expect(validateFlightDates("2026-01-01", TOMORROW, TODAY)).toBe(
      "출발일은 오늘 이후여야 합니다.",
    );
  });

  it("귀국일이 출발일과 동일일이면 통과한다(경계값)", () => {
    expect(validateFlightDates(TODAY, TODAY, TODAY)).toBeNull();
  });

  it("귀국일이 출발일 하루 전이면 차단한다(경계값)", () => {
    expect(validateFlightDates(TOMORROW, TODAY, TODAY)).toBe(
      "귀국일은 출발일 이후여야 합니다.",
    );
  });

  it("귀국일이 출발일보다 이전이면 차단한다", () => {
    expect(validateFlightDates(TOMORROW, "2026-01-01", TODAY)).toBe(
      "귀국일은 출발일 이후여야 합니다.",
    );
  });

  it("출발일·귀국일 모두 유효하면 통과한다", () => {
    expect(validateFlightDates(TOMORROW, "2026-06-20", TODAY)).toBeNull();
  });
});

describe("validateHotelDates — REQ-FUNC-021", () => {
  it("체크인이 오늘이면 통과한다(경계값)", () => {
    expect(validateHotelDates(TODAY, TOMORROW, TODAY)).toBeNull();
  });

  it("체크인이 오늘-1(어제)이면 차단한다(경계값)", () => {
    expect(validateHotelDates(YESTERDAY, TOMORROW, TODAY)).toBe(
      "체크인은 오늘 이후여야 합니다.",
    );
  });

  it("체크인이 오늘보다 이전이면 차단한다", () => {
    expect(validateHotelDates("2026-01-01", TOMORROW, TODAY)).toBe(
      "체크인은 오늘 이후여야 합니다.",
    );
  });

  it("체크아웃이 체크인과 동일일이면 차단한다(경계값 — 항공과 달리 등호 포함)", () => {
    expect(validateHotelDates(TODAY, TODAY, TODAY)).toBe(
      "체크아웃은 체크인보다 늦어야 합니다.",
    );
  });

  it("체크아웃이 체크인 하루 전이면 차단한다(경계값)", () => {
    expect(validateHotelDates(TOMORROW, TODAY, TODAY)).toBe(
      "체크아웃은 체크인보다 늦어야 합니다.",
    );
  });

  it("체크아웃이 체크인보다 하루라도 늦으면 통과한다(경계값)", () => {
    expect(validateHotelDates(TODAY, TOMORROW, TODAY)).toBeNull();
  });

  it("체크인·체크아웃 모두 유효하면 통과한다", () => {
    expect(validateHotelDates(TOMORROW, "2026-06-20", TODAY)).toBeNull();
  });
});
