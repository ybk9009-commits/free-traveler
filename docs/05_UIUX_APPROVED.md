# UI/UX 승인 기록 — Free Traveler

- **Document ID:** UIUX-APPROVED-001
- **기반 문서:** `02_SRS_BASELINE.md`(REQ-FUNC-001~080, REQ-NF-001~034), `PROJECT_SCOPE.md`, `03_UI_COVERAGE_ANALYSIS.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `docs/STITCH_VALIDATION_REPORT.md`, `design-reference/D-001/DESIGN.md`
- **목적**: `02_SRS_BASELINE.md` §3.5에 정의된 16개 공개 Route를 삭제하지 않고, 승인된 5개 디자인 Screen(SCR-001~SCR-005)의 탭·패널·모달로 통합했음을 공식 기록한다. Requirement ID(REQ-FUNC-001~080, REQ-NF-001~034)는 어느 것도 삭제·변경하지 않는다.
- **승인 상태**: Screen 설계는 `docs/STITCH_VALIDATION_REPORT.md`(정본 Screen ID 확정) 및 `design-reference/D-001/DESIGN.md`(`Status: LOCKED`)로 승인 완료. **코드 구현은 아직 시작되지 않았다** — 이 문서는 설계·라우트 계약의 승인을 기록하는 것이며 구현 완료를 의미하지 않는다.

---

## 1. Route 통합 매핑

`02_SRS_BASELINE.md` §3.5 "Page and Route Inventory"의 16개 Route는 삭제되지 않고, 아래와 같이 5개 Screen의 탭·패널·모달로 통합되었다(근거: `03_UI_COVERAGE_ANALYSIS.md` §2 Screen 정의).

| 기존 SRS Route(§3.5) | 기존 Page | 통합 대상 Screen | 통합 형태 |
|---|---|---|---|
| `/` | 홈 | **SCR-001** (`/`) | 그대로 유지(메인 화면) |
| `/destinations` | 전체 여행지 | **SCR-001** | 국내·해외 여행지 Card Grid 섹션으로 통합(별도 라우트 없음) |
| `/destinations/domestic` | 국내 여행지 | **SCR-001** | "국내 인기 여행지" 섹션(탭/필터로 표현) |
| `/destinations/overseas` | 해외 여행지 | **SCR-001** | "해외 인기 여행지" 섹션(탭/필터로 표현) |
| `/destinations/[slug]` | 여행지 상세 | **SCR-001** | 여행지 상세 **Drawer/Modal**(별도 라우트 아님) |
| `/flights` | 비행기 찾기 입력·요약 | **SCR-003** (`/travel-tools`) | "항공편" **탭** |
| `/hotels` | 호텔 찾기 입력·요약 | **SCR-003** | "숙소" **탭** |
| `/mates` | 동행 모집글 목록 | **SCR-004** (`/mates`) | 목록 영역(그대로 유지) |
| `/mates/[id]` | 동행 모집글 상세 | **SCR-004** | 상세 **패널**(Desktop 좌우 분할 / Mobile 하단 Drawer) |
| `/mates/new` | 동행 모집글 작성 | **SCR-003** | "동행 구하기" **탭** |
| `/safety` | 국가별 주의사항 목록 | **SCR-001** | 안전정보 Card Grid 섹션 |
| `/safety/[countryCode]` | 국가별 주의사항 상세 | **SCR-001** | 안전정보 상세 **Drawer/Modal** |
| `/about` | 대표 소개 | **SCR-002** (`/about`) | 그대로 유지 |
| `/auth/*` | 가입·로그인·성인 확인 | **SCR-005** (`/account`) | Guest 상태 인증 **Card**(서브탭: 로그인/가입/재설정) |
| `/my/*` | 내 글·참가 요청·차단 | **SCR-005** | Member 상태 "내 활동" **탭** |
| `/admin/*` | 콘텐츠·신고·설정 | **SCR-005** | Admin 상태 "관리" 영역(신고 큐 + 외부 URL 설정만, `PROJECT_SCOPE.md` §2 축소 범위 반영) |

**규칙 준수**: `/travel-tools`(SCR-003)는 항공·숙소·동행 작성 3개 탭을 모두 포함한다. `/account`(SCR-005)는 인증(Guest)·프로필·내 활동(Member)·간단 관리자(Admin)를 역할 기반으로 포함한다.

`PROJECT_SCOPE.md` §2의 "핵심 화면(4)/보조 화면(1)" 구분은 통합 이전 Route 개수 기준이었다. 통합 이후에는 `design-reference/UI_CONTRACT.md`의 기준(주요 사용자 여정 SCR-001·003·004·005 = **핵심**, 신뢰 구축용 정보 화면 SCR-002 = **보조**)으로 대체한다. `/safety`는 더 이상 독립 화면이 아니며 SCR-001의 Drawer/Modal로 흡수된다(`03_UI_COVERAGE_ANALYSIS.md` §2 각주 근거).

---

## 2. UI Route Contract (요약)

전체 계약은 `design-reference/UI_CONTRACT.md`(서술형)와 `design-reference/SCREEN_ROUTE_CONTRACT.json`(기계 판독용, `schema_version: traveler-screen-route-v1`)이 원본(Source of Truth)이다. 아래는 승인 기록용 요약이다.

| Screen ID | Tier | Route | Page Entry | Mobile 변형 | 현재 상태 |
|---|---|---|---|---|---|
| SCR-001 | 핵심 | `/` | `src/app/page.tsx` | 있음(승인) | **미구현** — create-next-app 스타터 템플릿이 그대로 남아 있음 |
| SCR-002 | 보조 | `/about` | `src/app/about/page.tsx` | 없음 | **미구현** — 라우트 미생성 |
| SCR-003 | 핵심 | `/travel-tools` | `src/app/travel-tools/page.tsx` | 있음(승인) | **미구현** — 라우트 미생성 |
| SCR-004 | 핵심 | `/mates` | `src/app/mates/page.tsx` | 없음 | **미구현** — 라우트 미생성 |
| SCR-005 | 핵심 | `/account` | `src/app/account/page.tsx` | 없음 | **미구현** — 라우트 미생성 |

기술 Route(Screen 수에 미포함, `SCREEN_ROUTE_CONTRACT.json` `technical_routes`): Auth Callback(`/auth/callback`), API Route(대표 4종), Not Found(`src/app/not-found.tsx`), Error Boundary(`src/app/error.tsx`), Unauthorized(`src/app/unauthorized.tsx`) — 전부 미구현.

---

## 3. Release Acceptance Criteria

`02_SRS_BASELINE.md` §6.8.3(Rollout Acceptance)과 `PROJECT_SCOPE.md`의 축소·제외 결정을 반영해, 5-Screen 승인 설계 기준으로 재정의한 출시 수용 기준이다. **아래 항목은 모두 현재 시점 기준 미충족(NOT MET) — 코드 구현 전이다.**

| # | 기준 | 근거 | 현재 상태 |
|---|---|---|---|
| AC-REL-01 | SCR-001~SCR-005 5개 Route가 모두 존재하고 Route/Page Entry 중복이 없다 | `SCREEN_ROUTE_CONTRACT.json` completion_checks | NOT MET(라우트 4개 미생성) |
| AC-REL-02 | SCR-001에 create-next-app 스타터 템플릿 흔적이 없다 | `starter_template_forbidden=true` | NOT MET |
| AC-REL-03 | `/travel-tools`에 항공·숙소·동행 구하기 3개 탭이 모두 존재한다 | 본 문서 §1, `PROJECT_SCOPE.md` §2 | NOT MET(미구현) |
| AC-REL-04 | `/account`에 인증·프로필·내 활동·관리(역할 기반) 영역이 모두 존재한다 | 본 문서 §1 | NOT MET(미구현) |
| AC-REL-05 | 콘텐츠 최소 수량 충족: 국내 10+, 해외 15개국 30도시+, 국가 안전정보 8개 카테고리, 동행 모집글 최소 3(Empty State 대체 가능) | REQ-FUNC-008, 047, `design-reference/D-001/DESIGN.md` | NOT MET(데이터 미작성) |
| AC-REL-06 | Lorem ipsum·"준비 중"·빈 카드가 없고, 콘텐츠 없는 상태는 완성형 Empty State(3요소)로 대체된다 | `design-reference/D-001/DESIGN.md` § Empty State 규칙 | NOT MET(미구현) |
| AC-REL-07 | `PROJECT_SCOPE.md`에서 EXCLUDED로 분류된 기능(전체 콘텐츠 CMS, 미디어 업로드 워크플로, 범용 감사 로그, 실시간 채팅, 자동 백업/장애 알림/부하테스트 등)이 화면 어디에도 구현되지 않는다 | `PROJECT_SCOPE.md` §8 | NOT MET(검증 대상 자체가 미구현) |
| AC-REL-08 | Playwright 핵심 Smoke Test가 5개 Screen의 핵심 흐름(여행지 탐색, 항공/호텔 입력→요약→외부이동, 회원가입·로그인·성인확인, 동행글 작성→참가요청→승인/거절, 신고·차단, 안전정보 열람, 대표 소개, 관리자 신고처리·외부URL설정)을 각 1개 이상 커버한다 | `PROJECT_SCOPE.md` §6 | NOT MET(테스트 미작성) |
| AC-REL-09 | 핵심 화면(4+1)에 대해 axe-core 자동 접근성 검사에서 serious/critical 0건 | REQ-NF-024, `PROJECT_SCOPE.md` §4.5 | NOT MET |
| AC-REL-10 | `tsc --noEmit`, ESLint, 데이터 검증 스크립트가 CI에서 통과한다 | REQ-NF-031 | NOT MET |

Task 생성 및 구현이 진행되면 각 기준의 상태는 `docs/UIUX_TRACEABILITY.md`의 Task/Test/Status 갱신을 통해 추적한다.

---

## 4. 승인 선언

- SCR-001~SCR-005 및 SCR-001/SCR-003 Mobile 변형은 `docs/STITCH_VALIDATION_REPORT.md` §3(화면별 최종 판정)과 `design-reference/D-001/DESIGN.md`(`Status: LOCKED`)를 근거로 **디자인 승인 완료** 상태다.
- 본 승인은 **시각 디자인과 Route/Screen 구조**에 대한 것이며, 코드 구현·테스트 완료를 의미하지 않는다.
- REQ-FUNC-001~080, REQ-NF-001~034는 본 문서에서 어느 것도 삭제하지 않았으며, 전체 매핑은 `docs/UIUX_TRACEABILITY.md`에서 확인한다.
