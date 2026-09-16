# PROJECT_SCOPE — Free Traveler 웹사이트 구현 범위

- **Document ID:** SCOPE-TRAVEL-001
- **기반 문서:** `01_PRD.md`, `02_SRS_BASELINE.md`
- **대상 코드베이스:** `package.json`(Next.js 16.3.4, React 19.2.8, TypeScript, Tailwind CSS 4), `src/app`
- **범위:** REQ-FUNC-001~080, REQ-NF-001~034 전체에 대한 구현/제외 결정과 구현 방식

---

## 1. 아키텍처 원칙

SRS 4.1.2절의 인프라 전제(Supabase 풀스택, RLS, CRUD 관리자 콘솔)를 그대로 따르지 않고, 아래 원칙으로 단순화한다. 이 절의 결정이 뒤의 요구사항별 분류(IMPLEMENT/EXCLUDED)의 기준이 된다.

| 영역 | 방식 |
|---|---|
| 여행지·안전정보·대표 소개 콘텐츠 | `src/data`의 정적 TypeScript 데이터. Supabase 콘텐츠 테이블·CMS 없음 |
| 즐겨찾기 | `localStorage`. 서버 저장 없음 |
| 참가 요청·승인/거절·신고 알림 | Toast 또는 화면 상태로만 표현. 실제 이메일 발송 없음 |
| 동행글 자동 마감 | 배치 작업 없이, 조회 시점에 `end_date`와 현재 시각을 비교해 상태를 계산 |
| 안전정보 최신성(stale) | 배치 작업 없이, 렌더링 시 `verified_at`과 현재 시각을 비교해 계산 |
| 이미지 | 일반 인터넷 이미지 URL과 `alt` 텍스트만 사용. 업로드·라이선스 승인 워크플로 없음 |
| 인증·성인확인 | Supabase Auth 이메일 인증 + `is_adult`/`adult_verified_at` 플래그만 사용 |
| 동행·신고·차단 데이터 | Supabase PostgreSQL + 최소 RLS (회원 전용 쓰기 경로 보호) |
| 관리자 | 신고 상태 변경과 외부 이동 URL(HTTPS 허용목록) 설정만 다룸. 콘텐츠 CRUD·감사 로그·제재 시스템 없음 |
| 배포 | Vercel (Next.js) + Supabase. EC2/AWS 인프라 직접 구성 없음 |
| 자동화 | Playwright 핵심 Smoke Test만 CI에 둔다. 무인 자동 Merge, 자동 백업, 장애 알림, 부하 테스트 파이프라인은 구축하지 않음 |

## 2. 화면 범위

| 구분 | 라우트 | 대응 항목 |
|---|---|---|
| 핵심 화면 (4) | `/destinations` (목록/필터/상세 포함), `/flights`, `/hotels`, `/mates`(목록/상세/작성 포함) | 여행지 검색·필터·상세, 항공·숙소 입력, 동행글 |
| 보조 화면 (1) | `/safety` (목록/국가별 상세) | 국가 안전정보 패널 |
| 필수 지원 화면 | `/about`, `/auth/*`, `/my/*`, `/admin` | 대표 소개, 이메일 인증·성인확인, 내 활동, 간단한 관리자 탭 |

`/admin`은 신고 큐(상태 변경)와 외부 URL 설정 탭 2개만 제공한다. 여행지·안전정보·미디어 관리 탭은 만들지 않는다(콘텐츠는 코드 배포로 갱신).

## 3. REQ-FUNC 요구사항 처리

