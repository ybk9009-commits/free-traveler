# UI Contract — Free Traveler (Next.js App Router)

- **기준 문서**: `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`, `design-reference/D-001/DESIGN.md`
- **현재 `src/app` 상태**: `layout.tsx`, `page.tsx`(create-next-app 스타터 템플릿, 교체 필요), `globals.css`, `favicon.ico`만 존재. `about/`, `travel-tools/`, `mates/`, `account/` 라우트는 아직 생성되지 않음.
- **짝 문서**: `design-reference/SCREEN_ROUTE_CONTRACT.json` — 이 문서의 Route/Page Entry/이동 관계를 기계 판독 가능한 형태로 재기록한 것. 두 문서는 항상 동기화한다.
- **Screen 구분**: **핵심(core) 4개** — SCR-001, SCR-003, SCR-004, SCR-005(주요 사용자 여정: 탐색→준비→동행→계정 순환) / **보조(auxiliary) 1개** — SCR-002(신뢰 구축용 정보성 페이지, 트랜잭션 없음)

---

## SCR-001 — 메인 (핵심)

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-001 |
| **Route** | `/` |
| **Page Entry** | `src/app/page.tsx` |
| **영역 순서** | 1) Header(공통) 2) 검색 Hero 3) 국내 인기 여행지(`card-destination` ×6) 4) 해외 인기 여행지(`card-destination` ×6) 5) 여행 테마 Chip(×6) 6) 국가별 안전정보(`card-safety` ×6) 7) 최근 동행(`card-mate` ×3 또는 Empty State) 8) 대표 소개 요약 9) Footer(공통) |
| **주요 Component** | Hero 통합 검색(pill), `card-destination`, Chip 필터, `card-safety`(경보 배지), `card-mate`, 여행지 상세 Drawer, 안전정보 상세 Drawer, 즐겨찾기 아이콘 버튼 |
| **상태** | Loading: 카드 스켈레톤(여행지/안전/동행) · Success: 정상 카드 표시 · Empty: 필터 결과 0건(초기화 CTA), 최근 동행 0건(Empty State 블록) · Error: 안전정보 원문 링크 실패 시 인라인 오류 |
| **사용자 행동** | 여행지·테마 키워드 검색(REQ-FUNC-003,067), 국내/해외 탭 전환(001), 테마 Chip 필터(002), 필터 상태 URL 반영(010), 여행지 카드 클릭→상세 Drawer(004), 안전정보 카드 클릭→안전정보 Drawer(047~054), 상세 Drawer 내 "이 나라 안전정보 보기" 전환(006), 즐겨찾기 토글(068), 여행지 URL 공유(069) |
| **다른 화면으로의 이동** | "항공·숙소 준비하기" → `/travel-tools`(SCR-003) · "전체 동행 보기" → `/mates`(SCR-004) · "대표 소개 더 보기" → `/about`(SCR-002) · 계정 아이콘/로그인 → `/account`(SCR-005) |
| **Desktop·Mobile 규칙** | Desktop 콘텐츠 1200-1280px 중앙 정렬, Hero는 뷰포트 60-70%(520-600px)로 제한해 다음 Section이 첫 화면에 보임. Card Grid는 Desktop 3열 → Tablet 2열 → Mobile 1열. Drawer는 Desktop 우측 슬라이드(480-560px) / Mobile 하단 풀스크린 시트 |
| **금지 기능** | **create-next-app 스타터 템플릿(`next.svg`, "To get started, edit the page.tsx", Vercel/Next.js 학습 링크 등) 유지 금지 — 반드시 실제 콘텐츠로 교체(`starter_template_forbidden=true`)**, 실시간 항공권/호텔 가격 표시, 광고 배너, 별점(star-rating) UI, Airbnb 상표 요소, 예약/결제 UI, Lorem ipsum·"준비 중" 문구, D-001 토큰 외 임의 색상 |

---

