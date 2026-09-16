---
name: traveler-project-pipeline
description: Free Traveler 프로젝트의 승인된 5개 Screen(SCR-001~SCR-005)을 Next.js App Router 구현 Task로 변환하는 Task 생성 Pipeline의 규칙·파일 규격·Task 분류 체계. /gen-tasklist, /gen-task-details, /audit-tasks 커맨드가 이 문서를 SSOT로 삼는다. Task List/상세 파일을 만들거나 감사하기 전에 반드시 전체를 읽는다.
---

# Traveler Project Pipeline

Free Traveler의 UI/UX 승인 산출물(`docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`)를 실제 구현 가능한 Task로 변환하는 3단계 Pipeline이다.

```
/gen-tasklist        → scripts/validate_inputs.py(gate) → docs/tasks/TASK_LIST.md
/gen-task-details     → docs/tasks/details/<TASK_ID>.md 1개씩 생성 → scripts/audit_tasks.py(gate)
/audit-tasks          → scripts/audit_tasks.py 재실행(읽기 전용 점검)
```

이 문서는 **규칙(무엇을 지켜야 하는가)**을 정의한다. "어떻게 실행하는가"는 `.claude/commands/gen-tasklist.md`, `.claude/commands/gen-task-details.md`, `.claude/commands/audit-tasks.md`에 있다.

---

## 0. 정본(SSOT) 입력

| 파일 | 역할 |
|---|---|
| `design-reference/SCREEN_ROUTE_CONTRACT.json` | **Screen 목록의 정본**(규칙 2). `schema_version`, Route, Page Entry, Tier, Section 목록의 유일한 근거 |
| `docs/UIUX_TRACEABILITY.md` | 114개 Requirement(REQ-FUNC-001~080, REQ-NF-001~034)의 Implementation Status(IMPLEMENT 계열/EXCLUDED) 정본 |
| `docs/PROJECT_SCOPE.md` | 아키텍처 단순화 원칙(정적 데이터, Supabase 최소 RLS, 관리자 축소 범위, 제외 기능) |
| `docs/06_SRS_UIUX_REVISED.md` | Requirement 원문·AC, UI Route Contract, Release Acceptance Criteria |
| `design-reference/D-001/DESIGN.md` | Section 순서·최소 콘텐츠 수·Empty State 규칙·Do/Do Not(디자인 토큰) |
| `design-reference/UI_CONTRACT.md` | Screen별 영역 순서·상태·사용자 행동·금지 기능 서술 |
| `package.json` + 실제 `src/app` 파일 트리 | Expected Files를 쓰기 전에 반드시 실측(규칙 4) |

**HARNESS_SCHEMA는 `traveler-screen-route-v1`이다(규칙 1).** `SCREEN_ROUTE_CONTRACT.json`의 `schema_version`이 이 값이 아니면 Pipeline을 중단한다.

---

## 1. 디렉터리 및 파일 규격

```
docs/tasks/
  TASK_LIST.md              # 마스터 목록 (표 1개 + EXCLUDED 레지스트리 표 1개)
  details/
    PO-SCR-001.md            # Task ID와 파일명이 동일 (확장자만 .md)
    CMP-SCR-001-hero-search.md
    ...
```

### 1.1 Task ID 네이밍

| Prefix | Type | 의미 |
|---|---|---|
| `PO-` | `page_owner` | Screen당 정확히 1개(규칙 3). 예: `PO-SCR-001` |
| `CMP-` | `component` | Page Owner가 조립하는 하위 컴포넌트. 예: `CMP-SCR-001-hero-search` |
| `DATA-` | `data` | `src/data/*.ts` 정적 데이터(규칙 11) |
| `DB-` | `db` | Supabase 테이블/마이그레이션/RLS(규칙 10) |
| `API-` | `api` | Route Handler/Server Action |
| `INFRA-` | `infra` | 인증 세션, Supabase client, 에러 경계 등 횡단 관심사 |
| `TEST-` | `test` | Playwright/axe/데이터 검증(규칙 13) |
| `CI-` | `ci` | Lint/typecheck 등 CI 게이트 |

Component Task ID는 `CMP-<SCREEN_ID>-<kebab-slug>` 형식이며 `<kebab-slug>`는 가능하면 `SCREEN_ROUTE_CONTRACT.json`의 `sections` 배열 값(또는 그 조합)을 그대로 쓴다.

### 1.2 `docs/tasks/TASK_LIST.md` 표 형식

