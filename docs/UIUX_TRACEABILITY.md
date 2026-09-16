# UI/UX Traceability Matrix — Free Traveler

- **Document ID:** UIUX-TRACE-001
- **기반 문서:** `02_SRS_BASELINE.md`(REQ-FUNC-001~080, REQ-NF-001~034 원문·AC), `PROJECT_SCOPE.md`(Implementation Status 분류), `03_UI_COVERAGE_ANALYSIS.md`(Screen 배치), `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`(Route/Page Entry)
- **열 정의**
  - **Requirement**: `02_SRS_BASELINE.md`의 ID + 1행 요약(원문은 baseline §4 참조, 삭제·변경 없음)
  - **Implementation Status**: `PROJECT_SCOPE.md`의 분류 그대로 인용(IMPLEMENT / IMPLEMENT(축소) / IMPLEMENT(간소화) / IMPLEMENT(목표) / IMPLEMENT(설계 원칙) / EXCLUDED)
  - **Screen**: 승인된 SCR-001~SCR-005 중 배치 화면, 화면 요소가 없으면 `—`, 여러 화면 공통이면 `공통(5개 Screen)`
  - **Route / Page Entry**: `design-reference/SCREEN_ROUTE_CONTRACT.json` 기준(Screen이 `—`이면 `—`, `공통`이면 전체 5개 Route/Entry)
  - **Task**: Task 생성 전이므로 전 항목 `PENDING_TASK_GENERATION`으로 고정
  - **Test**: `02_SRS_BASELINE.md` §5 Traceability Matrix의 TC-FUNC-xxx/TC-NF-xxx(ID 접미사 1:1 대응). EXCLUDED 항목은 검증 대상이 없으므로 `—`
  - **Status**: 현재 구현 진행 상태. IMPLEMENT 계열은 코드 미작성이므로 전 항목 `NOT_STARTED`, EXCLUDED는 범위 밖 확정 상태이므로 `EXCLUDED`(허위로 구현 완료를 기록하지 않는다)
- **검증**: REQ-FUNC 80개 + REQ-NF 34개 = **114개** 전체가 아래 표에 정확히 1회씩 등장한다(삭제 없음, `03_UI_COVERAGE_ANALYSIS.md` §6과 개수 일치).

---

## 1. REQ-FUNC — F1. Destination Guide (001~010)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-001 — 국내·해외 목록 구분 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-001 | NOT_STARTED |
| REQ-FUNC-002 — 국가·도시·계절·테마·기간 필터 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-002 | NOT_STARTED |
| REQ-FUNC-003 — 키워드 검색(한글 부분일치) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-003 | NOT_STARTED |
| REQ-FUNC-004 — 상세 필수 콘텐츠 항목 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-004 | NOT_STARTED |
| REQ-FUNC-005 — 빈 결과 안내·초기화 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-005 | NOT_STARTED |
| REQ-FUNC-006 — 해외 상세→안전정보 연결 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-006 | NOT_STARTED |
| REQ-FUNC-007 — 대표 이미지 메타(alt만 보증) | IMPLEMENT(축소) | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-007 | NOT_STARTED |
| REQ-FUNC-008 — MVP 게시 수량 검증(국내10+/해외15개국30도시+) | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-FUNC-008 | NOT_STARTED |
| REQ-FUNC-009 — 관련 여행지 추천(최대 6) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-009 | NOT_STARTED |
| REQ-FUNC-010 — 필터 상태 URL 반영 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-010 | NOT_STARTED |

## 2. REQ-FUNC — F2. Flight Link-out (011~018)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-011 — 항공 필수 입력 폼(국가/지역/출발일/귀국일) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-011 | NOT_STARTED |
| REQ-FUNC-012 — 국가별 지역 옵션 제한 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-012 | NOT_STARTED |
| REQ-FUNC-013 — 날짜 검증(과거/역전 차단) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-013 | NOT_STARTED |
| REQ-FUNC-014 — 입력 요약 단계 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-014 | NOT_STARTED |
| REQ-FUNC-015 — 비전달 고지 문구 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-015 | NOT_STARTED |
| REQ-FUNC-016 — 외부 URL 새 탭 이동(noopener,noreferrer) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-016 | NOT_STARTED |
| REQ-FUNC-017 — 항공 입력값 서버 미저장 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-FUNC-017 | NOT_STARTED |
| REQ-FUNC-018 — URL 오류 시 이동 차단·재시도 | IMPLEMENT(축소) | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-018 | NOT_STARTED |