## SCR-002 — 대표 소개 (보조)

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-002 |
| **Route** | `/about` |
| **Page Entry** | `src/app/about/page.tsx` |
| **영역 순서** | 1) Header(공통) 2) Hero(대표 사진+소개 문장) 3) 여행 지표 카드(×3+) 4) 소개 문단(×2+) 5) 여행 타임라인(`card-timeline-item` ×6+) 6) 방문 국가(권역 4그룹×Chip) 7) 여행 사진 Gallery(×8+) 8) 기억에 남는 여행지(`card-destination` ×4+) + CTA Banner 9) Footer(공통) |
| **주요 Component** | Hero(좌우 분할), 지표 카드, `card-timeline-item`, 권역 Chip 목록, Gallery Grid, `card-destination`, CTA Banner, 문의·SNS 링크 |
| **상태** | Loading: 이미지 lazy 로딩 placeholder · Success: 정상 표시 · Empty: 정적 콘텐츠라 발생하지 않음 · Error: 이미지 로드 실패 시 대체 배경+alt 텍스트 |
| **사용자 행동** | 타임라인·방문국가·갤러리 스크롤 열람, 추천 여행지 카드 클릭(SCR-001 상세 Drawer로 딥링크), 문의·SNS 외부 링크 클릭 |
| **다른 화면으로의 이동** | "추천 여행지" 카드 → `/`(SCR-001) 상세 Drawer 딥링크 · CTA Banner "항공·숙소 준비하기" → `/travel-tools`(SCR-003) · "동행과 함께 떠나기" → `/mates`(SCR-004) · SNS/문의 링크(외부, 새 탭) |
| **Desktop·Mobile 규칙** | Desktop 1200-1280px 중앙 정렬, Hero 좌우 분할이 Mobile에서는 세로 스택으로 전환. Gallery는 Desktop Masonry/Grid → Mobile 1~2열 |
| **금지 기능** | Airbnb 상표 요소, 예약/결제 UI, 광고·별점, SNS 링크 외 프로모션 배너, Lorem ipsum·"정보 확인 필요" 문구, 빈 SNS 링크 노출(값 없으면 항목 자체를 렌더링하지 않음), D-001 토큰 외 임의 색상 |

---

## SCR-003 — 통합 여행 준비 (핵심)

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-003 |
| **Route** | `/travel-tools` |
| **Page Entry** | `src/app/travel-tools/page.tsx` |
| **영역 순서** | 1) Header(공통) 2) Intro(3단계 안내: 조건 입력→요약 확인→이동/작성) 3) 탭 전환(`tab-underline`: 항공편/숙소/동행 구하기) 4) 조건 입력 Form(항공·숙소 탭) 5) 입력 요약+외부 이동 Action Card(항공·숙소 탭) 6) 고지+Tip(항공·숙소 탭, ×3+) 7) 동행 구하기 Form 또는 미인증 안내(동행 탭) 8) Footer(공통) |
| **주요 Component** | `tab-underline`(3개), `form-input`(국가/지역/날짜), Action Card(요약+외부 이동 버튼), 비전달 고지 배너, 동행 모집글 Form(제목/국가·지역/기간/인원/스타일/설명), 안전수칙 동의 체크박스 |
| **상태** | Loading: 외부 이동 버튼/제출 시 스피너 · Success: 요약 카드 표시, 제출 완료 Toast · Empty: 폼 화면이라 해당 없음 · Error: 날짜 검증 오류(013,021), 연락처 탐지 제출 차단(032), 외부 URL 실패+재시도(018,026) · Unauthorized: 동행 탭 미인증 시 안내 카드(027,028) |
| **사용자 행동** | 탭 전환(입력·검증 상태는 세션 내 유지, 탭별 독립 관리), 국가→지역(종속 옵션)→날짜 입력(011~013,019~021), 요약 확인 후 "항공편/숙소 보러 가기" 클릭(외부 새 탭, 014~016,022~024), 동행 모집글 작성+안전수칙 동의 후 제출(031,080) |
| **다른 화면으로의 이동** | 항공/숙소 "보러 가기" → 외부 사이트(새 탭, 앱 내 라우트 아님) · 동행 모집글 제출 완료 → `/mates`(SCR-004) 작성한 글 상세 · 동행 탭 미인증 시 "로그인/가입하기" → `/account`(SCR-005) |
| **Desktop·Mobile 규칙** | Desktop은 Form+Tip 좌우 분할(폭 1200-1280px), Mobile은 세로 스택. 탭은 Desktop/Mobile 동일하게 `tab-underline` 유지. Form 높이 52px·터치 영역 44px 이상은 두 해상도 공통 |
| **금지 기능** | **인앱 예약 캘린더·결제 폼·가격 확정 UI 금지**(항공/숙소는 조건 요약 후 외부 링크 이동만), 실시간 가격 표시 금지, 입력값 서버 저장 금지(017,025), 공개 연락처(이메일/전화/SNS ID) 입력 허용 및 노출 금지(032), Airbnb 상표 요소, D-001 토큰 외 임의 색상 |

