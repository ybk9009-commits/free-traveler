# UI Coverage Analysis — Free Traveler

- **Document ID:** UICOV-TRAVEL-001
- **기반 문서:** `02_SRS_BASELINE.md`, `PROJECT_SCOPE.md`
- **범위:** REQ-FUNC-001~080, REQ-NF-001~034 전체(114개)를 5개 디자인 Screen에 배치

---

## 1. 분류 기준

| 분류 | 정의 |
|---|---|
| **UI_DIRECT** | 화면에 고유한 시각 요소·레이아웃 영역이 필요한 요구사항(목록, 필터, 폼, 패널, 탭, 배지, 버튼, 링크) |
| **UI_STATE** | 기존 UI 요소 위에서 상태·검증·알림·조건부 표시로 표현되는 요구사항(오류 메시지, 빈 상태, 경고 배지, Toast, 동적 제약) |
| **NON_UI** | 사용자에게 직접 노출되는 화면 요소가 없는 데이터·보안·성능 규칙(저장 정책, RLS, 스키마 제약, 메타데이터, 성능 목표) |
| **OPERATIONS** | 운영·거버넌스·CI·모니터링·SLA 성격의 요구사항으로 최종 사용자 디자인 Screen이 아닌 프로세스/관리 영역(콘텐츠 게이트, 감사, 알림 인프라, QA 프로세스) |

**PROJECT_SCOPE 분류**는 `PROJECT_SCOPE.md`에서 확정한 값(IMPLEMENT / IMPLEMENT(축소) / IMPLEMENT(간소화) / IMPLEMENT(목표) / IMPLEMENT(설계 원칙) / EXCLUDED)을 그대로 인용한다. 이 문서는 그 분류를 변경하지 않는다.

## 2. Screen 정의 (5개 고정)

| Screen | 경로 | 사용자 목표 | 주요 영역 | 상태 | 이동 목적지 |
|---|---|---|---|---|---|
| **SCR-001** | `/` 메인 | 여행지를 탐색하고 국가 안전정보·대표 소개를 확인한다 | Hero/검색바, 국내·해외 탭, 필터, 여행지 카드 목록, 여행지 상세 Drawer/Modal, 안전정보 상세 Drawer/Modal, 대표 소개 요약 카드, 전역 nav/footer | 목록 로딩·빈 결과, 필터 결과 수, stale 경고 배지, 중대 경보 상단 배지, 즐겨찾기 토글 | 여행지 상세→안전정보 Drawer 전환, `/travel-tools`, `/mates`, `/about`, `/account` |
| **SCR-002** | `/about` 대표 소개 | 큐레이터의 경험과 편집 기준을 확인한다 | 대표 이미지·한줄소개, 50+/30+ 카드, 철학·편집원칙, 방문 국가 목록, 타임라인, 추천 여행지 6개, 문의·SNS 링크 | 이미지 placeholder, 빈 SNS 링크 미노출 | 추천 여행지 클릭 시 SCR-001 상세 Drawer 딥링크, 외부 SNS 링크 |
| **SCR-003** | `/travel-tools` 통합 여행 준비 | 항공·숙소 조건을 정리해 외부로 이동하거나 동행 모집글을 작성한다 | 탭 내비게이션(항공/숙소/동행 작성), 항공 폼+요약, 숙소 폼+요약, 동행 작성 폼+안전수칙 동의 | 필드·날짜 오류, 비전달 고지, 연락처 탐지 차단, 로그인·성인확인 게이트, 외부 이동 오류+재시도 | 외부 항공/숙소 사이트(새 탭), 작성 완료 후 `/mates` 상세, 미인증 시 `/account` 로그인 탭 |
| **SCR-004** | `/mates` 동행 조회 | 조건에 맞는 동행 모집글을 찾아 참가를 요청한다 | 필터, 목록 카드, 상세 패널(작성자·조건·설명·신청 폼·신고·차단) | 모집중/마감(자동+수동) 배지, 중복 신청 오류, 차단 상대 비노출 | `/travel-tools`(새 글 작성), `/account`(로그인·내 신청 확인) |
| **SCR-005** | `/account` 계정·관리 | 계정을 관리하고 내 활동·신고를 처리하며(권한 보유 시) 운영 설정을 변경한다 | 탭(로그인·가입, 프로필, 내 활동[내 글·내 신청·즐겨찾기·차단목록], 관리자[신고 큐, 외부 URL 설정]) | 인증 상태, 성인확인 완료 여부, 관리자 탭 노출 여부(역할 기반) | `/mates`(내 글 상세), `/travel-tools`(내 글 수정), `/`(로그아웃 후 홈) |

