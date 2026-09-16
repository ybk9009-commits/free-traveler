# Traveler Task List

- **Document ID:** TASKS-TRAVEL-001
- **기반 문서:** `docs/02_SRS_BASELINE.md.md`(REQ-FUNC-001~080, REQ-NF-001~034 원문), `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`, `design-reference/D-001/DESIGN.md`(`Status: LOCKED`), `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, 현재 `src/app` 파일 트리(`page.tsx`, `layout.tsx`, `globals.css`만 존재 — 스타터 템플릿 상태)
- **선행 검사**: `python scripts/validate_inputs.py` 실행 결과 `VALIDATE_INPUTS_PASS`, 검사 수 `11/11` (전체 로그는 본 작업 세션 기록 참조). 이 결과가 있어야만 아래 Task List를 작성한다.
- **범위**: 이 문서는 Task 목록만 정의한다. 구현 코드, Git Branch, Commit, Issue는 이 작업에서 만들지 않는다.

---

## 0. 요약

| 항목 | 값 |
|---|---:|
| 전체 Task 수 | **70** |
| Page Owner Task | 5 |
| Component Task | 35 (Screen 전용 27 + 공통 8) |
| Data Task | 3 |
| DB Task | 4 |
| API Task | 5 |
| Infra Task | 6 |
| Test Task | 9 (Unit 3 / Integration 1 / E2E 3 / A11y 1 / Data Validation 1) |
| CI Task | 2 |
| Release Check Task | 1 |

| Requirement 커버리지 | 값 |
|---|---:|
| REQ-FUNC 전체 | 80 |
| REQ-NF 전체 | 34 |
| **합계** | **114** |
| IMPLEMENT 계열(Task 연결됨) | 96 (FUNC 73 + NF 23) |
| EXCLUDED(NON_IMPLEMENTATION 표에 근거·후속방향 기록, 삭제 아님) | 18 (FUNC 7 + NF 11) |
| **빠진 Requirement ID** | **없음** — §7 Requirement Traceability에서 114개 전수 확인 |

Category 정의: **Page Owner**(Screen 1개를 조립) · **Component**(Section/기능 단위 실제 구현) · **Data**(정적 데이터, `src/data`) · **DB**(Supabase 스키마·RLS·접근) · **API**(Route Handler/Server Action) · **Infra**(인증·검증·유틸 등 횡단 관심사) · **Test**(Unit/Integration/E2E/A11y/데이터검증) · **CI**(Lint·Typecheck·배포 파이프라인) · **Release Check**(브라우저 수동 확인).

---

## 1. Task 목록 요약표

| Seq | Task ID | 제목 | Category | Screen | Priority |
|---:|---|---|---|---|---|
| 1 | DATA-DESTINATIONS | 여행지 정적 데이터 | Data | — | P0 |
| 2 | DATA-SAFETY | 국가 안전정보 정적 데이터 | Data | — | P0 |
| 3 | DATA-REPRESENTATIVE | 대표 소개 정적 데이터 | Data | — | P0 |
| 4 | DB-SCHEMA-BASE | Supabase 테이블 스키마(6종) | DB | — | P0 |
| 5 | DB-RLS-BASE | Supabase RLS 정책 | DB | — | P0 |
| 6 | DB-ACCESS | Supabase Client/Server 접근 유틸 | DB | — | P0 |
| 7 | DB-SEED-BASE | 개발·테스트 시드 데이터 | DB | — | P1 |
| 8 | INFRA-AUTH-SESSION | Supabase Auth 세션·이메일 인증 | Infra | — | P0 |
| 9 | INFRA-ADULT-VERIFICATION | 성인확인 플래그 처리 | Infra | — | P1 |
| 10 | INFRA-CONTACT-DETECTION | 공개 연락처 탐지 유틸 | Infra | — | P1 |
| 11 | INFRA-USER-DELETE | 탈퇴 시 즉시 비식별화 | Infra | — | P1 |
| 12 | INFRA-EXTERNAL-LINK-SAFETY | 외부 링크 새 탭·noopener 공용 유틸 | Infra | — | P1 |
| 13 | INFRA-INPUT-VALIDATION | 서버 입력 검증·이스케이프 공통 스키마 | Infra | — | P1 |
| 14 | API-MATE-POSTS | 동행 모집글 생성·수정·마감·삭제 | API | SCR-003/SCR-005 | P1 |
| 15 | API-MATE-APPLICATIONS | 참가 요청 생성·승인·거절 | API | SCR-004/SCR-005 | P1 |
| 16 | API-BLOCKS | 사용자 차단·해제 | API | SCR-004/SCR-005 | P1 |
| 17 | API-REPORTS | 신고 접수 | API | SCR-004 | P1 |
| 18 | API-ADMIN-SETTINGS | 신고 상태 변경·외부 URL 설정 | API | SCR-005 | P2 |
| 19 | CMP-SCR001-HERO-SEARCH | Hero 통합 검색 | Component | SCR-001 | P1 |
| 20 | CMP-SCR001-DESTINATION-GRID | 국내·해외 여행지 Card Grid + 테마 필터 | Component | SCR-001 | P1 |
| 21 | CMP-SCR001-DESTINATION-DETAIL-DRAWER | 여행지 상세 Drawer | Component | SCR-001 | P1 |
| 22 | CMP-SCR001-SAFETY-SECTION | 국가별 안전정보 Card + 상세 Drawer | Component | SCR-001 | P1 |
| 23 | CMP-SCR001-RECENT-MATES | 최근 동행 카드 3개/Empty State | Component | SCR-001 | P2 |
| 24 | CMP-SCR001-ABOUT-SUMMARY | 대표 소개 요약 카드 | Component | SCR-001 | P2 |
| 25 | CMP-SCR002-HERO-PROFILE | 대표 소개 Hero | Component | SCR-002 | P2 |
| 26 | CMP-SCR002-STATS-STORY | 여행 지표 + 소개·철학 | Component | SCR-002 | P2 |
| 27 | CMP-SCR002-TIMELINE | 여행 타임라인 6개 | Component | SCR-002 | P2 |
| 28 | CMP-SCR002-COUNTRIES-GALLERY | 방문 국가 30개 + 사진 Gallery 8개 | Component | SCR-002 | P2 |
| 29 | CMP-SCR002-FAVORITE-DESTINATIONS-CTA | 기억에 남는 여행지 4개 + CTA | Component | SCR-002 | P2 |
| 30 | CMP-SCR003-INTRO-TABS | Intro 3단계 안내 + 탭 Shell | Component | SCR-003 | P1 |
| 31 | CMP-SCR003-FLIGHT-FORM | 항공 조건 입력·요약·외부 이동 | Component | SCR-003 | P1 |
| 32 | CMP-SCR003-HOTEL-FORM | 숙소 조건 입력·요약·외부 이동 | Component | SCR-003 | P1 |
| 33 | CMP-SCR003-MATE-WRITE-FORM | 동행 모집글 작성 / 로그인 안내 | Component | SCR-003 | P1 |
| 34 | CMP-SCR004-INTRO-CTA | Intro + 새 글 작성 CTA Banner | Component | SCR-004 | P2 |
| 35 | CMP-SCR004-FILTER | 검색 Filter + 결과 요약 | Component | SCR-004 | P1 |
| 36 | CMP-SCR004-LIST | 동행 목록 Card Grid | Component | SCR-004 | P1 |
| 37 | CMP-SCR004-DETAIL | 동행 상세 패널 | Component | SCR-004 | P1 |
| 38 | CMP-SCR004-APPLY | 참가 메시지 신청 폼 | Component | SCR-004 | P1 |
| 39 | CMP-SCR004-REPORT | 신고 모달 | Component | SCR-004 | P2 |
| 40 | CMP-SCR004-BLOCK | 차단 버튼·확인 | Component | SCR-004 | P2 |
| 41 | CMP-SCR004-GUIDANCE-SAFETY | 신청 방법 3단계 + 안전 안내 CTA | Component | SCR-004 | P2 |
| 42 | CMP-SCR005-AUTH | Guest 인증 Card(로그인/가입/재설정) | Component | SCR-005 | P1 |
| 43 | CMP-SCR005-PROFILE | Member 프로필 탭 | Component | SCR-005 | P1 |
| 44 | CMP-SCR005-MY-ACTIVITY | Member 내 활동 탭 | Component | SCR-005 | P1 |
| 45 | CMP-SCR005-ADMIN | Admin 관리 영역(신고 큐·외부 URL) | Component | SCR-005 | P2 |
| 46 | CMP-COMMON-HEADER-FOOTER | 전역 Header/Footer(`layout.tsx`) | Component | 공통 | P0 |
| 47 | CMP-COMMON-RESPONSIVE-LAYOUT | 320px~Desktop 반응형 레이아웃 규칙 | Component | 공통 | P0 |
| 48 | CMP-COMMON-SEO-METADATA | Next Metadata API 공통 적용 | Component | 공통 | P2 |
| 49 | CMP-COMMON-FAVORITES-SHARE | 즐겨찾기(localStorage) + URL 공유 훅 | Component | 공통 | P1 |
| 50 | CMP-COMMON-TOAST | Toast 알림(성공/오류) | Component | 공통 | P1 |
| 51 | CMP-COMMON-EMPTY-STATE | 완성형 Empty State 공용 컴포넌트 | Component | 공통 | P1 |
| 52 | CMP-COMMON-ERROR-BOUNDARIES | 404/500/권한없음/외부연결실패 경계 | Component | 공통 | P1 |
| 53 | CMP-COMMON-ARIA-PATTERNS | 폼·모달·탭·알림 공용 ARIA 패턴 | Component | 공통 | P1 |
| 54 | PAGE-SCR001 | 메인 화면 조립 | Page Owner | SCR-001 | P1 |
| 55 | PAGE-SCR002 | 대표 소개 화면 조립 | Page Owner | SCR-002 | P1 |
| 56 | PAGE-SCR003 | 통합 여행 준비 화면 조립 | Page Owner | SCR-003 | P1 |
| 57 | PAGE-SCR004 | 동행 조회 화면 조립 | Page Owner | SCR-004 | P1 |
| 58 | PAGE-SCR005 | 계정·관리 화면 조립 | Page Owner | SCR-005 | P1 |
| 59 | UNIT-TRAVEL-DATES | 날짜 검증 Unit Test | Test | — | P1 |
| 60 | UNIT-CONTACT-DETECTION | 연락처 탐지 Unit Test | Test | — | P1 |
| 61 | UNIT-MATE-STATE | 모집글/신청 상태 전이 Unit Test | Test | — | P1 |
| 62 | TEST-RLS-BASIC | RLS 정책 기본 Integration Test | Test | — | P1 |
| 63 | TEST-A11Y-AXE | axe-core 자동 접근성 검사 | Test | — | P2 |
| 64 | TEST-DATA-VALIDATION | 정적 데이터 완전성·수량 검증 스크립트 | Test | — | P1 |
| 65 | E2E-PUBLIC-SMOKE | 공개 흐름 E2E(여행지·안전정보·대표소개) | Test | SCR-001/SCR-002 | P2 |
| 66 | E2E-TRAVEL-TOOLS | 항공·호텔 흐름 E2E | Test | SCR-003 | P2 |
| 67 | E2E-MATE-AUTH | 인증·동행·신고·관리자 흐름 E2E | Test | SCR-003/004/005 | P2 |
| 68 | CI-LINT-TYPECHECK-DATA | Lint·Typecheck·데이터검증 CI 게이트 | CI | — | P1 |
| 69 | DEPLOY-VERCEL-SUPABASE-CHECK | Vercel/Supabase 배포·환경 확인 | CI | — | P2 |
| 70 | RELEASE-CHECK-MANUAL | 브라우저 수동 릴리스 점검 | Release Check | — | P3 |

---

## 2. Task 상세 — Data

#### 1. `DATA-DESTINATIONS` — 여행지 정적 데이터

- **Category:** Data
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-007(축소), REQ-FUNC-008, REQ-NF-026
- **Screen:** — (SCR-001, SCR-002에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** —
- **Expected Files:** `src/data/destinations.ts`, `src/data/types.ts`(공용 타입)
- **Functional AC:**
  - `docs/PROJECT_SCOPE.md` §1 원칙대로 Supabase 테이블이 아닌 **정적 TypeScript 배열/객체**로 작성한다(DB 미사용).
  - 국내 10개 이상, 해외 15개국 30개 도시 이상을 포함한다(REQ-FUNC-008).
  - 각 항목은 `overview`(300자 이상), `highlights`(5개 이상), `bestTime`, `itinerary1d`, `itinerary3d`, `budget`, `transport`, `foods`(3개 이상), `etiquette`(3개 이상), `sources`(1개 이상)를 모두 채운다(REQ-FUNC-004의 데이터 전제).
  - 모든 이미지 URL에 실제 장소를 설명하는 `alt` 텍스트를 함께 저장한다(REQ-FUNC-007, alt만 필수 보증하고 출처·작가·라이선스는 참고 기록만 한다).
- **Visual AC:** 해당 없음(비-UI Task, 소비 측 Visual AC는 CMP-SCR001-DESTINATION-GRID/DETAIL-DRAWER에서 정의).
- **Security/Privacy AC:** 개인정보 없음. 외부 이미지 URL은 HTTPS만 허용한다.
- **Verify:** TEST-DATA-VALIDATION(수량·필드 완전성), 코드 리뷰(alt 텍스트 존재 확인)
- **Priority:** P0

#### 2. `DATA-SAFETY` — 국가 안전정보 정적 데이터

- **Category:** Data
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-046, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-052, REQ-FUNC-053, REQ-NF-027
- **Screen:** — (SCR-001에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** DATA-DESTINATIONS(국가 코드 매칭)
- **Expected Files:** `src/data/safety.ts`
- **Functional AC:**
  - `DATA-DESTINATIONS`에 등장하는 모든 해외 국가에 대해 안전정보 항목이 1:1로 존재한다(REQ-FUNC-046, `country_code` 매칭).
  - 8개 필수 카테고리(치안, 흔한 사기, 현지 법규, 교통, 재난·기후, 보건, 문화·복장, 긴급연락처)를 모두 포함한다(REQ-FUNC-047).
  - `scopeType`(COUNTRY/REGION), `scopeText`, `advisoryLevel`, `sourceName`, `sourceUrl`, `verifiedAt`, `verifiedBy`를 필드로 둔다(REQ-FUNC-048, 052).
  - 긴급전화·영사콜센터 연결 정보를 포함한다(REQ-FUNC-053).
- **Visual AC:** 해당 없음(비-UI Task).
- **Security/Privacy AC:** 공식 출처(외교부 해외안전여행) URL만 참조한다.
- **Verify:** TEST-DATA-VALIDATION, 코드 리뷰
- **Priority:** P0

#### 3. `DATA-REPRESENTATIVE` — 대표 소개 정적 데이터

- **Category:** Data
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059(축소), REQ-FUNC-060, REQ-FUNC-061(축소)
- **Screen:** — (SCR-001, SCR-002에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** —
- **Expected Files:** `src/data/representative-profile.ts`
- **Functional AC:**
  - 단일 정적 객체로 `displayName`("free_traveler"), `tripCountLabel`("50+ Trips"), `countryCountLabel`("30+ Countries")를 고정한다(REQ-FUNC-057). 이 값은 SCR-001/SCR-002 어디서 참조하든 동일해야 한다.
  - `bio`, `philosophy`, `editorialPrinciples` 텍스트 필드를 포함한다(REQ-FUNC-058).
  - `visitedCountries` 30개 이상(권역 4그룹: 아시아/유럽/북미/오세아니아)을 포함한다(REQ-FUNC-059, 지도 대신 목록형).
  - `timeline` 6개 이상(연도/장소/요약)을 포함한다(REQ-FUNC-060).
  - 대표 이미지에 `alt` 텍스트를 포함한다(REQ-FUNC-061).
- **Visual AC:** 해당 없음(비-UI Task).
- **Security/Privacy AC:** 개인정보 없음(공개 프로필 정보만).
- **Verify:** TEST-DATA-VALIDATION, 코드 리뷰
- **Priority:** P0

---

## 3. Task 상세 — DB

#### 4. `DB-SCHEMA-BASE` — Supabase 테이블 스키마(6종)

- **Category:** DB
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** (기반 인프라, REQ-FUNC-029, 031, 034, 040, 039, 077의 저장소 전제)
- **Screen:** —
- **Route:** —
- **Page Entry:** —
- **Depends On:** —
- **Expected Files:** `supabase/migrations/0001_schema.sql`
- **Functional AC:**
  - `docs/PROJECT_SCOPE.md` §5에 정의된 **6개 테이블만** 생성한다: `profiles`, `mate_posts`, `mate_applications`, `blocks`, `reports`, `app_settings`. `AUDIT_LOG` 등 7번째 테이블은 만들지 않는다.
  - `profiles`: `user_id`(PK/FK auth.users), `nickname`(UNIQUE), `is_adult`, `adult_verified_at`, `age_band`, `gender`(optional), `travel_styles`, `bio`, `status`.
  - `mate_posts`: `post_id`, `owner_id`, `country_id/region_id`(정적 데이터의 코드 참조), `start_date`, `end_date`, `capacity`, `preferences`, `travel_styles`, `title`, `description`, `status`(OPEN/CLOSED/HIDDEN/DELETED), `created_at`.
  - `mate_applications`: `application_id`, `post_id`, `applicant_id`, `message`(500자 제한), `status`(PENDING/ACCEPTED/REJECTED/WITHDRAWN), `created_at`.
  - `blocks`: `blocker_id`, `blocked_id`, `created_at`(쌍 UNIQUE).
  - `reports`: `report_id`, `reporter_id`, `target_type`, `target_id`, `reason_code`, `description`, `status`(OPEN/RESOLVED/DISMISSED), `created_at`, `resolved_at`.
  - `app_settings`: `key`(PK, 예: `FLIGHT_OUTBOUND_URL`/`HOTEL_OUTBOUND_URL`), `value`, `updated_at`, `updated_by`(FK `profiles.user_id`). Admin이 API-ADMIN-SETTINGS를 통해 관리하는 외부 URL 허용목록 값을 저장한다(REQ-FUNC-077). 콘텐츠 CRUD용 테이블이 아니다.
  - `profiles.age_band`가 아닌 정확한 생년월일 컬럼은 만들지 않는다(REQ-FUNC-028 전제).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 생년월일 원본을 저장하는 컬럼을 두지 않는다. 이메일 등 인증 정보는 Supabase `auth.users`에만 두고 커스텀 테이블에 중복 저장하지 않는다.
- **Verify:** 코드 리뷰(스키마), TEST-RLS-BASIC
- **Priority:** P0

#### 5. `DB-RLS-BASE` — Supabase RLS 정책

- **Category:** DB
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-044, REQ-FUNC-077, REQ-NF-013
- **Screen:** —
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE
- **Expected Files:** `supabase/migrations/0002_rls.sql`
- **Functional AC:**
  - `profiles`: 본인만 자신의 행 UPDATE 가능, 공개 필드(닉네임/스타일 등)는 SELECT 공개.
  - `mate_posts`: 누구나 `status != DELETED` 목록 SELECT 가능(차단 필터는 애플리케이션 레벨), 작성자만 UPDATE/DELETE.
  - `mate_applications`: 신청자 본인과 대상 글 작성자만 SELECT, 신청자만 INSERT, 글 작성자만 상태 UPDATE.
  - `blocks`: 본인(`blocker_id`)만 SELECT/INSERT/DELETE.
  - `reports`: 신고자 본인과 Moderator/Admin 역할만 SELECT, 신고자만 INSERT, Moderator/Admin만 상태 UPDATE.
  - `app_settings`: 클라이언트에서는 SELECT/INSERT/UPDATE/DELETE를 모두 차단한다(RLS 전면 거부) — 값은 서버 전용 Route Handler(`API-ADMIN-SETTINGS`)가 Service Role로만 읽고 쓴다. Admin 역할만 그 Route Handler를 호출할 수 있다(애플리케이션 레벨 검사).
  - 최소 RLS 원칙(`docs/PROJECT_SCOPE.md` §1)을 따르며 "회원 전용 쓰기 경로 보호"를 최우선 목표로 한다.
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 모든 쓰기 정책은 `auth.uid()` 기반으로 검증한다. Moderator/Admin 역할 판별은 `profiles`가 아닌 별도 role 클레임(Supabase custom claims)을 사용한다.
- **Verify:** TEST-RLS-BASIC(권한별 부정 접근 테스트)
- **Priority:** P0

#### 6. `DB-ACCESS` — Supabase Client/Server 접근 유틸

- **Category:** DB
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** (모든 Supabase 쓰기 Task의 공통 기반)
- **Screen:** —
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE
- **Expected Files:** `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`
- **Functional AC:**
  - Server Component/Route Handler용 클라이언트와 Client Component용 클라이언트를 분리 제공한다.
  - 환경변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)는 서버 전용 변수와 공개 변수를 명확히 분리한다.
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** `SUPABASE_SERVICE_ROLE_KEY`는 클라이언트 번들에 포함되지 않는다(REQ-NF-016).
- **Verify:** 코드 리뷰, 빌드 산출물에서 시크릿 노출 검사
- **Priority:** P0

#### 7. `DB-SEED-BASE` — 개발·테스트 시드 데이터

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

---

## 4. Task 상세 — Infra

#### 8. `INFRA-AUTH-SESSION` — Supabase Auth 세션·이메일 인증

- **Category:** Infra
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-027, REQ-FUNC-066, REQ-NF-014
- **Screen:** — (SCR-003, SCR-005에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-ACCESS
- **Expected Files:** `src/lib/auth/session.ts`, `src/app/auth/callback/route.ts`, `middleware.ts`
- **Functional AC:**
  - 이메일 가입/인증/로그인/로그아웃/비밀번호 재설정을 Supabase Auth로 구현한다(REQ-FUNC-066).
  - 이메일 인증 미완료 세션은 동행 쓰기 작업(API-MATE-POSTS, API-MATE-APPLICATIONS 등) 호출 시 서버에서 401/리다이렉트로 차단한다(REQ-FUNC-027).
  - 인증 콜백은 Screen 5개와 별개의 **기술 Route**(`src/app/auth/callback/route.ts`)로 처리하며 어떤 Page Owner의 Expected Files에도 포함하지 않는다.
- **Visual AC:** 해당 없음(로그인 UI는 CMP-SCR005-AUTH에서 정의).
- **Security/Privacy AC:** CSRF 방어·SameSite 쿠키를 Next.js Server Actions 기본 보호 + Supabase Auth 쿠키 설정으로 충족한다(REQ-NF-014).
- **Verify:** E2E-MATE-AUTH, 코드 리뷰
- **Priority:** P0

#### 9. `INFRA-ADULT-VERIFICATION` — 성인확인 플래그 처리

- **Category:** Infra
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-028
- **Screen:** — (SCR-005에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE, INFRA-AUTH-SESSION
- **Expected Files:** `src/lib/mate/adult-verification.ts`
- **Functional AC:**
  - 사용자가 "만 19세 이상"을 확인하면 `is_adult=true`, `adult_verified_at=now()`만 저장한다. 생년월일·나이 원본값은 어떤 저장소에도 남기지 않는다.
  - 동행 글 작성(CMP-SCR003-MATE-WRITE-FORM)·참가 요청(CMP-SCR004-APPLY) 진입 시 이 플래그를 게이트로 사용한다.
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 생년월일 미저장을 코드 리뷰로 확인한다(REQ-FUNC-028 핵심 제약).
- **Verify:** 코드 리뷰(스키마 확인), E2E-MATE-AUTH
- **Priority:** P1

#### 10. `INFRA-CONTACT-DETECTION` — 공개 연락처 탐지 유틸

- **Category:** Infra
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-032
- **Screen:** — (SCR-003 동행 작성 Form에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** —
- **Expected Files:** `src/lib/mate/contact-detection.ts`
- **Functional AC:**
  - 전화번호, 이메일, 카카오톡·텔레그램 등 일반 메신저 ID 패턴을 정규식/휴리스틱으로 탐지한다.
  - 기준 테스트셋 기준 탐지율 95% 이상, 오탐 5% 이하를 목표로 한다(REQ-FUNC-032 AC).
  - 탐지 시 모집글 제출을 서버에서 차단하고 구체적 수정 안내 메시지를 반환한다.
- **Visual AC:** 해당 없음(오류 UI는 CMP-SCR003-MATE-WRITE-FORM에서 정의).
- **Security/Privacy AC:** 탐지 로직 자체가 개인정보를 저장하지 않는다(요청 단위로만 검사).
- **Verify:** UNIT-CONTACT-DETECTION
- **Priority:** P1

#### 11. `INFRA-USER-DELETE` — 탈퇴 시 즉시 비식별화

- **Category:** Infra
- **Implementation Status:** IMPLEMENT(축소)
- **Requirement Ref:** REQ-FUNC-045, REQ-NF-018
- **Screen:** — (SCR-005에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE, INFRA-AUTH-SESSION
- **Expected Files:** `src/lib/account/delete.ts`
- **Functional AC:**
  - 탈퇴 요청 시 `profiles`의 닉네임·자기소개 등 공개 식별 정보를 즉시 비식별화한다.
  - 유예기간 후 배치 삭제(법적 보존 예외 처리 등)는 만들지 않는다(`docs/PROJECT_SCOPE.md` REQ-FUNC-045 처리 방법 축소 범위).
  - 개인정보 **내보내기**(다운로드) 기능은 만들지 않는다(REQ-NF-018 축소 범위 — 삭제만 구현).
- **Visual AC:** 해당 없음(탈퇴 버튼 UI는 CMP-SCR005-PROFILE에서 정의).
- **Security/Privacy AC:** 비식별화 처리 결과를 코드 리뷰로 확인한다. 배치 삭제·감사 로그는 EXCLUDED 범위(REQ-FUNC-076)와 무관하게 만들지 않는다.
- **Verify:** 코드 리뷰, 수동 확인
- **Priority:** P1

#### 12. `INFRA-EXTERNAL-LINK-SAFETY` — 외부 링크 새 탭·noopener 공용 유틸

- **Category:** Infra
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-016, REQ-FUNC-024, REQ-FUNC-049
- **Screen:** — (SCR-001, SCR-003에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** —
- **Expected Files:** `src/lib/links/external-link.ts`
- **Functional AC:**
  - 항공/호텔 외부 이동, 외교부 안전정보 원문 링크, 대표 소개 SNS 링크가 공통으로 사용할 `openExternal(url)` 유틸을 제공한다.
  - `target="_blank"` + `rel="noopener noreferrer"`를 강제하고, 목적지·날짜 쿼리 파라미터를 URL에 절대 추가하지 않는다(CON-02).
  - 허용목록(HTTPS만) 밖 URL이나 `javascript:` 스킴은 열지 않고 호출부에 오류를 반환한다(REQ-FUNC-018, 026 전제).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** URL이 허용목록의 HTTPS 프로토콜인지 유틸 내부에서 검증한다.
- **Verify:** 코드 리뷰, E2E-TRAVEL-TOOLS(속성 확인)
- **Priority:** P1

#### 13. `INFRA-INPUT-VALIDATION` — 서버 입력 검증·이스케이프 공통 스키마

- **Category:** Infra
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-NF-015
- **Screen:** — (모든 API Task에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** —
- **Expected Files:** `src/lib/validation/schemas.ts`
- **Functional AC:**
  - 모집글/참가요청/신고/관리자 설정 입력에 대한 공용 스키마(zod 등)를 정의하고, 모든 `API-*` Route Handler가 이를 통해 검증한다.
  - React 기본 이스케이프 + 서버 스키마 검증으로 저장 XSS를 차단한다.
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 모든 문자열 입력은 최대 길이·허용 문자 제약을 스키마에 명시한다(REQ-NF-015).
- **Verify:** 코드 리뷰, API 통합 테스트(각 API Task Verify에 포함)
- **Priority:** P1

---

## 5. Task 상세 — API

#### 14. `API-MATE-POSTS` — 동행 모집글 생성·수정·마감·삭제

- **Category:** API
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-037(축소), REQ-FUNC-038
- **Screen:** SCR-003(작성), SCR-005(관리)
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, INFRA-AUTH-SESSION, INFRA-ADULT-VERIFICATION, INFRA-CONTACT-DETECTION, INFRA-INPUT-VALIDATION
- **Expected Files:** `src/app/api/mates/route.ts`(POST), `src/app/api/mates/[id]/route.ts`(PATCH/DELETE)
- **Functional AC:**
  - 제목/국가/지역/시작일/종료일/모집인원/선호조건/여행스타일/설명/안전수칙 동의를 필수 입력으로 검증한다(REQ-FUNC-031). 날짜 역전·과거 종료일은 차단한다.
  - 본문에서 `INFRA-CONTACT-DETECTION` 결과가 양성이면 제출을 차단한다(REQ-FUNC-032).
  - 종료일이 지난 글은 **배치 없이** 조회 시점에 CLOSED로 계산해 응답한다(REQ-FUNC-037 축소).
  - 작성자만 수동 마감/수정/삭제할 수 있으며, 승인된 신청이 있는 상태에서 중요 일정을 바꾸면 경고 플래그를 응답에 포함한다(REQ-FUNC-038).
- **Visual AC:** 해당 없음(폼 UI는 CMP-SCR003-MATE-WRITE-FORM, 관리 UI는 CMP-SCR005-MY-ACTIVITY).
- **Security/Privacy AC:** 비로그인/미성년 요청은 401/403으로 차단한다. 응답 JSON에 신청자 개인 연락처를 포함하지 않는다.
- **Verify:** UNIT-MATE-STATE, E2E-MATE-AUTH
- **Priority:** P1

#### 15. `API-MATE-APPLICATIONS` — 참가 요청 생성·승인·거절

- **Category:** API
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036
- **Screen:** SCR-004(신청), SCR-005(승인/거절)
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, INFRA-AUTH-SESSION, INFRA-ADULT-VERIFICATION, INFRA-INPUT-VALIDATION
- **Expected Files:** `src/app/api/mates/[id]/applications/route.ts`(POST), `src/app/api/applications/[id]/route.ts`(PATCH)
- **Functional AC:**
  - 최대 500자 참가 메시지를 PENDING 상태로 저장한다(REQ-FUNC-034).
  - 동일 사용자·동일 글의 중복 PENDING/ACCEPTED 요청은 DB unique 제약 + 사전 검사로 차단한다(REQ-FUNC-035).
  - 글 작성자만 ACCEPTED/REJECTED로 상태를 변경할 수 있다. 비작성자 호출은 403을 반환한다(REQ-FUNC-036).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 신청 메시지는 신청자 본인과 글 작성자만 RLS로 조회 가능하다.
- **Verify:** UNIT-MATE-STATE, TEST-RLS-BASIC, E2E-MATE-AUTH
- **Priority:** P1

#### 16. `API-BLOCKS` — 사용자 차단·해제

- **Category:** API
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-040
- **Screen:** SCR-004, SCR-005
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, INFRA-AUTH-SESSION
- **Expected Files:** `src/app/api/blocks/route.ts`(POST), `src/app/api/blocks/[id]/route.ts`(DELETE)
- **Functional AC:**
  - 차단 생성/해제를 제공하며, 차단 이후 두 사용자 사이의 글·프로필·요청이 목록/상세 쿼리에서 상호 제외되도록 `CMP-SCR004-LIST`/`CMP-SCR004-FILTER`가 사용하는 조회 쿼리에 조인 필터를 반영한다.
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** `blocker_id`는 본인만 RLS로 접근 가능.
- **Verify:** TEST-RLS-BASIC, E2E-MATE-AUTH
- **Priority:** P1

#### 17. `API-REPORTS` — 신고 접수

- **Category:** API
- **Implementation Status:** IMPLEMENT(간소화)
- **Requirement Ref:** REQ-FUNC-039, REQ-NF-019
- **Screen:** SCR-004
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, INFRA-AUTH-SESSION, INFRA-INPUT-VALIDATION
- **Expected Files:** `src/app/api/reports/route.ts`(POST)
- **Functional AC:**
  - 대상(글/사용자/신청) + 사유코드 + 설명만 저장한다(증거 첨부·우선순위 필드는 만들지 않음 — 간소화 범위).
  - 응답에 신고 접수번호와 접수 시각을 3초 이내 반환한다(REQ-NF-019 목표).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 신고자 본인과 Moderator/Admin만 조회 가능.
- **Verify:** TEST-RLS-BASIC, E2E-MATE-AUTH
- **Priority:** P1

#### 18. `API-ADMIN-SETTINGS` — 신고 상태 변경·외부 URL 설정

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

---

## 6. Task 상세 — Component

### 6.1 SCR-001

#### 19. `CMP-SCR001-HERO-SEARCH` — Hero 통합 검색

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-003, REQ-FUNC-067
- **Screen:** SCR-001
- **Route:** `/`
- **Page Entry:** `src/app/page.tsx`(PAGE-SCR001이 조립)
- **Depends On:** DATA-DESTINATIONS, DATA-SAFETY
- **Expected Files:** `src/components/screens/scr001/HeroSearch.tsx`
- **Functional AC:**
  - `design-reference/D-001/DESIGN.md` § Search·Filter의 Hero pill 검색바(완전 원형, `{rounded.full}`)를 사용한다.
  - 여행지명·국가명·테마 키워드로 한글 부분 일치 검색을 수행하고, 여행지·안전정보를 통합 검색한다(REQ-FUNC-003, 067). 결과 유형 라벨과 하이라이트를 표시한다.
  - 보조 CTA "항공·숙소 준비하기"는 `/travel-tools`로 이동한다.
- **Visual AC:** Hero는 Desktop 뷰포트 60-70%(약 520-600px)로 제한해 다음 Section이 첫 화면에서 보이게 한다(D-001 § Hero 규칙). Mobile은 세로 스택.
- **Security/Privacy AC:** 해당 없음(공개 정적 검색).
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P1

#### 20. `CMP-SCR001-DESTINATION-GRID` — 국내·해외 여행지 Card Grid + 테마 필터

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-005, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-068, REQ-NF-006
- **Screen:** SCR-001
- **Route:** `/`
- **Page Entry:** `src/app/page.tsx`(PAGE-SCR001이 조립)
- **Depends On:** DATA-DESTINATIONS, CMP-COMMON-FAVORITES-SHARE, CMP-COMMON-EMPTY-STATE
- **Expected Files:** `src/components/screens/scr001/DestinationGrid.tsx`, `src/components/common/DestinationCard.tsx`
- **Functional AC:**
  - 국내 6개, 해외 6개(국기 배지 포함) `card.destination`을 표시한다(콘텐츠 계약).
  - 국가·도시·계절·테마·기간 필터를 AND 조건으로 클라이언트에서 적용한다(REQ-FUNC-002).
  - 테마 Chip(6개) 선택 시 목록이 필터링된다(REQ-FUNC-002). 필터 상태는 `useSearchParams` 기반으로 URL에 반영되며 새로고침·공유 시 복원된다(REQ-FUNC-010, 허용 키만 직렬화).
  - 필터 결과 0건이면 `CMP-COMMON-EMPTY-STATE`(조건 완화 안내 + 전체 초기화 버튼)로 대체한다(REQ-FUNC-005).
  - 즐겨찾기 아이콘 버튼은 `CMP-COMMON-FAVORITES-SHARE` 훅을 사용해 localStorage에 중복 없이 토글한다(REQ-FUNC-068).
- **Visual AC:** 카드 이미지 4:3, `{rounded.lg}` 클리핑, `Next/Image` 반응형+lazy(REQ-NF-006). Desktop 3열 → Tablet 2열 → Mobile 1열. 카드 정지 상태 그림자 없음, hover 시 `{elevation.card-hover}`.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- **Priority:** P1

#### 21. `CMP-SCR001-DESTINATION-DETAIL-DRAWER` — 여행지 상세 Drawer

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-004, REQ-FUNC-006, REQ-FUNC-007(축소), REQ-FUNC-009, REQ-FUNC-069
- **Screen:** SCR-001
- **Route:** `/`
- **Page Entry:** `src/app/page.tsx`(PAGE-SCR001이 조립)
- **Depends On:** CMP-SCR001-DESTINATION-GRID, DATA-DESTINATIONS, DATA-SAFETY, CMP-COMMON-FAVORITES-SHARE
- **Expected Files:** `src/components/screens/scr001/DestinationDetailDrawer.tsx`
- **Functional AC:**
  - 대표 이미지, 300자+ 소개, 명소·체험 5개+, 추천/비추천 시기, 1일·3일 일정, 예상 예산, 교통, 음식 3개+, 문화·에티켓 3개+, 출처·최종 수정일을 표시한다(REQ-FUNC-004).
  - 해외 여행지는 "이 나라 안전정보 보기" 버튼으로 `CMP-SCR001-SAFETY-SECTION`의 안전정보 Drawer로 전환한다(REQ-FUNC-006, `country_code` 일치).
  - 관련 여행지 최대 6개(같은 국가·테마, 비공개·현재 여행지 제외)를 하단에 표시한다(REQ-FUNC-009).
  - URL 공유 버튼 제공, Web Share API 실패 시 클립보드 복사로 폴백(REQ-FUNC-069).
- **Visual AC:** Desktop 우측 슬라이드 Drawer(480-560px, `{elevation.drawer-modal}`), Mobile 하단 풀스크린 시트. 상단 고정 헤더 + 44px 닫기 버튼.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P1

#### 22. `CMP-SCR001-SAFETY-SECTION` — 국가별 안전정보 Card + 상세 Drawer

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050(축소), REQ-FUNC-051, REQ-FUNC-052, REQ-FUNC-053, REQ-FUNC-054, REQ-NF-028(축소)
- **Screen:** SCR-001
- **Route:** `/`
- **Page Entry:** `src/app/page.tsx`(PAGE-SCR001이 조립)
- **Depends On:** DATA-SAFETY, INFRA-EXTERNAL-LINK-SAFETY
- **Expected Files:** `src/components/screens/scr001/SafetySection.tsx`, `src/components/screens/scr001/SafetyDetailDrawer.tsx`
- **Functional AC:**
  - 국가별 안전정보 `card.safety` 6개(경보단계 배지 + 최종확인일 + stale 배지)를 표시한다(콘텐츠 계약).
  - 상세 Drawer에 8개 필수 카테고리, 출처명·URL·최종확인일·편집자, 긴급연락처·영사콜센터를 표시한다(REQ-FUNC-047, 048, 053).
  - 외교부 원문 링크는 `INFRA-EXTERNAL-LINK-SAFETY`로 새 탭 오픈한다(REQ-FUNC-049).
  - `verifiedAt` 기준 7일 초과 시 렌더링 시점에 stale 배지를 계산해 표시한다(REQ-FUNC-050, REQ-NF-028 — 배치 없이 렌더링 시 계산).
  - 중대 경보(출국권고·여행금지·특별여행주의보)는 상단에 **텍스트로** 표시하며 색상만으로 의미를 전달하지 않는다(REQ-FUNC-051). 국가 전체/지역 경보 범위를 `scopeType`/`scopeText`로 구분 표시한다(REQ-FUNC-052).
  - "이 정보는 공식 판단을 대체하지 않습니다. 출국 전 공식 출처 재확인이 필요합니다" 고지를 고정 표시한다(REQ-FUNC-054).
- **Visual AC:** 경보 1~4단계 배지는 `{colors.safety-caution/warning/alert/ban}` + 텍스트 라벨("여행유의"/"여행자제"/"철수권고"/"여행금지") 병기.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE, TEST-DATA-VALIDATION
- **Priority:** P1

#### 23. `CMP-SCR001-RECENT-MATES` — 최근 동행 카드 3개/Empty State

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** —(디자인 계약: D-001 §화면별 Section 순서, SCR-004 데이터 재사용)
- **Screen:** SCR-001
- **Route:** `/`
- **Page Entry:** `src/app/page.tsx`(PAGE-SCR001이 조립)
- **Depends On:** DB-ACCESS, CMP-COMMON-EMPTY-STATE
- **Expected Files:** `src/components/screens/scr001/RecentMates.tsx`
- **Functional AC:**
  - `mate_posts`에서 `status=OPEN`인 최신 3건을 `card.mate`로 표시한다. "전체 동행 보기" CTA는 `/mates`로 이동한다.
  - 0건이면 `CMP-COMMON-EMPTY-STATE`(상황 설명 + 참가 방법 3줄 요약 + "동행 글 작성하기" CTA → `/travel-tools` 동행 탭)로 대체한다.
- **Visual AC:** Card Grid 3열(Mobile 1열), 모집상태 배지(모집중/마감).
- **Security/Privacy AC:** 작성자 연락처를 노출하지 않는다(REQ-FUNC-033과 동일 원칙 재사용).
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P2

#### 24. `CMP-SCR001-ABOUT-SUMMARY` — 대표 소개 요약 카드

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-057
- **Screen:** SCR-001
- **Route:** `/`
- **Page Entry:** `src/app/page.tsx`(PAGE-SCR001이 조립)
- **Depends On:** DATA-REPRESENTATIVE
- **Expected Files:** `src/components/screens/scr001/AboutSummary.tsx`
- **Functional AC:**
  - `DATA-REPRESENTATIVE`의 `displayName`/`tripCountLabel`/`countryCountLabel`을 그대로 표시하며 `/about`(`CMP-SCR002-HERO-PROFILE`)과 값이 100% 일치해야 한다(REQ-FUNC-057, 단일 데이터 소스 사용으로 보증).
  - "대표 소개 더 보기" CTA는 `/about`로 이동한다.
- **Visual AC:** 좌우 분할(이미지+텍스트) 레이아웃.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE(값 일치 assertion), TEST-DATA-VALIDATION
- **Priority:** P2

### 6.2 SCR-002

#### 25. `CMP-SCR002-HERO-PROFILE` — 대표 소개 Hero

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-057
- **Screen:** SCR-002
- **Route:** `/about`
- **Page Entry:** `src/app/about/page.tsx`(PAGE-SCR002가 조립)
- **Depends On:** DATA-REPRESENTATIVE
- **Expected Files:** `src/components/screens/scr002/HeroProfile.tsx`
- **Functional AC:** 대표 사진(alt: 실제 인물 촬영 설명) + 소개 한 문장 + `CMP-SCR001-ABOUT-SUMMARY`와 동일한 `displayName`/지표 라벨을 표시한다.
- **Visual AC:** 좌우 분할 Hero, Desktop 60-70% 높이 제한.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P2

#### 26. `CMP-SCR002-STATS-STORY` — 여행 지표 + 소개·철학

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-058
- **Screen:** SCR-002
- **Route:** `/about`
- **Page Entry:** `src/app/about/page.tsx`(PAGE-SCR002가 조립)
- **Depends On:** DATA-REPRESENTATIVE
- **Expected Files:** `src/components/screens/scr002/StatsStory.tsx`
- **Functional AC:** 지표 카드 3개("50+ Trips"/"30+ Countries"/대륙 수) + 소개/여행 철학/편집 원칙 문단 2개 이상을 표시한다(REQ-FUNC-058).
- **Visual AC:** 지표 카드 Grid(3열) + 텍스트 중심 좌우 분할.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P2

#### 27. `CMP-SCR002-TIMELINE` — 여행 타임라인 6개

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-060
- **Screen:** SCR-002
- **Route:** `/about`
- **Page Entry:** `src/app/about/page.tsx`(PAGE-SCR002가 조립)
- **Depends On:** DATA-REPRESENTATIVE
- **Expected Files:** `src/components/screens/scr002/Timeline.tsx`
- **Functional AC:** `card.timeline-item`(연도 캡션 + 장소 제목 + 2줄 요약) 6개 이상을 시간 순으로 표시한다(REQ-FUNC-060, 콘텐츠 계약).
- **Visual AC:** 세로 Timeline 레이아웃.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P2

#### 28. `CMP-SCR002-COUNTRIES-GALLERY` — 방문 국가 30개 + 사진 Gallery 8개

- **Category:** Component
- **Implementation Status:** IMPLEMENT(축소)
- **Requirement Ref:** REQ-FUNC-059(축소), REQ-FUNC-061(축소), REQ-NF-006
- **Screen:** SCR-002
- **Route:** `/about`
- **Page Entry:** `src/app/about/page.tsx`(PAGE-SCR002가 조립)
- **Depends On:** DATA-REPRESENTATIVE
- **Expected Files:** `src/components/screens/scr002/CountriesGallery.tsx`
- **Functional AC:** 권역 4그룹(아시아/유럽/북미/오세아니아) × 국가 Chip 목록 30개(지도 대신 목록형, REQ-FUNC-059 축소). 이미지 8장 이상(각 alt에 실제 장소 설명, REQ-FUNC-061)을 Masonry/Grid로 표시한다.
- **Visual AC:** Desktop Grid → Mobile 1~2열, `Next/Image` lazy 로딩(REQ-NF-006).
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P2

#### 29. `CMP-SCR002-FAVORITE-DESTINATIONS-CTA` — 기억에 남는 여행지 4개 + CTA

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-062, REQ-FUNC-063
- **Screen:** SCR-002
- **Route:** `/about`
- **Page Entry:** `src/app/about/page.tsx`(PAGE-SCR002가 조립)
- **Depends On:** DATA-DESTINATIONS, CMP-SCR001-DESTINATION-DETAIL-DRAWER
- **Expected Files:** `src/components/screens/scr002/FavoriteDestinationsCta.tsx`
- **Functional AC:**
  - `card.destination` 4개(비공개 여행지는 자동 제외, 대체 후보 표시)를 SCR-001 상세 Drawer로 딥링크한다(REQ-FUNC-063).
  - CTA Banner "항공·숙소 준비하기"(`/travel-tools`), "동행과 함께 떠나기"(`/mates`)를 표시한다.
  - 관리자 설정 기반 문의·SNS 링크를 제공하며, 빈 링크는 렌더링하지 않고 허용 프로토콜(https)만 연다(REQ-FUNC-062).
- **Visual AC:** Card Grid(2×2) + CTA Banner.
- **Security/Privacy AC:** SNS 링크는 `INFRA-EXTERNAL-LINK-SAFETY` 규칙(허용 프로토콜만)을 따른다.
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P2

### 6.3 SCR-003

#### 30. `CMP-SCR003-INTRO-TABS` — Intro 3단계 안내 + 탭 Shell

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** —(디자인 계약, PAGE-SCR003이 조립할 탭 shell)
- **Screen:** SCR-003
- **Route:** `/travel-tools`
- **Page Entry:** `src/app/travel-tools/page.tsx`(PAGE-SCR003이 조립)
- **Depends On:** —
- **Expected Files:** `src/components/screens/scr003/IntroTabs.tsx`
- **Functional AC:**
  - "조건 입력 → 요약 확인 → 이동/작성" 3단계 안내 문단을 표시한다.
  - `tab.underline` 3개(항공편/숙소/동행 구하기)를 렌더링하며, 탭 전환 시 다른 탭의 입력 상태는 세션 동안 유지하되 검증·제출 상태는 탭별로 독립 관리한다(D-001 § Form·Tabs).
- **Visual AC:** 활성 탭 = `{colors.ink}` + 2px `{colors.primary}` 밑줄, 비활성 = `{colors.muted}`.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-TRAVEL-TOOLS
- **Priority:** P1

#### 31. `CMP-SCR003-FLIGHT-FORM` — 항공 조건 입력·요약·외부 이동

- **Category:** Component
- **Implementation Status:** IMPLEMENT / IMPLEMENT(축소, 오류처리)
- **Requirement Ref:** REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-054, REQ-NF-017
- **Screen:** SCR-003
- **Route:** `/travel-tools`
- **Page Entry:** `src/app/travel-tools/page.tsx`(PAGE-SCR003이 조립)
- **Depends On:** CMP-SCR003-INTRO-TABS, INFRA-EXTERNAL-LINK-SAFETY, CMP-COMMON-TOAST
- **Expected Files:** `src/components/screens/scr003/FlightForm.tsx`
- **Functional AC:**
  - 국가/지역(국가 종속 Select, 국가 변경 시 지역 초기화)/출발일/귀국일을 필수 입력으로 제공한다(REQ-FUNC-011, 012).
  - 출발일이 오늘 이전이거나 귀국일이 출발일보다 빠르면 제출을 차단한다(REQ-FUNC-013, `UNIT-TRAVEL-DATES`로 검증).
  - 유효 입력 후 요약 단계(수정 버튼 포함, 값은 브라우저 세션 동안 유지)를 표시한다(REQ-FUNC-014).
  - "입력값은 외부 사이트로 전달되지 않습니다" 고지를 폼과 요약 모두에 고정 표시한다(REQ-FUNC-015).
  - "항공편 보러 가기" 클릭 시 `INFRA-EXTERNAL-LINK-SAFETY`로 `FLIGHT_OUTBOUND_URL`을 새 탭 이동한다. 목적지·날짜 쿼리는 절대 붙이지 않는다(REQ-FUNC-016).
  - 검색 Tip 3개 이상을 표시한다(콘텐츠 계약).
  - "안전정보는 공식 판단을 대체하지 않습니다" 고지를 공유한다(REQ-FUNC-054).
  - URL 오류(허용목록 밖/네트워크 실패) 시 이동을 차단하고 인라인 오류 + 재시도 버튼을 제공한다(REQ-FUNC-018 축소, 운영 오류 로그 저장 화면은 만들지 않음).
- **Visual AC:** Form+Tip 좌우 분할(Desktop) / 세로 스택(Mobile). 입력창 52px 높이, 포커스 시 2px `{colors.focus-ring}`.
- **Security/Privacy AC:** **국가·지역·날짜 입력값은 브라우저 메모리 상태로만 처리하고 서버 API·DB·서버 로그·분석 이벤트에 저장하지 않는다(REQ-FUNC-017, REQ-NF-017, CON-01). 이 Task를 위한 서버 API Route를 만들지 않는다.**
- **Verify:** UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS(쿼리 미포함·noopener 속성 확인)
- **Priority:** P1

#### 32. `CMP-SCR003-HOTEL-FORM` — 숙소 조건 입력·요약·외부 이동

- **Category:** Component
- **Implementation Status:** IMPLEMENT / IMPLEMENT(축소, 오류처리)
- **Requirement Ref:** REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-NF-017
- **Screen:** SCR-003
- **Route:** `/travel-tools`
- **Page Entry:** `src/app/travel-tools/page.tsx`(PAGE-SCR003이 조립)
- **Depends On:** CMP-SCR003-INTRO-TABS, INFRA-EXTERNAL-LINK-SAFETY, CMP-COMMON-TOAST
- **Expected Files:** `src/components/screens/scr003/HotelForm.tsx`
- **Functional AC:**
  - 국가/지역(종속)/체크인/체크아웃을 필수 입력으로 제공한다(REQ-FUNC-019, 020).
  - 체크인이 오늘 이전이거나 체크아웃이 체크인과 같거나 빠르면 제출을 차단한다(REQ-FUNC-021, `UNIT-TRAVEL-DATES`).
  - 유효 입력 후 요약을 표시하며 폼 값과 정확히 일치해야 한다(REQ-FUNC-022).
  - 비전달 고지를 폼과 요약에 고정 표시한다(REQ-FUNC-023).
  - `HOTEL_OUTBOUND_URL`을 `INFRA-EXTERNAL-LINK-SAFETY`로 새 탭 이동한다(REQ-FUNC-024).
  - URL 오류 시 이동을 차단하고 입력값을 유지한 채 오류를 표시한다(REQ-FUNC-026 축소).
- **Visual AC:** `CMP-SCR003-FLIGHT-FORM`과 동일한 좌우 분할/입력 패턴을 재사용한다.
- **Security/Privacy AC:** **국가·지역·날짜 입력값은 브라우저 메모리 상태로만 처리하고 서버 API·DB·서버 로그·분석 이벤트에 저장하지 않는다(REQ-FUNC-025, REQ-NF-017, CON-01). 이 Task를 위한 서버 API Route를 만들지 않는다.**
- **Verify:** UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS
- **Priority:** P1

#### 33. `CMP-SCR003-MATE-WRITE-FORM` — 동행 모집글 작성 / 로그인 안내

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-080
- **Screen:** SCR-003
- **Route:** `/travel-tools`
- **Page Entry:** `src/app/travel-tools/page.tsx`(PAGE-SCR003이 조립)
- **Depends On:** CMP-SCR003-INTRO-TABS, API-MATE-POSTS, INFRA-AUTH-SESSION, INFRA-ADULT-VERIFICATION, INFRA-CONTACT-DETECTION, CMP-COMMON-TOAST
- **Expected Files:** `src/components/screens/scr003/MateWriteForm.tsx`
- **Functional AC:**
  - 미인증(비로그인 또는 성인확인 미완료) 시 안내 카드 + "로그인/가입하기" CTA(`/account`)를 표시한다(REQ-FUNC-027, 028).
  - 인증된 사용자에게 제목/국가·지역/기간/인원/선호조건/여행스타일/설명 Form + 안전수칙 동의 체크박스를 표시한다(REQ-FUNC-031).
  - `API-MATE-POSTS` 제출 시 서버 연락처 탐지 결과가 양성이면 인라인 오류와 수정 안내를 표시한다(REQ-FUNC-032).
  - 약관/방침/동행 안전수칙/콘텐츠 면책 고지에 동의해야 제출 가능하며, 동의 시각을 서버에 기록한다(REQ-FUNC-080; 약관 본문 자체는 5개 Screen 외 정적 legal 페이지 — 이 Task 범위는 동의 체크박스와 기록 연동까지).
  - 제출 완료 시 `CMP-COMMON-TOAST` 성공 알림 + `/mates` 작성한 글 상세로 이동한다.
- **Visual AC:** Form 좌우 분할(Desktop)/세로 스택(Mobile).
- **Security/Privacy AC:** 서버 액션에서 이메일 인증·성인확인 세션을 재검증한다(클라이언트 상태만으로 게이트하지 않음).
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1

### 6.4 SCR-004

#### 34. `CMP-SCR004-INTRO-CTA` — Intro + 새 글 작성 CTA Banner

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** —(디자인 계약)
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(PAGE-SCR004가 조립)
- **Depends On:** —
- **Expected Files:** `src/components/screens/scr004/IntroCta.tsx`
- **Functional AC:** 안내 문단 + "새 동행 글 작성하기" CTA(`/travel-tools` 동행 탭)를 표시한다.
- **Visual AC:** 좌우 분할 + CTA Banner.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-MATE-AUTH
- **Priority:** P2

#### 35. `CMP-SCR004-FILTER` — 검색 Filter + 결과 요약

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-030
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(PAGE-SCR004가 조립)
- **Depends On:** API-BLOCKS, DB-ACCESS
- **Expected Files:** `src/components/screens/scr004/Filter.tsx`
- **Functional AC:**
  - 국가·지역·기간 겹침·모집상태 Filter를 제공하고 "N건의 동행글" 결과 요약을 표시한다(REQ-FUNC-030).
  - 차단한/차단당한 사용자의 글은 결과에서 제외한다(`API-BLOCKS`의 조인 필터 사용).
- **Visual AC:** 좌우 분할(Filter+요약).
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1

#### 36. `CMP-SCR004-LIST` — 동행 목록 Card Grid

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-037(축소), REQ-FUNC-069
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(PAGE-SCR004가 조립)
- **Depends On:** CMP-SCR004-FILTER, DB-ACCESS, CMP-COMMON-FAVORITES-SHARE, CMP-COMMON-EMPTY-STATE
- **Expected Files:** `src/components/screens/scr004/MateList.tsx`
- **Functional AC:**
  - 최근 등록순 최대 8개를 `card.mate`로 우선 노출하고 "더 보기"로 이어서 확인한다(콘텐츠 계약).
  - 종료일 경과 글은 조회 시점에 CLOSED로 계산해 배지에 반영한다(REQ-FUNC-037 축소).
  - 작성자 정보는 표시하되 연락처는 노출하지 않는다(REQ-FUNC-033).
  - URL 공유 버튼(Web Share API, 실패 시 클립보드 복사) 제공(REQ-FUNC-069).
  - 검색 결과 0건/전체 글 0건이면 `CMP-COMMON-EMPTY-STATE`("조건에 맞는 동행글이 아직 없어요" + 필터 초기화 + "첫 동행 글 작성하기" CTA)로 대체한다.
- **Visual AC:** Card Grid, 모집상태 배지(모집중/마감).
- **Security/Privacy AC:** 목록 API 응답에 이메일·전화번호를 포함하지 않는다.
- **Verify:** E2E-MATE-AUTH, TEST-A11Y-AXE
- **Priority:** P1

#### 37. `CMP-SCR004-DETAIL` — 동행 상세 패널

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-033
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(PAGE-SCR004가 조립)
- **Depends On:** CMP-SCR004-LIST
- **Expected Files:** `src/components/screens/scr004/MateDetailPanel.tsx`
- **Functional AC:**
  - 작성자 정보(연락처 비공개), 국가·지역·기간·인원, 선호조건·여행스타일, 설명, 모집상태 배지를 표시한다(REQ-FUNC-033).
  - 작성자 본인이 열람 시 "내 글 관리는 계정 > 내 활동에서" 안내 배너를 표시한다.
- **Visual AC:** Desktop 좌(목록)/우(상세) 분할, Mobile 목록→상세 하단 Drawer 전환(좌우 분할 유지 금지).
- **Security/Privacy AC:** 응답 JSON/HTML에 이메일·전화번호가 포함되지 않는다(REQ-FUNC-033 핵심 AC).
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1

#### 38. `CMP-SCR004-APPLY` — 참가 메시지 신청 폼

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-034, REQ-FUNC-035
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(PAGE-SCR004가 조립)
- **Depends On:** CMP-SCR004-DETAIL, API-MATE-APPLICATIONS, INFRA-ADULT-VERIFICATION
- **Expected Files:** `src/components/screens/scr004/ApplyForm.tsx`
- **Functional AC:**
  - 500자 이내 참가 메시지를 `API-MATE-APPLICATIONS`로 제출한다(REQ-FUNC-034).
  - 중복 신청 시 서버 오류를 인라인으로 표시한다(REQ-FUNC-035).
  - 미로그인/미성년 사용자가 신청을 시도하면 `/account`로 유도하는 안내를 표시한다.
- **Visual AC:** 상세 패널 내 인라인 폼.
- **Security/Privacy AC:** 신청 메시지는 신청자 본인과 글 작성자만 조회 가능(RLS).
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1

#### 39. `CMP-SCR004-REPORT` — 신고 모달

- **Category:** Component
- **Implementation Status:** IMPLEMENT(간소화)
- **Requirement Ref:** REQ-FUNC-039
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(PAGE-SCR004가 조립)
- **Depends On:** CMP-SCR004-DETAIL, API-REPORTS
- **Expected Files:** `src/components/screens/scr004/ReportModal.tsx`
- **Functional AC:** 사유코드 Select + 설명 textarea로 `API-REPORTS`에 제출하고, 접수번호를 3초 이내 표시한다(REQ-FUNC-039).
- **Visual AC:** Modal(`{elevation.drawer-modal}` + scrim), 44px 닫기 버튼.
- **Security/Privacy AC:** 해당 없음(신고자 정보는 서버 세션에서 자동 채움).
- **Verify:** E2E-MATE-AUTH
- **Priority:** P2

#### 40. `CMP-SCR004-BLOCK` — 차단 버튼·확인

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-040
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(PAGE-SCR004가 조립)
- **Depends On:** CMP-SCR004-DETAIL, API-BLOCKS
- **Expected Files:** `src/components/screens/scr004/BlockButton.tsx`
- **Functional AC:** 상세 패널에서 작성자 차단 액션을 제공하고 `API-BLOCKS` 호출 후 `CMP-COMMON-TOAST`로 결과를 알린다(REQ-FUNC-040).
- **Visual AC:** `button.secondary` 스타일, 확인 다이얼로그 포함.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-MATE-AUTH
- **Priority:** P2

#### 41. `CMP-SCR004-GUIDANCE-SAFETY` — 신청 방법 3단계 + 안전 안내 CTA

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** —(디자인 계약: 콘텐츠 계약 "신청 방법 3단계")
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(PAGE-SCR004가 조립)
- **Depends On:** —
- **Expected Files:** `src/components/screens/scr004/GuidanceSafety.tsx`
- **Functional AC:**
  - "모집글 확인 → 비공개 메시지로 참가 요청 → 작성자 승인 후 대화 시작" 3단계 안내를 표시한다.
  - 안전수칙 요약 + 신고/차단 안내 + "항공·숙소도 함께 준비하기" CTA(`/travel-tools`)를 CTA Banner로 표시한다.
- **Visual AC:** 3단계 안내 + CTA Banner.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-MATE-AUTH
- **Priority:** P2

### 6.5 SCR-005

#### 42. `CMP-SCR005-AUTH` — Guest 인증 Card(로그인/가입/재설정)

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-066
- **Screen:** SCR-005
- **Route:** `/account`
- **Page Entry:** `src/app/account/page.tsx`(PAGE-SCR005가 조립)
- **Depends On:** INFRA-AUTH-SESSION, CMP-COMMON-TOAST
- **Expected Files:** `src/components/screens/scr005/AuthCard.tsx`
- **Functional AC:**
  - Guest(비로그인) 상태에서만 렌더링한다(로그인 상태면 이 컴포넌트 대신 `CMP-SCR005-PROFILE`/`CMP-SCR005-MY-ACTIVITY`가 렌더링된다 — 역할에 없는 영역은 렌더링하지 않음).
  - 로그인/회원가입/비밀번호 재설정 서브탭 + 이메일+비밀번호 Form을 제공한다(REQ-FUNC-066).
  - 계정 Intro(로그인 시 가능한 것 안내) + 회원 혜택 안내(동행 글 작성·참가 요청, 즐겨찾기 저장, 내 활동 확인 3개 항목) + 보안 안내(비밀번호 암호화 저장, 신원 보증 안 함 고지)를 표시한다.
- **Visual AC:** Form 좌우 분할(Desktop)/세로 스택(Mobile).
- **Security/Privacy AC:** 로그인 실패는 구체 사유를 노출하지 않는 일반 오류 메시지로 표시한다.
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1

#### 43. `CMP-SCR005-PROFILE` — Member 프로필 탭

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-045, REQ-FUNC-068
- **Screen:** SCR-005
- **Route:** `/account`
- **Page Entry:** `src/app/account/page.tsx`(PAGE-SCR005가 조립)
- **Depends On:** INFRA-AUTH-SESSION, INFRA-ADULT-VERIFICATION, INFRA-USER-DELETE, CMP-COMMON-FAVORITES-SHARE
- **Expected Files:** `src/components/screens/scr005/ProfileTab.tsx`
- **Functional AC:**
  - 닉네임, 연령대, 여행 스타일(필수), 성별(선택), 자기소개를 편집한다(REQ-FUNC-029).
  - 성인 확인 상태(완료/미완료) 및 확인 시각을 표시하고, 미완료 시 확인 절차로 안내한다(REQ-FUNC-028).
  - 비밀번호 변경, 즐겨찾기 목록(`localStorage`, REQ-FUNC-068), 회원 탈퇴(`INFRA-USER-DELETE` 호출)를 제공한다(REQ-FUNC-045).
- **Visual AC:** Member 상태로만 렌더링(Guest/Admin과 혼합 렌더링 금지).
- **Security/Privacy AC:** 생년월일 입력 필드를 두지 않는다.
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1

#### 44. `CMP-SCR005-MY-ACTIVITY` — Member 내 활동 탭

- **Category:** Component
- **Implementation Status:** IMPLEMENT / IMPLEMENT(축소, 자동마감표시)
- **Requirement Ref:** REQ-FUNC-036, REQ-FUNC-037(축소), REQ-FUNC-038, REQ-FUNC-040
- **Screen:** SCR-005
- **Route:** `/account`
- **Page Entry:** `src/app/account/page.tsx`(PAGE-SCR005가 조립)
- **Depends On:** API-MATE-POSTS, API-MATE-APPLICATIONS, API-BLOCKS, CMP-COMMON-EMPTY-STATE
- **Expected Files:** `src/components/screens/scr005/MyActivityTab.tsx`
- **Functional AC:**
  - "내가 쓴 동행 글" 목록(상태 배지, 수정·마감·삭제 액션) + "받은 참가 요청"(승인/거절, REQ-FUNC-036) + "내가 보낸 참가 신청"(상태별 목록, REQ-FUNC-034) + "차단 목록"(해제 버튼, REQ-FUNC-040) + "새 동행 글 작성" CTA(`/travel-tools`)를 표시한다.
  - 승인된 신청자가 있는 글을 수정/마감하면 확인 모달로 경고한다(REQ-FUNC-038).
  - 각 목록이 0건이면 상황별 문구("아직 작성한 동행 글이 없어요" 등) + "동행 글 작성하기"/"동행 찾아보기" CTA의 Empty State로 대체한다.
- **Visual AC:** 탭 구조, `card.mate` 관리형 변형.
- **Security/Privacy AC:** 본인 글/신청만 노출(RLS 의존).
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1

#### 45. `CMP-SCR005-ADMIN` — Admin 관리 영역(신고 큐·외부 URL)

- **Category:** Component
- **Implementation Status:** IMPLEMENT(간소화)
- **Requirement Ref:** REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-077
- **Screen:** SCR-005
- **Route:** `/account`
- **Page Entry:** `src/app/account/page.tsx`(PAGE-SCR005가 조립)
- **Depends On:** API-ADMIN-SETTINGS
- **Expected Files:** `src/components/screens/scr005/AdminConsole.tsx`
- **Functional AC:**
  - Moderator/Admin 역할에서만 "관리" 영역을 렌더링한다(일반 Member/Guest에게는 이 컴포넌트 자체를 렌더링하지 않는다 — role 판정은 서버에서 수행).
  - 신고 큐: 대상/사유코드/접수시각/상태 목록 + OPEN→RESOLVED/DISMISSED 상태 변경 + 대상 게시물 숨김 액션(REQ-FUNC-041, 042).
  - 외부 URL 설정: `FLIGHT_OUTBOUND_URL`/`HOTEL_OUTBOUND_URL` 등 HTTPS 허용목록 Form(REQ-FUNC-077).
  - **통계 차트·대시보드 시각화는 사용하지 않고 목록 + 상태 변경 액션으로만 구성한다**(D-001 § Do Not, `docs/PROJECT_SCOPE.md` §2).
- **Visual AC:** 관리 Intro 1~2문장 + 목록형 UI(카드 그리드 아님).
- **Security/Privacy AC:** 클라이언트에서 role을 신뢰하지 않고 `API-ADMIN-SETTINGS` 서버 측 role 검사에 의존한다.
- **Verify:** E2E-MATE-AUTH, TEST-RLS-BASIC
- **Priority:** P2

### 6.6 공통(Common)

#### 46. `CMP-COMMON-HEADER-FOOTER` — 전역 Header/Footer(`layout.tsx`)

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-064
- **Screen:** 공통(5개 Screen)
- **Route:** 공통(5개 Route)
- **Page Entry:** `src/app/layout.tsx`
- **Depends On:** INFRA-AUTH-SESSION
- **Expected Files:** `src/components/common/Header.tsx`, `src/components/common/Footer.tsx`, `src/app/layout.tsx`(수정)
- **Functional AC:**
  - Header: 좌측 `Free Traveler` 워드마크, 중앙 내비게이션(여행지/여행 준비/동행 찾기/대표 소개), 우측 계정 영역(로그인 전 "로그인" 버튼 / 로그인 후 아바타+닉네임 메뉴). 활성 라우트는 코랄 텍스트+밑줄.
  - Footer: 3열(서비스 소개/정책/안전 정보 출처), legal band, Mobile 1열 스택.
  - 핵심 6개 기능과 정책 페이지에 2회 이내 이동 가능해야 한다(REQ-FUNC-064 AC).
- **Visual AC:** Desktop 72px 높이, 하단 1px `{colors.hairline}`. Mobile은 로고+햄버거로 축약, 내비게이션은 풀스크린 시트.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- **Priority:** P0

#### 47. `CMP-COMMON-RESPONSIVE-LAYOUT` — 320px~Desktop 반응형 레이아웃 규칙

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-065, REQ-NF-006
- **Screen:** 공통(5개 Screen)
- **Route:** 공통(5개 Route)
- **Page Entry:** `src/app/layout.tsx`, `src/app/globals.css`
- **Depends On:** —
- **Expected Files:** `src/app/globals.css`(Tailwind 기반 토큰/브레이크포인트 정의), `tailwind.config.ts`(필요 시)
- **Functional AC:**
  - `design-reference/D-001/DESIGN.md`의 Color/Typography/Spacing/Radius/Shadow 토큰을 Tailwind 테마로 등록한다.
  - Desktop 1440px 기준·콘텐츠 1200-1280px 중앙 정렬, Mobile 390px·좌우 16-20px 여백, Tablet 744-1279px 2열 전환 규칙을 전역 유틸로 제공한다.
  - 320px부터 가로 스크롤·겹침 없이 핵심 기능이 동작해야 한다(REQ-FUNC-065 AC).
- **Visual AC:** 모든 화면이 D-001 토큰만 사용하고 임의 색상을 추가하지 않는다(D-001 § Do Not).
- **Security/Privacy AC:** 해당 없음.
- **Verify:** TEST-A11Y-AXE(뷰포트 포함), E2E-PUBLIC-SMOKE(모바일 뷰포트)
- **Priority:** P0

#### 48. `CMP-COMMON-SEO-METADATA` — Next Metadata API 공통 적용

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-070, REQ-NF-030
- **Screen:** 공통(5개 Screen)
- **Route:** 공통(5개 Route)
- **Page Entry:** 5개 `page.tsx` + `src/app/layout.tsx`
- **Depends On:** —
- **Expected Files:** `src/lib/seo/metadata.ts`, 각 `page.tsx`에 `generateMetadata`/`metadata` export 추가(구현 시)
- **Functional AC:** 5개 공개 페이지 각각에 title, description, canonical, Open Graph, 구조화 데이터를 제공한다(REQ-FUNC-070). SEO 자동 검사에서 필수 메타 누락 0건을 목표로 한다(REQ-NF-030).
- **Visual AC:** 해당 없음(비시각 요소).
- **Security/Privacy AC:** 해당 없음.
- **Verify:** 코드 리뷰(메타 태그 존재 확인)
- **Priority:** P2

#### 49. `CMP-COMMON-FAVORITES-SHARE` — 즐겨찾기(localStorage) + URL 공유 훅

- **Category:** Component
- **Implementation Status:** IMPLEMENT(축소)
- **Requirement Ref:** REQ-FUNC-068, REQ-FUNC-069
- **Screen:** 공통(SCR-001, SCR-004, SCR-005에서 소비)
- **Route:** 공통
- **Page Entry:** —(훅/유틸, 특정 Page Entry 소유 없음)
- **Depends On:** —
- **Expected Files:** `src/lib/hooks/useFavorites.ts`, `src/lib/hooks/useShare.ts`
- **Functional AC:**
  - **즐겨찾기는 서버 저장이 아닌 `localStorage`에만 저장한다**(`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙). 여행지 ID 기준 중복 추가를 방지한다(REQ-FUNC-068).
  - URL 공유는 Web Share API를 우선 사용하고, 미지원 브라우저에서는 클립보드 복사로 폴백한다(REQ-FUNC-069).
