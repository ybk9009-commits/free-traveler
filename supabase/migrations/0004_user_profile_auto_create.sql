-- 0004_user_profile_auto_create — 회원가입 시 USER_PROFILE 자동 생성
-- DB-SCHEMA-BASE(0001)에는 auth.users에 대한 트리거가 없고, DB-RLS-BASE(0002)의
-- USER_PROFILE에는 INSERT 정책이 하나도 없어(SELECT/UPDATE만 존재) 실제
-- 회원가입 사용자는 프로필 행이 영원히 생기지 않고(본인이 직접 INSERT하려
-- 해도 RLS가 막는다), 그 결과 성인확인·동행글 작성·프로필 편집 등 회원
-- 기능 전체가 작동하지 않았다. TEST-RLS-BASIC 작성 중 발견됨.

-- 본인이 자신의 프로필 행을 직접 만드는 경로도 방어적으로 열어 둔다
-- (트리거가 어떤 이유로 실패하거나 과거 계정을 보정해야 할 때 대비).
create policy "user_profile_insert_own" on public.user_profile
  for insert
  with check (auth.uid() = user_id);

-- auth.users에 새 행이 생기면 같은 트랜잭션에서 user_profile을 함께 만든다.
-- SECURITY DEFINER로 실행해 RLS(INSERT 정책은 auth.uid()=user_id를 요구하지만,
-- 트리거 실행 시점엔 세션의 auth.uid()가 아직 설정되지 않을 수 있다)와 무관하게
-- 항상 성공하도록 한다. 닉네임 초기값 외의 어떤 개인정보도 다루지 않는다.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profile (user_id, nickname)
  values (new.id, 'traveler_' || substr(new.id::text, 1, 8))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