```
| Task ID | Type | Screen | Title | Depends On | Requirements | Detail File | Status |
|---|---|---|---|---|---|---|---|
| PO-SCR-001 | page_owner | SCR-001 | 메인 화면 조립 | CMP-SCR-001-hero-search, CMP-SCR-001-... | REQ-FUNC-001, REQ-FUNC-064 | docs/tasks/details/PO-SCR-001.md | NOT_STARTED |
```

- `Screen`: `SCR-001`~`SCR-005` 또는 화면 요소가 없으면 `—`
- `Depends On` / `Requirements`: 콤마(`, `)로 구분, 없으면 `—`
- `Status`: 신규 생성 시 항상 `NOT_STARTED`. 구현이 실제로 끝났다고 허위로 `DONE`을 적지 않는다.
- 표 아래에 **"제외된 Requirement(EXCLUDED, Task 없음)"** 표를 별도로 둔다(규칙 16):

```
## 제외된 Requirement (EXCLUDED — 구현 Task 없음)

| Requirement | 제외 사유 요약 |
|---|---|
| REQ-FUNC-055 | Editor/Admin 콘텐츠 워크플로 — `src/data` 코드 배포로 대체 |
| ... | ... |
```

이 표는 `docs/UIUX_TRACEABILITY.md`에서 `EXCLUDED`로 표시된 모든 항목을 그대로 옮긴 것이며, Traceability 문서 자체는 수정하지 않는다.

### 1.3 Task 상세 파일 형식 (`docs/tasks/details/<TASK_ID>.md`)

```markdown
# <TASK_ID> — <Title>

```task-meta
{
  "task_id": "PO-SCR-001",
  "type": "page_owner",
  "screen": "SCR-001",
  "route": "/",
  "depends_on": ["CMP-SCR-001-hero-search", "CMP-SCR-001-destination-grids"],
  "requirements": ["REQ-FUNC-001", "REQ-FUNC-064"],
  "status": "NOT_STARTED",
  "expected_files": ["src/app/page.tsx"],
  "section_order": ["hero-search", "domestic-destinations", "overseas-destinations", "travel-theme-chips", "country-safety", "recent-mates", "about-summary"],
  "min_content_counts": {"domestic-destinations": 6, "overseas-destinations": 6, "country-safety": 6, "recent-mates": 3},
  "empty_state_required": true,
  "forbids_placeholder": true,
  "starter_template_removal_required": true
}
```

## Description
...

## Expected Files
- `src/app/page.tsx` — **기존 파일 교체**(create-next-app 스타터 템플릿 제거)

## Depends On
- `CMP-SCR-001-hero-search`
- ...

## Requirements Covered
- REQ-FUNC-001 — ...
- REQ-FUNC-064 — ...

## Acceptance Criteria
1. ...

## Out of Scope / Forbidden
- ...

## Test Notes
- ...
```

`task-meta` 코드펜스는 **반드시** 존재해야 하며 유효한 JSON이어야 한다. `scripts/audit_tasks.py`는 이 블록만으로 대부분의 규칙을 기계적으로 검사한다 — 본문 서술은 사람이 읽기 위한 것이고, `task-meta`는 감사용 진실이다. 둘은 항상 일치해야 한다(TASK_LIST.md의 Depends On/Requirements 열과도 동일해야 함).

---

## 2. Task 분류 (규칙 5)

| Type | 기준 |
|---|---|
| `page_owner` | 하나의 승인된 Screen(SCR-00X)을 **조립**한다. 새 시각 요소를 직접 구현하지 않고, 해당 Screen의 `component`/공용 Task 산출물을 Header/Footer/Section 순서대로 배치·연결한다. |
| `component` | 하나의 Section 또는 밀접하게 묶인 Section 그룹(폼, 카드 그리드, Drawer 등)의 실제 UI·상호작용을 구현한다. 정확히 하나의 Screen에 속한다. |
| `data` | `src/data/*.ts` 정적 데이터셋 작성(규칙 11) |
| `db` | Supabase 테이블/마이그레이션/RLS(규칙 10) |
| `api` | Route Handler(`route.ts`) 또는 Server Action |
| `infra` | 인증 세션, Supabase client 유틸, 에러/404/권한 경계 등 |
| `test` | Playwright/axe/데이터 검증 스크립트(규칙 13) |
| `ci` | Lint/typecheck CI 설정 |

**규칙 6**: 모든 `page_owner` Task는 `depends_on`에 **같은 Screen**의 `component` Task를 최소 1개 이상 포함해야 한다. `scripts/audit_tasks.py`가 이를 기계적으로 검사한다.

---

## 3. Screen별 Page Owner 특칙