여행지·안전 상세는 SCR-001의 Drawer/Modal로만 존재하며 별도 라우트/Screen으로 세지 않는다. 항공·숙소 입력과 동행 작성은 SCR-003의 탭 3개로 통합한다. 동행 상세는 SCR-004의 상세 패널로만 존재한다. 로그인·프로필·내 활동·간단 관리자는 SCR-005의 탭으로 통합한다. API Route, 인증 콜백(`/auth/callback` 등), 404/500/오류 경계는 기술 Route로 처리하며 디자인 Screen 수에 포함하지 않는다.

## 3. Requirement 커버리지 — Functional (REQ-FUNC-001~080)

### 3.1 F1. Destination Guide

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-001 | 국내·해외 목록 구분 | UI_DIRECT | IMPLEMENT | SCR-001 | 탭 전환 |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | UI_DIRECT | IMPLEMENT | SCR-001 | 필터 패널 |
| REQ-FUNC-003 | 키워드 검색 | UI_DIRECT | IMPLEMENT | SCR-001 | REQ-FUNC-067 통합검색과 동일 입력창 |
| REQ-FUNC-004 | 상세 필수 콘텐츠 항목 | UI_DIRECT | IMPLEMENT | SCR-001 | 여행지 상세 Drawer/Modal |
| REQ-FUNC-005 | 빈 결과 안내·초기화 | UI_STATE | IMPLEMENT | SCR-001 | 필터 결과 0건 상태 |
| REQ-FUNC-006 | 해외 상세→안전정보 연결 | UI_DIRECT | IMPLEMENT | SCR-001 | 상세 Drawer 내 안전정보 Drawer 전환 링크 |
| REQ-FUNC-007 | 대표 이미지 메타(alt만 보증) | UI_STATE | IMPLEMENT(축소) | SCR-001 | 이미지 접근성 속성 |
| REQ-FUNC-008 | MVP 게시 수량 검증 | OPERATIONS | IMPLEMENT | — | CI 데이터 검증, 화면요소 아님 |
| REQ-FUNC-009 | 관련 여행지 추천(최대 6) | UI_DIRECT | IMPLEMENT | SCR-001 | 상세 Drawer 하단 영역 |
| REQ-FUNC-010 | 필터 상태 URL 반영 | UI_STATE | IMPLEMENT | SCR-001 | 공유·새로고침 복원 상태 |

### 3.2 F2. Flight Link-out

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-011 | 항공 필수 입력 폼 | UI_DIRECT | IMPLEMENT | SCR-003 | 항공 탭 |
| REQ-FUNC-012 | 국가별 지역 옵션 제한 | UI_STATE | IMPLEMENT | SCR-003 | 폼 동적 제약 |
| REQ-FUNC-013 | 날짜 검증(과거/역전 차단) | UI_STATE | IMPLEMENT | SCR-003 | 오류 표시 |
| REQ-FUNC-014 | 입력 요약 단계 | UI_DIRECT | IMPLEMENT | SCR-003 | 폼 내 요약 스텝 |
| REQ-FUNC-015 | 비전달 고지 문구 | UI_DIRECT | IMPLEMENT | SCR-003 | 고정 고지 영역 |
| REQ-FUNC-016 | 외부 URL 새 탭 이동 | UI_DIRECT | IMPLEMENT | SCR-003 | 이동 버튼 |
| REQ-FUNC-017 | 입력값 서버 미저장 | NON_UI | IMPLEMENT | — | 저장 정책 |
| REQ-FUNC-018 | URL 오류 시 차단·재시도 | UI_STATE | IMPLEMENT(축소) | SCR-003 | 오류 안내 |