---

## SCR-004 — 동행 조회 (핵심)

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-004 |
| **Route** | `/mates` |
| **Page Entry** | `src/app/mates/page.tsx` |
| **영역 순서** | 1) Header(공통) 2) Intro+CTA Banner 3) 검색 Filter(국가/지역/기간/모집상태) 4) 목록(`card-mate` 최대 8개+더 보기) 5) 상세(Desktop 좌목록/우상세 분할, Mobile 목록→상세 Drawer) 6) 신청 방법 안내(3단계) 7) 안전 안내 CTA Banner 8) Footer(공통) |
| **주요 Component** | Filter 패널, `card-mate`, 좌우 분할 상세 패널(작성자 정보·조건·설명·참가 메시지 폼 500자·신고/차단 버튼), 모집상태 배지(모집중/마감), Empty State 블록 |
| **상태** | Loading: 목록 스켈레톤 · Success: 목록·상세 정상 표시 · Empty: 검색 결과 0건/전체 글 0건→"조건에 맞는 동행글이 아직 없어요"+필터 초기화+"첫 동행 글 작성하기" CTA · Error: 중복 신청 오류(035), 신청 실패 오류 · Unauthorized: 참가 신청 시도 시 미로그인/미성년 안내→`/account` 유도 |
| **사용자 행동** | 국가/지역/기간/모집상태로 필터링(030), 카드 클릭→상세 패널 전환, 참가 메시지(500자) 작성 후 신청(034), 신고 사유코드+설명 제출(039), 작성자 차단/해제(040), 작성자 본인 열람 시 "내 글 관리는 계정 > 내 활동에서" 안내 배너 확인 |
| **다른 화면으로의 이동** | "새 동행 글 작성하기" → `/travel-tools`(SCR-003) 동행 탭 · "로그인/내 신청 확인" → `/account`(SCR-005) · "항공·숙소도 함께 준비하기" → `/travel-tools`(SCR-003) |
| **Desktop·Mobile 규칙** | Desktop: 목록(좌)+상세(우) 동시 분할 레이아웃. **Mobile은 좌우 분할을 유지하지 않고 목록 단일 컬럼 + 상세는 하단 풀스크린 Drawer로 전환**(D-001 규칙 고정) |
| **금지 기능** | 작성자 연락처(이메일/전화) 노출 금지(033), 결제/정산 UI 금지, 별점(star-rating) UI 금지(신뢰 표기는 텍스트/배지만), 차단한 상대의 글 노출 금지, Airbnb 상표 요소, D-001 토큰 외 임의 색상 |

---

