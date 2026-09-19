-- 0005_grant_table_privileges — anon/authenticated 기본 테이블 권한 부여
-- 0001~0004 적용 후 실측 결과, 이 프로젝트에는 Supabase가 보통 자동으로
-- 구성하는 anon/authenticated에 대한 public 스키마 테이블 기본 GRANT가
-- 없었다(TRUNCATE/TRIGGER/REFERENCES만 있고 SELECT/INSERT/UPDATE/DELETE가
-- 전혀 없어 모든 질의가 42501 permission denied로 실패). RLS 정책
-- (0002_rls.sql)은 GRANT가 이미 있다는 전제로 작성되어 있다 — Postgres에서는
-- GRANT가 먼저 통과해야 그 다음에 RLS가 행 단위로 걸러낸다.

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on
  public.user_profile,
  public.mate_post,
  public.mate_application,
  public.user_block,
  public.report,
  public.app_settings
to anon, authenticated;

-- app_settings는 이 GRANT 이후에도 RLS(0003_admin_settings.sql)가 정책을
-- 하나도 두지 않아 anon/authenticated에게는 여전히 전면 차단 상태다 —
-- Service Role만 RLS를 우회해 읽고 쓴다.

-- 앞으로 새 테이블을 만들 때도 이 프로젝트에서 같은 문제가 반복되지 않도록
-- 기본 권한을 등록해 둔다.
alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated;