### 3.1 F1. Destination Guide (REQ-FUNC-001~010)

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-001 | 국내·해외 목록 구분 | IMPLEMENT | `src/data` 배열의 `scope` 필드로 필터링 | Playwright smoke test |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | IMPLEMENT | 클라이언트 상태로 AND 조건 필터링(정적 배열) | Playwright smoke test |
| REQ-FUNC-003 | 키워드 검색(한글 부분일치) | IMPLEMENT | 클라이언트 문자열 `includes` 검색 | Playwright smoke test |
| REQ-FUNC-004 | 상세 필수 콘텐츠 항목 | IMPLEMENT | TypeScript 타입으로 필수 필드 강제, 콘텐츠 시드 작성 시 충족 | 데이터 검증 스크립트 + 상세 페이지 수동 확인 |
| REQ-FUNC-005 | 빈 결과 안내·초기화 | IMPLEMENT | 필터 결과 0건 시 안내 UI와 초기화 버튼 렌더 | Playwright smoke test |
| REQ-FUNC-006 | 해외 상세→안전정보 연결 | IMPLEMENT | `country_code`로 안전 데이터와 매칭 | 데이터 검증 스크립트 + Playwright |
| REQ-FUNC-007 | 대표 이미지 메타데이터(alt/출처/작가/라이선스) | IMPLEMENT (축소) | `alt` 텍스트만 필수 보증. 출처·작가·라이선스는 데이터 파일에 참고 기록만 하고 시스템적으로 강제하지 않음(이미지 정책 축소에 따름) | 코드 리뷰(모든 이미지 `alt` 존재 확인) |
| REQ-FUNC-008 | MVP 게시 수량(국내10+, 해외15개국30도시+) | IMPLEMENT | 데이터 검증 스크립트로 배열 길이·국가/도시 수 검사 | 데이터 검증 스크립트(CI) |
| REQ-FUNC-009 | 관련 여행지 추천(최대 6개) | IMPLEMENT | 동일 국가/테마 정적 데이터 필터 | Playwright smoke test(개수 상한 확인) |
| REQ-FUNC-010 | 필터 상태 URL 반영 | IMPLEMENT | `useSearchParams` 기반 직렬화, 허용 키만 반영 | Playwright smoke test |

### 3.2 F2. Flight Link-out (REQ-FUNC-011~018)

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-011 | 국가·지역·출발일·귀국일 필수 입력 | IMPLEMENT | 클라이언트 폼(Client Component), 서버 API 없음 | Playwright smoke test |
| REQ-FUNC-012 | 국가별 지역 옵션 제한 | IMPLEMENT | 국가 변경 시 지역 상태 초기화 | Playwright smoke test |
| REQ-FUNC-013 | 날짜 검증(과거/역전 차단) | IMPLEMENT | 클라이언트 검증 로직 | Playwright smoke test |
| REQ-FUNC-014 | 입력 요약 단계 | IMPLEMENT | 브라우저 세션 상태 유지 | Playwright smoke test |
| REQ-FUNC-015 | 비전달 고지 문구 | IMPLEMENT | 폼·요약 화면에 고정 문구 표시 | Playwright smoke test |
| REQ-FUNC-016 | 외부 URL 새 탭, `noopener,noreferrer` | IMPLEMENT | `window.open` + 속성 적용, query 미포함 | 코드 리뷰 + Playwright(속성 확인) |
| REQ-FUNC-017 | 입력값 서버 미저장 | IMPLEMENT | 서버 API·DB 미생성(설계 자체로 충족) | 코드 리뷰(네트워크 요청에 입력값 없음 확인) |
| REQ-FUNC-018 | URL 오류 시 이동 차단·재시도 안내 | IMPLEMENT (축소) | 클라이언트 오류 UI만 제공. 별도 운영 오류 로그 저장·조회 화면은 만들지 않음(관리자 범위를 신고·외부URL 설정으로 한정하는 원칙에 따름) | Playwright smoke test |

### 3.3 F3. Hotel Link-out (REQ-FUNC-019~026)

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-019 | 국가·지역·체크인·체크아웃 필수 입력 | IMPLEMENT | 클라이언트 폼 | Playwright smoke test |
| REQ-FUNC-020 | 국가별 지역 옵션 제한 | IMPLEMENT | 국가 변경 시 지역 초기화 | Playwright smoke test |
| REQ-FUNC-021 | 날짜 검증(과거/역전/동일 차단) | IMPLEMENT | 클라이언트 검증 로직 | Playwright smoke test |
| REQ-FUNC-022 | 입력 요약 표시 | IMPLEMENT | 폼 값과 동일한 요약 렌더 | Playwright smoke test |
| REQ-FUNC-023 | 비전달 고지 문구 | IMPLEMENT | 폼·요약 화면 고정 문구 | Playwright smoke test |
| REQ-FUNC-024 | 외부 URL 새 탭, `noopener,noreferrer` | IMPLEMENT | F2와 동일 패턴 재사용 | 코드 리뷰 + Playwright |
| REQ-FUNC-025 | 입력값 서버 미저장 | IMPLEMENT | 서버 API·DB 미생성 | 코드 리뷰 |
| REQ-FUNC-026 | URL 오류 시 차단·재시도, 입력 유지 | IMPLEMENT (축소) | 클라이언트 오류 UI, 별도 운영 오류 로그 없음(REQ-FUNC-018과 동일 사유) | Playwright smoke test |

