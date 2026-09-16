# ARCHITECTURE — Free Traveler 구현 경계

- **Document ID:** ARCH-TRAVEL-001
- **기반 문서:** `package.json`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `TASKS/TASK_MANIFEST.csv`(요청 입력이나 저장소에 없음 — §8 참조, 대체로 `TASKS/00_TASK_LIST.md` / `docs/tasks/TASK_LIST.md` 사용)
- **범위:** 이 문서는 "무엇을 어떻게 만드는가"의 구현 경계(Boundary)만 정의한다. Task 목록·Acceptance Criteria는 `docs/tasks/TASK_LIST.md`(및 `TASKS/00_TASK_LIST.md`), Requirement 원문은 `docs/06_SRS_UIUX_REVISED.md`·`docs/UIUX_TRACEABILITY.md`를 따른다. 이 문서 작성 시점 기준 `src/app`에는 create-next-app 스타터(`layout.tsx`, `page.tsx`, `globals.css`)만 존재하며 어떤 Requirement도 아직 코드로 구현되지 않았다.

---

## 1. 프레임워크·언어

| 항목 | 결정 |
|---|---|
| 프레임워크 | **Next.js 16.3.4 App Router** (`package.json` 기준, Pages Router 미사용) |
| 언어 | **TypeScript**(`^5`, strict) — `.js`/`.jsx` 신규 파일 생성 금지 |
| UI 라이브러리 | React 19.2.8 |
| 스타일 | Tailwind CSS 4 (`@tailwindcss/postcss`), `design-reference/D-001/DESIGN.md` 토큰만 사용 |
| ORM | **미사용**(§6) — Prisma 등 어떤 ORM도 도입하지 않는다 |

---

## 2. Screen 범위와 Page Entry

`design-reference/SCREEN_ROUTE_CONTRACT.json`(`schema_version: traveler-screen-route-v1`)이 정본이다. **핵심(core) Screen 4개 + 보조(auxiliary) Screen 1개 = 5개**, 그 외 신규 Screen을 만들지 않는다.

| Screen | Tier | Route | Page Entry | 비고 |
|---|---|---|---|---|
| SCR-001 | core | `/` | `src/app/page.tsx` | create-next-app 스타터 템플릿 교체 필수(`starter_template_forbidden=true`) |
| SCR-002 | auxiliary | `/about` | `src/app/about/page.tsx` | 신규 라우트 |
| SCR-003 | core | `/travel-tools` | `src/app/travel-tools/page.tsx` | 항공/숙소/동행 3탭 통합 |
| SCR-004 | core | `/mates` | `src/app/mates/page.tsx` | 목록+상세 분할 |
| SCR-005 | core | `/account` | `src/app/account/page.tsx` | Guest/Member/Admin 역할별 조립 |

기술 Route(Screen 수에 미포함): `src/app/auth/callback/route.ts`, `src/app/api/mates/route.ts` 등 API Route, `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/unauthorized.tsx`.

---

## 3. Server Component / Client Component 경계

기본값은 **Server Component**다. `"use client"`는 아래 경우에만 붙인다(그 외 컴포넌트는 서버에서 렌더링).

| Client Component가 필요한 경우 | 해당 영역 |
|---|---|
| 브라우저 전용 상태(입력값, 탭 선택, 폼 검증, 열림/닫힘)를 유지해야 함 | Hero 검색바, 여행지 Chip 필터, 항공/숙소 조건 Form, `tab-underline` 탭, 여행지/안전정보 상세 Drawer, 참가 신청 Form, 신고 Modal |
| 브라우저 API를 직접 호출함(`localStorage`, Web Share API, `window.open`) | 즐겨찾기 훅, URL 공유 훅, 외부 링크 오픈 유틸 |
| 사용자 이벤트에 즉시 반응해야 함(제출, 토글, Optimistic UI) | 동행 모집글 작성/수정 Form, 참가 요청 승인·거절 액션, 차단 버튼, Toast |
| Supabase Auth 세션을 브라우저에서 구독해야 함 | 로그인/가입/재설정 Form(`CMP-SCR-005-auth`), Header 계정 메뉴 |

**Page Entry(`src/app/*/page.tsx`) 5개는 모두 Server Component로 유지한다** — 데이터 조회(정적 데이터 import, Supabase 서버 클라이언트 조회)와 Section 조립만 담당하고, 위 표의 상호작용 조각만 별도 Client Component로 분리해 하위에 배치한다. Page Owner Task는 이 조립 경계를 넘어 새 시각 요소를 직접 구현하지 않는다.