### 3.3 F3. Hotel Link-out

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-019 | 호텔 필수 입력 폼 | UI_DIRECT | IMPLEMENT | SCR-003 | 호텔 탭 |
| REQ-FUNC-020 | 국가별 지역 옵션 제한 | UI_STATE | IMPLEMENT | SCR-003 | 폼 동적 제약 |
| REQ-FUNC-021 | 날짜 검증(과거/역전/동일 차단) | UI_STATE | IMPLEMENT | SCR-003 | 오류 표시 |
| REQ-FUNC-022 | 입력 요약 표시 | UI_DIRECT | IMPLEMENT | SCR-003 | 폼 내 요약 스텝 |
| REQ-FUNC-023 | 비전달 고지 문구 | UI_DIRECT | IMPLEMENT | SCR-003 | 고정 고지 영역 |
| REQ-FUNC-024 | 외부 URL 새 탭 이동 | UI_DIRECT | IMPLEMENT | SCR-003 | 이동 버튼 |
| REQ-FUNC-025 | 입력값 서버 미저장 | NON_UI | IMPLEMENT | — | 저장 정책 |
| REQ-FUNC-026 | URL 오류 시 차단·재시도 | UI_STATE | IMPLEMENT(축소) | SCR-003 | 오류 안내 |

### 3.4 F4. Travel Mate

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-027 | 쓰기 작업에 이메일 인증 요구 | UI_STATE | IMPLEMENT | SCR-003, SCR-005 | 미인증 시 로그인 리다이렉트 |
| REQ-FUNC-028 | 성인확인 요구(생년월일 미저장) | UI_DIRECT | IMPLEMENT | SCR-005 | 성인확인 절차, SCR-003 작성 탭 접근 게이트 |
| REQ-FUNC-029 | 프로필 필드 | UI_DIRECT | IMPLEMENT | SCR-005 | 프로필 탭 |
| REQ-FUNC-030 | 조건 필터+차단 사용자 제외 | UI_DIRECT | IMPLEMENT | SCR-004 | 목록 필터 |
| REQ-FUNC-031 | 모집글 필드+검증 | UI_DIRECT | IMPLEMENT | SCR-003 | 동행 작성 탭 |
| REQ-FUNC-032 | 공개 연락처 탐지·제출 차단 | UI_STATE | IMPLEMENT | SCR-003 | 제출 오류 안내 |
| REQ-FUNC-033 | 작성자 표시(연락처 미노출) | UI_DIRECT | IMPLEMENT | SCR-004 | 상세 패널 표시 요소 |
| REQ-FUNC-034 | 참가 메시지(500자) 제출 | UI_DIRECT | IMPLEMENT | SCR-004 | 상세 패널 내 신청 폼 |
| REQ-FUNC-035 | 중복 신청 차단 | UI_STATE | IMPLEMENT | SCR-004 | 오류 안내 |
| REQ-FUNC-036 | 작성자의 승인/거절 처리 | UI_DIRECT | IMPLEMENT | SCR-005 | 내 활동 탭(내 글의 요청 관리) |
| REQ-FUNC-037 | 종료일 경과 시 자동 마감(조회 시 계산) | UI_STATE | IMPLEMENT(축소) | SCR-004, SCR-005 | 모집중/마감 배지 |
| REQ-FUNC-038 | 수동 마감/수정/삭제 | UI_DIRECT | IMPLEMENT | SCR-005 | 내 활동 탭 관리 액션 |
| REQ-FUNC-039 | 신고(사유코드+설명) | UI_DIRECT | IMPLEMENT(간소화) | SCR-004 | 신고 모달 |
| REQ-FUNC-040 | 차단/해제 | UI_DIRECT | IMPLEMENT | SCR-004, SCR-005 | 차단 버튼 + 차단 목록 관리 |
| REQ-FUNC-041 | Moderator 신고 큐(간소화) | UI_DIRECT | IMPLEMENT(간소화) | SCR-005 | 관리자 탭 |
| REQ-FUNC-042 | Moderator 조치(간소화) | UI_DIRECT | IMPLEMENT(간소화) | SCR-005 | 관리자 탭 |
| REQ-FUNC-043 | 인앱 알림(Toast), 이메일 미발송 | UI_STATE | IMPLEMENT(축소) | 전체 공통 | 액션 결과 Toast |
| REQ-FUNC-044 | RLS로 비공개 데이터 접근 제한 | NON_UI | IMPLEMENT | — | 서버 정책 |
| REQ-FUNC-045 | 탈퇴 시 즉시 비식별화 | UI_DIRECT | IMPLEMENT(축소) | SCR-005 | 계정 탭 탈퇴 액션 |