### 3.4 F4. Travel Mate (REQ-FUNC-027~045)

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-027 | 쓰기 작업에 이메일 인증 요구 | IMPLEMENT | Supabase Auth 세션 확인(서버 액션) | Playwright smoke test |
| REQ-FUNC-028 | 성인 확인 상태만 저장(생년월일 미저장) | IMPLEMENT | `is_adult`, `adult_verified_at` 컬럼만 사용 | 코드 리뷰(스키마 확인) |
| REQ-FUNC-029 | 프로필 필드(닉네임/연령대/성별/스타일/자기소개) | IMPLEMENT | Supabase `user_profile` 테이블 | Playwright smoke test |
| REQ-FUNC-030 | 조건 필터 + 차단 사용자 제외 | IMPLEMENT | Supabase 쿼리 필터, `user_block` 조인 제외 | Playwright smoke test |
| REQ-FUNC-031 | 모집글 필드 및 검증 | IMPLEMENT | 서버 액션 검증(zod 등) | Playwright smoke test |
| REQ-FUNC-032 | 공개 연락처 패턴 탐지·제출 차단 | IMPLEMENT | 전화번호/이메일/메신저 ID 정규식 검사 | 유닛 테스트(샘플 패턴 셋) |
| REQ-FUNC-033 | 연락처 미노출 표시 | IMPLEMENT | 응답 데이터에서 연락처 필드 제외 | 코드 리뷰(API 응답 검사) |
| REQ-FUNC-034 | 참가 메시지(500자) 비공개 제출 | IMPLEMENT | `mate_application` 테이블, RLS로 당사자만 조회 | Playwright smoke test |
| REQ-FUNC-035 | 중복 PENDING/ACCEPTED 차단 | IMPLEMENT | DB unique 제약 + 서버 액션 사전 검사 | 유닛/통합 테스트 |
| REQ-FUNC-036 | 작성자만 승인/거절 | IMPLEMENT | 서버 액션에서 `owner_id` 검사, 비작성자 403 | Playwright smoke test |
| REQ-FUNC-037 | 종료일 경과 시 자동 마감 | IMPLEMENT (축소) | 배치 작업 없이, 목록/상세 조회 시 `end_date < now`이면 화면상 CLOSED로 계산·표시 | Playwright smoke test |
| REQ-FUNC-038 | 수동 마감/수정/삭제, 승인자 존재 시 경고 | IMPLEMENT | 작성자 전용 액션 + 승인된 신청 존재 시 확인 모달 | Playwright smoke test |
| REQ-FUNC-039 | 신고(사유코드+설명) | IMPLEMENT (간소화) | 신고 대상·사유코드·설명만 저장, 접수번호 표시. 증거 첨부·우선순위 필드는 만들지 않음 | Playwright smoke test |
| REQ-FUNC-040 | 차단/해제 | IMPLEMENT | `user_block` 테이블, 상호 노출 제한 쿼리 반영 | Playwright smoke test |
| REQ-FUNC-041 | Moderator 신고 큐(우선순위/증거 포함) | IMPLEMENT (간소화) | 상태(OPEN/RESOLVED/DISMISSED) 기준 목록만 제공. 우선순위·증거 첨부·담당자 배정은 만들지 않음 | Playwright smoke test |
| REQ-FUNC-042 | 경고/숨김/계정제한 조치 + 상세 감사기록 | IMPLEMENT (간소화) | 신고 대상 게시물 숨김 처리와 신고 상태 변경만 지원. 경고·계정 일시제한 기능과 상세 변경 이력은 만들지 않음(감사 로그 제외 원칙) | Playwright smoke test |
| REQ-FUNC-043 | 인앱 알림 + 이메일 선택 발송 | IMPLEMENT (축소) | 인앱 Toast/화면 상태로만 알림. 실제 이메일 발송은 만들지 않음(외부 이메일 사업자 연동 제외) | Playwright smoke test |
| REQ-FUNC-044 | RLS로 비공개 데이터 접근 제한 | IMPLEMENT | Supabase RLS 정책(본인/상대방/Moderator만) | 통합 테스트(권한별 접근 시도) |
| REQ-FUNC-045 | 탈퇴 시 비식별화 + 30일 내 삭제 | IMPLEMENT (축소) | 탈퇴 요청 시 즉시 프로필 비식별화(닉네임·자기소개 제거) 처리. 유예기간 후 배치 삭제 잡은 만들지 않음(자동화 인프라 최소화 원칙) | 코드 리뷰 + 수동 확인 |