---

## 4. 항공·숙소 입력 폼 — Client Component 일시 상태만 사용

- `CMP-SCR-003-flight-form`, `CMP-SCR-003-hotel-form`은 **Client Component이며 상태는 `useState`/`useReducer` 등 컴포넌트 내부 일시 상태로만 관리한다.**
- 탭을 벗어나지 않는 한 세션 동안 값을 유지하되(`design-reference/D-001/DESIGN.md` § Form·Tabs), 라우트를 벗어나거나 새로고침하면 값은 사라져도 된다 — 영속화(서버 세션, `localStorage` 등)를 하지 않는다.
- 이 두 컴포넌트를 위한 **서버 API Route를 만들지 않는다.**

---

## 5. 항공·숙소 입력값 비전달 원칙

국가·지역·출발/귀국일(또는 체크인/체크아웃) 입력값은 아래 어디로도 전송하지 않는다(REQ-FUNC-017, 025, REQ-NF-017, `PROJECT_SCOPE.md` §1 CON-01/CON-02).

| 금지 경로 | 규칙 |
|---|---|
| 서버 API | 이 폼을 위한 Route Handler/Server Action을 만들지 않는다 |
| DB | Supabase 테이블에 저장하지 않는다 |
| URL | 외부 이동 링크에 목적지·날짜 쿼리 파라미터를 붙이지 않는다(`window.open(url)`만 사용) |
| 로그/분석 이벤트 | 서버 로그·클라이언트 분석 이벤트 어디에도 값을 기록하지 않는다 |

외부 이동은 `src/lib/links/external-link.ts`(`INFRA-EXTERNAL-LINK-SAFETY`) 공용 유틸을 통해 HTTPS 허용목록 + `target="_blank"` + `rel="noopener noreferrer"`로만 수행한다.

---

## 6. 정적 데이터 — `src/data`

여행지·안전정보·대표 소개 3개 도메인은 Supabase 테이블이 아니라 **`src/data`의 정적 TypeScript 데이터**로 관리한다(`docs/PROJECT_SCOPE.md` §1, §5).

| 파일 | 도메인 |
|---|---|
| `src/data/destinations.ts` | 여행지(국내 10+/해외 15개국 30도시+) |
| `src/data/safety.ts` | 국가 안전정보(8개 필수 카테고리) |
| `src/data/representative-profile.ts` | 대표 소개(50+ Trips/30+ Countries/타임라인) |
| `src/data/types.ts` | 위 3개 도메인의 공용 타입 |

콘텐츠 갱신은 코드 배포(git commit)로만 이루어지며, Editor/Admin용 CMS 화면을 만들지 않는다(§8).

---

## 7. Supabase 범위 — Auth와 동행 기능 중심

Supabase는 **인증(Auth)과 동행 매칭 기능(Mate)** 두 가지 목적에만 사용하며, 콘텐츠 저장소로 쓰지 않는다.

- **Auth**: 이메일 가입/인증/로그인/로그아웃/비밀번호 재설정, 성인확인 플래그(`is_adult`/`adult_verified_at`).
- **Mate 기능**: 동행 모집글, 참가 요청, 차단, 신고의 생성·조회·상태 변경.
- 여행지·안전정보·대표 소개는 Supabase에 두지 않는다(§6과 중복 저장하지 않음).

---

## 8. DB — 6개 Table

앱이 마이그레이션으로 소유·관리하는 **커스텀 테이블은 정확히 6개**다(`docs/PROJECT_SCOPE.md` §5에서 고정한 개수). Supabase Auth가 별도로 관리하는 `auth.users`(스키마 소유는 Supabase, 앱이 직접 마이그레이션하지 않음)는 이 6개 카운트에 포함하지 않는다.

| # | 테이블 | 소유 |
|---|---|---|
| 1 | `profiles` | 앱(닉네임/연령대/스타일/자기소개, `auth.users` 1:1) |
| 2 | `mate_posts` | 앱(동행 모집글) |
| 3 | `mate_applications` | 앱(참가 요청) |
| 4 | `blocks` | 앱(차단 관계) |
| 5 | `reports` | 앱(신고) |
| 6 | `app_settings` | 앱(외부 URL 허용목록 등 관리자 설정, `key`/`value`. RLS로 클라이언트 직접 접근 전면 차단, 서버 Route Handler만 Service Role로 읽고 씀) |

