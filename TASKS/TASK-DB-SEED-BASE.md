# TASK-DB-SEED-BASE — 개발·테스트 시드 데이터

- **Category:** DB
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** (테스트 지원, REQ-FUNC-027~045 검증 전제)
- **Screen:** —
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE
- **Expected Files:** `supabase/seed.sql`
- **Functional AC:**
  - 각 테이블에 테스트용 최소 데이터(회원 2명 이상, 모집글 2건 이상 — 모집중/마감 각 1건, 신청 1건, 차단 1건, 신고 1건, `app_settings`에 `FLIGHT_OUTBOUND_URL`/`HOTEL_OUTBOUND_URL` 각 1행)를 넣는다.
  - `TEST-RLS-BASIC`, `E2E-MATE-AUTH`가 재현 가능하게 실행되도록 시드 초기화 스크립트(`npm run db:seed`)를 제공한다.
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 시드 데이터는 실제 개인정보를 포함하지 않는다(가짜 닉네임·메시지만 사용).
- **Verify:** TEST-RLS-BASIC, E2E-MATE-AUTH 실행으로 검증
- **Priority:** P1
