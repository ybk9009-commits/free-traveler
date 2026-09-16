# Traveler Task List

- **기반**: `TASKS/00_TASK_LIST.md`(70개 Task, 원본 상세 보존)를 `.claude/skills/traveler-project-pipeline/SKILL.md` 규격(Task ID 접두사, `task-meta` 코드펜스, `docs/tasks/details/<ID>.md` 1:1)에 맞춰 재정리한 문서.
- **범위**: Task 목록/상세 정의만 다룬다. 구현 코드·Branch·Commit은 이 작업에서 만들지 않는다.

---

## Task 목록

| Task ID | Type | Screen | Title | Depends On | Requirements | Detail File | Status |
|---|---|---|---|---|---|---|---|
| DATA-DESTINATIONS | data | — (SCR-001, SCR-002에서 소비) | 여행지 정적 데이터 | — | REQ-FUNC-007, REQ-FUNC-008, REQ-NF-026 | docs/tasks/details/DATA-DESTINATIONS.md | NOT_STARTED |
| DATA-REPRESENTATIVE | data | — (SCR-001, SCR-002에서 소비) | 대표 소개 정적 데이터 | — | REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-061 | docs/tasks/details/DATA-REPRESENTATIVE.md | NOT_STARTED |
| DATA-SAFETY | data | — (SCR-001에서 소비) | 국가 안전정보 정적 데이터 | DATA-DESTINATIONS | REQ-FUNC-046, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-052, REQ-FUNC-053, REQ-NF-027 | docs/tasks/details/DATA-SAFETY.md | NOT_STARTED |
| DB-ACCESS | db | — | Supabase Client/Server 접근 유틸 | DB-SCHEMA-BASE | — | docs/tasks/details/DB-ACCESS.md | NOT_STARTED |
| DB-RLS-BASE | db | — | Supabase RLS 정책 | DB-SCHEMA-BASE | REQ-FUNC-044, REQ-NF-013 | docs/tasks/details/DB-RLS-BASE.md | NOT_STARTED |
| DB-SCHEMA-BASE | db | — | Supabase 테이블 스키마(5종) | — | REQ-FUNC-029, REQ-FUNC-031, REQ-FUNC-034, REQ-FUNC-040, REQ-FUNC-039 | docs/tasks/details/DB-SCHEMA-BASE.md | NOT_STARTED |
| DB-SEED-BASE | db | — | 개발·테스트 시드 데이터 | DB-SCHEMA-BASE | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-030, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-043, REQ-FUNC-044, REQ-FUNC-045 | docs/tasks/details/DB-SEED-BASE.md | NOT_STARTED |
| INFRA-ADULT-VERIFICATION | infra | — (SCR-005에서 소비) | 성인확인 플래그 처리 | DB-SCHEMA-BASE, INFRA-AUTH-SESSION | REQ-FUNC-028 | docs/tasks/details/INFRA-ADULT-VERIFICATION.md | NOT_STARTED |
| INFRA-AUTH-SESSION | infra | — (SCR-003, SCR-005에서 소비) | Supabase Auth 세션·이메일 인증 | DB-ACCESS | REQ-FUNC-027, REQ-FUNC-066, REQ-NF-014 | docs/tasks/details/INFRA-AUTH-SESSION.md | NOT_STARTED |
| INFRA-CONTACT-DETECTION | infra | — (SCR-003 동행 작성 Form에서 소비) | 공개 연락처 탐지 유틸 | — | REQ-FUNC-032 | docs/tasks/details/INFRA-CONTACT-DETECTION.md | NOT_STARTED |
| INFRA-EXTERNAL-LINK-SAFETY | infra | — (SCR-001, SCR-003에서 소비) | 외부 링크 새 탭·noopener 공용 유틸 | — | REQ-FUNC-016, REQ-FUNC-024, REQ-FUNC-049 | docs/tasks/details/INFRA-EXTERNAL-LINK-SAFETY.md | NOT_STARTED |
| INFRA-INPUT-VALIDATION | infra | — (모든 API Task에서 소비) | 서버 입력 검증·이스케이프 공통 스키마 | — | REQ-NF-015 | docs/tasks/details/INFRA-INPUT-VALIDATION.md | NOT_STARTED |
| INFRA-USER-DELETE | infra | — (SCR-005에서 소비) | 탈퇴 시 즉시 비식별화 | DB-SCHEMA-BASE, INFRA-AUTH-SESSION | REQ-FUNC-045, REQ-NF-018 | docs/tasks/details/INFRA-USER-DELETE.md | NOT_STARTED |
| API-ADMIN-SETTINGS | api | SCR-005 | 신고 상태 변경·외부 URL 설정 | DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, INFRA-AUTH-SESSION, INFRA-INPUT-VALIDATION | REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-077 | docs/tasks/details/API-ADMIN-SETTINGS.md | NOT_STARTED |
| API-BLOCKS | api | SCR-004, SCR-005 | 사용자 차단·해제 | DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, INFRA-AUTH-SESSION | REQ-FUNC-040 | docs/tasks/details/API-BLOCKS.md | NOT_STARTED |
| API-MATE-APPLICATIONS | api | SCR-004(신청), SCR-005(승인/거절) | 참가 요청 생성·승인·거절 | DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, INFRA-AUTH-SESSION, INFRA-ADULT-VERIFICATION, INFRA-INPUT-VALIDATION | REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036 | docs/tasks/details/API-MATE-APPLICATIONS.md | NOT_STARTED |
| API-MATE-POSTS | api | SCR-003(작성), SCR-005(관리) | 동행 모집글 생성·수정·마감·삭제 | DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, INFRA-AUTH-SESSION, INFRA-ADULT-VERIFICATION, INFRA-CONTACT-DETECTION, INFRA-INPUT-VALIDATION | REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-037, REQ-FUNC-038 | docs/tasks/details/API-MATE-POSTS.md | NOT_STARTED |
| API-REPORTS | api | SCR-004 | 신고 접수 | DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, INFRA-AUTH-SESSION, INFRA-INPUT-VALIDATION | REQ-FUNC-039, REQ-NF-019 | docs/tasks/details/API-REPORTS.md | NOT_STARTED |
| CMP-COMMON-ARIA-PATTERNS | component | 공통(5개 Screen) | 폼·모달·탭·알림 공용 ARIA 패턴 | — | REQ-FUNC-079, REQ-NF-023 | docs/tasks/details/CMP-COMMON-ARIA-PATTERNS.md | NOT_STARTED |
| CMP-COMMON-EMPTY-STATE | component | 공통(5개 Screen) | 완성형 Empty State 공용 컴포넌트 | — | REQ-FUNC-005 | docs/tasks/details/CMP-COMMON-EMPTY-STATE.md | NOT_STARTED |
| CMP-COMMON-ERROR-BOUNDARIES | component | —(기술 Route, Screen 수에 미포함) | 404/500/권한없음/외부연결실패 경계 | — | REQ-FUNC-078 | docs/tasks/details/CMP-COMMON-ERROR-BOUNDARIES.md | NOT_STARTED |
| CMP-COMMON-FAVORITES-SHARE | component | 공통(SCR-001, SCR-004, SCR-005에서 소비) | 즐겨찾기(localStorage) + URL 공유 훅 | — | REQ-FUNC-068, REQ-FUNC-069 | docs/tasks/details/CMP-COMMON-FAVORITES-SHARE.md | NOT_STARTED |
| CMP-COMMON-HEADER-FOOTER | component | 공통(5개 Screen) | 전역 Header/Footer(`layout.tsx`) | INFRA-AUTH-SESSION | REQ-FUNC-064 | docs/tasks/details/CMP-COMMON-HEADER-FOOTER.md | NOT_STARTED |
| CMP-COMMON-RESPONSIVE-LAYOUT | component | 공통(5개 Screen) | 320px~Desktop 반응형 레이아웃 규칙 | — | REQ-FUNC-065, REQ-NF-006 | docs/tasks/details/CMP-COMMON-RESPONSIVE-LAYOUT.md | NOT_STARTED |
| CMP-COMMON-SEO-METADATA | component | 공통(5개 Screen) | Next Metadata API 공통 적용 | — | REQ-FUNC-070, REQ-NF-030 | docs/tasks/details/CMP-COMMON-SEO-METADATA.md | NOT_STARTED |
| CMP-COMMON-TOAST | component | 공통(5개 Screen) | Toast 알림(성공/오류) | — | REQ-FUNC-043 | docs/tasks/details/CMP-COMMON-TOAST.md | NOT_STARTED |
| CMP-SCR-001-about-summary | component | SCR-001 | 대표 소개 요약 카드 | DATA-REPRESENTATIVE | REQ-FUNC-057 | docs/tasks/details/CMP-SCR-001-about-summary.md | NOT_STARTED |
| CMP-SCR-001-destination-detail-drawer | component | SCR-001 | 여행지 상세 Drawer | CMP-SCR-001-destination-grid, DATA-DESTINATIONS, DATA-SAFETY, CMP-COMMON-FAVORITES-SHARE | REQ-FUNC-004, REQ-FUNC-006, REQ-FUNC-007, REQ-FUNC-009, REQ-FUNC-069 | docs/tasks/details/CMP-SCR-001-destination-detail-drawer.md | NOT_STARTED |
| CMP-SCR-001-destination-grid | component | SCR-001 | 국내·해외 여행지 Card Grid + 테마 필터 | DATA-DESTINATIONS, CMP-COMMON-FAVORITES-SHARE, CMP-COMMON-EMPTY-STATE | REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-005, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-068, REQ-NF-006 | docs/tasks/details/CMP-SCR-001-destination-grid.md | NOT_STARTED |
| CMP-SCR-001-hero-search | component | SCR-001 | Hero 통합 검색 | DATA-DESTINATIONS, DATA-SAFETY | REQ-FUNC-003, REQ-FUNC-067 | docs/tasks/details/CMP-SCR-001-hero-search.md | NOT_STARTED |
| CMP-SCR-001-recent-mates | component | SCR-001 | 최근 동행 카드 3개/Empty State | DB-ACCESS, CMP-COMMON-EMPTY-STATE | — | docs/tasks/details/CMP-SCR-001-recent-mates.md | NOT_STARTED |
| CMP-SCR-001-safety-section | component | SCR-001 | 국가별 안전정보 Card + 상세 Drawer | DATA-SAFETY, INFRA-EXTERNAL-LINK-SAFETY | REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-052, REQ-FUNC-053, REQ-FUNC-054, REQ-NF-028 | docs/tasks/details/CMP-SCR-001-safety-section.md | NOT_STARTED |
| CMP-SCR-002-countries-gallery | component | SCR-002 | 방문 국가 30개 + 사진 Gallery 8개 | DATA-REPRESENTATIVE | REQ-FUNC-059, REQ-FUNC-061, REQ-NF-006 | docs/tasks/details/CMP-SCR-002-countries-gallery.md | NOT_STARTED |
| CMP-SCR-002-favorite-destinations-cta | component | SCR-002 | 기억에 남는 여행지 4개 + CTA | DATA-DESTINATIONS, CMP-SCR-001-destination-detail-drawer | REQ-FUNC-062, REQ-FUNC-063 | docs/tasks/details/CMP-SCR-002-favorite-destinations-cta.md | NOT_STARTED |
| CMP-SCR-002-hero-profile | component | SCR-002 | 대표 소개 Hero | DATA-REPRESENTATIVE | REQ-FUNC-057 | docs/tasks/details/CMP-SCR-002-hero-profile.md | NOT_STARTED |
| CMP-SCR-002-stats-story | component | SCR-002 | 여행 지표 + 소개·철학 | DATA-REPRESENTATIVE | REQ-FUNC-058 | docs/tasks/details/CMP-SCR-002-stats-story.md | NOT_STARTED |
| CMP-SCR-002-timeline | component | SCR-002 | 여행 타임라인 6개 | DATA-REPRESENTATIVE | REQ-FUNC-060 | docs/tasks/details/CMP-SCR-002-timeline.md | NOT_STARTED |
| CMP-SCR-003-flight-form | component | SCR-003 | 항공 조건 입력·요약·외부 이동 | CMP-SCR-003-intro-tabs, INFRA-EXTERNAL-LINK-SAFETY, CMP-COMMON-TOAST | REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-054, REQ-NF-017 | docs/tasks/details/CMP-SCR-003-flight-form.md | NOT_STARTED |
| CMP-SCR-003-hotel-form | component | SCR-003 | 숙소 조건 입력·요약·외부 이동 | CMP-SCR-003-intro-tabs, INFRA-EXTERNAL-LINK-SAFETY, CMP-COMMON-TOAST | REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-NF-017 | docs/tasks/details/CMP-SCR-003-hotel-form.md | NOT_STARTED |
| CMP-SCR-003-intro-tabs | component | SCR-003 | Intro 3단계 안내 + 탭 Shell | — | — | docs/tasks/details/CMP-SCR-003-intro-tabs.md | NOT_STARTED |
| CMP-SCR-003-mate-write-form | component | SCR-003 | 동행 모집글 작성 / 로그인 안내 | CMP-SCR-003-intro-tabs, API-MATE-POSTS, INFRA-AUTH-SESSION, INFRA-ADULT-VERIFICATION, INFRA-CONTACT-DETECTION, CMP-COMMON-TOAST | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-080 | docs/tasks/details/CMP-SCR-003-mate-write-form.md | NOT_STARTED |
| CMP-SCR-004-apply | component | SCR-004 | 참가 메시지 신청 폼 | CMP-SCR-004-detail, API-MATE-APPLICATIONS, INFRA-ADULT-VERIFICATION | REQ-FUNC-034, REQ-FUNC-035 | docs/tasks/details/CMP-SCR-004-apply.md | NOT_STARTED |
| CMP-SCR-004-block | component | SCR-004 | 차단 버튼·확인 | CMP-SCR-004-detail, API-BLOCKS | REQ-FUNC-040 | docs/tasks/details/CMP-SCR-004-block.md | NOT_STARTED |
| CMP-SCR-004-detail | component | SCR-004 | 동행 상세 패널 | CMP-SCR-004-list | REQ-FUNC-033 | docs/tasks/details/CMP-SCR-004-detail.md | NOT_STARTED |
| CMP-SCR-004-filter | component | SCR-004 | 검색 Filter + 결과 요약 | API-BLOCKS, DB-ACCESS | REQ-FUNC-030 | docs/tasks/details/CMP-SCR-004-filter.md | NOT_STARTED |
| CMP-SCR-004-guidance-safety | component | SCR-004 | 신청 방법 3단계 + 안전 안내 CTA | — | — | docs/tasks/details/CMP-SCR-004-guidance-safety.md | NOT_STARTED |
| CMP-SCR-004-intro-cta | component | SCR-004 | Intro + 새 글 작성 CTA Banner | — | — | docs/tasks/details/CMP-SCR-004-intro-cta.md | NOT_STARTED |
| CMP-SCR-004-list | component | SCR-004 | 동행 목록 Card Grid | CMP-SCR-004-filter, DB-ACCESS, CMP-COMMON-FAVORITES-SHARE, CMP-COMMON-EMPTY-STATE | REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-037, REQ-FUNC-069 | docs/tasks/details/CMP-SCR-004-list.md | NOT_STARTED |
| CMP-SCR-004-report | component | SCR-004 | 신고 모달 | CMP-SCR-004-detail, API-REPORTS | REQ-FUNC-039 | docs/tasks/details/CMP-SCR-004-report.md | NOT_STARTED |
| CMP-SCR-005-admin | component | SCR-005 | Admin 관리 영역(신고 큐·외부 URL) | API-ADMIN-SETTINGS | REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-077 | docs/tasks/details/CMP-SCR-005-admin.md | NOT_STARTED |
| CMP-SCR-005-auth | component | SCR-005 | Guest 인증 Card(로그인/가입/재설정) | INFRA-AUTH-SESSION, CMP-COMMON-TOAST | REQ-FUNC-066 | docs/tasks/details/CMP-SCR-005-auth.md | NOT_STARTED |
| CMP-SCR-005-my-activity | component | SCR-005 | Member 내 활동 탭 | API-MATE-POSTS, API-MATE-APPLICATIONS, API-BLOCKS, CMP-COMMON-EMPTY-STATE | REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-040 | docs/tasks/details/CMP-SCR-005-my-activity.md | NOT_STARTED |
| CMP-SCR-005-profile | component | SCR-005 | Member 프로필 탭 | INFRA-AUTH-SESSION, INFRA-ADULT-VERIFICATION, INFRA-USER-DELETE, CMP-COMMON-FAVORITES-SHARE | REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-045, REQ-FUNC-068 | docs/tasks/details/CMP-SCR-005-profile.md | NOT_STARTED |
| PO-SCR-001 | page_owner | SCR-001 | 메인 화면 조립 (`/`) | CMP-SCR-001-hero-search, CMP-SCR-001-destination-grid, CMP-SCR-001-destination-detail-drawer, CMP-SCR-001-safety-section, CMP-SCR-001-recent-mates, CMP-SCR-001-about-summary, CMP-COMMON-HEADER-FOOTER, CMP-COMMON-EMPTY-STATE, DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE | REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-007, REQ-FUNC-008, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-052, REQ-FUNC-053, REQ-FUNC-054, REQ-FUNC-057, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-067, REQ-FUNC-068, REQ-FUNC-069, REQ-FUNC-070 | docs/tasks/details/PO-SCR-001.md | NOT_STARTED |
| PO-SCR-002 | page_owner | SCR-002 | 대표 소개 화면 조립 (`/about`) | CMP-SCR-002-hero-profile, CMP-SCR-002-stats-story, CMP-SCR-002-timeline, CMP-SCR-002-countries-gallery, CMP-SCR-002-favorite-destinations-cta, CMP-COMMON-HEADER-FOOTER, DATA-REPRESENTATIVE, DATA-DESTINATIONS | REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-061, REQ-FUNC-062, REQ-FUNC-063, REQ-FUNC-064, REQ-FUNC-065 | docs/tasks/details/PO-SCR-002.md | NOT_STARTED |
| PO-SCR-003 | page_owner | SCR-003 | 통합 여행 준비 화면 조립 (`/travel-tools`) | CMP-SCR-003-intro-tabs, CMP-SCR-003-flight-form, CMP-SCR-003-hotel-form, CMP-SCR-003-mate-write-form, CMP-COMMON-HEADER-FOOTER, CMP-COMMON-TOAST, API-MATE-POSTS, INFRA-AUTH-SESSION, INFRA-ADULT-VERIFICATION | REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-030, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-054, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-080 | docs/tasks/details/PO-SCR-003.md | NOT_STARTED |
| PO-SCR-004 | page_owner | SCR-004 | 동행 조회 화면 조립 (`/mates`) | CMP-SCR-004-intro-cta, CMP-SCR-004-filter, CMP-SCR-004-list, CMP-SCR-004-detail, CMP-SCR-004-apply, CMP-SCR-004-report, CMP-SCR-004-block, CMP-SCR-004-guidance-safety, CMP-COMMON-HEADER-FOOTER, CMP-COMMON-EMPTY-STATE, API-MATE-APPLICATIONS, API-REPORTS, API-BLOCKS | REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-069 | docs/tasks/details/PO-SCR-004.md | NOT_STARTED |
| PO-SCR-005 | page_owner | SCR-005 | 계정·관리 화면 조립 (`/account`) | CMP-SCR-005-auth, CMP-SCR-005-profile, CMP-SCR-005-my-activity, CMP-SCR-005-admin, CMP-COMMON-HEADER-FOOTER, CMP-COMMON-EMPTY-STATE, INFRA-AUTH-SESSION, INFRA-USER-DELETE, API-ADMIN-SETTINGS | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-040, REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-045, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-066, REQ-FUNC-068, REQ-FUNC-077 | docs/tasks/details/PO-SCR-005.md | NOT_STARTED |
| TEST-A11Y-AXE | test | SCR-001~SCR-005(핵심 5화면) | axe-core 자동 접근성 검사 | PO-SCR-001, PO-SCR-002, PO-SCR-003, PO-SCR-004, PO-SCR-005 | REQ-NF-024 | docs/tasks/details/TEST-A11Y-AXE.md | NOT_STARTED |
| TEST-DATA-VALIDATION | test | — (SCR-001/002 데이터 검증) | 정적 데이터 완전성·수량 검증 스크립트 | DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE | REQ-FUNC-008, REQ-FUNC-046, REQ-FUNC-074, REQ-NF-026, REQ-NF-027, REQ-NF-028 | docs/tasks/details/TEST-DATA-VALIDATION.md | NOT_STARTED |
| TEST-E2E-MATE-AUTH | test | SCR-003, SCR-004, SCR-005 | 인증·동행·신고·관리자 흐름 E2E | PO-SCR-003, PO-SCR-004, PO-SCR-005, DB-SEED-BASE | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-030, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-043, REQ-FUNC-044, REQ-FUNC-045, REQ-FUNC-066, REQ-FUNC-077 | docs/tasks/details/TEST-E2E-MATE-AUTH.md | NOT_STARTED |
| TEST-E2E-PUBLIC-SMOKE | test | SCR-001, SCR-002 | 공개 흐름 E2E(여행지·안전정보·대표소개) | PO-SCR-001, PO-SCR-002 | REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-007, REQ-FUNC-008, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-052, REQ-FUNC-053, REQ-FUNC-054, REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-061, REQ-FUNC-062, REQ-FUNC-063, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-067, REQ-FUNC-069, REQ-FUNC-070 | docs/tasks/details/TEST-E2E-PUBLIC-SMOKE.md | NOT_STARTED |
| TEST-E2E-TRAVEL-TOOLS | test | SCR-003 | 항공·호텔 흐름 E2E | PO-SCR-003 | REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-FUNC-054 | docs/tasks/details/TEST-E2E-TRAVEL-TOOLS.md | NOT_STARTED |
| TEST-RELEASE-CHECK-MANUAL | test | SCR-001~SCR-005(전체) | 브라우저 수동 릴리스 점검 | TEST-E2E-PUBLIC-SMOKE, TEST-E2E-TRAVEL-TOOLS, TEST-E2E-MATE-AUTH, TEST-A11Y-AXE | REQ-NF-001, REQ-NF-002, REQ-NF-003, REQ-NF-004, REQ-NF-005, REQ-NF-019, REQ-NF-025, REQ-NF-028 | docs/tasks/details/TEST-RELEASE-CHECK-MANUAL.md | NOT_STARTED |
| TEST-RLS-BASIC | test | — (전체 Screen의 데이터 접근 경로 검증) | RLS 정책 기본 Integration Test | DB-RLS-BASE, DB-SEED-BASE | REQ-FUNC-044, REQ-NF-013 | docs/tasks/details/TEST-RLS-BASIC.md | NOT_STARTED |
| TEST-UNIT-CONTACT-DETECTION | test | — (SCR-003 검증) | 연락처 탐지 Unit Test | INFRA-CONTACT-DETECTION | REQ-FUNC-032 | docs/tasks/details/TEST-UNIT-CONTACT-DETECTION.md | NOT_STARTED |
| TEST-UNIT-MATE-STATE | test | — (SCR-004/SCR-005 검증) | 모집글/신청 상태 전이 Unit Test | API-MATE-POSTS, API-MATE-APPLICATIONS | REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038 | docs/tasks/details/TEST-UNIT-MATE-STATE.md | NOT_STARTED |
| TEST-UNIT-TRAVEL-DATES | test | — (SCR-003 검증) | 날짜 검증 Unit Test | CMP-SCR-003-flight-form, CMP-SCR-003-hotel-form | REQ-FUNC-013, REQ-FUNC-021 | docs/tasks/details/TEST-UNIT-TRAVEL-DATES.md | NOT_STARTED |
| CI-DEPLOY-VERCEL-SUPABASE-CHECK | ci | — | Vercel/Supabase 배포·환경 확인 | DB-SCHEMA-BASE, DB-RLS-BASE, INFRA-AUTH-SESSION | REQ-NF-012, REQ-NF-016, REQ-NF-034 | docs/tasks/details/CI-DEPLOY-VERCEL-SUPABASE-CHECK.md | NOT_STARTED |
| CI-LINT-TYPECHECK-DATA | ci | — | Lint·Typecheck·데이터검증 CI 게이트 | TEST-DATA-VALIDATION, TEST-UNIT-TRAVEL-DATES, TEST-UNIT-CONTACT-DETECTION, TEST-UNIT-MATE-STATE | REQ-NF-031 | docs/tasks/details/CI-LINT-TYPECHECK-DATA.md | NOT_STARTED |