## 3. REQ-FUNC — F3. Hotel Link-out (019~026)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-019 — 호텔 필수 입력 폼(국가/지역/체크인/체크아웃) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-019 | NOT_STARTED |
| REQ-FUNC-020 — 국가별 지역 옵션 제한 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-020 | NOT_STARTED |
| REQ-FUNC-021 — 날짜 검증(과거/역전/동일 차단) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-021 | NOT_STARTED |
| REQ-FUNC-022 — 입력 요약 표시 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-022 | NOT_STARTED |
| REQ-FUNC-023 — 비전달 고지 문구 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-023 | NOT_STARTED |
| REQ-FUNC-024 — 외부 URL 새 탭 이동(noopener,noreferrer) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-024 | NOT_STARTED |
| REQ-FUNC-025 — 호텔 입력값 서버 미저장 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-FUNC-025 | NOT_STARTED |
| REQ-FUNC-026 — URL 오류 시 차단·재시도, 입력 유지 | IMPLEMENT(축소) | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-026 | NOT_STARTED |

## 4. REQ-FUNC — F4. Travel Mate (027~045)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-027 — 동행 쓰기 작업에 이메일 인증 세션 요구 | IMPLEMENT | SCR-003, SCR-005 | `/travel-tools`, `/account` | `src/app/travel-tools/page.tsx`, `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-027 | NOT_STARTED |
| REQ-FUNC-028 — 성인확인 요구(생년월일 미저장) | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-028 | NOT_STARTED |
| REQ-FUNC-029 — 프로필 필드(닉네임/연령대/성별/스타일/자기소개) | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-029 | NOT_STARTED |
| REQ-FUNC-030 — 조건 필터 + 차단 사용자 제외 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-030 | NOT_STARTED |
| REQ-FUNC-031 — 모집글 필드 및 검증 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-031 | NOT_STARTED |
| REQ-FUNC-032 — 공개 연락처 탐지·제출 차단 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-032 | NOT_STARTED |
| REQ-FUNC-033 — 작성자 표시(연락처 미노출) | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-033 | NOT_STARTED |
| REQ-FUNC-034 — 참가 메시지(500자) 비공개 제출 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-034 | NOT_STARTED |
| REQ-FUNC-035 — 동일 사용자 중복 PENDING/ACCEPTED 차단 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-035 | NOT_STARTED |
| REQ-FUNC-036 — 작성자의 참가 요청 승인/거절 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-036 | NOT_STARTED |
| REQ-FUNC-037 — 종료일 경과 시 자동 마감(조회 시 계산) | IMPLEMENT(축소) | SCR-004, SCR-005 | `/mates`, `/account` | `src/app/mates/page.tsx`, `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-037 | NOT_STARTED |
| REQ-FUNC-038 — 수동 마감/수정/삭제 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-038 | NOT_STARTED |
| REQ-FUNC-039 — 신고(사유코드+설명) | IMPLEMENT(간소화) | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-039 | NOT_STARTED |
| REQ-FUNC-040 — 차단/해제 | IMPLEMENT | SCR-004, SCR-005 | `/mates`, `/account` | `src/app/mates/page.tsx`, `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-040 | NOT_STARTED |
| REQ-FUNC-041 — Moderator 신고 큐(간소화) | IMPLEMENT(간소화) | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-041 | NOT_STARTED |
| REQ-FUNC-042 — Moderator 조치(간소화) | IMPLEMENT(간소화) | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-042 | NOT_STARTED |
| REQ-FUNC-043 — 인앱 알림(Toast), 이메일 미발송 | IMPLEMENT(축소) | 공통(5개 Screen) | 공통(5개 Route) | `src/app/layout.tsx` 등 공통 | PENDING_TASK_GENERATION | TC-FUNC-043 | NOT_STARTED |
| REQ-FUNC-044 — RLS로 비공개 데이터 접근 제한 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-FUNC-044 | NOT_STARTED |
| REQ-FUNC-045 — 탈퇴 시 즉시 비식별화 | IMPLEMENT(축소) | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-045 | NOT_STARTED |

