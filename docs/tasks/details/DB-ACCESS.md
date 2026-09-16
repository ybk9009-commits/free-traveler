# DB-ACCESS — Supabase Client/Server 접근 유틸

```task-meta
{
  "task_id": "DB-ACCESS",
  "type": "db",
  "depends_on": [
    "DB-SCHEMA-BASE"
  ],
  "requirements": [],
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
이 Task는 여러 화면 또는 인프라 계층에서 공통으로 소비되는 기반 요소이 필요로 하는 'Supabase Client/Server 접근 유틸' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙(최소 RLS), §5 데이터 모델 매핑(5개 테이블 고정) `USER_PROFILE`/`MATE_POST`/`MATE_APPLICATION`/`USER_BLOCK`/`REPORT` 5개 테이블 범위를 넘지 않는다.

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): (모든 Supabase 쓰기 Task의 공통 기반)
- 정규화된 Requirement ID: — (없음, 조립/기반 Task)

## Screen / Route / Page Entry
- Screen: —
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- DB-SCHEMA-BASE

## Expected Files
`src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`

## Functional AC
- Server Component/Route Handler용 클라이언트와 Client Component용 클라이언트를 분리 제공한다.
  - 환경변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)는 서버 전용 변수와 공개 변수를 명확히 분리한다.

## Visual AC
해당 없음.

## Security/Privacy AC
`SUPABASE_SERVICE_ROLE_KEY`는 클라이언트 번들에 포함되지 않는다(REQ-NF-016).

## Test Cases
- [Functional AC] Server Component/Route Handler용 클라이언트와 Client Component용 클라이언트를 분리 제공한다. — Verify: 코드 리뷰, 빌드 산출물에서 시크릿 노출 검사
- [Functional AC] 환경변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)는 서버 전용 변수와 공개 변수를 명확히 분리한다. — Verify: 코드 리뷰, 빌드 산출물에서 시크릿 노출 검사
- [Security/Privacy AC] `SUPABASE_SERVICE_ROLE_KEY`는 클라이언트 번들에 포함되지 않는다(REQ-NF-016). — Verify: 코드 리뷰, 빌드 산출물에서 시크릿 노출 검사

## Verify
코드 리뷰, 빌드 산출물에서 시크릿 노출 검사

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`코드 리뷰, 빌드 산출물에서 시크릿 노출 검사`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
