-- DB-SCHEMA-BASE — Supabase 테이블 스키마(5종)
-- docs/PROJECT_SCOPE.md §5에 정의된 5개 테이블만 생성한다.
-- USER_PROFILE / MATE_POST / MATE_APPLICATION / USER_BLOCK / REPORT 외
-- 추가 테이블(범용 감사 로그 등)은 만들지 않는다.
--
-- RLS 활성화·정책은 이 파일의 범위가 아니다(DB-RLS-BASE, W04에서 별도 처리).
-- country_code/region_code는 Supabase 테이블이 아닌 src/data(정적 TypeScript)의
-- 코드 값을 참조하는 일반 텍스트 컬럼이며, FK 제약을 두지 않는다.

create table public.user_profile (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null unique,
  is_adult boolean not null default false,
  adult_verified_at timestamptz,
  age_band text check (
    age_band is null
    or age_band in ('10s', '20s', '30s', '40s', '50s', '60+')
  ),
  gender text,
  travel_styles text[] not null default '{}',
  bio text check (char_length(bio) <= 1000),
  status text not null default 'ACTIVE' check (
    status in ('ACTIVE', 'SUSPENDED', 'DELETED')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.user_profile is
  '생년월일 원본은 저장하지 않는다(age_band만 보관). 이메일 등 인증 정보는 auth.users에만 둔다.';

create table public.mate_post (
  post_id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.user_profile (user_id) on delete cascade,
  country_code varchar(2) not null,
  region_code text,
  start_date date not null,
  end_date date not null,
  capacity integer not null check (capacity > 0),
  preferences jsonb not null default '{}'::jsonb,
  travel_styles text[] not null default '{}',
  title text not null check (char_length(title) <= 100),
  description text not null check (char_length(description) <= 2000),
  status text not null default 'OPEN' check (
    status in ('OPEN', 'CLOSED', 'HIDDEN', 'DELETED')
  ),
  created_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create index mate_post_owner_id_idx on public.mate_post (owner_id);
create index mate_post_status_idx on public.mate_post (status);

create table public.mate_application (
  application_id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.mate_post (post_id) on delete cascade,
  applicant_id uuid not null references public.user_profile (user_id) on delete cascade,
  message text not null check (char_length(message) <= 500),
  status text not null default 'PENDING' check (
    status in ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN')
  ),
  created_at timestamptz not null default now(),
  unique (post_id, applicant_id)
);

create index mate_application_post_id_idx on public.mate_application (post_id);

create table public.user_block (
  blocker_id uuid not null references public.user_profile (user_id) on delete cascade,
  blocked_id uuid not null references public.user_profile (user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create table public.report (
  report_id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.user_profile (user_id) on delete cascade,
  target_type text not null check (
    target_type in ('USER', 'MATE_POST', 'MATE_APPLICATION')
  ),
  target_id uuid not null,
  reason_code text not null,
  description text check (char_length(description) <= 2000),
  status text not null default 'OPEN' check (
    status in ('OPEN', 'RESOLVED', 'DISMISSED')
  ),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index report_target_idx on public.report (target_type, target_id);