- **Visual AC:** 해당 없음(소비 컴포넌트의 Visual AC를 따름).
- **Security/Privacy AC:** `localStorage` 값에 개인정보를 저장하지 않는다(여행지 ID만 저장).
- **Verify:** E2E-PUBLIC-SMOKE(중복 방지 assertion)
- **Priority:** P1

#### 50. `CMP-COMMON-TOAST` — Toast 알림(성공/오류)

- **Category:** Component
- **Implementation Status:** IMPLEMENT(축소)
- **Requirement Ref:** REQ-FUNC-043
- **Screen:** 공통(5개 Screen)
- **Route:** 공통(5개 Route)
- **Page Entry:** —(공용 컴포넌트)
- **Depends On:** —
- **Expected Files:** `src/components/common/Toast.tsx`, `src/lib/hooks/useToast.ts`
- **Functional AC:**
  - **참가 요청 접수·승인·거절·신고 처리 결과 등은 인앱 Toast로만 알린다. 실제 이메일 발송은 만들지 않는다**(`docs/PROJECT_SCOPE.md` §1, REQ-FUNC-043 축소 범위).
  - 알림 상태는 1분 이내 화면에 반영되어야 한다(REQ-FUNC-043 AC 취지, 클라이언트 갱신 기준).
- **Visual AC:** 위치 우하단(Desktop)/상단(Mobile), `{rounded.md}`, 3-5초 자동 소멸 + 수동 닫기. 성공은 `{colors.success}` 아이콘, 오류는 `{colors.danger}` 아이콘 좌측 배치.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-MATE-AUTH(Toast 노출 assertion)
- **Priority:** P1

