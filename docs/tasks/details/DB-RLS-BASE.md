# DB-RLS-BASE — Supabase RLS 정책

```task-meta
{
  "task_id": "DB-RLS-BASE",
  "type": "db",
  "depends_on": [
    "DB-SCHEMA-BASE"
  ],
  "requirements": [
    "REQ-FUNC-044",
    "REQ-NF-013"
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

이 Task는 여러 화면 또는 인프라 계층에서 공통으로 소비되는 기반 요소이 필요로 하는 'Supabase RLS 정책' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙(최소 RLS), §5 데이터 모델 매핑(5개 테이블 고정) `USER_PROFILE`/`MATE_POST`/`MATE_APPLICATION`/`USER_BLOCK`/`REPORT` 5개 테이블 범위를 넘지 않는다.

## Requirement Ref

- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-044, REQ-NF-013
- 정규화된 Requirement ID: REQ-FUNC-044, REQ-NF-013

## Screen / Route / Page Entry

- Screen: —
- Route: —
- Page Entry: —

## Design Ref

해당 없음(비-UI Task).

## Depends On

- DB-SCHEMA-BASE

## Expected Files

`supabase/migrations/0002_rls.sql`

## Functional AC

- `USER_PROFILE`: 본인만 자신의 행 UPDATE 가능, 공개 필드(닉네임/스타일 등)는 SELECT 공개.
  - `MATE_POST`: 누구나 `status != DELETED` 목록 SELECT 가능(차단 필터는 애플리케이션 레벨), 작성자만 UPDATE/DELETE.
  - `MATE_APPLICATION`: 신청자 본인과 대상 글 작성자만 SELECT, 신청자만 INSERT, 글 작성자만 상태 UPDATE.
  - `USER_BLOCK`: 본인(`blocker_id`)만 SELECT/INSERT/DELETE.
  - `REPORT`: 신고자 본인과 Moderator/Admin 역할만 SELECT, 신고자만 INSERT, Moderator/Admin만 상태 UPDATE.
  - 최소 RLS 원칙(`docs/PROJECT_SCOPE.md` §1)을 따르며 "회원 전용 쓰기 경로 보호"를 최우선 목표로 한다.
  - (참고, 2026-09-17 정정) `ADMIN_SETTINGS`(`app_settings`)는 이 Task의 범위가 아니다 — 그 테이블은 `API-ADMIN-SETTINGS`가 만드는 별도 마이그레이션에서 "클라이언트 전체 차단(Service Role만 접근)" RLS까지 함께 정의한다(`docs/PROJECT_SCOPE.md` 235행).

## Visual AC

해당 없음.

## Security/Privacy AC

모든 쓰기 정책은 `auth.uid()` 기반으로 검증한다. Moderator/Admin 역할 판별은 `USER_PROFILE`이 아닌 별도 role 클레임(Supabase custom claims)을 사용한다.

## Test Cases

- [Functional AC] `USER_PROFILE`: 본인만 자신의 행 UPDATE 가능, 공개 필드(닉네임/스타일 등)는 SELECT 공개. — Verify: TEST-RLS-BASIC(권한별 부정 접근 테스트)
- [Functional AC] `MATE_POST`: 누구나 `status != DELETED` 목록 SELECT 가능(차단 필터는 애플리케이션 레벨), 작성자만 UPDATE/DELETE. — Verify: TEST-RLS-BASIC(권한별 부정 접근 테스트)
- [Functional AC] `MATE_APPLICATION`: 신청자 본인과 대상 글 작성자만 SELECT, 신청자만 INSERT, 글 작성자만 상태 UPDATE. — Verify: TEST-RLS-BASIC(권한별 부정 접근 테스트)
- [Functional AC] `USER_BLOCK`: 본인(`blocker_id`)만 SELECT/INSERT/DELETE. — Verify: TEST-RLS-BASIC(권한별 부정 접근 테스트)
- [Security/Privacy AC] 모든 쓰기 정책은 `auth.uid()` 기반으로 검증한다. Moderator/Admin 역할 판별은 `USER_PROFILE`이 아닌 별도 role 클레임(Supabase custom claims)을 사용한다. — Verify: TEST-RLS-BASIC(권한별 부정 접근 테스트)

## Verify

TEST-RLS-BASIC(권한별 부정 접근 테스트)

## Definition of Done

- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-RLS-BASIC(권한별 부정 접근 테스트)`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden

- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