`SCREEN_ROUTE_CONTRACT.json`의 5개 Screen 각각에 정확히 1개의 `page_owner` Task를 만든다(규칙 3). 아래 3개는 SKILL의 명시적 규칙(7~9)이므로 해당 Page Owner의 Acceptance Criteria와 `task-meta`에 **반드시** 반영한다.

| Screen | Route | Page Owner 특칙 |
|---|---|---|
| SCR-001 | `/` | **규칙 7**: `src/app/page.tsx`의 create-next-app 스타터 템플릿(`next.svg`, "To get started, edit the page.tsx", Vercel/Next.js 학습 링크 등)을 제거하는 AC를 명시한다. `task-meta.starter_template_removal_required = true`. |
| SCR-003 | `/travel-tools` | **규칙 8**: 항공편·숙소·동행 구하기 3개 탭을 **실제로 조립**한다(스텁/placeholder 탭 금지). AC에 "3개 탭이 모두 실제 컴포넌트로 렌더링됨"을 명시한다. |
| SCR-005 | `/account` | **규칙 9**: Guest·Member·Admin 3개 역할 상태를 **실제로 조립**한다(역할별 조건부 렌더링이 스텁이 아니어야 함). AC에 "3개 상태가 모두 실제 컴포넌트로 렌더링됨"을 명시한다. |

나머지 Page Owner(SCR-002, SCR-004)도 §5의 공통 Acceptance Criteria 규칙(19, 20)을 동일하게 따른다.

---

## 4. 20개 핵심 규칙과 적용 방법

| # | 규칙 | Pipeline에서의 적용 |
|---|---|---|
| 1 | HARNESS_SCHEMA는 `traveler-screen-route-v1` | `scripts/validate_inputs.py`가 `SCREEN_ROUTE_CONTRACT.json.schema_version`을 검사, 불일치 시 Pipeline 중단 |
| 2 | Screen 목록의 정본은 `SCREEN_ROUTE_CONTRACT.json` | 다른 문서(예: `PROJECT_SCOPE.md`의 옛 "핵심4/보조1" 화면 구분)와 충돌하면 JSON을 따른다 |
| 3 | 정확히 5개 Screen 각각에 Page Owner Task 1개 | §2, `scripts/audit_tasks.py`의 `check_page_owner_coverage` |
| 4 | 실제 `src/app` 파일 트리를 확인한 뒤 Expected Files를 쓴다 | `/gen-tasklist`, `/gen-task-details` 실행 전 `scripts/validate_inputs.py`가 트리를 스캔해 `scripts/.reports/validate_inputs_report.json`에 기록, Task 작성 시 이 결과를 인용 |
| 5 | Page Owner와 Component Task를 구분 | §2 Type 분류 |
| 6 | Page Owner는 같은 Screen의 Component Task에 의존 | §2, `task-meta.depends_on` |
| 7 | `src/app/page.tsx` Owner는 Next.js Starter 제거 AC | §3 |
| 8 | `/travel-tools` Owner는 항공·숙소·동행 탭을 실제 조립 | §3 |
| 9 | `/account` Owner는 Guest·Member·Admin 상태를 실제 조립 | §3 |
| 10 | DB는 6개 테이블로 제한 | §6 |
| 11 | 여행지·안전·대표는 정적 데이터 Task | §7 |
| 12 | 외부 항공·숙소 입력값을 서버·DB·URL에 보내지 않음 | §8 |
| 13 | Playwright는 Chromium Smoke Task만 | §9 |
| 14 | 자동 Merge·EC2·AWS Task를 만들지 않음 | §10 |
| 15 | 모든 114개 Requirement에 IMPLEMENT 또는 EXCLUDED 상태 기록 | §11, `docs/UIUX_TRACEABILITY.md`를 그대로 인용(변경 금지) |
| 16 | EXCLUDED는 상세 구현 Task를 만들지 않지만 추적표에서 삭제하지 않음 | §11, TASK_LIST.md의 "제외된 Requirement" 표(§1.2) |
| 17 | Task List와 상세 파일이 1:1 | `scripts/audit_tasks.py`가 누락/고아 파일을 모두 검사 |
| 18 | 상세 생성 후 `scripts/audit_tasks.py`를 실행 | `.claude/commands/gen-task-details.md` 마지막 단계 |
| 19 | Page Owner AC에 화면별 Section 순서와 최소 콘텐츠 수 기록 | §5 |
| 20 | Page Owner는 큰 빈 영역·Placeholder 금지, Empty State(안내+이용방법+CTA) 요구 | §5 |

---

## 5. Page Owner Acceptance Criteria 계약 (규칙 19, 20)