## 5. REQ-FUNC — F5. Country Safety (046~056)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-046 — 게시된 모든 해외국가 안전페이지 존재 보장 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-FUNC-046 | NOT_STARTED |
| REQ-FUNC-047 — 8개 필수 카테고리 섹션 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-047 | NOT_STARTED |
| REQ-FUNC-048 — 출처/확인일/편집자 표시 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-048 | NOT_STARTED |
| REQ-FUNC-049 — 외교부 원문 링크(새 탭) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-049 | NOT_STARTED |
| REQ-FUNC-050 — 7일 초과 stale 경고 | IMPLEMENT(축소) | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-050 | NOT_STARTED |
| REQ-FUNC-051 — 중대 경보 상단 텍스트 표시 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-051 | NOT_STARTED |
| REQ-FUNC-052 — 국가/지역 경보 범위 구분 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-052 | NOT_STARTED |
| REQ-FUNC-053 — 긴급연락처·영사콜센터 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-053 | NOT_STARTED |
| REQ-FUNC-054 — 공식판단 대체 아님 고지 | IMPLEMENT | SCR-001, SCR-003 | `/`, `/travel-tools` | `src/app/page.tsx`, `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-054 | NOT_STARTED |
| REQ-FUNC-055 — Editor/Admin 작성·검수·게시 워크플로 | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |
| REQ-FUNC-056 — 변경 이력 보존 | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |

## 6. REQ-FUNC — F6. About free_traveler (057~063)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-057 — 대표명/50+/30+ 일관 표시 | IMPLEMENT | SCR-002, SCR-001 | `/about`, `/` | `src/app/about/page.tsx`, `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-057 | NOT_STARTED |
| REQ-FUNC-058 — 소개문/철학/편집원칙 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-058 | NOT_STARTED |
| REQ-FUNC-059 — 방문 권역 지도 또는 국가 목록 | IMPLEMENT(축소) | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-059 | NOT_STARTED |
| REQ-FUNC-060 — 여행 타임라인 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-060 | NOT_STARTED |
| REQ-FUNC-061 — 대표 이미지 메타(alt만 보증) | IMPLEMENT(축소) | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-061 | NOT_STARTED |
| REQ-FUNC-062 — 문의·SNS 링크 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-062 | NOT_STARTED |
| REQ-FUNC-063 — 추천 여행지 6개 연결 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-063 | NOT_STARTED |

