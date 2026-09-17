-- API-ADMIN-SETTINGS — 관리자 외부 URL 허용목록 테이블
-- docs/PROJECT_SCOPE.md 235행(정본): 관리자 외부 URL 허용목록은 Supabase
-- PostgreSQL 테이블 app_settings에 저장하며, RLS로 클라이언트 직접 접근을
-- 전면 차단하고 서버 전용 Route Handler(Service Role)만 읽고 쓴다.
-- (2026-09-17: DB-SCHEMA-BASE/DB-RLS-BASE 정정에 따라 이 Task가 직접 만든다.)

create table public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.user_profile (user_id)
);

comment on table public.app_settings is
  'FLIGHT_OUTBOUND_URL/HOTEL_OUTBOUND_URL 등 관리자 외부 URL 허용목록만 저장한다. 콘텐츠 CRUD용 테이블이 아니다.';

alter table public.app_settings enable row level security;

-- 클라이언트(anon/authenticated) 접근을 전면 차단한다 — 별도 정책을 추가하지
-- 않는 것 자체가 "모두 거부"를 의미한다(Postgres RLS 기본값). 이 주석은 그
-- 의도가 실수로 빠진 정책이 아님을 명확히 하기 위한 것이다. 값은 오직
-- Service Role 키를 쓰는 서버 전용 Route Handler(API-ADMIN-SETTINGS)만 읽고
-- 쓴다 — Service Role은 RLS 자체를 우회하므로 여기에 별도 정책이 필요 없다.