### 3.5 F5. Country Safety (REQ-FUNC-046~056)

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-046 | 게시된 모든 해외국가 안전페이지 존재 | IMPLEMENT | 국가 정적 데이터와 안전정보 정적 데이터 1:1 매핑 | 데이터 검증 스크립트 |
| REQ-FUNC-047 | 8개 필수 카테고리 섹션 | IMPLEMENT | 데이터 스키마에 8개 카테고리 필드 강제 | 데이터 검증 스크립트 |
| REQ-FUNC-048 | 출처명/URL/확인일/편집자 기록 | IMPLEMENT | 정적 데이터 필드로 기록 | 데이터 검증 스크립트 |
| REQ-FUNC-049 | 외교부 원문 링크(새 탭) | IMPLEMENT | `noopener,noreferrer` 외부 링크 | Playwright smoke test |
| REQ-FUNC-050 | 7일 초과 시 stale 경고 | IMPLEMENT (축소) | 렌더링 시 `verified_at`과 현재 시각을 비교해 경고 계산(배치 없음) | Playwright smoke test |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | IMPLEMENT | 색상 외 텍스트 라벨 병기, 상단 배치 | Playwright smoke test |
| REQ-FUNC-052 | 국가/지역 경보 범위 구분 | IMPLEMENT | `scope_type`/`scope_text` 필드 표시 | 데이터 검증 스크립트 |
| REQ-FUNC-053 | 긴급연락처·영사콜센터 정보 | IMPLEMENT | 정적 데이터 필드 | 코드 리뷰 |
| REQ-FUNC-054 | 공식판단 대체 아님 고지 | IMPLEMENT | 안전 페이지·항공 요약 화면 고정 문구 | Playwright smoke test |
| REQ-FUNC-055 | Editor/Admin 작성·검수·게시 워크플로 | EXCLUDED | 콘텐츠는 개발자가 `src/data`를 직접 코드로 작성·배포한다. 게시 상태 전이 UI(DRAFT/REVIEW/PUBLISHED)와 별도 편집자 콘솔은 만들지 않는다(전체 콘텐츠 CMS 제외) | — |
| REQ-FUNC-056 | 변경 이력(이전값/새값/사유/담당자/시각) 보존 | EXCLUDED | 변경 이력은 git 커밋 이력으로 대체하며, 별도 DB 이력 관리 UI는 만들지 않는다(범용 감사 로그 제외) | — |

### 3.6 F6. About free_traveler (REQ-FUNC-057~063)

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-057 | 대표명/50+/30+ 일관 표시 | IMPLEMENT | 단일 정적 데이터 소스(`representativeProfile`)에서 홈·About 공통 참조 | 데이터 검증 스크립트 + Playwright |
| REQ-FUNC-058 | 소개문/철학/편집원칙 | IMPLEMENT | 정적 데이터 텍스트 필드 | Playwright smoke test |
| REQ-FUNC-059 | 방문 권역 지도 또는 30개국 목록 | IMPLEMENT (축소) | 인터랙티브 지도 대신 국가 카드 목록으로 구현 | Playwright smoke test |
| REQ-FUNC-060 | 여행 타임라인 | IMPLEMENT | 정적 데이터 배열(연도/장소/요약) | Playwright smoke test |
| REQ-FUNC-061 | 대표 이미지 메타데이터 | IMPLEMENT (축소) | REQ-FUNC-007과 동일하게 `alt` 텍스트만 필수 보증 | 코드 리뷰 |
| REQ-FUNC-062 | 문의·SNS 링크 | IMPLEMENT | 정적 설정값 기반 링크, 빈 값은 미렌더 | Playwright smoke test |
| REQ-FUNC-063 | 추천 여행지 6개 연결 | IMPLEMENT | 정적 데이터에서 slug 6개 참조 | 데이터 검증 스크립트 |

