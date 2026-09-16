# TEST-E2E-MATE-AUTH — 인증·동행·신고·관리자 흐름 E2E

```task-meta
{
  "task_id": "TEST-E2E-MATE-AUTH",
  "type": "test",
  "depends_on": [
    "PO-SCR-003",
    "PO-SCR-004",
    "PO-SCR-005",
    "DB-SEED-BASE"
  ],
  "requirements": [
    "REQ-FUNC-027",
    "REQ-FUNC-028",
    "REQ-FUNC-029",
    "REQ-FUNC-030",
    "REQ-FUNC-031",
    "REQ-FUNC-032",
    "REQ-FUNC-033",
    "REQ-FUNC-034",
    "REQ-FUNC-035",
    "REQ-FUNC-036",
    "REQ-FUNC-037",
    "REQ-FUNC-038",
    "REQ-FUNC-039",
    "REQ-FUNC-040",
    "REQ-FUNC-041",
    "REQ-FUNC-042",
    "REQ-FUNC-043",
    "REQ-FUNC-044",
    "REQ-FUNC-045",
    "REQ-FUNC-066",
    "REQ-FUNC-077"
  ],
  "browser_projects": [
    "chromium"
  ]
}
```

## Context
이 Task는 SCR-003, SCR-004, SCR-005 화면이 필요로 하는 '인증·동행·신고·관리자 흐름 E2E' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §6 테스트 전략

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-027~045, 066, 077, 041, 042
- 정규화된 Requirement ID: REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-030, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-043, REQ-FUNC-044, REQ-FUNC-045, REQ-FUNC-066, REQ-FUNC-077

## Screen / Route / Page Entry
- Screen: SCR-003, SCR-004, SCR-005
- Route: `/travel-tools`, `/mates`, `/account`
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- PO-SCR-003
- PO-SCR-004
- PO-SCR-005
- DB-SEED-BASE

## Expected Files
`tests/e2e/mate-auth.spec.ts`

## Functional AC
- 회원가입·로그인·성인확인(REQ-FUNC-066, 028) → 동행글 작성(연락처 탐지 차단 케이스 포함, REQ-FUNC-031, 032) → 참가 요청(REQ-FUNC-034) → 승인/거절(REQ-FUNC-036) → 신고(REQ-FUNC-039) → 차단(REQ-FUNC-040) → 관리자 신고 처리·외부 URL 설정(REQ-FUNC-041, 042, 077)까지 하나의 연속 시나리오(또는 2~3개로 분할된 관련 시나리오)로 커버한다(`docs/PROJECT_SCOPE.md` §6).
  - Playwright(Chromium)로 실행하며 `DB-SEED-BASE` 시드 데이터를 사용한다.

## Visual AC
해당 없음.

## Security/Privacy AC
테스트 계정은 실제 개인정보를 사용하지 않는다.

## Test Cases
- [Functional AC] 회원가입·로그인·성인확인(REQ-FUNC-066, 028) → 동행글 작성(연락처 탐지 차단 케이스 포함, REQ-FUNC-031, 032) → 참가 요청(REQ-FUNC-034) → 승인/거절(REQ-FUNC-036) → 신고(REQ-FUNC-039) → 차단(REQ-FUNC-040) → 관리자 신고 처리·외부 URL 설정(REQ-FUNC-041, 042, 077)까지 하나의 연속 시나리오(또는 2~3개로 분할된 관련 시나리오)로 커버한다(`docs/PROJECT_SCOPE.md` §6). — Verify: CI-LINT-TYPECHECK-DATA
- [Functional AC] Playwright(Chromium)로 실행하며 `DB-SEED-BASE` 시드 데이터를 사용한다. — Verify: CI-LINT-TYPECHECK-DATA
- [Security/Privacy AC] 테스트 계정은 실제 개인정보를 사용하지 않는다. — Verify: CI-LINT-TYPECHECK-DATA

## Verify
CI-LINT-TYPECHECK-DATA

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`CI-LINT-TYPECHECK-DATA`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
