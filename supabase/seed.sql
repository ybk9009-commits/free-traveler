-- DB-SEED-BASE — 개발·테스트 시드 데이터
-- Supabase CLI 로컬 스택(`supabase start` + `supabase db reset`)에서만 사용한다.
-- 실제 개인정보를 포함하지 않는다(가짜 닉네임·이메일·메시지만 사용, .test 도메인 사용).
-- DB-SCHEMA-BASE(0001_schema.sql)가 먼저 적용되어 있어야 한다.

-- 2명 이상의 인증 사용자(auth.users)를 시드한다.
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'mate-seed-owner@example.test',
    crypt('seed-password-owner', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'mate-seed-applicant@example.test',
    crypt('seed-password-applicant', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}'
  )
on conflict (id) do nothing;

insert into public.user_profile (
  user_id, nickname, is_adult, adult_verified_at, age_band,
  travel_styles, bio, status
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    '여행좋아하는동글이',
    true,
    now(),
    '30s',
    array['배낭여행', '맛집투어'],
    'seed 데이터용 프로필입니다. 실제 사용자가 아닙니다.',
    'ACTIVE'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '햇살가득여행자',
    true,
    now(),
    '20s',
    array['휴양', '사진여행'],
    'seed 데이터용 프로필입니다. 실제 사용자가 아닙니다.',
    'ACTIVE'
  )
on conflict (user_id) do nothing;

-- 모집중 1건 + 마감 1건.
insert into public.mate_post (
  post_id, owner_id, country_code, region_code, start_date, end_date,
  capacity, preferences, travel_styles, title, description, status
)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'TH', 'bangkok',
    current_date + interval '30 days', current_date + interval '35 days',
    3,
    '{"genderPreference": "ANY", "minAge": 20}'::jsonb,
    array['배낭여행'],
    'seed 방콕 동행 모집(모집중)',
    'seed 테스트용 모집글 설명입니다. 실제 여행 정보가 아닙니다.',
    'OPEN'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    'JP', 'tokyo',
    current_date - interval '10 days', current_date - interval '5 days',
    2,
    '{"genderPreference": "ANY"}'::jsonb,
    array['맛집투어'],
    'seed 도쿄 동행 모집(마감)',
    'seed 테스트용 모집글 설명입니다. 실제 여행 정보가 아닙니다.',
    'CLOSED'
  )
on conflict (post_id) do nothing;

-- 참가 신청 1건.
insert into public.mate_application (
  application_id, post_id, applicant_id, message, status
)
values
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '22222222-2222-2222-2222-222222222222',
    'seed 테스트용 신청 메시지입니다. 실제 사용자가 아닙니다.',
    'PENDING'
  )
on conflict (application_id) do nothing;

-- 차단 1건.
insert into public.user_block (blocker_id, blocked_id)
values (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222'
)
on conflict (blocker_id, blocked_id) do nothing;

-- 신고 1건.
insert into public.report (
  report_id, reporter_id, target_type, target_id, reason_code, description, status
)
values (
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '22222222-2222-2222-2222-222222222222',
  'MATE_POST',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'SPAM',
  'seed 테스트용 신고 설명입니다. 실제 신고가 아닙니다.',
  'OPEN'
)
on conflict (report_id) do nothing;