모든 `page_owner` Task의 `task-meta`는 아래 필드를 **반드시** 포함한다.

| 필드 | 설명 | 출처 |
|---|---|---|
| `section_order` | 해당 Screen의 Section을 화면에 렌더링되는 순서대로 나열한 문자열 배열 | `SCREEN_ROUTE_CONTRACT.json`의 `sections`(SCR-005는 역할별 배열 중 큰 쪽을 기준으로 최소치를 잡는다) |
| `min_content_counts` | Section별 최소 콘텐츠 수(Card/Timeline/Gallery 등) | `design-reference/D-001/DESIGN.md` "화면별 Section 순서와 Card·Timeline·Gallery 최소 콘텐츠 수" 절. 예: 국내 여행지 6, 해외 여행지 6, 안전정보 6, 타임라인 6, 방문 국가 권역 4, 사진 갤러리 8, 추천 여행지 4, 동행(최근) 최대 3(Empty 가능) |
| `empty_state_required` | 항상 `true` | 콘텐츠가 0건인 Section은 D-001의 3요소 Empty State(① 상황 설명 ② 이용 방법/조건 안내 ③ 다음 행동 CTA)로 대체해야 한다 |
| `forbids_placeholder` | 항상 `true` | Lorem ipsum, "준비 중", "정보 확인 필요", 의미 없는 빈 카드, 과도한 빈 여백을 금지한다 |

Acceptance Criteria 본문에는 최소한 다음을 명시한다:
1. Section이 `section_order` 순서 그대로 렌더링된다(Hero 아래 다음 Section이 첫 화면에서 보이고 긴 빈 공간이 없다 — D-001 "Hero 높이와 첫 화면에서 다음 Section을 보여주는 규칙").
2. `min_content_counts`에 명시된 각 Section의 최소 콘텐츠 수가 충족된다.
3. 콘텐츠가 없는 상태는 반드시 완성형 Empty State(3요소)로 대체되며, 빈 화면·무한 스피너·Placeholder 문구를 남기지 않는다.
4. `design-reference/D-001/DESIGN.md` § Do / Do Not(Airbnb 상표, 예약/결제 UI, 광고·별점, 미지정 색상 금지)을 위반하지 않는다.

---

## 6. DB 범위 (규칙 10)

`docs/PROJECT_SCOPE.md` §5(데이터 모델 매핑)에 따라 Supabase 테이블은 아래 **5개로 고정**하며, 어떤 `db` Task도 이 목록을 벗어나거나 6개를 초과할 수 없다. `AUDIT_LOG`는 명시적으로 만들지 않는다(REQ-FUNC-056, 076 EXCLUDED).

1. `USER_PROFILE`
2. `MATE_POST`
3. `MATE_APPLICATION`
4. `USER_BLOCK`
5. `REPORT`

`db` Task의 `task-meta.tables`는 이 5개 중 일부만 참조해야 하며, `scripts/audit_tasks.py`는 전체 `db` Task의 `tables` 합집합이 6개를 넘거나 `AUDIT_LOG`를 포함하면 실패시킨다.

---

## 7. 정적 데이터 범위 (규칙 11)

아래 3개 도메인은 **항상 `data` Task**이며 `db` Task로 만들지 않는다(`src/data/*.ts`, `docs/PROJECT_SCOPE.md` §1 아키텍처 원칙).

- 여행지(국내 10+/해외 15개국 30도시+, `DESTINATION`/`DESTINATION_CONTENT`)
- 국가 안전정보(8개 필수 카테고리, `COUNTRY_SAFETY`)
- 대표 소개(`REPRESENTATIVE_PROFILE`: 50+ Trips/30+ Countries/타임라인/방문국가)

각 `data` Task의 Acceptance Criteria에는 `docs/PROJECT_SCOPE.md`의 최소 수량·완전성 기준(REQ-FUNC-008, 046, 047 등)을 인용한다.

---

## 8. 항공·숙소 입력값 비전달 계약 (규칙 12)

SCR-003(`/travel-tools`)의 항공·숙소 관련 `component` Task는 `task-meta.no_server_persistence = true`를 **반드시** 포함하고, Acceptance Criteria/Out of Scope에 아래를 명시한다(`CON-01`, `CON-02`, REQ-FUNC-017, 025 근거).

- 국가·지역·날짜 입력값은 브라우저 메모리 상태로만 처리하고 서버 API·DB·서버 로그·분석 이벤트에 저장하지 않는다.
- 외부 이동 URL에는 목적지·날짜 쿼리 파라미터를 붙이지 않는다.
- 이 Task를 위한 서버 API Route를 만들지 않는다(항공·호텔 폼은 Client Component 상태로만 동작).