### 3.7 F7. Common / Admin / Governance (REQ-FUNC-064~080)

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-064 | 전역 내비게이션·푸터 | IMPLEMENT | 공통 레이아웃 컴포넌트 | Playwright smoke test |
| REQ-FUNC-065 | 320px~데스크톱 반응형 | IMPLEMENT | Tailwind 반응형 유틸리티 | Playwright smoke test(모바일 뷰포트) |
| REQ-FUNC-066 | 이메일 가입/인증/로그인/로그아웃/재설정 | IMPLEMENT | Supabase Auth | Playwright smoke test |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | IMPLEMENT | 클라이언트 검색(정적 데이터 대상) | Playwright smoke test |
| REQ-FUNC-068 | 여행지 즐겨찾기 | IMPLEMENT (축소) | `localStorage` 저장, 서버 미저장. 클라이언트에서 중복 방지 | Playwright smoke test |
| REQ-FUNC-069 | URL 공유 | IMPLEMENT | Web Share API, 미지원 시 클립보드 복사 폴백 | Playwright smoke test |
| REQ-FUNC-070 | SEO 메타데이터(title/description/canonical/OG) | IMPLEMENT | Next.js Metadata API | 코드 리뷰 |
| REQ-FUNC-071 | 행동 분석 이벤트(정확한 날짜/자유서술 제외) | EXCLUDED | 이번 범위(11개 핵심 항목)에 커스텀 이벤트 분석 파이프라인을 포함하지 않는다. 필요 시 Vercel 기본 페이지 조회 지표로 대체 가능 | — |
| REQ-FUNC-072 | Editor/Admin 콘텐츠 CRUD·미리보기 | EXCLUDED | 콘텐츠는 코드 배포(`src/data`)로 관리하며 관리자 콘텐츠 CRUD 화면은 만들지 않는다(전체 콘텐츠 CMS 제외) | — |
| REQ-FUNC-073 | 미디어 업로드 메타데이터 필수 입력 | EXCLUDED | 이미지는 일반 URL과 alt 텍스트만 사용하며 업로드 UI를 만들지 않는다(미디어 업로드·라이선스 승인 워크플로 제외) | — |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | IMPLEMENT (축소) | 관리자 워크플로 대신 TypeScript 필수 타입 + 데이터 검증 스크립트로 콘텐츠 누락을 CI에서 검출 | 데이터 검증 스크립트(CI) |
| REQ-FUNC-075 | stale 현황·담당자 대시보드 | EXCLUDED | 관리자 범위를 신고 상태·외부 URL 설정으로 한정하는 원칙에 따라 별도 대시보드를 만들지 않는다. 공개 페이지의 stale 경고(REQ-FUNC-050)로 대체 | — |
| REQ-FUNC-076 | 관리자 변경/신고처리/권한변경 감사 로그 | EXCLUDED | 범용 감사 로그를 제외한다 | — |
| REQ-FUNC-077 | Admin 외부 URL HTTPS 허용목록 설정 | IMPLEMENT | 관리자 탭에서 `FLIGHT_OUTBOUND_URL`/`HOTEL_OUTBOUND_URL` 등을 HTTPS만 허용해 설정 | Playwright smoke test |
| REQ-FUNC-078 | 오류 화면(404/500/권한없음/외부연결실패) 복구행동 | IMPLEMENT | Next.js `not-found`/`error` 경계 + 홈/재시도 버튼 | Playwright smoke test |
| REQ-FUNC-079 | 폼/모달/탭/알림 ARIA | IMPLEMENT | 시맨틱 HTML + ARIA 속성, shadcn/ui 접근성 프리미티브 활용 | 코드 리뷰 + 수동 키보드 확인 |
| REQ-FUNC-080 | 약관/방침/안전수칙/면책 고지 + 동의 기록 | IMPLEMENT | 정적 정책 페이지 + 모집글 작성 시 동의 시각 저장 | Playwright smoke test |

