# TASK-API-ADMIN-SETTINGS — 신고 상태 변경·외부 URL 설정

- **Category:** API
- **Implementation Status:** IMPLEMENT(간소화)
- **Requirement Ref:** REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-077
- **Screen:** SCR-005
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, INFRA-AUTH-SESSION, INFRA-INPUT-VALIDATION
- **Expected Files:** `src/app/api/admin/reports/[id]/route.ts`(PATCH), `src/app/api/admin/settings/route.ts`(GET/PATCH)
- **Functional AC:**
  - 신고 상태(OPEN/RESOLVED/DISMISSED) 변경과 신고 대상 게시물 숨김만 지원한다. 경고·계정 일시제한 기능은 만들지 않는다(REQ-FUNC-042 간소화 범위).
  - `FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL` 등 외부 URL은 **HTTPS 허용목록 내**에서만 `app_settings` 테이블(`key`/`value`)에 저장 가능하다. `http://`, `javascript:`, `data:` URL은 저장을 거부한다(REQ-FUNC-077).
  - `app_settings`는 RLS로 클라이언트 직접 접근이 전면 차단되어 있으므로, 이 Route Handler는 Supabase Server Client(Service Role)로만 읽고 쓴다(`DB-ACCESS`).
  - 콘텐츠 CRUD(여행지/안전정보 관리 탭)는 만들지 않는다(EXCLUDED REQ-FUNC-072 범위 밖).
- **Visual AC:** 해당 없음(관리 UI는 CMP-SCR005-ADMIN).
- **Security/Privacy AC:** Moderator/Admin 역할만 호출 가능(비권한 호출 403). `app_settings.updated_by`에 변경자만 기록하고, 그 외 상세 감사 로그(before/after 등)는 만들지 않는다(REQ-FUNC-076 EXCLUDED, 최소한의 `status`/`updated_at`/`updated_by`만 기록).
- **Verify:** TEST-RLS-BASIC, E2E-MATE-AUTH
- **Priority:** P2