#### 51. `CMP-COMMON-EMPTY-STATE` — 완성형 Empty State 공용 컴포넌트

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-005(지원)
- **Screen:** 공통(5개 Screen)
- **Route:** 공통(5개 Route)
- **Page Entry:** —(공용 컴포넌트)
- **Depends On:** —
- **Expected Files:** `src/components/common/EmptyState.tsx`
- **Functional AC:**
  - **3요소를 props로 강제한다**: ① 상황 설명 한 문장(왜 비어 있는지) ② 이용 방법 또는 조건 안내 ③ 다음 행동 CTA 버튼. 아이콘/일러스트는 장식용으로만 허용하며 텍스트 없이 아이콘만 두는 사용을 금지한다(D-001 § Empty State 규칙).
  - Lorem ipsum, "준비 중", "정보 확인 필요" 등 자리표시 문구를 props/기본값 어디에도 두지 않는다.
- **Visual AC:** 모든 Empty State 사용처(CMP-SCR001-DESTINATION-GRID, CMP-SCR001-RECENT-MATES, CMP-SCR004-LIST, CMP-SCR005-MY-ACTIVITY)가 이 컴포넌트를 재사용한다.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** TEST-A11Y-AXE, E2E-PUBLIC-SMOKE/E2E-MATE-AUTH의 Empty 상태 시나리오
- **Priority:** P1