## 4. REQ-NF 요구사항 처리

### 4.1 Performance (REQ-NF-001~007)

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-001 | LCP p75 ≤2.5s | IMPLEMENT (목표) | 정적 데이터 + Next/Image 최적화로 설계 목표로 삼음. 지속적 RUM 모니터링은 구축하지 않음 | 배포 전 수동 Lighthouse 점검 |
| REQ-NF-002 | INP p75 ≤200ms | IMPLEMENT (목표) | 경량 클라이언트 상태, 불필요한 리렌더 최소화 | 배포 전 수동 Lighthouse 점검 |
| REQ-NF-003 | CLS p75 ≤0.1 | IMPLEMENT (목표) | 이미지 크기 고정, 레이아웃 시프트 방지 | 배포 전 수동 Lighthouse 점검 |
| REQ-NF-004 | 필터 응답 p95 ≤1s(동시 50명) | IMPLEMENT (축소) | 정적 데이터 클라이언트 필터링으로 사실상 충족. 부하 테스트는 실시하지 않는다(부하 테스트 제외) | 수동 확인(개발자 도구 타이밍) |
| REQ-NF-005 | 쓰기 API p95 ≤3s | IMPLEMENT (축소) | Supabase 응답 시간 수동 확인. 부하 테스트는 실시하지 않음 | 수동 확인 |
| REQ-NF-006 | 이미지 반응형·lazy·LCP priority | IMPLEMENT | Next/Image 컴포넌트 사용 | 코드 리뷰 |
| REQ-NF-007 | 배포 전 Lighthouse Performance ≥85 CI 게이트 | EXCLUDED | 지속적 성능 CI 파이프라인(Lighthouse CI)은 구축하지 않고 배포 전 수동 점검으로 대체한다(자동화 인프라 최소화 원칙, CI는 Playwright smoke test만 운용) | — |

### 4.2 Reliability and Recovery (REQ-NF-008~011)

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-008 | 월간 가용성 ≥99.5% | EXCLUDED | 별도 가용성 모니터링·SLA 관리 체계를 구축하지 않는다. Vercel/Supabase 기본 인프라 가용성에 의존 | — |
| REQ-NF-009 | 내부 API 5xx ≤0.5% | EXCLUDED | 별도 오류율 모니터링 파이프라인을 구축하지 않는다(장애 알림 제외) | — |
| REQ-NF-010 | DB 백업 RPO≤24h/RTO≤8h | EXCLUDED | 자동 백업 체계를 구축하지 않는다(자동 백업 제외). Supabase 기본 백업 정책에 의존 | — |
| REQ-NF-011 | 외부 링크 주 1회 자동 검사 + Admin 알림 | EXCLUDED | 자동 모니터링·알림을 구축하지 않는다. 배포 전 수동 링크 점검 체크리스트로 대체 | 배포 전 수동 체크리스트 |

### 4.3 Security and Privacy (REQ-NF-012~018)

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-012 | TLS 1.2 이상 | IMPLEMENT | Vercel/Supabase 기본 HTTPS 제공 | 배포 후 SSL 설정 확인 |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | IMPLEMENT | Supabase RLS + 서버 액션 권한 검사 | 통합 테스트(권한별 부정 접근) |
| REQ-NF-014 | CSRF 방어·SameSite 쿠키 | IMPLEMENT | Next.js Server Actions 기본 보호 + Supabase Auth 쿠키 설정 | 코드 리뷰 |
| REQ-NF-015 | 입력 검증·이스케이프, 저장 XSS 차단 | IMPLEMENT | React 기본 이스케이프 + 서버 측 스키마 검증(zod 등) | 코드 리뷰 |
| REQ-NF-016 | 비밀키 env 관리, 클라이언트 번들 미포함 | IMPLEMENT | `.env` + 서버 전용 변수 분리 | 빌드 산출물 확인 |
| REQ-NF-017 | 항공·호텔 원시 입력값 미보존 | IMPLEMENT | F2/F3 설계 자체로 서버 미저장 | 코드 리뷰(네트워크·DB 검사) |
| REQ-NF-018 | 개인정보 내보내기/탈퇴/삭제 요청 제공 | IMPLEMENT (축소) | 탈퇴·삭제 요청 처리(REQ-FUNC-045)만 구현한다. 개인정보 다운로드(내보내기) UI는 만들지 않는다 | 수동 확인 |

