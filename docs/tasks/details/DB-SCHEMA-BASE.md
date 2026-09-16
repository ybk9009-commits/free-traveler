# DB-SCHEMA-BASE — Supabase 테이블 스키마(5종)

```task-meta
{
  "task_id": "DB-SCHEMA-BASE",
  "type": "db",
  "depends_on": [],
  "requirements": [
    "REQ-FUNC-029",
    "REQ-FUNC-031",
    "REQ-FUNC-034",
    "REQ-FUNC-040",
    "REQ-FUNC-039"
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
이 Task는 여러 화면 또는 인프라 계층에서 공통으로 소비되는 기반 요소이 필요로 하는 'Supabase 테이블 스키마(5종)' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙(최소 RLS), §5 데이터 모델 매핑(5개 테이블 고정) `USER_PROFILE`/`MATE_POST`/`MATE_APPLICATION`/`USER_BLOCK`/`REPORT` 5개 테이블 범위를 넘지 않는다.

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): (기반 인프라, REQ-FUNC-029, 031, 034, 040, 039의 저장소 전제)
- 정규화된 Requirement ID: REQ-FUNC-029, REQ-FUNC-031, REQ-FUNC-034, REQ-FUNC-040, REQ-FUNC-039

## Screen / Route / Page Entry
- Screen: —
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
— (없음)

## Expected Files
`supabase/migrations/0001_schema.sql`

## Functional AC
- `docs/PROJECT_SCOPE.md` §5에 정의된 **5개 테이블만** 생성한다: `USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`. `AUDIT_LOG` 등 6번째 테이블은 만들지 않는다.
  - `USER_PROFILE`: `user_id`(PK/FK auth.users), `nickname`(UNIQUE), `is_adult`, `adult_verified_at`, `age_band`, `gender`(optional), `travel_styles`, `bio`, `status`.
  - `MATE_POST`: `post_id`, `owner_id`, `country_id/region_id`(정적 데이터의 코드 참조), `start_date`, `end_date`, `capacity`, `preferences`, `travel_styles`, `title`, `description`, `status`(OPEN/CLOSED/HIDDEN/DELETED), `created_at`.
  - `MATE_APPLICATION`: `application_id`, `post_id`, `applicant_id`, `message`(500자 제한), `status`(PENDING/ACCEPTED/REJECTED/WITHDRAWN), `created_at`.
  - `USER_BLOCK`: `blocker_id`, `blocked_id`, `created_at`(쌍 UNIQUE).
  - `REPORT`: `report_id`, `reporter_id`, `target_type`, `target_id`, `reason_code`, `description`, `status`(OPEN/RESOLVED/DISMISSED), `created_at`, `resolved_at`.
  - `USER_PROFILE.age_band`가 아닌 정확한 생년월일 컬럼은 만들지 않는다(REQ-FUNC-028 전제).

## Visual AC
해당 없음.

## Security/Privacy AC
생년월일 원본을 저장하는 컬럼을 두지 않는다. 이메일 등 인증 정보는 Supabase `auth.users`에만 두고 커스텀 테이블에 중복 저장하지 않는다.

## Test Cases
- [Functional AC] `docs/PROJECT_SCOPE.md` §5에 정의된 **5개 테이블만** 생성한다: `USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`. `AUDIT_LOG` 등 6번째 테이블은 만들지 않는다. — Verify: 코드 리뷰(스키마), TEST-RLS-BASIC
- [Functional AC] `USER_PROFILE`: `user_id`(PK/FK auth.users), `nickname`(UNIQUE), `is_adult`, `adult_verified_at`, `age_band`, `gender`(optional), `travel_styles`, `bio`, `status`. — Verify: 코드 리뷰(스키마), TEST-RLS-BASIC
- [Functional AC] `MATE_POST`: `post_id`, `owner_id`, `country_id/region_id`(정적 데이터의 코드 참조), `start_date`, `end_date`, `capacity`, `preferences`, `travel_styles`, `title`, `description`, `status`(OPEN/CLOSED/HIDDEN/DELETED), `created_at`. — Verify: 코드 리뷰(스키마), TEST-RLS-BASIC
- [Functional AC] `MATE_APPLICATION`: `application_id`, `post_id`, `applicant_id`, `message`(500자 제한), `status`(PENDING/ACCEPTED/REJECTED/WITHDRAWN), `created_at`. — Verify: 코드 리뷰(스키마), TEST-RLS-BASIC
- [Security/Privacy AC] 생년월일 원본을 저장하는 컬럼을 두지 않는다. 이메일 등 인증 정보는 Supabase `auth.users`에만 두고 커스텀 테이블에 중복 저장하지 않는다. — Verify: 코드 리뷰(스키마), TEST-RLS-BASIC

## Verify
코드 리뷰(스키마), TEST-RLS-BASIC

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`코드 리뷰(스키마), TEST-RLS-BASIC`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
- `USER_PROFILE`/`MATE_POST`/`MATE_APPLICATION`/`USER_BLOCK`/`REPORT` 외 추가 테이블(예: 범용 감사 로그 테이블)을 만들지 않는다.
