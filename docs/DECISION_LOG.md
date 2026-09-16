# DECISION_LOG — Free Traveler

- **Document ID:** DECLOG-TRAVEL-001
- **범위:** 이 문서는 프로젝트 진행 중 확정된 결정을 번호가 붙은 항목으로 기록한다. 결정의 원문 근거(Requirement/설계 문서)는 변경하지 않으며, 이 문서는 "무엇을 왜 그렇게 정했는가"만 모아 추적한다.
- **기록 원칙:** 결정은 뒤집히지 않는 한 삭제하지 않는다. 이후 결정이 바뀌면 새 DEC 항목을 추가하고 이전 항목에 "SUPERSEDED BY DEC-0XX"를 표기한다(이번 기록 시점에는 없음).

---

| ID | 결정 | 상태 |
|---|---|---|
| DEC-001 | 실제 개발 루트는 `traveler/app` | Adopted |
| DEC-002 | 디자인 Screen은 핵심 4개·보조 1개 | Adopted |
| DEC-003 | `/travel-tools`에 항공·숙소·동행 작성을 통합 | Adopted |
| DEC-004 | 여행지·안전·대표는 정적 TypeScript Data | Adopted |
| DEC-005 | Supabase는 Auth와 동행 기능 중심 | Adopted |
| DEC-006 | DB는 6개 Table로 제한 | Adopted |
| DEC-007 | 항공·숙소 입력은 Browser Memory에만 유지 | Adopted |
| DEC-008 | Airbnb DESIGN.md는 vendor 참고본, D-001이 실제 정본 | Adopted |
| DEC-009 | Playwright는 Chromium Smoke만 필수 | Adopted |
| DEC-010 | 사용자의 개발 실행 단위는 Wave | Adopted |
| DEC-011 | Single Agent가 Wave 내부 Task를 순차 수행 | Adopted |
| DEC-012 | PR·Merge는 사용자가 수동 수행 | Adopted |
| DEC-013 | EC2·AWS는 사용하지 않음 | Adopted |
| DEC-014 | 제외 기능은 EXCLUDED로 관리 | Adopted |

---

## DEC-001 — 실제 개발 루트는 `traveler/app`

- **결정:** 이 저장소 상위 폴더(`C:\AI_SERVICE`)에는 `traveler/app` 외에도 `mcp_practice`, `pm-skills-lab`, `PRD_SRS`, `practice` 등 서로 무관한 작업 디렉터리가 함께 존재하지만, Free Traveler의 실제 Next.js 애플리케이션 루트는 **`traveler/app`이 유일하다.**
- **근거:** `traveler/app/package.json`(Next.js 앱 정의), `traveler/app/src/app`(App Router 엔트리)만 실제 코드 트리를 가진다. `CLAUDE.md`/`AGENTS.md`도 `traveler/app`을 기준으로 배치되어 있다.
- **영향:** 모든 Task의 `Expected Files`는 `traveler/app` 기준 상대경로로 해석한다. 다른 형제 디렉터리의 파일을 이 프로젝트의 구현 대상으로 취급하지 않는다.

## DEC-002 — 디자인 Screen은 핵심 4개·보조 1개

