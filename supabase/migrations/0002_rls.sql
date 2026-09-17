-- DB-RLS-BASE — Supabase RLS 정책
-- 최소 RLS 원칙(docs/PROJECT_SCOPE.md §1)에 따라 "회원 전용 쓰기 경로 보호"를
-- 최우선 목표로 하며, 열(column) 단위 공개 범위 제한은 애플리케이션 레벨의
-- select 필드 제한에 맡긴다(행 단위 RLS만 다룬다).

alter table public.user_profile enable row level security;
alter table public.mate_post enable row level security;
alter table public.mate_application enable row level security;
alter table public.user_block enable row level security;
alter table public.report enable row level security;

-- Moderator/Admin 역할은 USER_PROFILE이 아닌 Supabase custom claims
-- (auth.users.raw_app_meta_data → JWT의 app_metadata)로 판별한다.
create or replace function public.is_moderator_or_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('MODERATOR', 'ADMIN'),
    false
  );
$$;

-- USER_PROFILE: 공개 필드(닉네임/스타일 등)는 누구나 SELECT 가능, 본인만 UPDATE.
create policy "user_profile_select_public" on public.user_profile
  for select
  using (true);

create policy "user_profile_update_own" on public.user_profile
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- MATE_POST: DELETED가 아닌 글은 누구나 SELECT 가능(차단 필터는 애플리케이션 레벨),
-- 작성자만 쓰기/수정/삭제.
create policy "mate_post_select_not_deleted" on public.mate_post
  for select
  using (status <> 'DELETED');

create policy "mate_post_insert_own" on public.mate_post
  for insert
  with check (auth.uid() = owner_id);

create policy "mate_post_update_own" on public.mate_post
  for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "mate_post_delete_own" on public.mate_post
  for delete
  using (auth.uid() = owner_id);

-- MATE_APPLICATION: 신청자 본인과 대상 글 작성자만 SELECT, 신청자만 INSERT,
-- 글 작성자만 상태 UPDATE.
create policy "mate_application_select_participant" on public.mate_application
  for select
  using (
    auth.uid() = applicant_id
    or auth.uid() = (
      select owner_id from public.mate_post where post_id = mate_application.post_id
    )
  );

create policy "mate_application_insert_applicant" on public.mate_application
  for insert
  with check (auth.uid() = applicant_id);

create policy "mate_application_update_post_owner" on public.mate_application
  for update
  using (
    auth.uid() = (
      select owner_id from public.mate_post where post_id = mate_application.post_id
    )
  )
  with check (
    auth.uid() = (
      select owner_id from public.mate_post where post_id = mate_application.post_id
    )
  );

-- USER_BLOCK: 본인(blocker_id)만 SELECT/INSERT/DELETE.
create policy "user_block_select_own" on public.user_block
  for select
  using (auth.uid() = blocker_id);

create policy "user_block_insert_own" on public.user_block
  for insert
  with check (auth.uid() = blocker_id);

create policy "user_block_delete_own" on public.user_block
  for delete
  using (auth.uid() = blocker_id);

-- REPORT: 신고자 본인과 Moderator/Admin만 SELECT, 신고자만 INSERT,
-- Moderator/Admin만 상태 UPDATE.
create policy "report_select_reporter_or_moderator" on public.report
  for select
  using (auth.uid() = reporter_id or public.is_moderator_or_admin());

create policy "report_insert_reporter" on public.report
  for insert
  with check (auth.uid() = reporter_id);

create policy "report_update_moderator" on public.report
  for update
  using (public.is_moderator_or_admin())
  with check (public.is_moderator_or_admin());