#### 52. `CMP-COMMON-ERROR-BOUNDARIES` — 404/500/권한없음/외부연결실패 경계

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-078
- **Screen:** —(기술 Route, Screen 수에 미포함)
- **Route:** 기술 Route(전체 미매칭 경로/렌더 오류/권한없음)
- **Page Entry:** `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/unauthorized.tsx`
- **Depends On:** —
- **Expected Files:** `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/unauthorized.tsx`
- **Functional AC:**
  - 404(`not-found.tsx`)/500(`error.tsx`)/권한없음(`unauthorized.tsx`)/외부연결실패(각 폼 인라인 오류로 처리, `CMP-SCR003-FLIGHT-FORM`/`HOTEL-FORM` 참조) 화면 각각에 홈/이전/재시도 중 최소 1개 복구 행동을 제공한다(REQ-FUNC-078).
- **Visual AC:** 5개 Page Owner와 톤을 공유하되, 어떤 Page Owner의 Expected Files에도 포함하지 않는 독립 파일이다(규칙 16 — 한 Task가 여러 Page Entry를 겸하지 않음: 이 Task는 Page Owner가 아니라 기술 경계 전용 Task).
- **Security/Privacy AC:** 500 화면에 스택 트레이스 등 민감 정보를 노출하지 않는다.
- **Verify:** 코드 리뷰, E2E-PUBLIC-SMOKE(404 시나리오)
- **Priority:** P1