## SCR-005 — 계정·관리 (핵심)

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-005 |
| **Route** | `/account` |
| **Page Entry** | `src/app/account/page.tsx` |
| **영역 순서** | **Guest**: 1) 계정 Intro 2) 인증 Card(로그인/가입/비밀번호 재설정) 3) 회원 혜택 안내(×3+) 4) 보안 안내. **Member**(탭: 프로필/내 활동): 프로필 요약 → 내가 쓴 동행 글(+받은 참가 요청) → 내가 보낸 참가 신청 → 차단 목록 → 새 동행 글 작성 CTA. **Admin**(위 탭에 관리 영역 추가, 승인된 Stitch 정본 `88c265bbe49740e3a2f1e03eccf8e750` 기준): 관리 Intro → 핵심 KPI 요약 카드(×4+) → 신고 및 긴급 대응 현황 → 회원/본인인증 심사 대기 → 동행 게시물 검수 → 외부 URL·안전정보 동기화 설정 |
| **주요 Component** | 인증 Form(이메일+비밀번호, 서브탭), `tab-underline`(프로필/내 활동, 로그인 시 "관리" 영역 추가), 프로필 요약 카드, `card-mate` 관리 리스트(수정/마감/삭제 액션), 참가 요청 승인/거절 액션, 차단 목록+해제 버튼, 탈퇴 액션, 관리 목록+상태 변경 액션(신고 큐, 외부 URL Form) |
| **상태** | Loading: 로그인 처리 중 스피너, 목록 로딩 스켈레톤 · Success: 정상 표시 · Empty: 내 글/신청/차단 목록 0건→Empty State 블록("아직 작성한 동행 글이 없어요" 등 + "동행 글 작성하기"/"동행 찾아보기" CTA) · Error: 로그인 실패, 프로필/모집글 폼 검증 오류 · Unauthorized: 비로그인 상태의 프로필·내 활동·관리 영역 접근 시 로그인 카드로 대체, 관리 영역은 권한 없으면 렌더링 자체를 하지 않음 |
| **사용자 행동** | 이메일 가입/인증/로그인/로그아웃/비밀번호 재설정(066), 프로필 편집(029), 성인확인 진행(028), 즐겨찾기 목록 확인(068), 내가 쓴 글 수정/마감/삭제(038)+받은 요청 승인/거절(036), 보낸 신청 상태 확인(034), 차단 해제(040), 회원 탈퇴(045), (Admin) 신고 상태 변경(OPEN→RESOLVED/DISMISSED, 041~042), 본인인증 심사 승인/보완 요청, 게시물 검수 정상처리/게시중단, 외부 URL(`FLIGHT_OUTBOUND_URL`,`HOTEL_OUTBOUND_URL`) HTTPS 설정(077) |
| **다른 화면으로의 이동** | "내가 쓴 동행 글" 항목 클릭 → `/mates`(SCR-004) 내 글 상세 · "수정" → `/travel-tools`(SCR-003) 동행 탭(수정 모드) · 로그아웃 → `/`(SCR-001) |
| **Desktop·Mobile 규칙** | Desktop/Mobile 모두 `tab-underline` 유지, Mobile은 탭 라벨 축약 가능. 관리 영역은 Desktop 카드 그리드 → Mobile 세로 스택. 성인확인 등 민감 폼은 Mobile에서도 52px 입력 높이·44px 터치 영역 유지 |
| **금지 기능** | **관리 영역에 통계 차트·대시보드 시각화 금지**(D-001 규칙 — 목록+상태 변경 액션만 허용), 생년월일 저장/노출 금지(028, 성인확인 사실만 기록), 감사 로그·행동 분석 대시보드 금지(EXCLUDED 범위), Airbnb 상표 요소, 예약/결제 UI, D-001 토큰 외 임의 색상 |

---

## 기술 Route (Screen 수에 미포함)

| 구분 | Route | File | 근거 |
|---|---|---|---|
| Auth Callback | `/auth/callback` | `src/app/auth/callback/route.ts` | 이메일 인증/매직링크 콜백 처리(REQ-FUNC-066) — 화면 요소 없음 |
| API Route(대표) | `/api/mates` | `src/app/api/mates/route.ts` | 동행 모집글 생성(REQ-FUNC-031,032) |
| API Route(대표) | `/api/mates/[id]/requests` | `src/app/api/mates/[id]/requests/route.ts` | 참가 요청 생성/중복 차단(REQ-FUNC-034,035) |
| API Route(대표) | `/api/reports` | `src/app/api/reports/route.ts` | 신고 접수(REQ-FUNC-039) |
| API Route(대표) | `/api/admin/settings` | `src/app/api/admin/settings/route.ts` | 외부 URL HTTPS 허용목록 설정(REQ-FUNC-077) |
| Not Found | (미매칭 전체 경로) | `src/app/not-found.tsx` | REQ-FUNC-078, 별도 디자인 Screen으로 세지 않음 |
| Error Boundary | (렌더 오류) | `src/app/error.tsx` | REQ-FUNC-078 500 처리 |
| Unauthorized | (권한 없음) | `src/app/unauthorized.tsx` | REQ-FUNC-078 권한없음 처리 |

API Route 표는 5개 Screen이 필요로 하는 대표 쓰기 작업만 예시로 기록한 것이며, 전체 백엔드 API 인벤토리는 본 계약의 범위가 아니다.

---

## 완료 조건 자체 점검

- Route 중복 없음: `/`, `/about`, `/travel-tools`, `/mates`, `/account` — 5개 모두 고유
- Page Entry 중복 없음: `src/app/{page.tsx, about/page.tsx, travel-tools/page.tsx, mates/page.tsx, account/page.tsx}` — 5개 모두 고유
- Screen 수 5 (SCR-001~SCR-005)
- 핵심 4개(SCR-001, SCR-003, SCR-004, SCR-005) · 보조 1개(SCR-002) 구분 명시