`AUDIT_LOG`(7번째 후보)는 만들지 않는다 — 범용 감사 로그는 범위 밖이며 변경 이력은 git 커밋 이력으로 대체한다(REQ-FUNC-056, 076 EXCLUDED). 생년월일 원본 컬럼도 만들지 않는다(`profiles.age_band`만 사용, REQ-FUNC-028). `app_settings`는 콘텐츠 CRUD용 테이블이 아니다 — 여행지·안전정보·대표 소개는 여전히 §6의 `src/data` 정적 데이터로만 관리한다.

---

## 9. Supabase Client — Browser / Server 분리

| Client | 파일 | 키 | 용도 |
|---|---|---|---|
| Browser Client | `src/lib/supabase/client.ts` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client Component에서 Auth 세션 구독·로그인/가입 폼 |
| Server Client | `src/lib/supabase/server.ts` | 위 공개 키 + 필요 시 `SUPABASE_SERVICE_ROLE_KEY`(서버 전용) | Server Component 데이터 조회, Route Handler/Server Action 쓰기, RLS 우회가 필요한 관리자 작업 |

`SUPABASE_SERVICE_ROLE_KEY`는 클라이언트 번들에 포함되지 않는다(`NEXT_PUBLIC_` 접두사 금지, REQ-NF-016).

---

## 10. RLS — 간단한 원칙

`docs/PROJECT_SCOPE.md` §1의 "최소 RLS" 원칙을 따른다: 목표는 **회원 전용 쓰기 경로 보호**이며, 세밀한 다단계 정책 체계는 만들지 않는다.

- `profiles`: 본인만 UPDATE, 공개 필드는 SELECT 공개.
- `mate_posts`: 누구나 `status != DELETED` SELECT, 작성자만 UPDATE/DELETE.
- `mate_applications`: 신청자·대상 글 작성자만 SELECT, 신청자만 INSERT, 글 작성자만 상태 UPDATE.
- `blocks`: 본인(`blocker_id`)만 SELECT/INSERT/DELETE.
- `reports`: 신고자 본인 + Moderator/Admin만 SELECT, 신고자만 INSERT, Moderator/Admin만 상태 UPDATE.
- `app_settings`: 클라이언트(Guest/Member/Moderator/Admin 전부)는 SELECT/INSERT/UPDATE/DELETE 전면 거부. 서버 Route Handler만 Service Role Key로 읽고 쓰며, 그 Route Handler 내부에서 Admin 역할만 허용한다.
- Moderator/Admin 판별은 `profiles` 컬럼이 아닌 Supabase custom claims(role)로 한다.

---

## 11. Prisma·ORM 미사용

DB 접근은 **Supabase JS Client(`@supabase/supabase-js`)의 쿼리 빌더**로만 수행한다. Prisma, Drizzle 등 어떤 ORM/쿼리 빌더 계층도 추가하지 않으며, 스키마는 `supabase/migrations/*.sql` 순수 SQL 마이그레이션으로만 관리한다.

---

## 12. 테스트 — Vitest + Playwright Chromium Smoke

| 계층 | 도구 | 범위 |
|---|---|---|
| Unit | **Vitest** | 날짜 검증(`UNIT-TRAVEL-DATES`), 연락처 탐지(`UNIT-CONTACT-DETECTION`), 모집글/신청 상태 전이(`UNIT-MATE-STATE`) |
| Data Validation | Node 스크립트(`scripts/validate_content.ts`) | 정적 데이터 완전성·수량 |
| Integration | Vitest 또는 Supabase 테스트 DB 대상 스크립트 | RLS 기본 동작(`TEST-RLS-BASIC`) |
| E2E | **Playwright — `chromium` 프로젝트만** | 공개 흐름/여행 준비/인증·동행·신고·관리자 흐름 3개 Smoke Spec(`docs/PROJECT_SCOPE.md` §6) |
| A11y | Playwright + `@axe-core/playwright` | 핵심 화면(4+1) serious/critical 0건 |

Firefox/WebKit/모바일 에뮬레이션 매트릭스, Lighthouse CI, 부하 테스트는 추가하지 않는다(REQ-NF-007 EXCLUDED 등).