### 3.5 F5. Country Safety

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-046 | 해외 국가 안전페이지 존재 보장 | OPERATIONS | IMPLEMENT | — | 콘텐츠 커버리지 검증 |
| REQ-FUNC-047 | 8개 필수 카테고리 섹션 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer/Modal |
| REQ-FUNC-048 | 출처/확인일/편집자 표시 | UI_DIRECT | IMPLEMENT | SCR-001 | |
| REQ-FUNC-049 | 외교부 원문 링크(새 탭) | UI_DIRECT | IMPLEMENT | SCR-001 | |
| REQ-FUNC-050 | 7일 초과 stale 경고 | UI_STATE | IMPLEMENT(축소) | SCR-001 | 렌더링 시 계산된 배지 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | UI_DIRECT | IMPLEMENT | SCR-001 | |
| REQ-FUNC-052 | 국가/지역 경보 범위 구분 | UI_DIRECT | IMPLEMENT | SCR-001 | |
| REQ-FUNC-053 | 긴급연락처·영사콜센터 | UI_DIRECT | IMPLEMENT | SCR-001 | |
| REQ-FUNC-054 | 공식판단 대체 아님 고지 | UI_DIRECT | IMPLEMENT | SCR-001, SCR-003 | 안전 Drawer + 항공 요약 공통 고지 |
| REQ-FUNC-055 | Editor/Admin 작성·검수·게시 워크플로 | OPERATIONS | EXCLUDED | — | 콘텐츠는 코드 배포로 대체(CMS 미구현) |
| REQ-FUNC-056 | 변경 이력 보존 | OPERATIONS | EXCLUDED | — | git 커밋 이력으로 대체(감사 로그 미구현) |

### 3.6 F6. About free_traveler

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-057 | 대표명/50+/30+ 일관 표시 | UI_DIRECT | IMPLEMENT | SCR-002, SCR-001 | About 본문 + 홈 요약 카드 |
| REQ-FUNC-058 | 소개문/철학/편집원칙 | UI_DIRECT | IMPLEMENT | SCR-002 | |
| REQ-FUNC-059 | 방문 권역 지도 또는 국가 목록 | UI_DIRECT | IMPLEMENT(축소) | SCR-002 | 목록형으로 구현 |
| REQ-FUNC-060 | 여행 타임라인 | UI_DIRECT | IMPLEMENT | SCR-002 | |
| REQ-FUNC-061 | 대표 이미지 메타(alt만 보증) | UI_STATE | IMPLEMENT(축소) | SCR-002 | |
| REQ-FUNC-062 | 문의·SNS 링크 | UI_DIRECT | IMPLEMENT | SCR-002 | |
| REQ-FUNC-063 | 추천 여행지 6개 연결 | UI_DIRECT | IMPLEMENT | SCR-002 | SCR-001 상세 Drawer로 딥링크 |

### 3.7 F7. Common / Admin / Governance

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-064 | 전역 내비게이션·푸터 | UI_DIRECT | IMPLEMENT | 전체 공통 | 5개 Screen 공통 레이아웃 |
| REQ-FUNC-065 | 320px~데스크톱 반응형 | UI_STATE | IMPLEMENT | 전체 공통 | 레이아웃 원칙 |
| REQ-FUNC-066 | 이메일 가입/인증/로그인/로그아웃/재설정 | UI_DIRECT | IMPLEMENT | SCR-005 | 로그인 탭 |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | UI_DIRECT | IMPLEMENT | SCR-001 | 전역 검색바 |
| REQ-FUNC-068 | 여행지 즐겨찾기 | UI_DIRECT | IMPLEMENT(축소) | SCR-001, SCR-005 | 즐겨찾기 버튼 + 내 활동 목록 |
| REQ-FUNC-069 | URL 공유 | UI_DIRECT | IMPLEMENT | SCR-001, SCR-004 | 공유 버튼 |
| REQ-FUNC-070 | SEO 메타데이터 | NON_UI | IMPLEMENT | 전체 공통 | head 메타, 비시각 요소 |
| REQ-FUNC-071 | 행동 분석 이벤트 | OPERATIONS | EXCLUDED | — | 이벤트 파이프라인 미구현 |
| REQ-FUNC-072 | Editor/Admin 콘텐츠 CRUD·미리보기 | OPERATIONS | EXCLUDED | — | 전체 콘텐츠 CMS 미구현 |
| REQ-FUNC-073 | 미디어 업로드 메타데이터 | OPERATIONS | EXCLUDED | — | 업로드 워크플로 미구현 |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | OPERATIONS | IMPLEMENT(축소) | — | CI 데이터 검증 스크립트 |
| REQ-FUNC-075 | stale 현황·담당자 대시보드 | OPERATIONS | EXCLUDED | — | 별도 대시보드 미구현 |
| REQ-FUNC-076 | 관리자 변경/신고처리/권한변경 감사 로그 | OPERATIONS | EXCLUDED | — | 범용 감사 로그 미구현 |
| REQ-FUNC-077 | Admin 외부 URL HTTPS 허용목록 설정 | UI_DIRECT | IMPLEMENT | SCR-005 | 관리자 탭 |
| REQ-FUNC-078 | 오류 화면(404/500/권한없음/외부연결실패) | UI_STATE | IMPLEMENT | — (기술 Route) | 별도 디자인 Screen으로 세지 않음 |
| REQ-FUNC-079 | 폼/모달/탭/알림 ARIA | UI_STATE | IMPLEMENT | 전체 공통 | 구현 원칙 |
| REQ-FUNC-080 | 약관/방침/안전수칙/면책 고지 + 동의 기록 | UI_DIRECT | IMPLEMENT | SCR-003 | 동행 작성 탭 동의 체크박스(약관 본문은 정적 legal 페이지, 5개 Screen 외) |