### 4.4 Safety and Moderation (REQ-NF-019~022)

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-019 | 신고 접수 응답 p95 ≤3s | IMPLEMENT | Supabase insert 응답 시간 수동 확인 | 수동 확인 |
| REQ-NF-020 | 신고 1차 검토 24h 이내 90%+ | EXCLUDED | 운영 SLA 측정·모니터링 체계를 구축하지 않는다. 관리자가 신고 큐를 수동으로 처리 | — |
| REQ-NF-021 | 글/요청/신고 속도 제한(rate limit) | EXCLUDED | 별도 rate limit 인프라를 구축하지 않는다(간단한 차단·신고 원칙에 따른 최소 기능) | — |
| REQ-NF-022 | Moderator 조치 추적성(감사 로그) | EXCLUDED | 범용 감사 로그 제외와 동일 사유 | — |

### 4.5 Accessibility (REQ-NF-023~025)

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-023 | WCAG 2.2 Level AA 목표 | IMPLEMENT | 시맨틱 마크업·명도 대비·라벨 연결을 설계 원칙으로 적용 | 코드 리뷰 |
| REQ-NF-024 | 자동 접근성 검사(axe) | IMPLEMENT (축소) | Playwright smoke test에 axe-core 점검을 포함하되 핵심 화면(4+1)만 대상으로 함 | Playwright + axe-core |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | IMPLEMENT | 핵심 사용자 흐름에 대해 수동 QA 체크리스트로 확인 | 수동 확인 |

### 4.6 Content, Freshness, SEO, Copyright (REQ-NF-026~030)

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | IMPLEMENT | REQ-FUNC-074와 동일한 데이터 검증 스크립트 | 데이터 검증 스크립트(CI) |
| REQ-NF-027 | 해외 안전정보 커버리지 100% | IMPLEMENT | REQ-FUNC-046과 동일한 매핑 검증 | 데이터 검증 스크립트(CI) |
| REQ-NF-028 | 안전정보 최신 확인 7일 이내 95%+ | IMPLEMENT (축소) | stale 경고 로직(REQ-FUNC-050)만 시스템으로 구현하며, 실제 95% 유지 여부는 콘텐츠 갱신(수동)에 의존하고 별도 지표 대시보드는 없음 | 수동 확인 |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | EXCLUDED | 이미지 정책 축소(URL+alt만 보증)에 따라 라이선스 메타데이터 100% 보증을 요구하지 않는다 | — |
| REQ-NF-030 | 공개 페이지 SEO 메타데이터 누락 0건 | IMPLEMENT | Next.js Metadata API 전 페이지 적용 | 코드 리뷰 |

### 4.7 Maintainability, Monitoring, Cost (REQ-NF-031~034)

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-031 | TypeScript strict·lint·테스트 통과(병합 전) | IMPLEMENT | `tsc --noEmit`, ESLint, 데이터 검증 스크립트, Playwright smoke test를 CI로 실행 | CI 파이프라인 |
| REQ-NF-032 | 구조화 로그(request_id/actor/action/result, PII 제외) | EXCLUDED | 별도 구조화 로그 파이프라인을 구축하지 않는다. Vercel 기본 함수 로그로 대체(모니터링 인프라 최소화 원칙) | — |
| REQ-NF-033 | 핵심 오류 알림(5xx>1% 또는 외부링크 실패 5분 이내) | EXCLUDED | 자동 장애 알림을 구축하지 않는다(장애 알림 제외) | — |
| REQ-NF-034 | MVP 월 인프라 비용 10만원 이하 목표 | IMPLEMENT (설계 원칙) | Vercel/Supabase 무료~저가 티어 구성으로 목표를 충족시키되, 별도 비용 모니터링 도구는 구축하지 않는다 | 수동 확인(요금제 검토) |

## 5. 데이터 모델 매핑

