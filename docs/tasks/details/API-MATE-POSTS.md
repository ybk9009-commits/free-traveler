# API-MATE-POSTS — 동행 모집글 생성·수정·마감·삭제

```task-meta
{
  "task_id": "API-MATE-POSTS",
  "type": "api",
  "depends_on": [
    "DB-SCHEMA-BASE",
    "DB-RLS-BASE",
    "DB-ACCESS",
    "INFRA-AUTH-SESSION",
    "INFRA-ADULT-VERIFICATION",
    "INFRA-CONTACT-DETECTION",
    "INFRA-INPUT-VALIDATION"
  ],
  "requirements": [
    "REQ-FUNC-031",
    "REQ-FUNC-032",
    "REQ-FUNC-037",
    "REQ-FUNC-038"
  ]
}
```

## Context
이 Task는 SCR-003(작성), SCR-005(관리) 화면이 필요로 하는 '동행 모집글 생성·수정·마감·삭제' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-037(축소), REQ-FUNC-038
- 정규화된 Requirement ID: REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-037, REQ-FUNC-038

## Screen / Route / Page Entry
- Screen: SCR-003(작성), SCR-005(관리)
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- DB-SCHEMA-BASE
- DB-RLS-BASE
- DB-ACCESS
- INFRA-AUTH-SESSION
- INFRA-ADULT-VERIFICATION
- INFRA-CONTACT-DETECTION
- INFRA-INPUT-VALIDATION

## Expected Files
`src/app/api/mates/route.ts`(POST), `src/app/api/mates/[id]/route.ts`(PATCH/DELETE)

## Functional AC
- 제목/국가/지역/시작일/종료일/모집인원/선호조건/여행스타일/설명/안전수칙 동의를 필수 입력으로 검증한다(REQ-FUNC-031). 날짜 역전·과거 종료일은 차단한다.
  - 본문에서 `INFRA-CONTACT-DETECTION` 결과가 양성이면 제출을 차단한다(REQ-FUNC-032).
  - 종료일이 지난 글은 **배치 없이** 조회 시점에 CLOSED로 계산해 응답한다(REQ-FUNC-037 축소).
  - 작성자만 수동 마감/수정/삭제할 수 있으며, 승인된 신청이 있는 상태에서 중요 일정을 바꾸면 경고 플래그를 응답에 포함한다(REQ-FUNC-038).

## Visual AC
해당 없음(폼 UI는 CMP-SCR-003-mate-write-form, 관리 UI는 CMP-SCR-005-my-activity).

## Security/Privacy AC
비로그인/미성년 요청은 401/403으로 차단한다. 응답 JSON에 신청자 개인 연락처를 포함하지 않는다.

## Test Cases
- [Functional AC] 제목/국가/지역/시작일/종료일/모집인원/선호조건/여행스타일/설명/안전수칙 동의를 필수 입력으로 검증한다(REQ-FUNC-031). 날짜 역전·과거 종료일은 차단한다. — Verify: TEST-UNIT-MATE-STATE, TEST-E2E-MATE-AUTH
- [Functional AC] 본문에서 `INFRA-CONTACT-DETECTION` 결과가 양성이면 제출을 차단한다(REQ-FUNC-032). — Verify: TEST-UNIT-MATE-STATE, TEST-E2E-MATE-AUTH
- [Functional AC] 종료일이 지난 글은 **배치 없이** 조회 시점에 CLOSED로 계산해 응답한다(REQ-FUNC-037 축소). — Verify: TEST-UNIT-MATE-STATE, TEST-E2E-MATE-AUTH
- [Functional AC] 작성자만 수동 마감/수정/삭제할 수 있으며, 승인된 신청이 있는 상태에서 중요 일정을 바꾸면 경고 플래그를 응답에 포함한다(REQ-FUNC-038). — Verify: TEST-UNIT-MATE-STATE, TEST-E2E-MATE-AUTH
- [Security/Privacy AC] 비로그인/미성년 요청은 401/403으로 차단한다. 응답 JSON에 신청자 개인 연락처를 포함하지 않는다. — Verify: TEST-UNIT-MATE-STATE, TEST-E2E-MATE-AUTH

## Verify
TEST-UNIT-MATE-STATE, TEST-E2E-MATE-AUTH

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-UNIT-MATE-STATE, TEST-E2E-MATE-AUTH`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