## 4. Requirement 커버리지 — Non-Functional (REQ-NF-001~034)

### 4.1 Performance

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-001 | LCP p75 ≤2.5s | NON_UI | IMPLEMENT(목표) | 전체 공통 | 성능 목표 |
| REQ-NF-002 | INP p75 ≤200ms | NON_UI | IMPLEMENT(목표) | 전체 공통 | 성능 목표 |
| REQ-NF-003 | CLS p75 ≤0.1 | NON_UI | IMPLEMENT(목표) | 전체 공통 | 성능 목표 |
| REQ-NF-004 | 필터 응답 p95 ≤1s | NON_UI | IMPLEMENT(축소) | — | SCR-001 필터 성능 지표, 부하테스트 없음 |
| REQ-NF-005 | 쓰기 API p95 ≤3s | NON_UI | IMPLEMENT(축소) | — | 성능 지표, 부하테스트 없음 |
| REQ-NF-006 | 이미지 반응형·lazy·priority | NON_UI | IMPLEMENT | 전체 공통 | Next/Image 구현 |
| REQ-NF-007 | 배포 전 Lighthouse CI 게이트 | OPERATIONS | EXCLUDED | — | 수동 점검으로 대체 |

### 4.2 Reliability and Recovery

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-008 | 월간 가용성 ≥99.5% | OPERATIONS | EXCLUDED | — | 모니터링 체계 미구축 |
| REQ-NF-009 | 내부 API 5xx ≤0.5% | OPERATIONS | EXCLUDED | — | 모니터링 체계 미구축 |
| REQ-NF-010 | DB 백업 RPO/RTO | OPERATIONS | EXCLUDED | — | 자동 백업 제외 |
| REQ-NF-011 | 외부 링크 주 1회 자동 검사 | OPERATIONS | EXCLUDED | — | 수동 점검 체크리스트로 대체 |

### 4.3 Security and Privacy

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-012 | TLS 1.2 이상 | NON_UI | IMPLEMENT | — | 인프라 기본 제공 |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | NON_UI | IMPLEMENT | — | 서버 정책 |
| REQ-NF-014 | CSRF 방어·SameSite 쿠키 | NON_UI | IMPLEMENT | — | 서버 정책 |
| REQ-NF-015 | 입력 검증·이스케이프, XSS 차단 | NON_UI | IMPLEMENT | — | 서버 정책 |
| REQ-NF-016 | 비밀키 env 관리 | NON_UI | IMPLEMENT | — | 빌드/배포 정책 |
| REQ-NF-017 | 항공·호텔 원시 입력값 미보존 | NON_UI | IMPLEMENT | — | REQ-FUNC-017/025와 동일 |
| REQ-NF-018 | 개인정보 내보내기/탈퇴/삭제 요청 | UI_DIRECT | IMPLEMENT(축소) | SCR-005 | 탈퇴 버튼(내보내기 기능 제외) |