---

## 13. CI/CD — GitHub Actions + Vercel Preview

- **GitHub Actions**: PR마다 `tsc --noEmit`, ESLint, `scripts/validate_content.ts`, Vitest Unit 3종을 실행하는 게이트 워크플로(`.github/workflows/ci.yml`, `CI-LINT-TYPECHECK-DATA`). Playwright E2E/axe는 동일 워크플로의 후속 Job 또는 별도 워크플로로 둔다.
- **배포**: Next.js 앱은 **Vercel**에 배포하고, PR마다 Vercel Preview 배포로 리뷰한다. Supabase(Auth/PostgreSQL)를 연동한다.
- 병합은 **사람이 직접 수행**하며 CI는 검증까지만 담당한다(§15).

---

## 14. AWS·EC2 미사용

클라우드 VM(EC2 등)이나 그 외 AWS 리소스를 직접 구성하지 않는다. 배포·런타임은 Vercel(Next.js)과 Supabase(Auth/PostgreSQL) 관리형 서비스만 사용한다(`docs/PROJECT_SCOPE.md` §7).

---

## 15. 자동 Merge 미사용

무인 자동 병합 도구/봇을 구성하지 않는다. GitHub Actions는 검증(Lint/Typecheck/Test)까지만 수행하고, 모든 PR 병합은 사람이 직접 승인·실행한다.

---

## 16. 착수 차단 — 실제로 필요한데 누락된 파일·환경변수

아래는 이 문서를 작성하며 실제로 확인한, 구현 착수 전 채워야 하는 항목이다(존재 여부만 보고하며, 이 작업에서 직접 생성하지 않는다).

| 항목 | 상태 | 필요한 이유 |
|---|---|---|
| `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK_AUDIT_REPORT.md` | **해결됨** — `scripts/audit_task_manifest.py`가 `TASKS/00_TASK_LIST.md`(+`TASKS/TASK-*.md`)로부터 생성한다. | (기록용) 이 문서 최초 작성 시점에는 없었으나 이후 감사 스크립트 실행으로 생성됐다. |
| `.env.example` / Supabase 환경변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) | **없음** | §9의 Browser/Server Client 분리를 구현하려면 이 3개 변수가 먼저 정의되어야 한다. |
| `FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL` 환경변수 | **없음** | §5 외부 이동 기능(`INFRA-EXTERNAL-LINK-SAFETY`, `API-ADMIN-SETTINGS`)의 HTTPS 허용목록 대상 URL이 아직 설정되지 않았다. |
| `supabase/` 디렉터리(마이그레이션·`config.toml`) | **없음** | §8/§10 스키마·RLS 마이그레이션(`DB-SCHEMA-BASE`, `DB-RLS-BASE`)을 시작하려면 먼저 생성해야 한다. |
| `package.json`의 `@supabase/supabase-js`, `zod`, `vitest`, `@playwright/test`, `@axe-core/playwright` 의존성 | **미설치**(현재 `next`/`react`/`react-dom`만 존재) | §9, §11, §12 구현 착수 전에 설치가 필요하다. 이는 차단 항목이 아니라 착수 시 첫 단계로 기록한다. |

---

## 17. 명시적 제외 범위

아래는 이 프로젝트 범위에서 **제외**한다(`docs/PROJECT_SCOPE.md` §8과 동일):

- **CMS(콘텐츠 관리 시스템)** — 여행지·안전정보·대표 소개는 §6의 `src/data` 코드 배포로만 갱신하며, Editor/Admin용 콘텐츠 CRUD·미리보기 화면을 만들지 않는다(REQ-FUNC-055, 072 EXCLUDED).
- **외부 Email 공급자 연동** — 참가 요청·승인/거절·신고 처리 알림은 인앱 Toast로만 표시하며, 실제 이메일 발송(SendGrid 등 외부 이메일 사업자 연동)은 구현하지 않는다(REQ-FUNC-043 IMPLEMENT(축소)).
- **Monitoring(모니터링)** — 가용성 SLA, 오류율 대시보드, 구조화 로그 파이프라인, 자동 장애 알림 등 지속적 운영 모니터링 체계를 구축하지 않는다. Vercel/Supabase 기본 제공 로그·가용성에 의존한다(REQ-NF-007~011, 020~022, 032, 033 EXCLUDED).
