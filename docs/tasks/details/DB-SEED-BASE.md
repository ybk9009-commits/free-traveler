# DB-SEED-BASE — 개발·테스트 시드 데이터

```task-meta
{
  "task_id": "DB-SEED-BASE",
  "type": "db",
  "depends_on": [
    "DB-SCHEMA-BASE"
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
    "REQ-FUNC-045"
  ],
  "tables": [
    "USER_PROFILE",
    "MATE_POST",
    "MATE_APPLICATION",
    "USER_BLOCK",
    "REPORT"
  ]
}
```

## Context
이 Task는 여러 화면 또는 인프라 계층에서 공통으로 소비되는 기반 요소이 필요로 하는 '개발·테스트 시드 데이터' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙(최소 RLS), §5 데이터 모델 매핑(5개 테이블 고정) `USER_PROFILE`/`MATE_POST`/`MATE_APPLICATION`/`USER_BLOCK`/`REPORT` 5개 테이블 범위를 넘지 않는다.

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): (테스트 지원, REQ-FUNC-027~045 검증 전제)
- 정규화된 Requirement ID: REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-030, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-043, REQ-FUNC-044, REQ-FUNC-045

## Screen / Route / Page Entry
- Screen: —
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- DB-SCHEMA-BASE

## Expected Files
`supabase/seed.sql`

## Functional AC
- 각 테이블에 테스트용 최소 데이터(회원 2명 이상, 모집글 2건 이상 — 모집중/마감 각 1건, 신청 1건, 차단 1건, 신고 1건)를 넣는다.
  - `TEST-RLS-BASIC`, `TEST-E2E-MATE-AUTH`가 재현 가능하게 실행되도록 시드 초기화 스크립트(`npm run db:seed`)를 제공한다.

## Visual AC
해당 없음.

## Security/Privacy AC
시드 데이터는 실제 개인정보를 포함하지 않는다(가짜 닉네임·메시지만 사용).

## Test Cases
- [Functional AC] 각 테이블에 테스트용 최소 데이터(회원 2명 이상, 모집글 2건 이상 — 모집중/마감 각 1건, 신청 1건, 차단 1건, 신고 1건)를 넣는다. — Verify: TEST-RLS-BASIC, TEST-E2E-MATE-AUTH 실행으로 검증
- [Functional AC] `TEST-RLS-BASIC`, `TEST-E2E-MATE-AUTH`가 재현 가능하게 실행되도록 시드 초기화 스크립트(`npm run db:seed`)를 제공한다. — Verify: TEST-RLS-BASIC, TEST-E2E-MATE-AUTH 실행으로 검증
- [Security/Privacy AC] 시드 데이터는 실제 개인정보를 포함하지 않는다(가짜 닉네임·메시지만 사용). — Verify: TEST-RLS-BASIC, TEST-E2E-MATE-AUTH 실행으로 검증

## Verify
TEST-RLS-BASIC, TEST-E2E-MATE-AUTH 실행으로 검증

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-RLS-BASIC, TEST-E2E-MATE-AUTH 실행으로 검증`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