### 4.4 Safety and Moderation

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-019 | 신고 접수 응답 p95 ≤3s | NON_UI | IMPLEMENT | — | 성능 지표 |
| REQ-NF-020 | 신고 1차 검토 24h 이내 90%+ | OPERATIONS | EXCLUDED | — | SLA 모니터링 미구축 |
| REQ-NF-021 | 글/요청/신고 속도 제한 | OPERATIONS | EXCLUDED | — | rate limit 인프라 미구축 |
| REQ-NF-022 | Moderator 조치 추적성(감사 로그) | OPERATIONS | EXCLUDED | — | 범용 감사 로그 미구현 |

### 4.5 Accessibility

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-023 | WCAG 2.2 Level AA 목표 | UI_STATE | IMPLEMENT | 전체 공통 | 설계 원칙 |
| REQ-NF-024 | 자동 접근성 검사(axe) | OPERATIONS | IMPLEMENT(축소) | — | 테스트 프로세스(Playwright+axe) |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | OPERATIONS | IMPLEMENT | — | QA 프로세스 |

### 4.6 Content, Freshness, SEO, Copyright

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | OPERATIONS | IMPLEMENT | — | 데이터 검증 스크립트 |
| REQ-NF-027 | 해외 안전정보 커버리지 100% | OPERATIONS | IMPLEMENT | — | 데이터 검증 스크립트 |
| REQ-NF-028 | 안전정보 최신확인 7일 이내 95%+ | OPERATIONS | IMPLEMENT(축소) | — | 콘텐츠 갱신 운영 지표 |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | OPERATIONS | EXCLUDED | — | 이미지 정책 축소 |
| REQ-NF-030 | 공개 페이지 SEO 메타데이터 누락 0건 | NON_UI | IMPLEMENT | 전체 공통 | REQ-FUNC-070과 동일 |

### 4.7 Maintainability, Monitoring, Cost

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-031 | TypeScript strict·lint·테스트(병합 전) | OPERATIONS | IMPLEMENT | — | CI 파이프라인 |
| REQ-NF-032 | 구조화 로그 | OPERATIONS | EXCLUDED | — | 로그 파이프라인 미구축 |
| REQ-NF-033 | 핵심 오류 알림 | OPERATIONS | EXCLUDED | — | 장애 알림 자동화 미구축 |
| REQ-NF-034 | MVP 월 인프라 비용 목표 | OPERATIONS | IMPLEMENT(설계 원칙) | — | 요금제 선택으로 충족 |

## 5. 커버리지 요약

### 5.1 UI 분류별 개수

| 분류 | 개수 |
|---|---:|
| UI_DIRECT | 48 |
| UI_STATE | 20 |
| NON_UI | 18 |
| OPERATIONS | 28 |
| **합계** | **114** |

### 5.2 배치 Screen별 개수(주 배치 기준, 첫 번째로 기재된 Screen)

| Screen/구분 | 개수 |
|---|---:|
| SCR-001 (`/`) | 20 |
| SCR-002 (`/about`) | 7 |
| SCR-003 (`/travel-tools`) | 18 |
| SCR-004 (`/mates`) | 7 |
| SCR-005 (`/account`) | 10 |
| 전체 공통(모든 Screen 레이아웃/원칙) | 11 |
| — (화면 요소 없음: NON_UI·OPERATIONS·기술 Route) | 41 |
| **합계** | **114** |

### 5.3 PROJECT_SCOPE 분류별 개수

| PROJECT_SCOPE 분류 | 개수 |
|---|---:|
| IMPLEMENT 계열(IMPLEMENT/축소/간소화/목표/설계 원칙) | 96 |
| EXCLUDED | 18 |

## 6. 검증

- REQ-FUNC-001~080: 80개 전 항목이 3절 표에 1회씩 등장한다(F1 10 + F2 8 + F3 8 + F4 19 + F5 11 + F6 7 + F7 17 = 80).
- REQ-NF-001~034: 34개 전 항목이 4절 표에 1회씩 등장한다(Performance 7 + Reliability 4 + Security 7 + Safety 4 + Accessibility 3 + Content 5 + Maintainability 4 = 34).
- 전체 Requirement 총수: 80 + 34 = **114개** (5.1, 5.2 표의 합계와 일치).
- 디자인 Screen은 SCR-001~SCR-005 5개로 고정했으며 추가 Screen을 생성하지 않았다.
- EXCLUDED로 분류된 18개 항목은 본 문서에서도 EXCLUDED를 유지했으며 구현 범위로 되돌리지 않았다.