- **결정:** 승인된 Screen은 SCR-001~SCR-005 5개이며, **핵심(core) 4개**(SCR-001 `/`, SCR-003 `/travel-tools`, SCR-004 `/mates`, SCR-005 `/account`) + **보조(auxiliary) 1개**(SCR-002 `/about`)로 구분한다.
- **근거:** `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `tiers`(정본, 규칙 1/2), `design-reference/UI_CONTRACT.md` 서두의 Screen 구분.
- **영향:** 신규 Screen을 추가하지 않으며, Page Owner Task는 이 5개에 정확히 1:1 대응한다(`docs/ARCHITECTURE.md` §2).

## DEC-003 — `/travel-tools`에 항공·숙소·동행 작성을 통합

- **결정:** SRS baseline의 `/flights`, `/hotels`, `/mates/new` 3개 개별 Route를 별도 화면으로 만들지 않고, `/travel-tools`(SCR-003) 한 화면 안의 항공편/숙소/동행 구하기 3개 탭으로 통합한다.
- **근거:** `docs/06_SRS_UIUX_REVISED.md` §2(Page and Route Inventory → UI Route Contract), `design-reference/SCREEN_ROUTE_CONTRACT.json`의 SCR-003 `sections`(`tabs-flight-hotel-mate`).
- **영향:** 3개 탭 모두 실제 컴포넌트로 조립되어야 하며 스텁 탭을 허용하지 않는다(`docs/ARCHITECTURE.md` §2, `.claude/skills/traveler-project-pipeline` 규칙 8).

## DEC-004 — 여행지·안전·대표는 정적 TypeScript Data

- **결정:** 여행지(Destination), 국가 안전정보(Country Safety), 대표 소개(Representative Profile) 3개 콘텐츠 도메인은 Supabase 테이블이 아니라 `src/data`의 정적 TypeScript 데이터로 관리한다.
- **근거:** `docs/PROJECT_SCOPE.md` §1(아키텍처 원칙), §5(데이터 모델 매핑).
- **영향:** 콘텐츠 CMS·업로드 워크플로를 만들지 않는다(REQ-FUNC-055/072/073 EXCLUDED). 갱신은 코드 배포로만 한다(`docs/ARCHITECTURE.md` §6).

## DEC-005 — Supabase는 Auth와 동행 기능 중심

- **결정:** Supabase는 (1) 이메일 인증 기반 Auth, (2) 동행 모집글/참가 요청/차단/신고(Mate) 기능, (3) 관리자 외부 URL 설정(`app_settings`) 세 가지에만 사용한다. 콘텐츠 저장소로 쓰지 않는다.
- **근거:** `docs/PROJECT_SCOPE.md` §1, §5(데이터 모델 매핑 표).
- **영향:** `docs/ARCHITECTURE.md` §7·§8의 DB 범위(6개 Table)로 구체화된다.
- **갱신(감사 시 구체화):** 관리자 외부 URL 설정을 env var가 아니라 `app_settings` 테이블로 저장하기로 구체화했다(아래 DEC-006 갱신과 동일 계기).

## DEC-006 — DB는 6개 Table로 제한

- **결정:** 앱이 마이그레이션으로 소유하는 커스텀 테이블 수를 정확히 6개로 제한한다: `profiles`, `mate_posts`, `mate_applications`, `blocks`, `reports`, `app_settings`. Supabase Auth가 별도로 관리하는 `auth.users`는 이 6개 카운트에 포함하지 않는다(스키마 소유가 Supabase이며 앱이 마이그레이션하지 않기 때문).
- **근거:** `docs/PROJECT_SCOPE.md` §5(커스텀 6개 테이블 고정), `docs/ARCHITECTURE.md` §8.
- **영향:** `AUDIT_LOG` 등 7번째 테이블을 만들지 않는다(REQ-FUNC-056/076 EXCLUDED). `scripts/audit_task_manifest.py`가 DB Task 본문에서 발견한 테이블 토큰 수가 6을 넘지 않는지 기계적으로 검사한다(`docs/tasks/TASK_LIST.md`의 SKILL.md 규격 버전에서는 `scripts/audit_tasks.py`가 동일 원칙을 검사하되 아직 예전 5개 테이블명을 쓴다 — 두 문서 체계 동기화는 별도 작업으로 남아 있다).
- **갱신 이력:** 최초 결정 시(이 세션 초반)에는 관리자 설정을 테이블이 아닌 환경변수로 두고 "5개 커스텀 + `auth.users`=6개"로 셌다. 이후 감사 과정에서 관리자 설정용 6번째 커스텀 테이블 `app_settings`가 필요하다고 구체화되어, 지금은 "6개 커스텀 테이블(그 자체) + `auth.users`는 별도 카운트"로 정정했다. 테이블 이름도 대문자 스네이크케이스(`USER_PROFILE` 등)에서 Postgres 관례인 소문자 스네이크케이스(`profiles` 등)로 바꿨다.

## DEC-007 — 항공·숙소 입력은 Browser Memory에만 유지

- **결정:** 항공/숙소 조건 입력 폼(국가·지역·날짜)의 값은 Client Component의 일시 상태로만 유지하며 서버 API·DB·URL query·로그로 전송하지 않는다.
- **근거:** `docs/PROJECT_SCOPE.md` §1(CON-01, CON-02), REQ-FUNC-017/025, REQ-NF-017.
- **영향:** 이 두 폼을 위한 서버 API Route를 만들지 않는다(`docs/ARCHITECTURE.md` §4·§5).

## DEC-008 — Airbnb DESIGN.md는 vendor 참고본, D-001이 실제 정본

- **결정:** `design-reference/vendor/airbnb/DESIGN.md`는 **구조(흰 캔버스+단일 액센트+카드 그리드+절제된 그림자) 참고 전용**이며, 실제 색상·타이포·컴포넌트 토큰의 정본은 `design-reference/D-001/DESIGN.md`(`status: LOCKED`)이다.
- **근거:** `design-reference/D-001/DESIGN.md` 프런트매터 `source_of_truth`(vendor 문서를 "구조 참고 전용 — 상표 요소 제외"로 명시), Overview 절.
- **영향:** Airbnb 고유 색상(Rausch 등)·서체·상표·"Guest favorite" 배지 스타일 등은 코드에 반영하지 않는다(`design-reference/D-001/DESIGN.md` § Do Not).

## DEC-009 — Playwright는 Chromium Smoke만 필수

- **결정:** E2E 테스트는 Playwright **`chromium` 프로젝트만** 필수로 운용한다. Firefox/WebKit/모바일 에뮬레이션 매트릭스는 추가하지 않는다.
- **근거:** `docs/PROJECT_SCOPE.md` §1·§6, `.claude/skills/traveler-project-pipeline/SKILL.md` 규칙 13.
- **영향:** `docs/tasks/TASK_LIST.md`의 `TEST-E2E-*` Task는 `task-meta.browser_projects = ["chromium"]`로 고정되며, `scripts/audit_tasks.py`가 이를 검사한다(`docs/ARCHITECTURE.md` §12).

## DEC-010 — 사용자의 개발 실행 단위는 Wave

- **결정:** 실제 구현 작업은 Task 단위로 나열하되, 사용자가 실행을 지시하는 단위는 **Wave**(관련 Task를 묶은 실행 배치)로 한다.
- **근거:** 이번 세션에서 사용자가 직접 지정한 운영 방침이며, 별도 문서에서 유래한 결정이 아니다. Wave의 구체적 분할 기준(어떤 Task를 어떤 Wave에 넣는지)은 아직 별도 계획 문서로 존재하지 않는다.
- **영향:** Wave 계획 문서는 `scripts/build_waves.py`가 `TASKS/TASK_MANIFEST.csv`(+`TASKS/TASK-*.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`)로부터 생성해 `TASKS/WAVE_PLAN.md`/`TASKS/WAVE_STATE.json`으로 확정했다(19개 Wave, W01~W19). `docs/tasks/TASK_LIST.md`(SKILL.md 규격 병행본)의 Task 단위 자체는 변경하지 않았다.

## DEC-011 — Single Agent가 Wave 내부 Task를 순차 수행

- **결정:** 하나의 Wave 안에 포함된 여러 Task는 **단일 Agent가 순차적으로** 수행한다(여러 Agent를 동시에 병렬 투입하지 않는다).
- **근거:** 이번 세션에서 사용자가 직접 지정한 운영 방침. DEC-010(Wave 단위 실행)과 짝을 이루는 결정이다.
- **영향:** Wave 계획 시 Task 간 `Depends On` 순서를 Agent의 실제 처리 순서로 그대로 사용할 수 있다. 별도의 멀티 에이전트 오케스트레이션 설계는 필요하지 않다.

## DEC-012 — PR·Merge는 사용자가 수동 수행

- **결정:** GitHub Actions 등 CI는 Lint/Typecheck/Test까지만 자동으로 수행하고, Pull Request 생성 이후의 **병합(Merge)은 항상 사용자가 직접 수행**한다. 무인 자동 병합 도구는 두지 않는다.
- **근거:** `docs/PROJECT_SCOPE.md` §7(배포 원칙 — 병합·배포 자동화는 CI까지만 두며 무인 병합 자동화는 구성하지 않음), `docs/ARCHITECTURE.md` §13·§15.
- **영향:** CI 워크플로에 자동 병합 트리거(예: 특정 라벨이 붙으면 자동 Merge)를 추가하지 않는다.

## DEC-013 — EC2·AWS는 사용하지 않음

- **결정:** 배포·런타임 인프라는 **Vercel(Next.js) + Supabase(Auth/PostgreSQL)** 관리형 서비스만 사용한다. EC2 등 AWS 리소스를 직접 구성하지 않는다.
- **근거:** `docs/PROJECT_SCOPE.md` §1(아키텍처 원칙), §7(배포).
- **영향:** `docs/ARCHITECTURE.md` §14, `docs/tasks/TASK_LIST.md`의 `CI-DEPLOY-VERCEL-SUPABASE-CHECK` Task 어디에도 클라우드 VM/AWS 리소스 직접 구성이 포함되지 않는다.

## DEC-014 — 제외 기능은 EXCLUDED로 관리

- **결정:** 구현하지 않기로 한 Requirement는 baseline 문서에서 삭제하지 않고, Implementation Status를 **`EXCLUDED`**로 표기해 근거·후속 방향과 함께 보존한다.
- **근거:** `docs/UIUX_TRACEABILITY.md`(114개 Requirement 전수 보존 원칙), `docs/tasks/TASK_LIST.md`의 "제외된 Requirement" 표, `.claude/skills/traveler-project-pipeline/SKILL.md` 규칙 15/16.
- **영향:** 어떤 Task의 `Requirements` 열에도 EXCLUDED ID가 등장하지 않으며, `scripts/audit_tasks.py`가 이를 기계적으로 검사한다.
