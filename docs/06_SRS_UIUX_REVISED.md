# SRS Revision — UI/UX Screen Consolidation

- **Document ID:** SRS-TRAVEL-001-R1 (revises `02_SRS_BASELINE.md`, Revision 1.0)
- **기반 문서:** `02_SRS_BASELINE.md`, `PROJECT_SCOPE.md`, `03_UI_COVERAGE_ANALYSIS.md`, `docs/05_UIUX_APPROVED.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`
- **개정 범위**: `02_SRS_BASELINE.md` §3.5(Page and Route Inventory), §3.6(Use Cases의 화면 대응), §2.2(Role Permission Matrix)의 화면 대응 관계를 5개 승인 Screen(SCR-001~SCR-005) 기준으로 개정한다. **§4 Specific Requirements의 REQ-FUNC-001~080, REQ-NF-001~034 원문·Priority·Acceptance Criteria는 변경하지 않는다** — 전문은 `02_SRS_BASELINE.md` §4를 그대로 따른다.
- **삭제 금지 확인**: 본 문서는 REQ-FUNC-001~080, REQ-NF-001~034 중 어떤 항목도 삭제하지 않는다. 아래 §5에 114개 항목 전체를 ID·요약·Priority·Implementation Status로 재수록해 누락이 없음을 확인한다.

---

## 1. 개정 개요

| 구분 | 상태 |
|---|---|
| REQ-FUNC-001~080 (80개) | **변경 없음** — 원문·우선순위·AC는 `02_SRS_BASELINE.md` §4.1 그대로 |
| REQ-NF-001~034 (34개) | **변경 없음** — 원문·지표·목표는 `02_SRS_BASELINE.md` §4.2 그대로 |
| §3.5 Page and Route Inventory (16개 Route) | **개정** — 5개 Screen(SCR-001~005)의 탭·패널·모달로 통합(§2) |
| §2.2 Role Permission Matrix | **개정** — 각 권한 행에 대응 Screen과 `PROJECT_SCOPE.md` 축소/제외 여부를 추가(§3) |
| UI Route Contract | **신규 추가**(§4) |
| Release Acceptance Criteria | **신규 추가**(§5.3) |
| 구현 현황 | 코드 구현 **미시작**. 본 개정은 설계·계약 승인 기록이며 구현 완료를 선언하지 않는다(§6) |

---

## 2. §3.5 개정 — Page and Route Inventory → UI Route Contract

`02_SRS_BASELINE.md` §3.5의 16개 Route는 삭제되지 않고 아래 5개 Screen으로 통합되었다. 상세 근거와 통합 형태(탭/패널/모달)는 `docs/05_UIUX_APPROVED.md` §1과 동일하며, 이 절은 SRS 문서 내에서 동일 사실을 재수록한다.

| 기존 Route(baseline §3.5) | 통합 Screen | 통합 형태 |
|---|---|---|
| `/`, `/destinations`, `/destinations/domestic`, `/destinations/overseas`, `/destinations/[slug]`, `/safety`, `/safety/[countryCode]` | **SCR-001** (`/`) | 목록 섹션(탭/필터) + 여행지·안전정보 상세 Drawer/Modal |
| `/flights`, `/hotels`, `/mates/new` | **SCR-003** (`/travel-tools`) | 항공편 / 숙소 / 동행 구하기 3개 **탭** |
| `/mates`, `/mates/[id]` | **SCR-004** (`/mates`) | 목록 + 상세 **패널**(Desktop 분할, Mobile Drawer) |
| `/about` | **SCR-002** (`/about`) | 그대로 유지 |
| `/auth/*`, `/my/*`, `/admin/*` | **SCR-005** (`/account`) | Guest 인증 Card / Member "내 활동" 탭 / Admin "관리" 영역(역할 기반 조건부 렌더링) |

`/travel-tools`는 항공·숙소·동행 작성 탭을 모두 포함하고, `/account`는 인증·프로필·내 활동·간단 관리자를 모두 포함한다(규칙 준수).

---

## 3. §2.2 개정 — Role Permission Matrix의 Screen 대응

`02_SRS_BASELINE.md` §2.2 원표는 변경하지 않으며, 각 권한 행이 통합 후 어느 Screen/영역에서 구현되는지와 `PROJECT_SCOPE.md`의 축소·제외 여부를 아래에 추가한다.