## 7. REQ-FUNC — F7. Common / Admin / Governance (064~080)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-064 — 전역 내비게이션·푸터 | IMPLEMENT | 공통(5개 Screen) | 공통(5개 Route) | `src/app/layout.tsx` 등 공통 | PENDING_TASK_GENERATION | TC-FUNC-064 | NOT_STARTED |
| REQ-FUNC-065 — 320px~데스크톱 반응형 | IMPLEMENT | 공통(5개 Screen) | 공통(5개 Route) | `src/app/layout.tsx` 등 공통 | PENDING_TASK_GENERATION | TC-FUNC-065 | NOT_STARTED |
| REQ-FUNC-066 — 이메일 가입/인증/로그인/로그아웃/재설정 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-066 | NOT_STARTED |
| REQ-FUNC-067 — 여행지·안전정보 통합 검색 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-067 | NOT_STARTED |
| REQ-FUNC-068 — 여행지 즐겨찾기 | IMPLEMENT(축소) | SCR-001, SCR-005 | `/`, `/account` | `src/app/page.tsx`, `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-068 | NOT_STARTED |
| REQ-FUNC-069 — URL 공유 | IMPLEMENT | SCR-001, SCR-004 | `/`, `/mates` | `src/app/page.tsx`, `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-069 | NOT_STARTED |
| REQ-FUNC-070 — SEO 메타데이터 | IMPLEMENT | 공통(5개 Screen) | 공통(5개 Route) | `src/app/layout.tsx` 등 공통 | PENDING_TASK_GENERATION | TC-FUNC-070 | NOT_STARTED |
| REQ-FUNC-071 — 행동 분석 이벤트 | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |
| REQ-FUNC-072 — Editor/Admin 콘텐츠 CRUD·미리보기 | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |
| REQ-FUNC-073 — 미디어 업로드 메타데이터 | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |
| REQ-FUNC-074 — 게시 전 완전성 게이트 | IMPLEMENT(축소) | — | — | — | PENDING_TASK_GENERATION | TC-FUNC-074 | NOT_STARTED |
| REQ-FUNC-075 — stale 현황·담당자 대시보드 | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |
| REQ-FUNC-076 — 관리자 변경/신고처리/권한변경 감사 로그 | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |
| REQ-FUNC-077 — Admin 외부 URL HTTPS 허용목록 설정 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-077 | NOT_STARTED |
| REQ-FUNC-078 — 오류 화면(404/500/권한없음/외부연결실패) | IMPLEMENT | —(기술 Route) | 기술 Route(404/500/권한없음) | `src/app/not-found.tsx`, `error.tsx`, `unauthorized.tsx` | PENDING_TASK_GENERATION | TC-FUNC-078 | NOT_STARTED |
| REQ-FUNC-079 — 폼/모달/탭/알림 ARIA | IMPLEMENT | 공통(5개 Screen) | 공통(5개 Route) | `src/app/layout.tsx` 등 공통 | PENDING_TASK_GENERATION | TC-FUNC-079 | NOT_STARTED |
| REQ-FUNC-080 — 약관/방침/안전수칙/면책 고지 + 동의 기록 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-080 | NOT_STARTED |

## 8. REQ-NF — Performance (001~007)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-001 — 공개 핵심 페이지 LCP p75 ≤2.5s | IMPLEMENT(목표) | 공통(5개 Screen) | 공통(5개 Route) | `src/app/layout.tsx` 등 공통 | PENDING_TASK_GENERATION | TC-NF-001 | NOT_STARTED |
| REQ-NF-002 — INP p75 ≤200ms | IMPLEMENT(목표) | 공통(5개 Screen) | 공통(5개 Route) | `src/app/layout.tsx` 등 공통 | PENDING_TASK_GENERATION | TC-NF-002 | NOT_STARTED |
| REQ-NF-003 — CLS p75 ≤0.1 | IMPLEMENT(목표) | 공통(5개 Screen) | 공통(5개 Route) | `src/app/layout.tsx` 등 공통 | PENDING_TASK_GENERATION | TC-NF-003 | NOT_STARTED |
| REQ-NF-004 — 필터 응답 p95 ≤1s | IMPLEMENT(축소) | — | — | — | PENDING_TASK_GENERATION | TC-NF-004 | NOT_STARTED |
| REQ-NF-005 — 쓰기 API p95 ≤3s | IMPLEMENT(축소) | — | — | — | PENDING_TASK_GENERATION | TC-NF-005 | NOT_STARTED |
| REQ-NF-006 — 이미지 반응형·lazy·priority | IMPLEMENT | 공통(5개 Screen) | 공통(5개 Route) | `src/app/layout.tsx` 등 공통 | PENDING_TASK_GENERATION | TC-NF-006 | NOT_STARTED |
| REQ-NF-007 — 배포 전 Lighthouse CI 게이트 | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |

## 9. REQ-NF — Reliability and Recovery (008~011)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-008 — 월간 가용성 ≥99.5% | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |
| REQ-NF-009 — 내부 API 5xx ≤0.5% | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |
| REQ-NF-010 — DB 백업 RPO/RTO | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |
| REQ-NF-011 — 외부 링크 주 1회 자동 검사 | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |

## 10. REQ-NF — Security and Privacy (012~018)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-012 — TLS 1.2 이상 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-012 | NOT_STARTED |
| REQ-NF-013 — 인증·역할·RLS 서버 검증 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-013 | NOT_STARTED |
| REQ-NF-014 — CSRF 방어·SameSite 쿠키 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-014 | NOT_STARTED |
| REQ-NF-015 — 입력 검증·이스케이프, XSS 차단 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-015 | NOT_STARTED |
| REQ-NF-016 — 비밀키 env 관리 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-016 | NOT_STARTED |
| REQ-NF-017 — 항공·호텔 원시 입력값 미보존 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-017 | NOT_STARTED |
| REQ-NF-018 — 개인정보 내보내기/탈퇴/삭제 요청 | IMPLEMENT(축소) | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-NF-018 | NOT_STARTED |

## 11. REQ-NF — Safety and Moderation (019~022)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-019 — 신고 접수 응답 p95 ≤3s | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-019 | NOT_STARTED |
| REQ-NF-020 — 신고 1차 검토 24h 이내 90%+ | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |
| REQ-NF-021 — 글/요청/신고 속도 제한 | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |
| REQ-NF-022 — Moderator 조치 추적성(감사 로그) | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |

## 12. REQ-NF — Accessibility (023~025)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-023 — WCAG 2.2 Level AA 목표 | IMPLEMENT | 공통(5개 Screen) | 공통(5개 Route) | `src/app/layout.tsx` 등 공통 | PENDING_TASK_GENERATION | TC-NF-023 | NOT_STARTED |
| REQ-NF-024 — 자동 접근성 검사(axe) | IMPLEMENT(축소) | — | — | — | PENDING_TASK_GENERATION | TC-NF-024 | NOT_STARTED |
| REQ-NF-025 — 키보드·스크린리더 수동 검사 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-025 | NOT_STARTED |

## 13. REQ-NF — Content, Freshness, SEO, Copyright (026~030)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-026 — 여행지 콘텐츠 완전성 100% | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-026 | NOT_STARTED |
| REQ-NF-027 — 해외 안전정보 커버리지 100% | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-027 | NOT_STARTED |
| REQ-NF-028 — 안전정보 최신확인 7일 이내 95%+ | IMPLEMENT(축소) | — | — | — | PENDING_TASK_GENERATION | TC-NF-028 | NOT_STARTED |
| REQ-NF-029 — 미디어 라이선스 메타데이터 100% | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |
| REQ-NF-030 — 공개 페이지 SEO 메타데이터 누락 0건 | IMPLEMENT | 공통(5개 Screen) | 공통(5개 Route) | `src/app/layout.tsx` 등 공통 | PENDING_TASK_GENERATION | TC-NF-030 | NOT_STARTED |

## 14. REQ-NF — Maintainability, Monitoring, Cost (031~034)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-031 — TypeScript strict·lint·테스트(병합 전) | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-031 | NOT_STARTED |
| REQ-NF-032 — 구조화 로그 | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |
| REQ-NF-033 — 핵심 오류 알림 | EXCLUDED | — | — | — | PENDING_TASK_GENERATION | — | EXCLUDED |
| REQ-NF-034 — MVP 월 인프라 비용 목표 | IMPLEMENT(설계 원칙) | — | — | — | PENDING_TASK_GENERATION | TC-NF-034 | NOT_STARTED |

---

## 15. 요약 검증

| 구분 | 개수 |
|---|---:|
| REQ-FUNC 전체 | 80 |
| REQ-NF 전체 | 34 |
| **합계(삭제 없음 확인)** | **114** |
| Implementation Status = EXCLUDED | 18 (FUNC 7: 055,056,071,072,073,075,076 + NF 11: 007,008,009,010,011,020,021,022,029,032,033) |
| Implementation Status = IMPLEMENT 계열 | 96 (FUNC 73 + NF 23) |
| Task = PENDING_TASK_GENERATION | 114 (전체, Task 생성 전) |
| Status = NOT_STARTED | 96 (구현 미시작, 코드 없음) |
| Status = EXCLUDED | 18 |

현재 시점 기준 `Status` 열에 `IMPLEMENTED` 또는 `DONE`으로 표시된 항목은 없다 — `src/app`에 SCR-001~005 라우트 중 어느 것도 완성된 형태로 구현되지 않았기 때문이며, 이는 허위 기록을 남기지 않는다는 원칙에 따른 것이다. Task가 생성되고 구현·테스트가 진행되면 각 행의 Task/Test/Status를 갱신한다.