| SRS 엔터티 | 이번 구현 방식 |
|---|---|
| `COUNTRY`, `REGION`, `DESTINATION`, `DESTINATION_CONTENT` | `src/data`의 정적 TypeScript 배열/객체 |
| `COUNTRY_SAFETY` | `src/data`의 정적 TypeScript 배열/객체 |
| `MEDIA_ASSET` | 별도 테이블 없음. 각 콘텐츠 항목에 이미지 URL과 `alt` 필드만 포함 |
| `REPRESENTATIVE_PROFILE` | `src/data`의 단일 정적 객체 |
| `USER`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT` | Supabase PostgreSQL 테이블(`profiles`, `mate_posts`, `mate_applications`, `blocks`, `reports`) + 최소 RLS |
| 외부 URL 허용목록(관리자 설정, REQ-FUNC-077) | Supabase PostgreSQL 테이블 `app_settings`(RLS로 클라이언트 직접 접근 차단, 서버 전용 Route Handler만 읽고 씀) |
| `AUDIT_LOG` | 구현하지 않음(3.5, 3.7절 EXCLUDED 사유 참조) |

> 커스텀 테이블은 정확히 **6개**(`profiles`, `mate_posts`, `mate_applications`, `blocks`, `reports`, `app_settings`)로 고정한다. Supabase Auth가 관리하는 `auth.users`는 이 6개와 별개다.

## 6. 테스트 전략

- **Playwright 핵심 Smoke Test**: 여행지 탐색·필터, 항공/호텔 입력→요약→외부 이동, 회원가입·로그인·성인확인, 동행글 작성→참가 요청→승인/거절, 신고·차단, 안전정보 열람(및 stale 경고), 대표 소개, 관리자(신고 상태 변경, 외부 URL 설정) 흐름을 각 1개 이상의 시나리오로 커버한다.
- **접근성**: 위 Smoke Test 대상 화면에 axe-core 점검을 포함한다(REQ-NF-024).
- **데이터 검증 스크립트**: `src/data`의 여행지·안전정보·대표 소개 콘텐츠가 필수 필드·최소 수량 기준(국내 10+, 해외 15개국 30도시+, 안전정보 8개 카테고리 등)을 충족하는지 CI에서 검사한다.
- **정적 분석**: `tsc --noEmit`, ESLint를 CI 게이트로 사용한다.
- **성능·가용성**: 배포 전 수동 Lighthouse 점검과 수동 링크 점검 체크리스트로 대체하며, 지속적 모니터링·부하 테스트·자동 알림 파이프라인은 구축하지 않는다.

## 7. 배포

- Vercel에 Next.js 애플리케이션을 배포하고, Supabase(Auth/PostgreSQL)를 연동한다.
- 외부 이동 URL(`FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL`)과 안전정보 공식 출처 URL은 관리자 탭에서 HTTPS 허용목록 범위 내에서 설정한다.
- EC2/AWS 등 별도 인프라는 구성하지 않는다.
- 병합·배포 자동화는 CI(Lint/Test/Playwright)까지만 두며, 무인 자동 Merge Runner는 구성하지 않는다.

## 8. 제외 기능 요약

| 제외 기능 | 관련 요구사항 | 제외 이유 |
|---|---|---|
| 전체 콘텐츠 CMS | REQ-FUNC-055, 072 | 콘텐츠는 `src/data` 코드 배포로 관리하며 별도 편집자 콘솔을 두지 않는다 |
| 미디어 업로드·라이선스 승인 워크플로 | REQ-FUNC-073, REQ-NF-029 | 이미지 정책을 URL+alt 텍스트로 축소했다 |
| 범용 감사 로그 | REQ-FUNC-056, 076, REQ-NF-022, 032 | 변경 이력은 git 커밋으로 대체하고 별도 감사 로그 시스템을 두지 않는다 |
| 자동 백업·장애 알림·부하 테스트 | REQ-NF-007~011, 020, 021, 033 | 운영 모니터링·알림·부하 검증 인프라를 구축하지 않고 Vercel/Supabase 기본 제공 범위에 의존한다 |
| 외부 이메일 사업자 연동 | REQ-FUNC-043 | 알림은 Toast/화면 상태로 대체한다 |
| EC2·AWS 인프라 | 해당 없음(아키텍처 원칙) | Vercel/Supabase만 사용한다 |
| 무인 자동 Merge Runner | 해당 없음(아키텍처 원칙) | CI는 검증까지만 수행하고 병합은 사람이 수행한다 |