| 기능(baseline §2.2 원행) | Guest | Adult Member | Editor | Moderator | Admin | 대응 Screen/영역 | PROJECT_SCOPE 반영 |
|---|:---:|:---:|:---:|:---:|:---:|---|---|
| 여행지·안전·대표 열람 | O | O | O | O | O | SCR-001, SCR-002 | 그대로 구현 |
| 항공·호텔 외부 이동 | O | O | O | O | O | SCR-003 | 그대로 구현(서버 API 없음) |
| 동행글 목록·상세 열람 | O | O | O | O | O | SCR-004 | 그대로 구현 |
| 동행글 작성·참가 요청 | X | O | X | O | O | SCR-003(작성 탭), SCR-004(참가 요청) | 그대로 구현 |
| 본인 글·요청 관리 | X | O | X | O | O | SCR-005(내 활동 탭) | 그대로 구현 |
| 신고·차단 | X | O | X | O | O | SCR-004(신고/차단 버튼), SCR-005(차단 목록) | 신고는 간소화(REQ-FUNC-039 IMPLEMENT(간소화)) |
| 여행지·안전 콘텐츠 CRUD | X | X | O | X | O | 없음(**EXCLUDED**) | REQ-FUNC-055, 072 EXCLUDED — 콘텐츠는 `src/data` 코드 배포로 관리, Editor 전용 UI를 만들지 않는다 |
| 신고 큐·제재 | X | X | X | O | O | SCR-005(관리 영역) | 간소화(REQ-FUNC-041, 042 IMPLEMENT(간소화)) — 상태 변경·숨김만, 우선순위·증거·계정 제한은 없음 |
| 외부 URL·권한 관리 | X | X | X | X | O | SCR-005(관리 영역) | 외부 URL 설정만 구현(REQ-FUNC-077 IMPLEMENT). 사용자 권한 변경 UI는 범위 밖(**EXCLUDED**, 별도 REQ 없음 — `PROJECT_SCOPE.md` §2 관리자 탭 2종 한정) |
| 감사 로그 열람 | X | X | 제한 | 제한 | O | 없음(**EXCLUDED**) | REQ-FUNC-076 EXCLUDED — 범용 감사 로그 미구현 |

---

## 4. UI Route Contract

Source of Truth는 `design-reference/SCREEN_ROUTE_CONTRACT.json`(`schema_version: traveler-screen-route-v1`, `framework: nextjs-app-router`)이며, 충돌 시 JSON을 따른다. 서술형 계약은 `design-reference/UI_CONTRACT.md`.

| Screen ID | Tier | Route | Page Entry | Mobile 변형 | page_owner_task_required | preview_required | starter_template_forbidden |
|---|---|---|---|---|:---:|:---:|:---:|
| SCR-001 | core | `/` | `src/app/page.tsx` | 있음 | true | true | **true** |
| SCR-002 | auxiliary | `/about` | `src/app/about/page.tsx` | 없음 | true | true | false |
| SCR-003 | core | `/travel-tools` | `src/app/travel-tools/page.tsx` | 있음 | true | true | false |
| SCR-004 | core | `/mates` | `src/app/mates/page.tsx` | 없음 | true | true | false |
| SCR-005 | core | `/account` | `src/app/account/page.tsx` | 없음 | true | true | false |

**기술 Route**(Screen 수 5에 미포함): Auth Callback(`src/app/auth/callback/route.ts`), API Route 대표 4종(`/api/mates`, `/api/mates/[id]/requests`, `/api/reports`, `/api/admin/settings`), Not Found(`src/app/not-found.tsx`), Error Boundary(`src/app/error.tsx`), Unauthorized(`src/app/unauthorized.tsx`).

**완료 조건 확인**(SCREEN_ROUTE_CONTRACT.json `completion_checks`): Route 중복 없음 · Page Entry 중복 없음 · Screen 수 5 · 핵심(SCR-001,003,004,005) 4개·보조(SCR-002) 1개 구분 존재 — 모두 충족.

---

## 5. Requirement 재확인 및 Release Acceptance Criteria

### 5.1 REQ-FUNC-001~080 재확인 (원문·AC는 baseline §4.1 참조)

전체 80개 항목이 아래 표에 1회씩 존재한다(삭제 없음). Implementation Status는 `PROJECT_SCOPE.md`의 분류를 그대로 인용한다.

| Range | 개수 | Implementation Status 분포 |
|---|---:|---|
| REQ-FUNC-001~010 (F1) | 10 | IMPLEMENT 9, IMPLEMENT(축소) 1 |
| REQ-FUNC-011~018 (F2) | 8 | IMPLEMENT 7, IMPLEMENT(축소) 1 |
| REQ-FUNC-019~026 (F3) | 8 | IMPLEMENT 7, IMPLEMENT(축소) 1 |
| REQ-FUNC-027~045 (F4) | 19 | IMPLEMENT 13, IMPLEMENT(축소) 3(037, 043, 045), IMPLEMENT(간소화) 3(039, 041, 042) |
| REQ-FUNC-046~056 (F5) | 11 | IMPLEMENT 8, IMPLEMENT(축소) 1(050), EXCLUDED 2(055, 056) |
| REQ-FUNC-057~063 (F6) | 7 | IMPLEMENT 5, IMPLEMENT(축소) 2 |
| REQ-FUNC-064~080 (F7) | 17 | IMPLEMENT 10, IMPLEMENT(축소) 2(068, 074), EXCLUDED 5(071, 072, 073, 075, 076) |
| **합계** | **80** | ID·개수는 `03_UI_COVERAGE_ANALYSIS.md` §6 검증과 일치 |