`scripts/audit_tasks.py`는 SCR-003의 항공/숙소 관련 `component` Task에 이 필드가 없으면 실패시킨다.

---

## 9. 테스트 범위 (규칙 13)

`test` Task는 다음만 만든다:
- **Playwright Chromium Smoke Task 1개**: `task-meta.browser_projects = ["chromium"]` 고정(Firefox/WebKit/모바일 에뮬레이션 매트릭스 추가 금지). `docs/PROJECT_SCOPE.md` §6이 정의한 핵심 흐름(여행지 탐색/필터, 항공·호텔 입력→요약→외부이동, 회원가입·로그인·성인확인, 동행글 작성→참가요청→승인/거절, 신고·차단, 안전정보 열람, 대표 소개, 관리자)을 각 1개 이상 시나리오로 커버한다.
- **axe-core 접근성 점검 Task**: 핵심 화면(4+1)에 대해 Smoke Test에 포함하거나 별도 Task로 둔다(REQ-NF-024).
- **데이터 검증 스크립트 Task**: 정적 데이터 최소 수량·완전성 CI 검사(REQ-FUNC-008, 046, 074).

Lighthouse CI, 부하 테스트, 다중 브라우저 매트릭스, 시각 회귀 테스트 Task는 만들지 않는다(REQ-NF-007 EXCLUDED).

---

## 10. 금지 기술 (규칙 14)

아래는 어떤 Task 제목·본문·`task-meta`에도 등장해서는 안 된다(`scripts/audit_tasks.py`가 대소문자 무시 문자열 검사를 수행한다).

- EC2, AWS 인프라 직접 구성
- 자동(무인) Merge Runner / auto-merge
- Lighthouse CI 게이트(REQ-NF-007 EXCLUDED)

그 외 `docs/PROJECT_SCOPE.md` §8 "제외 기능 요약"에 나열된 기능(전체 콘텐츠 CMS, 미디어 업로드·라이선스 승인 워크플로, 범용 감사 로그, 자동 백업·장애 알림·부하 테스트, 외부 이메일 사업자 연동)은 §11의 EXCLUDED Requirement에 대응하므로 애초에 구현 Task를 만들지 않는다(규칙 16).

---

## 11. Requirement 커버리지 계약 (규칙 15, 16)

- `docs/UIUX_TRACEABILITY.md`의 114개 Requirement(REQ-FUNC-001~080, REQ-NF-001~034)는 **그대로 인용**한다. 이 파이프라인은 그 문서를 수정하지 않는다.
- Implementation Status가 `IMPLEMENT`로 시작하는(`IMPLEMENT`, `IMPLEMENT(축소)`, `IMPLEMENT(간소화)`, `IMPLEMENT(목표)`, `IMPLEMENT(설계 원칙)`) 모든 Requirement는 최소 1개 Task의 `requirements` 목록에 등장해야 한다.
- Implementation Status가 `EXCLUDED`인 Requirement는 **어떤 Task의 `requirements` 목록에도 등장해서는 안 된다.** 대신 `docs/tasks/TASK_LIST.md`의 "제외된 Requirement" 표(§1.2)에 ID와 제외 사유를 그대로 옮겨 적어, 삭제되지 않았음을 보존한다.
- `scripts/audit_tasks.py`가 위 두 조건을 기계적으로 검사한다.

---

## 12. Task 개수에 대한 안내

전체 Task 수는 대략 **45~65개**로 예상한다(Page Owner 5 + Component 20~25 + Data 3 + DB 1~2 + API/Infra 6~9 + 공통 2~3 + Test 2~3 + CI 1). **이 개수 자체를 완료 조건으로 쓰지 않는다** — `scripts/audit_tasks.py`를 통과하는지가 완료 조건이다. 실제 Section 구성상 Component Task가 더 필요하면 늘려도 되고, 합쳐도 무리가 없으면 줄여도 된다.

---

## 13. Pipeline 순서 요약

1. `/gen-tasklist` — `scripts/validate_inputs.py`(gate) → `docs/tasks/TASK_LIST.md` 생성/갱신
2. `/gen-task-details [TASK_ID ...]` — 누락된(또는 지정된) Task의 상세 파일을 `docs/tasks/details/`에 생성 → 마지막 단계로 `scripts/audit_tasks.py` 실행(규칙 18) → 실패 시 수정 후 재실행
3. `/audit-tasks` — 언제든 재실행 가능한 읽기 전용 점검(생성 로직 없음)