#### 53. `CMP-COMMON-ARIA-PATTERNS` — 폼·모달·탭·알림 공용 ARIA 패턴

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-079, REQ-NF-023
- **Screen:** 공통(5개 Screen)
- **Route:** 공통(5개 Route)
- **Page Entry:** —(공용 프리미티브)
- **Depends On:** —
- **Expected Files:** `src/components/common/Modal.tsx`, `src/components/common/Tabs.tsx`, `src/components/common/FormField.tsx`
- **Functional AC:**
  - 폼(라벨-입력 연결, `aria-describedby` 오류 연결), 모달(포커스 트랩, `role="dialog"`), 탭(`role="tablist"`/`aria-selected`), 알림(`role="status"`/`aria-live`)의 공용 패턴을 제공한다(REQ-FUNC-079).
  - 키보드 포커스는 항상 `{colors.focus-ring}` 2px 아웃라인+2px 오프셋으로 표시하며 `outline: none`으로 제거하지 않는다(D-001 접근성 원칙, REQ-NF-023).
  - 모든 클릭 가능 요소는 최소 44×44px 히트 영역을 확보한다.
- **Visual AC:** 해당 없음(접근성 프리미티브).
- **Security/Privacy AC:** 해당 없음.
- **Verify:** TEST-A11Y-AXE, RELEASE-CHECK-MANUAL(키보드·스크린리더 수동)
- **Priority:** P1

---

## 7. Task 상세 — Page Owner

#### 54. `PAGE-SCR001` — 메인 화면 조립 (`/`)

