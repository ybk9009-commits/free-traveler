# API-ADMIN-SETTINGS — 신고 상태 변경·외부 URL 설정

```task-meta
{
  "task_id": "API-ADMIN-SETTINGS",
  "type": "api",
  "depends_on": [
    "DB-SCHEMA-BASE",
    "DB-RLS-BASE",
    "DB-ACCESS",
    "INFRA-AUTH-SESSION",
    "INFRA-INPUT-VALIDATION"
  ],
  "requirements": [
    "REQ-FUNC-041",
    "REQ-FUNC-042",
    "REQ-FUNC-077"
  ],
  "tables": [
    "ADMIN_SETTINGS"
  ]
}
```

> **2026-09-17 정정**: `docs/PROJECT_SCOPE.md` 235행(정본)은 관리자 외부 URL 허용목록을 Supabase 테이블 `app_settings`(RLS로 클라이언트 직접 접근 차단, 서버 전용 Route Handler만 Service Role로 읽고 씀)에 저장하도록 명시하지만, 이 테이블이 `DB-SCHEMA-BASE`/`DB-RLS-BASE` 어디에도 만들어져 있지 않았다. 이 Task가 유일한 소비자이므로 `supabase/migrations/0003_admin_settings.sql`(테이블 생성 + RLS 전면 차단 정책)을 이 Task의 Expected Files에 추가해 직접 만든다.

## Context

이 Task는 SCR-005 화면이 필요로 하는 '신고 상태 변경·외부 URL 설정' 기능을 제공한다. Implementation Status가 `IMPLEMENT(간소화)`인 것은 관리자 범위를 신고 처리·외부 URL 설정으로 한정하는 원칙(docs/PROJECT_SCOPE.md §2)에 따라 기능을 간소화했다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙, §3 REQ-FUNC 요구사항 처리

## Requirement Ref

- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-077
- 정규화된 Requirement ID: REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-077

## Screen / Route / Page Entry

- Screen: SCR-005
- Route: —
- Page Entry: —

## Design Ref

해당 없음(비-UI Task).

## Depends On

- DB-SCHEMA-BASE
- DB-RLS-BASE
- DB-ACCESS
- INFRA-AUTH-SESSION
- INFRA-INPUT-VALIDATION

## Expected Files

`supabase/migrations/0003_admin_settings.sql`(`app_settings` 테이블 + RLS 전면 차단 정책, 신규), `src/app/api/admin/reports/[id]/route.ts`(PATCH), `src/app/api/admin/settings/route.ts`(GET/PATCH)

## Functional AC

- 신고 상태(OPEN/RESOLVED/DISMISSED) 변경과 신고 대상 게시물 숨김만 지원한다. 경고·계정 일시제한 기능은 만들지 않는다(REQ-FUNC-042 간소화 범위).
  - `FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL` 등 외부 URL은 **HTTPS 허용목록 내**에서만 `app_settings` 테이블(`key`/`value`)에 저장 가능하다. `http://`, `javascript:`, `data:` URL은 저장을 거부한다(REQ-FUNC-077).
  - `app_settings`는 RLS로 클라이언트 직접 접근이 전면 차단되어 있으므로, 이 Route Handler는 Supabase Server Client(Service Role, `DB-ACCESS`의 `createSupabaseServiceRoleClient`)로만 읽고 쓴다.
  - 콘텐츠 CRUD(여행지/안전정보 관리 탭)는 만들지 않는다(EXCLUDED REQ-FUNC-072 범위 밖).

## Visual AC

해당 없음(관리 UI는 CMP-SCR-005-admin).

## Security/Privacy AC

Moderator/Admin 역할만 호출 가능(비권한 호출 403). `app_settings.updated_by`에 변경자만 기록하고, 그 외 상세 감사 로그(before/after 등)는 만들지 않는다(REQ-FUNC-076 EXCLUDED, 최소한의 `status`/`updated_at`/`updated_by`만 기록).

## Test Cases

- [Functional AC] 신고 상태(OPEN/RESOLVED/DISMISSED) 변경과 신고 대상 게시물 숨김만 지원한다. 경고·계정 일시제한 기능은 만들지 않는다(REQ-FUNC-042 간소화 범위). — Verify: TEST-RLS-BASIC, TEST-E2E-MATE-AUTH
- [Functional AC] `FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL` 등 외부 URL은 **HTTPS 허용목록 내**에서만 저장 가능하다. `http://`, `javascript:`, `data:` URL은 저장을 거부한다(REQ-FUNC-077). — Verify: TEST-RLS-BASIC, TEST-E2E-MATE-AUTH
- [Functional AC] 콘텐츠 CRUD(여행지/안전정보 관리 탭)는 만들지 않는다(EXCLUDED REQ-FUNC-072 범위 밖). — Verify: TEST-RLS-BASIC, TEST-E2E-MATE-AUTH
- [Security/Privacy AC] Moderator/Admin 역할만 호출 가능(비권한 호출 403). 상세 감사 로그(before/after 등)는 만들지 않는다(REQ-FUNC-076 EXCLUDED, 최소한의 `status`/`updated_at`만 기록). — Verify: TEST-RLS-BASIC, TEST-E2E-MATE-AUTH

## Verify

TEST-RLS-BASIC, TEST-E2E-MATE-AUTH

## Definition of Done

- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-RLS-BASIC, TEST-E2E-MATE-AUTH`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden

- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