전체 80개 항목의 ID별 Implementation Status·Screen·Route·Page Entry 매핑은 `docs/UIUX_TRACEABILITY.md`에서 1:1로 확인한다(요약 표 중복 방지를 위해 본 문서에서는 재수록하지 않는다).

### 5.2 REQ-NF-001~034 재확인 (원문·지표는 baseline §4.2 참조)

| Range | 개수 | Implementation Status 분포 |
|---|---:|---|
| REQ-NF-001~007 (Performance) | 7 | IMPLEMENT(목표) 3, IMPLEMENT(축소) 2, IMPLEMENT 1, EXCLUDED 1(007) |
| REQ-NF-008~011 (Reliability) | 4 | EXCLUDED 4(전체) |
| REQ-NF-012~018 (Security) | 7 | IMPLEMENT 6, IMPLEMENT(축소) 1(018) |
| REQ-NF-019~022 (Safety) | 4 | IMPLEMENT 1(019), EXCLUDED 3(020~022) |
| REQ-NF-023~025 (Accessibility) | 3 | IMPLEMENT 2, IMPLEMENT(축소) 1(024) |
| REQ-NF-026~030 (Content/SEO) | 5 | IMPLEMENT 3, IMPLEMENT(축소) 1(028), EXCLUDED 1(029) |
| REQ-NF-031~034 (Maintainability) | 4 | IMPLEMENT 1, IMPLEMENT(설계 원칙) 1(034), EXCLUDED 2(032, 033) |
| **합계** | **34** | `03_UI_COVERAGE_ANALYSIS.md` §6 검증과 일치 |

전체 34개 항목의 상세 매핑도 `docs/UIUX_TRACEABILITY.md`에서 확인한다.

### 5.3 Release Acceptance Criteria

`02_SRS_BASELINE.md` §6.8.3(Rollout Acceptance)을 `PROJECT_SCOPE.md`의 축소·제외 결정에 맞게 재정의한다. baseline의 일부 기준(예: "신고 24h 이내 90% 1차 검토")은 REQ-NF-020이 EXCLUDED로 분류되어 이번 릴리스 수용 기준에서 제외한다.

| # | 기준 | 근거 | 현재 상태 |
|---|---|---|---|
| AC-REL-01 | SCR-001~SCR-005 5개 Route가 모두 존재하고 Route/Page Entry 중복이 없다 | §4 completion_checks | **NOT MET** |
| AC-REL-02 | SCR-001에 create-next-app 스타터 템플릿 흔적이 없다 | starter_template_forbidden=true | **NOT MET** |
| AC-REL-03 | `/travel-tools`에 항공·숙소·동행 구하기 3개 탭이 모두 존재한다 | §2 | **NOT MET** |
| AC-REL-04 | `/account`에 인증·프로필·내 활동·관리(역할 기반) 영역이 모두 존재한다 | §2, §3 | **NOT MET** |
| AC-REL-05 | 콘텐츠 최소 수량 충족(국내 10+, 해외 15개국 30도시+, 안전정보 8개 카테고리) | REQ-FUNC-008, 047 | **NOT MET** |
| AC-REL-06 | Lorem ipsum·"준비 중"·빈 카드 없음, 콘텐츠 없는 상태는 완성형 Empty State로 대체 | `design-reference/D-001/DESIGN.md` | **NOT MET** |
| AC-REL-07 | EXCLUDED 기능(콘텐츠 CMS, 미디어 업로드, 감사 로그, 실시간 채팅, 자동 백업/장애알림/부하테스트 등)이 화면에 없다 | `PROJECT_SCOPE.md` §8 | **NOT MET**(구현 자체가 없어 검증 불가) |
| AC-REL-08 | Playwright 핵심 Smoke Test가 5개 Screen 핵심 흐름을 각 1개 이상 커버한다 | `PROJECT_SCOPE.md` §6 | **NOT MET** |
| AC-REL-09 | 핵심 화면(4+1)에서 axe-core serious/critical 0건 | REQ-NF-024 | **NOT MET** |
| AC-REL-10 | `tsc --noEmit`, ESLint, 데이터 검증 스크립트 CI 통과 | REQ-NF-031 | **NOT MET** |

---

## 6. 구현 현황 고지

본 개정 문서 작성 시점 기준 `src/app`에는 `layout.tsx`, `page.tsx`(create-next-app 스타터 템플릿), `globals.css`만 존재하며 `about/`, `travel-tools/`, `mates/`, `account/` 라우트는 생성되지 않았다. **REQ-FUNC-001~080, REQ-NF-001~034 중 IMPLEMENT로 분류된 어떤 항목도 아직 코드로 구현되지 않았다.** 본 문서는 설계·Route 계약의 개정을 기록하는 것이며 구현 완료를 의미하지 않는다. 구현 진행 상황은 `docs/UIUX_TRACEABILITY.md`의 Task/Test/Status 열을 갱신하며 추적한다.