- **Category:** Page Owner
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-001~010, 047~054, 057, 064, 065, 067~070(조립 수준)
- **Screen:** SCR-001
- **Route:** `/`
- **Page Entry:** `src/app/page.tsx`
- **Depends On:** CMP-SCR001-HERO-SEARCH, CMP-SCR001-DESTINATION-GRID, CMP-SCR001-DESTINATION-DETAIL-DRAWER, CMP-SCR001-SAFETY-SECTION, CMP-SCR001-RECENT-MATES, CMP-SCR001-ABOUT-SUMMARY, CMP-COMMON-HEADER-FOOTER, CMP-COMMON-EMPTY-STATE, DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE
- **Expected Files:** `src/app/page.tsx`(create-next-app 스타터 템플릿 완전 교체 — 현재 `next.svg`, "To get started, edit the page.tsx", Vercel/Next.js 학습 링크가 남아 있음)
- **Functional AC:**
  - **Section 순서**(Header 제외 본문): 1) Hero(통합 검색) 2) 국내 여행지 6개 3) 해외 여행지 6개 4) 여행 동기(테마) 6개 5) 국가별 주의사항 6개 6) 최근 동행글 3개 또는 완성형 Empty State 7) free_traveler 소개 — 화면별 콘텐츠 계약과 정확히 일치해야 한다.
  - **Section별 데이터 출처**: 2·3은 `DATA-DESTINATIONS`(scope=DOMESTIC/OVERSEAS), 5는 `DATA-SAFETY`, 6은 Supabase `mate_posts`(`DB-ACCESS`), 7은 `DATA-REPRESENTATIVE`.
  - **최소 Card 수**: 국내 6, 해외 6, 테마 Chip 6, 안전정보 6, 최근 동행 최대 3(0건이면 Empty State).
  - **반응형 콘텐츠 밀도**: Desktop Card Grid 3열 → Tablet 2열 → Mobile 1열. Hero는 Desktop 뷰포트 60-70%로 제한해 로드 즉시 다음 Section 상단이 보이게 한다.
  - 모든 Component/Data Task를 실제로 연결한다(더미 데이터·하드코딩 텍스트 금지).
- **Visual AC:**
  - **Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 빈 카드를 절대 두지 않는다.**
  - 콘텐츠가 없는 Section(최근 동행 0건 등)은 `CMP-COMMON-EMPTY-STATE`(상황 설명+이용 방법+CTA 3요소)로 대체하며, 빈 화면이나 무한 스피너를 남기지 않는다.
  - D-001 토큰(Color/Typography/Radius/Spacing/Shadow) 외 임의 색상·폰트를 추가하지 않는다.
- **Security/Privacy AC:** 해당 없음(공개 페이지, 로그인 불필요).
- **Verify:** E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- **Priority:** P1

#### 55. `PAGE-SCR002` — 대표 소개 화면 조립 (`/about`)

- **Category:** Page Owner
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-057~063, 064, 065
- **Screen:** SCR-002
- **Route:** `/about`
- **Page Entry:** `src/app/about/page.tsx`
- **Depends On:** CMP-SCR002-HERO-PROFILE, CMP-SCR002-STATS-STORY, CMP-SCR002-TIMELINE, CMP-SCR002-COUNTRIES-GALLERY, CMP-SCR002-FAVORITE-DESTINATIONS-CTA, CMP-COMMON-HEADER-FOOTER, DATA-REPRESENTATIVE, DATA-DESTINATIONS
- **Expected Files:** `src/app/about/page.tsx`(신규 생성)
- **Functional AC:**
  - **Section 순서**: 1) Profile Hero 2) 여행 지표 3) 소개·철학 4) Timeline 6개 5) 방문 국가 30개 6) Gallery 8개 7) 기억에 남는 여행지 4개 + CTA.
  - **데이터 출처**: 전 Section `DATA-REPRESENTATIVE`, 7번만 `DATA-DESTINATIONS` 딥링크.
  - **최소 수**: Timeline 6, 방문 국가 30, Gallery 8, 추천 여행지 4.
  - **반응형 밀도**: Hero 좌우 분할→Mobile 세로 스택, Gallery Desktop Grid→Mobile 1~2열.
- **Visual AC:**
  - Lorem ipsum·"준비 중"·"정보 확인 필요"·빈 카드 금지. 정적 콘텐츠 화면이라 Empty State가 발생하지 않지만, 이미지 로드 실패 시 대체 배경+alt 텍스트를 노출한다.
  - D-001 토큰만 사용한다.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P1

#### 56. `PAGE-SCR003` — 통합 여행 준비 화면 조립 (`/travel-tools`)

- **Category:** Page Owner
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-011~032, 054, 064, 065, 080
- **Screen:** SCR-003
- **Route:** `/travel-tools`
- **Page Entry:** `src/app/travel-tools/page.tsx`
- **Depends On:** CMP-SCR003-INTRO-TABS, CMP-SCR003-FLIGHT-FORM, CMP-SCR003-HOTEL-FORM, CMP-SCR003-MATE-WRITE-FORM, CMP-COMMON-HEADER-FOOTER, CMP-COMMON-TOAST, API-MATE-POSTS, INFRA-AUTH-SESSION, INFRA-ADULT-VERIFICATION
- **Expected Files:** `src/app/travel-tools/page.tsx`(신규 생성)
- **Functional AC:**
  - **Section 순서**: 1) Intro(3단계 안내) 2) 탭(항공편/숙소/동행 구하기) 3) 여행정보 Form(선택 탭에 따라 항공 또는 숙소) 4) 입력 요약·외부 이동 5) 찾기 Tip 3개 6) 동행 작성 또는 로그인 안내·안전 안내.
  - **항공·숙소·동행 작성 영역은 각각 별도 Component(`CMP-SCR003-FLIGHT-FORM`/`HOTEL-FORM`/`MATE-WRITE-FORM`)로 분리해 조립한다(규칙 9).** 탭 전환은 실제로 3개 탭 모두 완전히 동작해야 한다(스텁 금지).
  - **데이터 출처**: 항공/숙소 입력은 브라우저 세션 상태(서버 없음), 동행 작성은 `API-MATE-POSTS`.
  - Tip 최소 3개.
- **Visual AC:**
  - Lorem ipsum·"준비 중"·빈 카드 금지. 완성형 Empty State가 필요한 목록형 Section은 없음(폼 화면).
  - Desktop Form+Tip 좌우 분할, Mobile 세로 스택.
- **Security/Privacy AC:** 항공·숙소 폼의 국가·지역·날짜 입력값은 서버·DB·URL query·분석 이벤트 어디에도 전달하지 않는다(REQ-FUNC-017, 025, CON-01, CON-02 — `CMP-SCR003-FLIGHT-FORM`/`HOTEL-FORM`의 Security/Privacy AC 상속).
- **Verify:** E2E-TRAVEL-TOOLS, UNIT-TRAVEL-DATES
- **Priority:** P1

#### 57. `PAGE-SCR004` — 동행 조회 화면 조립 (`/mates`)