---

## 제외된 Requirement (EXCLUDED — 구현 Task 없음)

`docs/UIUX_TRACEABILITY.md`에서 EXCLUDED로 표시된 항목을 그대로 옮긴 것이며, 어떤 Task의 Requirements 열에도 등장하지 않는다.

| Requirement | 근거(왜 제외했는가) |
|---|---|
| REQ-FUNC-055 | Editor/Admin 안전정보 작성·검수·게시 워크플로 — 콘텐츠는 `src/data` 코드 배포로 관리 |
| REQ-FUNC-056 | 안전정보 변경 이력 보존 — 범용 감사 로그 제외, git 커밋 이력으로 대체 |
| REQ-FUNC-071 | 행동 분석 이벤트 파이프라인 — 커스텀 이벤트 분석 인프라 미포함 |
| REQ-FUNC-072 | Editor/Admin 콘텐츠 CRUD·미리보기 — 전체 콘텐츠 CMS 제외 |
| REQ-FUNC-073 | 미디어 업로드 시 출처·라이선스 필수 입력 — 업로드 워크플로 제외, 이미지는 URL+alt만 사용 |
| REQ-FUNC-075 | 안전정보 stale 현황·담당자 대시보드 — 별도 대시보드 제외, 공개 페이지 stale 배지로 대체 |
| REQ-FUNC-076 | 관리자 변경/신고처리/권한변경 감사 로그 — 범용 감사 로그 제외 |
| REQ-NF-007 | 배포 전 성능 점검 자동화 게이트 — 지속 성능 CI 파이프라인 미구축, 수동 점검으로 대체 |
| REQ-NF-008 | 월간 서비스 가용성 모니터링 — 별도 SLA 관리 체계 없음 |
| REQ-NF-009 | 내부 API 5xx 비율 모니터링 — 별도 오류율 모니터링 파이프라인 미구축 |
| REQ-NF-010 | DB 백업 RPO/RTO 목표 — 자동 백업 체계 미구축 |
| REQ-NF-011 | 외부 링크 자동 검사 + Admin 알림 — 자동 모니터링·알림 미구축, 수동 점검으로 대체 |
| REQ-NF-020 | 신고 1차 검토 SLA — 운영 SLA 측정·모니터링 체계 미구축 |
| REQ-NF-021 | 글/요청/신고 속도 제한 — 별도 rate limit 인프라 미구축 |
| REQ-NF-022 | Moderator 조치 추적성(감사 로그) — 범용 감사 로그 제외와 동일 사유 |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% 보증 — 이미지 정책을 URL+alt로 축소 |
| REQ-NF-032 | 구조화 로그 파이프라인 — 별도 로그 파이프라인 미구축, 기본 함수 로그로 대체 |
| REQ-NF-033 | 핵심 오류 자동 알림 — 자동 장애 알림 미구축 |