- **Category:** Page Owner
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-030, 033~040, 064, 065, 069
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`
- **Depends On:** CMP-SCR004-INTRO-CTA, CMP-SCR004-FILTER, CMP-SCR004-LIST, CMP-SCR004-DETAIL, CMP-SCR004-APPLY, CMP-SCR004-REPORT, CMP-SCR004-BLOCK, CMP-SCR004-GUIDANCE-SAFETY, CMP-COMMON-HEADER-FOOTER, CMP-COMMON-EMPTY-STATE, API-MATE-APPLICATIONS, API-REPORTS, API-BLOCKS
- **Expected Files:** `src/app/mates/page.tsx`(신규 생성)
- **Functional AC:**
  - **Section 순서**: 1) Intro 2) Filter·결과 요약 3) 동행 목록(최대 8+더보기) 4) 상세 5) 신청 방법 3단계 6) 안전·신고·차단 안내와 CTA.
  - **데이터 출처**: Supabase `mate_posts`/`mate_applications`/`blocks`(`DB-ACCESS`).
  - **반응형 콘텐츠 밀도**: Desktop 좌(목록)+우(상세) 동시 분할, Mobile은 목록 단일 컬럼 + 상세 하단 Drawer(좌우 분할 유지 금지).
- **Visual AC:**
  - Lorem ipsum·"준비 중"·빈 카드 금지.
  - 검색 결과 0건/전체 글 0건은 `CMP-COMMON-EMPTY-STATE`(상황 설명+필터 초기화+"첫 동행 글 작성하기" CTA)로 대체한다.
- **Security/Privacy AC:** 목록·상세 응답에 이메일·전화번호를 포함하지 않는다. 참가 신청은 로그인·성인확인 세션을 서버에서 재검증한다.
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1

#### 58. `PAGE-SCR005` — 계정·관리 화면 조립 (`/account`)

- **Category:** Page Owner
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-027~029, 036~038, 040~042, 045, 064, 065, 066, 068, 077
- **Screen:** SCR-005
- **Route:** `/account`
- **Page Entry:** `src/app/account/page.tsx`
- **Depends On:** CMP-SCR005-AUTH, CMP-SCR005-PROFILE, CMP-SCR005-MY-ACTIVITY, CMP-SCR005-ADMIN, CMP-COMMON-HEADER-FOOTER, CMP-COMMON-EMPTY-STATE, INFRA-AUTH-SESSION, INFRA-USER-DELETE, API-ADMIN-SETTINGS
- **Expected Files:** `src/app/account/page.tsx`(신규 생성)
- **Functional AC:**
  - **역할별 조립(규칙 11)**: Auth(Guest), Profile(Member), My Activity(Member), Admin(Moderator/Admin)을 각각 독립 Component로 분리하고, **현재 세션 역할에 해당하지 않는 영역은 렌더링 자체를 하지 않는다**(props로 숨기는 CSS 방식 금지 — 서버에서 역할을 판정해 컴포넌트 트리에서 제외).
  - Guest·Member·Admin 중 현재 역할의 **Intro → 핵심 작업 → 도움말 또는 다음 행동** 순서를 지킨다(콘텐츠 계약).
    - Guest: 계정 Intro → 인증 Form(핵심 작업) → 회원 혜택 안내/보안 안내(도움말).
    - Member: 프로필/내 활동 탭 Intro → 프로필 편집·글 관리·신청 관리(핵심 작업) → 새 글 작성 CTA(다음 행동).
    - Admin: 관리 Intro → 신고 처리·외부 URL 설정(핵심 작업) → 처리 결과 상태(도움말).
  - Admin 관리 탭은 신고 상태 변경 + 외부 URL 설정 2개만 제공한다(콘텐츠 CRUD 탭 없음, `docs/PROJECT_SCOPE.md` §2).
- **Visual AC:**
  - Lorem ipsum·"준비 중"·빈 카드 금지.
  - 내 글/신청/차단 목록 0건은 `CMP-COMMON-EMPTY-STATE`로 대체한다.
  - 관리 영역은 통계 차트 없이 목록+상태 변경 액션으로만 구성한다.
- **Security/Privacy AC:** 관리 탭은 클라이언트 role 값을 신뢰하지 않고, 서버(API-ADMIN-SETTINGS, 미들웨어)에서 role을 재검증한 뒤에만 렌더링 데이터를 채운다.
- **Verify:** E2E-MATE-AUTH, TEST-RLS-BASIC
- **Priority:** P1

---

## 8. Task 상세 — Test

#### 59. `UNIT-TRAVEL-DATES` — 날짜 검증 Unit Test

- **Category:** Test(Unit)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-013, REQ-FUNC-021
- **Screen:** — (SCR-003 검증)
- **Route:** —
- **Page Entry:** —
- **Depends On:** CMP-SCR003-FLIGHT-FORM, CMP-SCR003-HOTEL-FORM
- **Expected Files:** `tests/unit/travel-dates.test.ts`
- **Functional AC:**
  - 항공: 출발일<오늘, 귀국일<출발일 케이스가 모두 차단되는지 경계값(오늘, 오늘-1, 동일일) 테스트.
  - 호텔: 체크인<오늘, 체크아웃≤체크인 케이스가 모두 차단되는지 경계값 테스트.
  - statement coverage 80% 이상, 핵심 규칙(날짜 검증) 100% 커버를 목표로 한다(`docs/02_SRS_BASELINE.md.md` §6.8.1).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** CI-LINT-TYPECHECK-DATA에서 자동 실행
- **Priority:** P1

#### 60. `UNIT-CONTACT-DETECTION` — 연락처 탐지 Unit Test

- **Category:** Test(Unit)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-032
- **Screen:** — (SCR-003 검증)
- **Route:** —
- **Page Entry:** —
- **Depends On:** INFRA-CONTACT-DETECTION
- **Expected Files:** `tests/unit/contact-detection.test.ts`
- **Functional AC:**
  - 기준 테스트셋(전화번호/이메일/카카오톡·텔레그램 ID 패턴 + 정상 문장 오탐 케이스)으로 탐지율 95% 이상, 오탐률 5% 이하를 검증한다(REQ-FUNC-032 AC).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 테스트 픽스처에 실제 개인 연락처를 사용하지 않는다(가짜 패턴만).
- **Verify:** CI-LINT-TYPECHECK-DATA에서 자동 실행
- **Priority:** P1

#### 61. `UNIT-MATE-STATE` — 모집글/신청 상태 전이 Unit Test

- **Category:** Test(Unit)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038
- **Screen:** — (SCR-004/SCR-005 검증)
- **Route:** —
- **Page Entry:** —
- **Depends On:** API-MATE-POSTS, API-MATE-APPLICATIONS
- **Expected Files:** `tests/unit/mate-state.test.ts`
- **Functional AC:**
  - `mate_posts` 상태 전이(OPEN→CLOSED/HIDDEN/DELETED, 종료일 경과 시 조회 시점 CLOSED 계산 포함)를 테스트한다.
  - `mate_applications` 상태 전이(PENDING→ACCEPTED/REJECTED/WITHDRAWN)와 중복 PENDING/ACCEPTED 차단 로직을 테스트한다.
  - 비작성자의 승인/거절 시도가 거부되는지 테스트한다(REQ-FUNC-036).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** CI-LINT-TYPECHECK-DATA에서 자동 실행
- **Priority:** P1

#### 62. `TEST-RLS-BASIC` — RLS 정책 기본 Integration Test

- **Category:** Test(Integration)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-044, REQ-FUNC-077, REQ-NF-013
- **Screen:** — (전체 Screen의 데이터 접근 경로 검증)
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-RLS-BASE, DB-SEED-BASE
- **Expected Files:** `tests/integration/rls.test.ts`
- **Functional AC:**
  - 본인/상대방/비회원/Moderator/Admin 각 역할로 `mate_applications`, `blocks`, `reports`, `profiles` 비공개 필드에 대한 부정 접근을 시도하고 전부 403 또는 빈 결과인지 검증한다(REQ-FUNC-044 AC).
  - Guest/Member/Moderator 역할로 `app_settings`를 직접 SELECT/UPDATE 시도해 전부 거부되는지(서버 Route Handler 경유만 허용) 검증한다(REQ-FUNC-077).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 테스트 자체가 이 Task의 핵심 목적(보안 검증)이다.
- **Verify:** CI-LINT-TYPECHECK-DATA(가능 시) 또는 별도 통합테스트 파이프라인에서 실행
- **Priority:** P1

#### 63. `TEST-A11Y-AXE` — axe-core 자동 접근성 검사

- **Category:** Test(A11y)
- **Implementation Status:** IMPLEMENT(축소)
- **Requirement Ref:** REQ-NF-024
- **Screen:** SCR-001~SCR-005(핵심 5화면)
- **Route:** 공통(5개 Route)
- **Page Entry:** —
- **Depends On:** PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005
- **Expected Files:** `tests/e2e/a11y.spec.ts`
- **Functional AC:** Playwright + `@axe-core/playwright`로 5개 핵심 화면(4+1)에서 serious/critical 위반 0건을 목표로 한다(REQ-NF-024, `docs/PROJECT_SCOPE.md` §4.5 축소 범위 — 핵심 화면만 대상).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** CI-LINT-TYPECHECK-DATA 또는 별도 E2E 파이프라인
- **Priority:** P2

#### 64. `TEST-DATA-VALIDATION` — 정적 데이터 완전성·수량 검증 스크립트

- **Category:** Test(Data Validation)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-008, REQ-FUNC-046, REQ-FUNC-074, REQ-NF-026, REQ-NF-027, REQ-NF-028(축소)
- **Screen:** — (SCR-001/002 데이터 검증)
- **Route:** —
- **Page Entry:** —
- **Depends On:** DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE
- **Expected Files:** `scripts/validate_content.ts`
- **Functional AC:**
  - 국내 10개 이상, 해외 15개국 30개 도시 이상 검증(REQ-FUNC-008).
  - 모든 해외 국가에 안전정보 1:1 매핑 검증(REQ-FUNC-046).
  - 여행지 필수 필드(명소 5+, 음식 3+, 에티켓 3+, 출처 1+), 안전정보 8개 카테고리 존재 검증(REQ-NF-026, 027).
  - 게시 전 완전성 게이트: 누락 목록을 반환하고, 미충족 시 CI를 실패시킨다(REQ-FUNC-074).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** CI-LINT-TYPECHECK-DATA에서 실행
- **Priority:** P1

#### 65. `E2E-PUBLIC-SMOKE` — 공개 흐름 E2E(여행지·안전정보·대표소개)

- **Category:** Test(E2E)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-001~010, 047~054, 057~063, 064, 065, 067, 069, 070
- **Screen:** SCR-001, SCR-002
- **Route:** `/`, `/about`
- **Page Entry:** —
- **Depends On:** PAGE-SCR001, PAGE-SCR002
- **Expected Files:** `tests/e2e/public-smoke.spec.ts`
- **Functional AC:**
  - 여행지 탐색·필터·빈 결과(REQ-FUNC-001,002,005), 여행지 상세→안전정보 연결(REQ-FUNC-006), 안전정보 열람 및 stale 경고(REQ-FUNC-050), 대표 소개 열람(REQ-FUNC-057~063)을 각 1개 이상 시나리오로 커버한다(`docs/PROJECT_SCOPE.md` §6 핵심 흐름).
  - Playwright(Chromium)로 실행한다.
- **Visual AC:** 해당 없음(테스트 스펙).
- **Security/Privacy AC:** 해당 없음.
- **Verify:** CI-LINT-TYPECHECK-DATA
- **Priority:** P2

#### 66. `E2E-TRAVEL-TOOLS` — 항공·호텔 흐름 E2E

- **Category:** Test(E2E)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-011~026, 054
- **Screen:** SCR-003
- **Route:** `/travel-tools`
- **Page Entry:** —
- **Depends On:** PAGE-SCR003
- **Expected Files:** `tests/e2e/travel-tools.spec.ts`
- **Functional AC:**
  - 항공 입력→검증 오류→요약→외부 이동(새 탭, query 없음, `noopener,noreferrer` 속성 확인) 시나리오.
  - 호텔 동일 시나리오.
  - **입력값이 네트워크 요청(XHR/fetch)이나 URL query에 포함되지 않는지 네트워크 탭 assertion으로 확인한다**(REQ-FUNC-017, 025 핵심 검증).
  - Playwright(Chromium)로 실행한다.
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 이 Task의 핵심 목적이 개인정보 비전달 검증이다.
- **Verify:** CI-LINT-TYPECHECK-DATA
- **Priority:** P2

#### 67. `E2E-MATE-AUTH` — 인증·동행·신고·관리자 흐름 E2E

- **Category:** Test(E2E)
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-027~045, 066, 077, 041, 042
- **Screen:** SCR-003, SCR-004, SCR-005
- **Route:** `/travel-tools`, `/mates`, `/account`
- **Page Entry:** —
- **Depends On:** PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, DB-SEED-BASE
- **Expected Files:** `tests/e2e/mate-auth.spec.ts`
- **Functional AC:**
  - 회원가입·로그인·성인확인(REQ-FUNC-066, 028) → 동행글 작성(연락처 탐지 차단 케이스 포함, REQ-FUNC-031, 032) → 참가 요청(REQ-FUNC-034) → 승인/거절(REQ-FUNC-036) → 신고(REQ-FUNC-039) → 차단(REQ-FUNC-040) → 관리자 신고 처리·외부 URL 설정(REQ-FUNC-041, 042, 077)까지 하나의 연속 시나리오(또는 2~3개로 분할된 관련 시나리오)로 커버한다(`docs/PROJECT_SCOPE.md` §6).
  - Playwright(Chromium)로 실행하며 `DB-SEED-BASE` 시드 데이터를 사용한다.
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 테스트 계정은 실제 개인정보를 사용하지 않는다.
- **Verify:** CI-LINT-TYPECHECK-DATA
- **Priority:** P2

---

## 9. Task 상세 — CI / Release Check

#### 68. `CI-LINT-TYPECHECK-DATA` — Lint·Typecheck·데이터검증 CI 게이트

- **Category:** CI
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-NF-031
- **Screen:** —
- **Route:** —
- **Page Entry:** —
- **Depends On:** TEST-DATA-VALIDATION, UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION, UNIT-MATE-STATE
- **Expected Files:** `.github/workflows/ci.yml`(또는 동등 CI 설정)
- **Functional AC:**
  - `tsc --noEmit`, ESLint, `scripts/validate_content.ts`(TEST-DATA-VALIDATION), Unit Test 3종을 main 병합 전 게이트로 실행한다(REQ-NF-031).
  - Playwright E2E/axe는 별도 워크플로(또는 동일 워크플로의 후속 Job)로 실행하되 병합 필수 게이트 여부는 팀 결정에 맡긴다(Lighthouse CI 게이트는 REQ-NF-007 EXCLUDED이므로 포함하지 않는다).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** CI 로그에 `.env` 값·서비스 롤 키를 출력하지 않는다.
- **Verify:** 실제 PR에서 워크플로 성공 확인
- **Priority:** P1

#### 69. `DEPLOY-VERCEL-SUPABASE-CHECK` — Vercel/Supabase 배포·환경 확인

- **Category:** CI
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-NF-012, REQ-NF-016, REQ-NF-034
- **Screen:** —
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE, DB-RLS-BASE, INFRA-AUTH-SESSION
- **Expected Files:** `.env.example`, `supabase/config.toml`(검토), 배포 체크리스트(문서화는 이 Task 구현 시 별도 산출물로 생성 — 지금은 만들지 않음)
- **Functional AC:**
  - Vercel 프로젝트에 Next.js 앱을 배포하고 TLS 1.2+(REQ-NF-012, Vercel 기본 제공)를 확인한다.
  - 비밀키는 Vercel 환경변수로만 관리하고 클라이언트 번들에 포함되지 않음을 빌드 산출물 검사로 확인한다(REQ-NF-016).
  - Vercel/Supabase 무료~저가 티어 조합으로 월 인프라 비용(콘텐츠 인건비 제외) 100,000원 이하 목표를 요금제 문서로 검토한다(REQ-NF-034, 설계 원칙 — 별도 비용 모니터링 도구는 구축하지 않음).
  - EC2/AWS 등 별도 인프라를 구성하지 않는다(`docs/PROJECT_SCOPE.md` 아키텍처 원칙).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** `SUPABASE_SERVICE_ROLE_KEY` 등 서버 전용 값이 `NEXT_PUBLIC_` 접두사로 노출되지 않는지 확인한다.
- **Verify:** 배포 후 수동 확인(RELEASE-CHECK-MANUAL과 연계)
- **Priority:** P2

#### 70. `RELEASE-CHECK-MANUAL` — 브라우저 수동 릴리스 점검

- **Category:** Release Check
- **Implementation Status:** IMPLEMENT(목표/축소, 항목별로 아래 참조)
- **Requirement Ref:** REQ-NF-001, REQ-NF-002, REQ-NF-003, REQ-NF-004, REQ-NF-005, REQ-NF-019, REQ-NF-025, REQ-NF-028
- **Screen:** SCR-001~SCR-005(전체)
- **Route:** 공통(5개 Route)
- **Page Entry:** —
- **Depends On:** E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH, TEST-A11Y-AXE
- **Expected Files:** 없음(체크리스트 실행 Task — 결과는 릴리스 노트/체크리스트 문서에 기록하되 이번 작업에서는 문서를 생성하지 않는다)
- **Functional AC — 브라우저 확인이 필요해 자동화하지 않는 항목(규칙 4)을 모은다**:
  - Lighthouse 수동 측정으로 LCP p75 ≤2.5s, INP p75 ≤200ms, CLS p75 ≤0.1 목표 확인(REQ-NF-001~003, 목표치이며 지속 RUM 모니터링은 구축하지 않음).
  - 개발자 도구 타이밍으로 필터 응답(REQ-NF-004)·쓰기 API 응답(REQ-NF-005)·신고 접수 응답(REQ-NF-019)이 목표 이내인지 수동 확인(부하 테스트 아님, 단일 요청 기준).
  - 키보드 전용 탐색 + 스크린리더(NVDA/VoiceOver 등)로 핵심 UC(REQ-NF-025) 수동 통과 확인.
  - 안전정보 최신 확인 비율(7일 이내 95%+) 수동 점검(REQ-NF-028 축소, 지표 대시보드 없음).
  - 외부 링크(항공/호텔/외교부/SNS) 배포 전 수동 클릭 점검 체크리스트(REQ-NF-011 EXCLUDED의 대체 수단 — §10 참조).
- **Visual AC:** 위 점검을 Desktop 1440px, Mobile 390px 두 뷰포트에서 각각 수행한다.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** 사람이 직접 수행하고 결과를 PR/릴리스 노트에 기록(자동 스크립트 없음)
- **Priority:** P3

---

## 10. NON_IMPLEMENTATION — EXCLUDED Requirement (18개)

`docs/PROJECT_SCOPE.md`에서 EXCLUDED로 분류된 항목은 삭제하지 않고 아래에 근거와 후속 방향을 기록한다. **이 표의 어떤 항목에도 구현 Task를 연결하지 않는다(규칙 5).**

| Requirement | 근거(왜 제외했는가) | 후속 방향 |
|---|---|---|
| REQ-FUNC-055 | Editor/Admin 안전정보 작성·검수·게시 워크플로 — 콘텐츠는 `src/data` 코드 배포로 관리 | 콘텐츠 갱신이 잦아지면 별도 CMS 도입을 재검토 |
| REQ-FUNC-056 | 안전정보 변경 이력(이전값/새값/사유/담당자/시각) 보존 — 범용 감사 로그 제외 | git 커밋 이력으로 대체. 규제 요구 발생 시 감사 로그 스키마 추가 검토 |
| REQ-FUNC-071 | 행동 분석 이벤트(폼 시작/검증완료/외부클릭 등) — 커스텀 이벤트 파이프라인 미포함 | Vercel 기본 페이지 조회 지표로 1차 대체, 필요 시 GA4/PostHog 등 도입 검토 |
| REQ-FUNC-072 | Editor/Admin 콘텐츠 CRUD·미리보기 — 전체 콘텐츠 CMS 제외 | 콘텐츠 편집 빈도가 늘면 관리자 CRUD 화면을 별도 스프린트로 계획 |
| REQ-FUNC-073 | 미디어 업로드 시 출처·작가·라이선스·URL·대체텍스트 필수 입력 — 업로드 워크플로 제외 | 이미지는 URL+alt만 사용. 라이선스 승인 프로세스는 CMS 도입 시 함께 설계 |
| REQ-FUNC-075 | 안전정보 stale 현황·담당자 대시보드 — 별도 대시보드 제외 | 공개 페이지의 stale 배지(CMP-SCR001-SAFETY-SECTION)로 대체. 운영 규모 확대 시 대시보드 검토 |
| REQ-FUNC-076 | 관리자 변경/신고처리/권한변경 감사 로그 | 범용 감사 로그 제외 원칙과 동일. 컴플라이언스 요구 발생 시 `AUDIT_LOG` 테이블 추가를 별도 Task로 계획(현재 6테이블 제한에는 포함하지 않음) |
| REQ-NF-007 | 배포 전 Lighthouse CI 게이트(Performance ≥85) | 지속 성능 CI 미구축, CI는 Playwright smoke만 운용 | `RELEASE-CHECK-MANUAL`의 수동 Lighthouse 점검으로 대체. 트래픽 증가 시 Lighthouse CI 도입 검토 |
| REQ-NF-008 | 월간 서비스 가용성 ≥99.5% 모니터링 | Vercel/Supabase 기본 가용성에 의존, 별도 SLA 관리 체계 없음 | 유료 모니터링(Vercel Pro, Supabase 관측 도구) 도입 시 재검토 |
| REQ-NF-009 | 내부 API 5xx 비율 ≤0.5% 모니터링 | 별도 오류율 모니터링 파이프라인 미구축 | Vercel 함수 로그 수동 확인으로 대체 |
| REQ-NF-010 | DB 백업 RPO≤24h/RTO≤8h | 자동 백업 체계 미구축, Supabase 기본 백업 정책 의존 | 유료 플랜 전환 시 백업 정책 재확인 |
| REQ-NF-011 | 외부 링크 주 1회 자동 검사 + Admin 알림 | 자동 모니터링·알림 미구축 | `RELEASE-CHECK-MANUAL`의 배포 전 수동 링크 점검 체크리스트로 대체 |
| REQ-NF-020 | 신고 1차 검토 24h 이내 90%+ | 운영 SLA 측정·모니터링 체계 미구축 | 관리자가 신고 큐(`CMP-SCR005-ADMIN`)를 수동 처리. 신고량 증가 시 SLA 대시보드 검토 |
| REQ-NF-021 | 글/요청/신고 rate limit | 별도 rate limit 인프라 미구축 | 남용 정황 발견 시 Vercel Edge Middleware 기반 rate limit 추가 검토 |
| REQ-NF-022 | Moderator 조치 추적성(감사 로그) | 범용 감사 로그 제외와 동일 사유 | REQ-FUNC-076과 함께 재검토 |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% 보증 | 이미지 정책을 URL+alt로 축소 | REQ-FUNC-073과 함께 CMS 도입 시 재도입 |
| REQ-NF-032 | 구조화 로그(request_id/actor/action/result) | 별도 로그 파이프라인 미구축, Vercel 기본 함수 로그로 대체 | 운영 규모 확대 시 구조화 로깅(Datadog 등) 도입 검토 |
| REQ-NF-033 | 핵심 오류 알림(5xx>1% 또는 외부링크 실패 5분 이내) | 자동 장애 알림 미구축 | Vercel 알림 통합 또는 Slack 웹훅 도입 시 재검토 |

---

## 11. Requirement Traceability (전체 114개)

Screen 열은 `SCREEN_ROUTE_CONTRACT.json`의 `SCR-00X` 표기를 그대로 쓴다(Task ID의 `PAGE-SCR00X`와 동일 화면을 가리킨다).

### 11.1 REQ-FUNC-001~080

| Requirement | Implementation Status | 연결 Task |
|---|---|---|
| REQ-FUNC-001 | IMPLEMENT | CMP-SCR001-DESTINATION-GRID, PAGE-SCR001 |
| REQ-FUNC-002 | IMPLEMENT | CMP-SCR001-DESTINATION-GRID, PAGE-SCR001 |
| REQ-FUNC-003 | IMPLEMENT | CMP-SCR001-HERO-SEARCH, PAGE-SCR001 |
| REQ-FUNC-004 | IMPLEMENT | CMP-SCR001-DESTINATION-DETAIL-DRAWER, PAGE-SCR001 |
| REQ-FUNC-005 | IMPLEMENT | CMP-SCR001-DESTINATION-GRID, CMP-COMMON-EMPTY-STATE, PAGE-SCR001 |
| REQ-FUNC-006 | IMPLEMENT | CMP-SCR001-DESTINATION-DETAIL-DRAWER, DATA-SAFETY, PAGE-SCR001 |
| REQ-FUNC-007 | IMPLEMENT(축소) | DATA-DESTINATIONS, CMP-SCR001-DESTINATION-DETAIL-DRAWER |
| REQ-FUNC-008 | IMPLEMENT | DATA-DESTINATIONS, TEST-DATA-VALIDATION |
| REQ-FUNC-009 | IMPLEMENT | CMP-SCR001-DESTINATION-DETAIL-DRAWER, PAGE-SCR001 |
| REQ-FUNC-010 | IMPLEMENT | CMP-SCR001-DESTINATION-GRID, PAGE-SCR001 |
| REQ-FUNC-011 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM, PAGE-SCR003 |
| REQ-FUNC-012 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM |
| REQ-FUNC-013 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM, UNIT-TRAVEL-DATES |
| REQ-FUNC-014 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM |
| REQ-FUNC-015 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM |
| REQ-FUNC-016 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM, INFRA-EXTERNAL-LINK-SAFETY |
| REQ-FUNC-017 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM |
| REQ-FUNC-018 | IMPLEMENT(축소) | CMP-SCR003-FLIGHT-FORM |
| REQ-FUNC-019 | IMPLEMENT | CMP-SCR003-HOTEL-FORM, PAGE-SCR003 |
| REQ-FUNC-020 | IMPLEMENT | CMP-SCR003-HOTEL-FORM |
| REQ-FUNC-021 | IMPLEMENT | CMP-SCR003-HOTEL-FORM, UNIT-TRAVEL-DATES |
| REQ-FUNC-022 | IMPLEMENT | CMP-SCR003-HOTEL-FORM |
| REQ-FUNC-023 | IMPLEMENT | CMP-SCR003-HOTEL-FORM |
| REQ-FUNC-024 | IMPLEMENT | CMP-SCR003-HOTEL-FORM, INFRA-EXTERNAL-LINK-SAFETY |
| REQ-FUNC-025 | IMPLEMENT | CMP-SCR003-HOTEL-FORM |
| REQ-FUNC-026 | IMPLEMENT(축소) | CMP-SCR003-HOTEL-FORM |
| REQ-FUNC-027 | IMPLEMENT | CMP-SCR003-MATE-WRITE-FORM, INFRA-AUTH-SESSION |
| REQ-FUNC-028 | IMPLEMENT | CMP-SCR005-PROFILE, INFRA-ADULT-VERIFICATION, CMP-SCR003-MATE-WRITE-FORM |
| REQ-FUNC-029 | IMPLEMENT | CMP-SCR005-PROFILE |
| REQ-FUNC-030 | IMPLEMENT | CMP-SCR004-FILTER, CMP-SCR004-LIST, PAGE-SCR004 |
| REQ-FUNC-031 | IMPLEMENT | CMP-SCR003-MATE-WRITE-FORM, API-MATE-POSTS |
| REQ-FUNC-032 | IMPLEMENT | CMP-SCR003-MATE-WRITE-FORM, API-MATE-POSTS, INFRA-CONTACT-DETECTION, UNIT-CONTACT-DETECTION |
| REQ-FUNC-033 | IMPLEMENT | CMP-SCR004-LIST, CMP-SCR004-DETAIL |
| REQ-FUNC-034 | IMPLEMENT | CMP-SCR004-APPLY, API-MATE-APPLICATIONS |
| REQ-FUNC-035 | IMPLEMENT | CMP-SCR004-APPLY, API-MATE-APPLICATIONS, UNIT-MATE-STATE |
| REQ-FUNC-036 | IMPLEMENT | CMP-SCR005-MY-ACTIVITY, API-MATE-APPLICATIONS, UNIT-MATE-STATE |
| REQ-FUNC-037 | IMPLEMENT(축소) | CMP-SCR004-LIST, CMP-SCR005-MY-ACTIVITY, API-MATE-POSTS, UNIT-MATE-STATE |
| REQ-FUNC-038 | IMPLEMENT | CMP-SCR005-MY-ACTIVITY, API-MATE-POSTS, UNIT-MATE-STATE |
| REQ-FUNC-039 | IMPLEMENT(간소화) | CMP-SCR004-REPORT, API-REPORTS |
| REQ-FUNC-040 | IMPLEMENT | CMP-SCR004-BLOCK, CMP-SCR005-MY-ACTIVITY, API-BLOCKS |
| REQ-FUNC-041 | IMPLEMENT(간소화) | CMP-SCR005-ADMIN, API-ADMIN-SETTINGS |
| REQ-FUNC-042 | IMPLEMENT(간소화) | CMP-SCR005-ADMIN, API-ADMIN-SETTINGS |
| REQ-FUNC-043 | IMPLEMENT(축소) | CMP-COMMON-TOAST |
| REQ-FUNC-044 | IMPLEMENT | DB-RLS-BASE, TEST-RLS-BASIC |
| REQ-FUNC-045 | IMPLEMENT(축소) | CMP-SCR005-PROFILE, INFRA-USER-DELETE |
| REQ-FUNC-046 | IMPLEMENT | DATA-SAFETY, TEST-DATA-VALIDATION |
| REQ-FUNC-047 | IMPLEMENT | CMP-SCR001-SAFETY-SECTION, DATA-SAFETY |
| REQ-FUNC-048 | IMPLEMENT | CMP-SCR001-SAFETY-SECTION, DATA-SAFETY |
| REQ-FUNC-049 | IMPLEMENT | CMP-SCR001-SAFETY-SECTION, INFRA-EXTERNAL-LINK-SAFETY |
| REQ-FUNC-050 | IMPLEMENT(축소) | CMP-SCR001-SAFETY-SECTION |
| REQ-FUNC-051 | IMPLEMENT | CMP-SCR001-SAFETY-SECTION |
| REQ-FUNC-052 | IMPLEMENT | CMP-SCR001-SAFETY-SECTION, DATA-SAFETY |
| REQ-FUNC-053 | IMPLEMENT | CMP-SCR001-SAFETY-SECTION, DATA-SAFETY |
| REQ-FUNC-054 | IMPLEMENT | CMP-SCR001-SAFETY-SECTION, CMP-SCR003-FLIGHT-FORM, CMP-SCR003-HOTEL-FORM |
| REQ-FUNC-055 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-FUNC-056 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-FUNC-057 | IMPLEMENT | CMP-SCR001-ABOUT-SUMMARY, CMP-SCR002-HERO-PROFILE, DATA-REPRESENTATIVE |
| REQ-FUNC-058 | IMPLEMENT | CMP-SCR002-STATS-STORY, DATA-REPRESENTATIVE |
| REQ-FUNC-059 | IMPLEMENT(축소) | CMP-SCR002-COUNTRIES-GALLERY, DATA-REPRESENTATIVE |
| REQ-FUNC-060 | IMPLEMENT | CMP-SCR002-TIMELINE, DATA-REPRESENTATIVE |
| REQ-FUNC-061 | IMPLEMENT(축소) | CMP-SCR002-COUNTRIES-GALLERY, DATA-REPRESENTATIVE |
| REQ-FUNC-062 | IMPLEMENT | CMP-SCR002-FAVORITE-DESTINATIONS-CTA |
| REQ-FUNC-063 | IMPLEMENT | CMP-SCR002-FAVORITE-DESTINATIONS-CTA |
| REQ-FUNC-064 | IMPLEMENT | CMP-COMMON-HEADER-FOOTER |
| REQ-FUNC-065 | IMPLEMENT | CMP-COMMON-RESPONSIVE-LAYOUT |
| REQ-FUNC-066 | IMPLEMENT | CMP-SCR005-AUTH, INFRA-AUTH-SESSION |
| REQ-FUNC-067 | IMPLEMENT | CMP-SCR001-HERO-SEARCH |
| REQ-FUNC-068 | IMPLEMENT(축소) | CMP-SCR001-DESTINATION-GRID, CMP-SCR005-PROFILE, CMP-COMMON-FAVORITES-SHARE |
| REQ-FUNC-069 | IMPLEMENT | CMP-SCR001-DESTINATION-DETAIL-DRAWER, CMP-SCR004-LIST, CMP-COMMON-FAVORITES-SHARE |
| REQ-FUNC-070 | IMPLEMENT | CMP-COMMON-SEO-METADATA |
| REQ-FUNC-071 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-FUNC-072 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-FUNC-073 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-FUNC-074 | IMPLEMENT(축소) | TEST-DATA-VALIDATION, CI-LINT-TYPECHECK-DATA |
| REQ-FUNC-075 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-FUNC-076 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-FUNC-077 | IMPLEMENT | CMP-SCR005-ADMIN, API-ADMIN-SETTINGS |
| REQ-FUNC-078 | IMPLEMENT | CMP-COMMON-ERROR-BOUNDARIES |
| REQ-FUNC-079 | IMPLEMENT | CMP-COMMON-ARIA-PATTERNS |
| REQ-FUNC-080 | IMPLEMENT | CMP-SCR003-MATE-WRITE-FORM |

### 11.2 REQ-NF-001~034

| Requirement | Implementation Status | 연결 Task |
|---|---|---|
| REQ-NF-001 | IMPLEMENT(목표) | RELEASE-CHECK-MANUAL |
| REQ-NF-002 | IMPLEMENT(목표) | RELEASE-CHECK-MANUAL |
| REQ-NF-003 | IMPLEMENT(목표) | RELEASE-CHECK-MANUAL |
| REQ-NF-004 | IMPLEMENT(축소) | RELEASE-CHECK-MANUAL |
| REQ-NF-005 | IMPLEMENT(축소) | RELEASE-CHECK-MANUAL |
| REQ-NF-006 | IMPLEMENT | CMP-SCR001-DESTINATION-GRID, CMP-SCR002-COUNTRIES-GALLERY |
| REQ-NF-007 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-NF-008 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-NF-009 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-NF-010 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-NF-011 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-NF-012 | IMPLEMENT | DEPLOY-VERCEL-SUPABASE-CHECK |
| REQ-NF-013 | IMPLEMENT | DB-RLS-BASE, TEST-RLS-BASIC |
| REQ-NF-014 | IMPLEMENT | INFRA-AUTH-SESSION |
| REQ-NF-015 | IMPLEMENT | INFRA-INPUT-VALIDATION |
| REQ-NF-016 | IMPLEMENT | DEPLOY-VERCEL-SUPABASE-CHECK, DB-ACCESS |
| REQ-NF-017 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM, CMP-SCR003-HOTEL-FORM |
| REQ-NF-018 | IMPLEMENT(축소) | INFRA-USER-DELETE |
| REQ-NF-019 | IMPLEMENT | API-REPORTS, RELEASE-CHECK-MANUAL |
| REQ-NF-020 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-NF-021 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-NF-022 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-NF-023 | IMPLEMENT | CMP-COMMON-ARIA-PATTERNS |
| REQ-NF-024 | IMPLEMENT(축소) | TEST-A11Y-AXE |
| REQ-NF-025 | IMPLEMENT | RELEASE-CHECK-MANUAL |
| REQ-NF-026 | IMPLEMENT | TEST-DATA-VALIDATION, DATA-DESTINATIONS |
| REQ-NF-027 | IMPLEMENT | TEST-DATA-VALIDATION, DATA-SAFETY |
| REQ-NF-028 | IMPLEMENT(축소) | CMP-SCR001-SAFETY-SECTION, RELEASE-CHECK-MANUAL |
| REQ-NF-029 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-NF-030 | IMPLEMENT | CMP-COMMON-SEO-METADATA |
| REQ-NF-031 | IMPLEMENT | CI-LINT-TYPECHECK-DATA |
| REQ-NF-032 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-NF-033 | EXCLUDED | — (NON_IMPLEMENTATION §10) |
| REQ-NF-034 | IMPLEMENT(설계 원칙) | DEPLOY-VERCEL-SUPABASE-CHECK |

---

## 12. 완료 조건 자체 점검

- [x] `python scripts/validate_inputs.py` → `VALIDATE_INPUTS_PASS`, 검사 수 `11/11` 확인 후 작성 시작.
- [x] REQ-FUNC-001~080(80개) + REQ-NF-001~034(34개) = **114개 전부**가 §11 Traceability 표에 정확히 1회씩 등장(누락 0건, 중복 0건).
- [x] IMPLEMENT 계열 96개는 전부 구현 Task(Component/API/Infra/Data/DB/Page Owner)와 최소 1개의 검증 Task(Unit/Integration/E2E/A11y/데이터검증/CI/Manual)에 연결됨.
- [x] EXCLUDED 18개는 §10 NON_IMPLEMENTATION 표에 근거·후속 방향과 함께 보존되었고 어떤 구현 Task에도 연결되지 않음.
- [x] SCR-001~005 각각 Page Owner Task 정확히 1개(§7), Expected Files에 해당 `page_entry` 포함(규칙 7), 같은 Screen의 Component·Data·API Task에 의존(규칙 8).
- [x] SCR-003은 항공(`CMP-SCR003-FLIGHT-FORM`)·숙소(`CMP-SCR003-HOTEL-FORM`)·동행 작성(`CMP-SCR003-MATE-WRITE-FORM`) 3개 Component로 분리(규칙 9).
- [x] SCR-004는 목록(`LIST`)·필터(`FILTER`)·상세(`DETAIL`)·참가(`APPLY`)·신고(`REPORT`)·차단(`BLOCK`) 6개 관심사를 각각 별도 Component로 분리(규칙 10).
- [x] SCR-005는 Auth·Profile·My Activity·Admin 4개 Component로 분리하고 역할에 없는 영역은 렌더링하지 않음(규칙 11).
- [x] DB Schema/RLS/Access/Seed 4개 Task 분리(규칙 12), 필수 Data·DB Task ID(`DATA-DESTINATIONS/SAFETY/REPRESENTATIVE`, `DB-SCHEMA-BASE/RLS-BASE/ACCESS/SEED-BASE`) 전부 포함.
- [x] 날짜 검증(`UNIT-TRAVEL-DATES`)·연락처 탐지(`UNIT-CONTACT-DETECTION`)·상태 전이(`UNIT-MATE-STATE`) Unit Test 분리(규칙 13), 필수 Test Task ID 7개 전부 포함.
- [x] Playwright는 3개 Task(`E2E-PUBLIC-SMOKE`/`E2E-TRAVEL-TOOLS`/`E2E-MATE-AUTH`)로 핵심 7개 이상 흐름을 커버(규칙 14).
- [x] CI(`CI-LINT-TYPECHECK-DATA`)와 Vercel/Supabase 확인(`DEPLOY-VERCEL-SUPABASE-CHECK`) Task 분리(규칙 15).
- [x] 어떤 Task도 2개 이상의 Page Entry를 동시에 소유하지 않음(규칙 16 — Page Owner는 각자 자신의 `page.tsx`만 소유, `CMP-COMMON-ERROR-BOUNDARIES`는 Page Owner가 아닌 기술 경계 전용 Task로 분리).
- [x] Page Owner 5개 전부 Acceptance Criteria에 Section 순서·Section별 데이터 출처·최소 Card/Timeline/Gallery 수·반응형 콘텐츠 밀도 포함(규칙 17).
- [x] Page Owner 5개 전부 Visual AC에 Lorem ipsum·준비 중·정보 확인 필요·빈 카드 금지 + 완성형 Empty State 포함(규칙 18).
- [x] 브라우저 확인이 필요한 REQ-NF-001~005, 019, 025, 028은 `RELEASE-CHECK-MANUAL`(Manual Check Task)에 연결(규칙 4).
- [x] EC2·AWS는 어떤 Task에도 활성 기술로 언급되지 않음(`DEPLOY-VERCEL-SUPABASE-CHECK`가 명시적으로 미사용을 재확인).
- **빠진 Requirement ID: 없음.** 이 문서를 완료로 보고한다.

---

*— End of TASKS-TRAVEL-001 —*
