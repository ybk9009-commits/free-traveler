---
version: D-001
name: Free-Traveler-Design-System
description: A white-canvas, photo-led travel information and travel-companion platform with a single coral accent, dark-ink Korean-first typography, rounded cards and pill search. Structurally derived from `design-reference/vendor/airbnb/DESIGN.md` (white canvas + single accent + photo-first card grid + restrained one-tier shadow) but with its own coral brand voltage, Inter + system Korean type, and no Airbnb trademark elements, booking UI, or payment UI anywhere in the system.
status: LOCKED
source_of_truth:
  - design-reference/vendor/airbnb/DESIGN.md (구조 참고 전용 — 상표 요소 제외)
  - docs/04_UIUX_PLAN.md (토큰·컴포넌트·Section 설계 1차 정의)
  - docs/STITCH_VALIDATION_REPORT.md (승인된 Stitch Screen 검증 결과)
  - 승인된 Stitch Screen (Project 8964223977379653134, SCR-001~SCR-005 + SCR-001/SCR-003 Mobile 변형)

colors:
  canvas: "#FFFFFF"
  surface-soft: "#F7F6F4"
  surface-strong: "#EFEDE9"
  ink: "#2A2A2E"
  body: "#54545A"
  muted: "#83838A"
  hairline: "#E3E2DE"
  border-strong: "#C7C6C1"
  primary: "#F4623A"
  primary-hover: "#D94F2B"
  primary-disabled: "#FBCFC0"
  primary-soft: "#FEEBE3"
  focus-ring: "#1D4ED8"
  danger: "#C1392B"
  danger-soft: "#FBE4E1"
  warning: "#B4700A"
  warning-soft: "#FBEEDA"
  success: "#1F7A52"
  info: "#2B5FAE"
  safety-caution: "#2C5FA8"
  safety-warning: "#C77700"
  safety-alert: "#C1352B"
  safety-ban: "#1F1F1F"
  scrim: "rgba(20,20,20,0.5)"

typography:
  fontFamily: "'Inter', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
  display-xl: { size: 34px, weight: 700, lineHeight: 1.3 }
  display-lg: { size: 26px, weight: 700, lineHeight: 1.35 }
  display-md: { size: 20px, weight: 600, lineHeight: 1.4 }
  title-md: { size: 18px, weight: 600, lineHeight: 1.4 }
  title-sm: { size: 15px, weight: 600, lineHeight: 1.4 }
  body-md: { size: 16px, weight: 400, lineHeight: 1.65 }
  body-sm: { size: 14px, weight: 400, lineHeight: 1.6 }
  caption: { size: 13px, weight: 500, lineHeight: 1.4 }
  button-md: { size: 16px, weight: 600, lineHeight: 1.2 }
  button-sm: { size: 14px, weight: 600, lineHeight: 1.2 }
  link: { size: 14px, weight: 500, lineHeight: 1.5 }

rounded:
  sm: 8px   # 버튼, 입력창
  md: 12px  # 기본 카드
  lg: 16px  # Hero 카드, 이미지 큰 카드
  full: 9999px  # 칩, 배지, 검색바, 아바타

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section-desktop: 64-96px
  section-mobile: 40-64px
  content-max: 1200-1280px

elevation:
  card-rest: none (1px hairline border only)
  card-hover: "0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.08)"
  drawer-modal: "0 8px 24px rgba(0,0,0,.16) + {colors.scrim} 배경"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    height: 48px
    typography: "{typography.button-md}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    height: 48px
  button-secondary:
    backgroundColor: "{colors.canvas}"
    border: "1px solid {colors.ink}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: 48px
  button-tertiary-text:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    height: 44px
  chip:
    backgroundColor: "{colors.canvas} (기본) / {colors.primary-soft} (선택)"
    textColor: "{colors.body} (기본) / {colors.primary} (선택)"
    rounded: "{rounded.full}"
    height: 40px
  card-destination:
    photo: "4:3, {rounded.lg} 클리핑"
    meta: "제목 {typography.title-md} + 지역 {typography.body-sm} muted + 추천 시기 캡션 칩"
    action: "우상단 즐겨찾기 아이콘 버튼(44px 히트 영역)"
  card-safety:
    content: "국기/국가명 + 경보단계 배지(색상+텍스트) + 최종 확인일 캡션 + 7일 초과 시 stale 경고 배지"
  card-mate:
    content: "제목 {typography.title-md} + 국가·기간·모집인원 메타 행 + 여행 스타일 칩 1~2개 + 모집상태 배지(모집중/마감)"
  card-timeline-item:
    content: "연도 캡션 + 장소 제목 + 2줄 요약"
  tab-underline:
    active: "{colors.ink} 텍스트 + 2px {colors.primary} 밑줄"
    inactive: "{colors.muted} 텍스트"
  form-input:
    backgroundColor: "{colors.canvas}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.sm}"
    height: 52px
    focus: "2px {colors.focus-ring} 테두리"
    error: "{colors.danger} 테두리 + 아이콘+텍스트 오류 문구"
  drawer-desktop:
    position: "우측 슬라이드인, 480-560px 폭, 전체 높이"
    elevation: "{elevation.drawer-modal}"
  drawer-mobile-sheet:
    position: "하단 풀스크린 시트"
  badge:
    모집중: "{colors.primary-soft} 배경 + {colors.primary} 텍스트"
    마감: "{colors.surface-strong} 배경 + {colors.muted} 텍스트"
    stale경고: "{colors.warning-soft} 배경 + {colors.warning} 텍스트"
    경보1~4단계: "{colors.safety-*} 텍스트 + 옅은 배경 + 텍스트 라벨 필수"
    오류: "{colors.danger-soft} 배경 + {colors.danger} 텍스트"
  toast:
    position: "우하단(Desktop) / 상단(Mobile)"
    rounded: "{rounded.md}"
    duration: "3-5초 자동 소멸 + 수동 닫기"
  header:
    height: "72px(Desktop) / 로고+햄버거(Mobile)"
    border: "하단 1px {colors.hairline}"
  footer:
    backgroundColor: "{colors.surface-soft}"
    layout: "3열(Desktop) → 1열(Mobile)"
---

## Overview

Free Traveler는 `design-reference/vendor/airbnb/DESIGN.md`에서 **"흰 캔버스 + 단일 액센트 컬러 + 사진 중심 카드 그리드 + 절제된 한 단계 그림자"**라는 구조적 접근만 차용한 여행 정보·동행 매칭 플랫폼이다. 기본 캔버스는 순백(`{colors.canvas}` #FFFFFF)이고 짙은 잉크 톤(`{colors.ink}` #2A2A2E)이 제목·본문을 담당하며, 단일 액센트인 코랄(`{colors.primary}` #F4623A)이 모든 주요 CTA·활성 탭 밑줄·선택 칩·즐겨찾기 활성 상태를 담당한다. Airbnb의 Rausch(#ff385c)와는 색상·명도가 분명히 다르며, 두 번째 브랜드 컬러 없이 코랄 하나만 절제되게 사용한다.

타이포그래피는 Inter를 기본으로 하고 한글 글리프는 시스템 한글 폰트(Apple SD Gothic Neo, Malgun Gothic)가 대체한다. Airbnb Cereal VF 같은 **Proprietary Font 파일은 사용하지 않는다.** 한글 가독성을 위해 본문 줄간격을 1.6~1.65로 Airbnb(1.43~1.5)보다 넉넉하게 잡았다.

형태 언어는 버튼·입력창 8px, 기본 카드 12px, Hero/큰 이미지 카드 16px, 칩·배지·검색바·아바타는 완전 원형(9999px)으로 부드럽다. 카드는 정지 상태에서 그림자 없이 1px 헤어라인 테두리만 사용하고, hover 시에만 `{elevation.card-hover}` 한 단계 그림자를 얹는다 — Airbnb의 "단일 그림자 티어" 원칙을 그대로 계승한다.

**본 문서는 승인된 Stitch Screen(Project `8964223977379653134`, `docs/STITCH_VALIDATION_REPORT.md` 기준 정본 7개 화면 인스턴스: SCR-001 Desktop/Mobile, SCR-002, SCR-003 Desktop/Mobile, SCR-004, SCR-005)의 실제 구현 내용과 `docs/04_UIUX_PLAN.md`의 설계를 통합한 정본(D-001)이며, 이후 모든 화면 구현은 이 문서를 기준으로 한다.**

---

## Color Token

| 토큰 | 값 | 용도 |
|---|---|---|
| `{colors.canvas}` | #FFFFFF | 기본 배경 |
| `{colors.surface-soft}` | #F7F6F4 | 카드 그룹 배경, Footer 배경, 비활성 필드 |
| `{colors.surface-strong}` | #EFEDE9 | 강조 서브 배경, 아이콘 버튼 배경 |
| `{colors.ink}` | #2A2A2E | 제목·본문 기본 텍스트 |
| `{colors.body}` | #54545A | 본문 보조 텍스트, 카드 메타 |
| `{colors.muted}` | #83838A | 캡션, 비활성 라벨, 타임스탬프 |
| `{colors.hairline}` | #E3E2DE | 1px 구분선, 카드 테두리 |
| `{colors.border-strong}` | #C7C6C1 | 비포커스 입력 테두리, 비활성 버튼 테두리 |
| `{colors.primary}` | #F4623A | 주요 CTA, 활성 탭 밑줄, 링크, 즐겨찾기 활성 |
| `{colors.primary-hover}` | #D94F2B | 코랄 버튼 hover/active |
| `{colors.primary-disabled}` | #FBCFC0 | 비활성 코랄 버튼 |
| `{colors.primary-soft}` | #FEEBE3 | 코랄 배경 톤(칩 선택, 배지 배경) |
| `{colors.focus-ring}` | #1D4ED8 | 키보드 포커스 링(코랄과 명확히 구분) |
| `{colors.danger}` / `{colors.danger-soft}` | #C1392B / #FBE4E1 | 오류 텍스트·아이콘 / 오류 배경 |
| `{colors.warning}` / `{colors.warning-soft}` | #B4700A / #FBEEDA | 경고(모집 마감 임박 등) / 경고 배경 |
| `{colors.success}` | #1F7A52 | 제출 완료, 승인 상태 |
| `{colors.info}` | #2B5FAE | 안내·정보성 배지 |
| `{colors.safety-caution}` | #2C5FA8 (남색) | 여행경보 1단계 "여행유의" |
| `{colors.safety-warning}` | #C77700 (황색) | 여행경보 2단계 "여행자제" |
| `{colors.safety-alert}` | #C1352B (적색) | 여행경보 3단계 "철수권고" |
| `{colors.safety-ban}` | #1F1F1F (흑색) | 여행경보 4단계 "여행금지" |
| `{colors.scrim}` | rgba(20,20,20,.5) | Drawer/Modal 배경 스크림 |

**규칙**: 경보·오류·경고 색상은 코랄과 색상 계열이 다르며, 어떤 상태 배지도 색상만으로 의미를 전달하지 않고 반드시 텍스트 라벨을 함께 표기한다(§ Alert·Toast 참고). 위 표에 없는 색상은 신규 추가하지 않는다(§ Do / Do Not).

---

## Typography

기본 폰트: `'Inter', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`

| 토큰 | 크기 | 굵기 | 줄간격 | 용도 |
|---|---:|---:|---:|---|
| `{typography.display-xl}` | 34px | 700 | 1.3 | SCR-001/002 Hero H1 |
| `{typography.display-lg}` | 26px | 700 | 1.35 | Section 제목(H2) |
| `{typography.display-md}` | 20px | 600 | 1.4 | 서브섹션 제목, Drawer 헤더 |
| `{typography.title-md}` | 18px | 600 | 1.4 | Card 제목 |
| `{typography.title-sm}` | 15px | 600 | 1.4 | 탭 라벨, Footer 컬럼 제목 |
| `{typography.body-md}` | 16px | 400 | 1.65 | 본문 문단(한글 가독성 확대) |
| `{typography.body-sm}` | 14px | 400 | 1.6 | 카드 메타, 폼 도움말 |
| `{typography.caption}` | 13px | 500 | 1.4 | 배지, 라벨, 타임스탬프 |
| `{typography.button-md}` | 16px | 600 | 1.2 | 기본 버튼 |
| `{typography.button-sm}` | 14px | 600 | 1.2 | 보조 버튼, Chip |
| `{typography.link}` | 14px | 500 | 1.5 | 인라인 링크(밑줄은 hover/focus 시) |

Airbnb는 "사진이 위계를 대신하므로 Display를 절제"하는 원칙을 쓰지만, Free Traveler는 한글 스캐닝 가독성을 위해 Display 굵기를 Airbnb(500~600)보다 한 단계 무겁게(700) 잡는다 — 유일하게 구조를 벗어나는 지점이며, Rating-display(64px)처럼 브랜드 상표적인 대형 타이포 모먼트는 두지 않는다.

---

## Spacing

| 토큰 | 값 |
|---|---|
| `{spacing.xs}` | 4px |
| `{spacing.sm}` | 8px |
| `{spacing.md}` | 12px |
| `{spacing.base}` | 16px |
| `{spacing.lg}` | 24px |
| `{spacing.xl}` | 32px |
| `{spacing.xxl}` | 48px |
| `{spacing.section-desktop}` | 64-96px (Section 상하 여백, Desktop) |
| `{spacing.section-mobile}` | 40-64px (Section 상하 여백, Mobile) |
| `{spacing.content-max}` | 1200-1280px (Desktop 콘텐츠 최대 폭) |

카드 내부 패딩은 `{spacing.lg}`(24px, Drawer/안전정보 카드), 카드 그리드 간격은 `{spacing.base}`(16px)를 기본으로 한다. Airbnb의 section(64px) 단일 값과 달리 Free Traveler는 64~96px 범위를 허용해 Section 성격(Hero 직후는 좁게, 콘텐츠 밀도 낮은 Section은 넓게)에 따라 조정한다.

---

## Radius

| 토큰 | 값 | 대상 |
|---|---|---|
| `{rounded.sm}` | 8px | 버튼, 입력창 |
| `{rounded.md}` | 12px | 기본 카드 |
| `{rounded.lg}` | 16px | Hero 카드, 이미지 큰 카드, Destination Card 사진 |
| `{rounded.full}` | 9999px | 칩, 배지, 검색바, 아바타, 아이콘 버튼 |

정의되지 않은 radius 값(예: Airbnb의 32px 카테고리 스트립 radius)은 사용하지 않는다.

---

## Shadow (Elevation)

Airbnb와 동일하게 **한 단계 그림자 티어**만 허용한다.

- `{elevation.card-rest}`: none — 카드 정지 상태는 1px `{colors.hairline}` 테두리만 사용
- `{elevation.card-hover}`: `0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.08)` — 카드 hover
- `{elevation.drawer-modal}`: `0 8px 24px rgba(0,0,0,.16)` + `{colors.scrim}` 배경 — Drawer/Modal 전용

두 단계 이상의 elevation 체계(예: Material Design의 dp 레이어)는 도입하지 않는다.

---

## Header · Footer

### Header (SCR-001~SCR-005 공통)
- 구성: 좌측 `Free Traveler` 텍스트 워드마크(`{colors.ink}`, 로고 마크 없음) · 중앙 내비게이션(여행지 / 여행 준비 / 동행 찾기 / 대표 소개) · 우측 계정 영역(비로그인 "로그인" 텍스트 버튼 / 로그인 시 아바타+닉네임 메뉴).
- Desktop 72px 높이, 흰 배경, 하단 1px `{colors.hairline}`. Mobile(<744px)은 로고+햄버거로 축약, 내비게이션은 풀스크린 시트.
- 활성 라우트는 `{colors.primary}` 텍스트 + 하단 2px 코랄 밑줄.
- 내비게이션 4개 항목은 SCR-001(`/`)·SCR-002(`/about`)·SCR-003(`/travel-tools`)·SCR-004(`/mates`)로 직접 연결, 계정 영역은 SCR-005(`/account`)로 연결.

### Footer (SCR-001~SCR-005 공통)
- Desktop 3열: 서비스 소개(브랜드 한 줄 + 여행 준비/동행 찾기/대표 소개 링크) · 정책(이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책) · 안전 정보 출처(외교부 해외안전여행 링크 + "정보는 참고용이며 출국 전 공식 출처 재확인이 필요합니다" 고지).
- 하단 legal band: `© Free Traveler` + 문의 링크. Mobile은 1열 스택.
- 배경 `{colors.surface-soft}`로 본문 캔버스와 미세하게 구분한다.

---

## Search · Filter

- **Hero 통합 검색(SCR-001)**: 검색바는 완전 원형(`{rounded.full}`) 흰 배경 pill, 여행지/테마 키워드 입력 1개 필드 + 보조 CTA "항공·숙소 준비하기"(→ SCR-003). Airbnb처럼 Where/When/Who 3분할 세그먼트 구조는 사용하지 않는다(숙박 예약 UI가 아니므로).
- **조건 입력 Form(SCR-003, 항공/숙소 탭)**: 국가 Select → 지역 Select(국가 종속) → 날짜 2개(출발/귀국 또는 체크인/체크아웃). 실시간 검증 오류는 `{colors.danger}` 테두리 + 하단 오류 문구.
- **검색 Filter(SCR-004)**: 국가 · 지역 · 기간 · 모집 상태 Filter + "N건의 동행글" 결과 요약. 결과 0건 시 § Loading·Empty·Error의 Empty 규칙을 따른다.
- 모든 검색/필터 입력값은 서버에 저장되지 않으며, 항공·숙소 조건은 외부 사이트 이동 전 요약 카드로만 노출한다(예약·결제 UI 금지, § Do / Do Not).

---

## Destination Card

`card-destination` (SCR-001 국내/해외 여행지, SCR-002 "다시 가고 싶은 여행지"):
- 이미지: 4:3 비율, `{rounded.lg}`(16px) 코너 클리핑, 상단 배치.
- 메타: 제목 `{typography.title-md}` + 지역/국가 `{typography.body-sm}`(muted) + 추천 시기 캡션 칩.
- 우상단 즐겨찾기 아이콘 버튼(시각적 크기는 작아도 44×44px 히트 영역 확보).
- 정지 상태 그림자 없음, hover 시 `{elevation.card-hover}`.
- 모든 이미지는 실제 장소를 설명하는 alt 텍스트를 가진다(예: "제주 성산일출봉 전경") — 일반적인 "이미지"/"사진" 라벨 금지.
- 해외 카드는 국기 배지를 추가로 포함할 수 있다.

---

## Form · Tabs

### Form Input
- 흰 배경, 1px `{colors.hairline}` 테두리, `{rounded.sm}`(8px), 높이 52px. 라벨은 필드 위 `{typography.caption}`.
- 포커스 시 2px `{colors.focus-ring}` 테두리(`outline: none`으로 제거 금지). 오류 시 `{colors.danger}` 테두리 + 아이콘+텍스트 오류 문구, `aria-describedby`로 연결.

### Tabs
- `tab-underline` 스타일 단일 패턴만 사용: 활성 = `{colors.ink}` 텍스트 + 2px `{colors.primary}` 밑줄, 비활성 = `{colors.muted}`.
- 적용 화면: SCR-003(항공편 / 숙소 / 동행 구하기), SCR-005(프로필 / 내 활동, 로그인 시 "관리" 탭 추가 — Admin 역할에 한함. 관리 탭이 별도 세그먼트/토글로 구현된 경우도 동일한 밑줄 tab 시각 언어를 따른다).
- 탭 전환 시 다른 탭의 입력 상태는 세션 동안 유지하되, 검증·제출 상태는 탭별로 독립 관리한다.

---

## Mate Post Card

`card-mate` (SCR-001 "최근 동행", SCR-004 동행 목록, SCR-005 "내가 쓴 동행 글"):
- 제목 `{typography.title-md}`, 국가·기간·모집인원 메타 행, 여행 스타일 칩 1~2개, 모집상태 배지(모집중/마감).
- SCR-004는 Desktop 기준 좌측 목록(Card Grid, 최대 8개 우선 노출 + "더 보기") + 우측 상세 패널의 분할(split-panel) 레이아웃을 사용한다. Mobile은 목록 → 상세 Drawer(하단 시트) 전환.
- 참가 요청은 비공개 메시지로만 진행하며, 작성자 연락처는 카드·상세 어디에도 노출하지 않는다.
- 신뢰도 표기가 필요한 경우 Airbnb식 별점 대신 텍스트 기반 상태(예: 인증 배지)만 사용한다 — 숫자 신뢰도 점수를 쓰더라도 별 아이콘 형태의 star-rating UI는 사용하지 않는다(§ Do / Do Not).

---

## Drawer · Modal

- **Desktop**: 우측에서 슬라이드인, 폭 480-560px, 전체 높이, `{elevation.drawer-modal}`. 여행지 상세, 안전정보 상세, 동행 상세(Mobile 한정) 등에 사용.
- **Mobile**: 하단에서 슬라이드업하는 풀스크린 시트로 전환.
- 상단 고정 헤더(제목 + 44px 닫기 버튼), 본문 스크롤 가능, 하단 고정 CTA 영역은 선택적으로 배치.
- Modal 배경은 항상 `{colors.scrim}`을 사용하며 배경 클릭 시 닫힘 + `Esc` 키 닫힘을 함께 지원한다.

---

## Alert · Toast

### Alert / Badge
| 배지 | 색상 | 텍스트 예시 |
|---|---|---|
| 모집중 | `{colors.primary-soft}` 배경 + `{colors.primary}` 텍스트 | "모집중" |
| 마감 | `{colors.surface-strong}` 배경 + `{colors.muted}` 텍스트 | "마감" |
| stale 경고 | `{colors.warning-soft}` 배경 + `{colors.warning}` 텍스트 | "최신 정보 재확인 필요" |
| 여행경보 1~4단계 | `{colors.safety-*}` 텍스트 + 옅은 배경 | "여행유의" / "여행자제" / "철수권고" / "여행금지" |
| 오류 | `{colors.danger-soft}` 배경 + `{colors.danger}` 텍스트 | "입력값을 확인해 주세요" |

모든 상태 배지는 색상 단독이 아니라 **색상 + 텍스트 라벨 + (필요 시) 아이콘**의 3중 표기를 기본으로 한다.

### Toast
- 위치: 우하단(Desktop) / 상단(Mobile) 고정, `{rounded.md}`, 3~5초 자동 소멸 + 수동 닫기 버튼.
- 성공은 `{colors.success}` 아이콘, 오류는 `{colors.danger}` 아이콘을 좌측에 배치.

---

## Loading · Empty · Error 상태

각 화면은 실제로 발생 가능한 상태만 정의한다(표에 없는 조합은 만들지 않는다).

| Screen | Loading | Empty | Error |
|---|---|---|---|
| SCR-001 | 카드 스켈레톤(여행지/안전/동행 섹션) | 최근 동행글 0건 → Empty State 블록 | 안전정보 원문 링크 실패 시 인라인 오류 |
| SCR-002 | 이미지 lazy 로딩 placeholder | 정적 콘텐츠라 발생하지 않음 | 이미지 로드 실패 시 대체 배경 + alt 텍스트 |
| SCR-003 | 외부 이동 버튼/제출 시 스피너 | 폼 화면이라 해당 없음 | 날짜 검증 오류, 연락처 탐지 차단, 외부 URL 실패(재시도 버튼) |
| SCR-004 | 목록 스켈레톤 | 검색 결과 0건 / 전체 글 0건 → Empty State 블록 | 중복 신청 오류, 신청 실패 오류 |
| SCR-005 | 로그인 처리 중 스피너, 목록 로딩 스켈레톤 | 내 글/신청/차단 목록 0건 → Empty State 블록 | 로그인 실패, 프로필/모집글 폼 검증 오류 |

### Empty State 블록 (완성형, 3요소 고정)
모든 Empty State는 다음 3요소를 반드시 포함한다:
1. **상황 설명 한 문장** — 왜 비어 있는지
2. **이용 방법 또는 조건 안내**
3. **다음 행동 CTA 버튼**

아이콘/일러스트는 장식용으로만 두며, 텍스트 없이 아이콘만 두는 Empty State는 만들지 않는다.

---

## Desktop · Mobile 규칙

| 기준 | 값 | 비고 |
|---|---|---|
| Desktop 기준폭 | 1440px | 콘텐츠는 `{spacing.content-max}`(1200-1280px)로 중앙 정렬, 여백은 좌우로 흡수 |
| Mobile 기준폭 | 390px | 좌우 여백 16-20px, Card 1열 |
| Tablet(744-1279px) | 2열 Card Grid | Header 내비게이션 유지, 라벨은 축약 가능 |

- 접근성: 키보드 포커스는 항상 `{colors.focus-ring}` 2px 아웃라인 + 2px 오프셋으로 표시(제거 금지). 모든 클릭 가능 요소는 최소 44×44px 터치 영역. 텍스트 대비 WCAG 2.2 AA(4.5:1) 이상.
- Header/Footer 축약 규칙, Drawer→Bottom Sheet 전환 규칙은 각각 § Header·Footer, § Drawer·Modal 참고.
- SCR-004 목록+상세 분할 레이아웃은 Mobile에서 목록 단일 컬럼 + 상세는 Drawer(Bottom Sheet)로 전환한다(좌우 분할 유지 금지).

---

## Page Section 최대 폭과 Desktop·Mobile 상하 여백

- **Desktop 콘텐츠 최대 폭**: `{spacing.content-max}` 1200-1280px, 1440px 캔버스 중앙 정렬.
- **Section 상하 여백**: Desktop `{spacing.section-desktop}`(64-96px), Mobile `{spacing.section-mobile}`(40-64px).
- Section 사이 여백은 콘텐츠 밀도에 따라 범위 내에서 조정하되, 동일 화면 안에서 임의의 값(예: 120px)을 추가하지 않는다.

---

## Hero 높이와 첫 화면에서 다음 Section을 보여주는 규칙

- Hero는 Desktop 기준 화면 높이의 **60~70%(약 520-600px)**만 차지한다.
- 1440px 데스크톱 화면에서 최초 로드 시 다음 Section의 상단 일부가 반드시 보여야 한다 — Hero 아래 긴 빈 공간을 두지 않는다.
- 승인된 SCR-001/SCR-002 Stitch 화면 검증 결과 Hero 직후 검색바/콘텐츠가 즉시 이어지는 구조가 확인되었으며(`docs/STITCH_VALIDATION_REPORT.md` §2-12), 이 규칙을 정본 기준으로 고정한다.

---

## Section별 제목·설명·본문·CTA 계층과 시각적 리듬

각 Section은 다음 4계층을 기본으로 한다(계층이 비면 안 됨, 단 CTA는 정보성 Section에서 등급 배지 등으로 대체 가능):

1. **제목** — `{typography.display-lg}`(26px/700), Section의 목적을 한 문장 이하로 요약
2. **설명** — `{typography.body-md}` 1~2문장, 왜/어떻게 이 Section을 쓰는지
3. **본문(콘텐츠)** — Card Grid / Timeline / Gallery / Form / Chip 목록 등
4. **CTA(선택)** — "모두 보기" / "작성하기" 같은 다음 행동 링크·버튼. 안전정보 Section처럼 경보 배지가 핵심 정보인 경우 CTA 대신 배지로 대체 가능

**시각적 리듬**: 동일한 Card Grid 레이아웃만 반복하지 않도록 화면마다 Hero → Card Grid → 좌우 분할(이미지+텍스트) → Chip 목록 → 3단계 안내 → CTA Banner 패턴을 교차 배치한다. Airbnb의 "열린 Hero, 밀도 높은 마켓플레이스"라는 대비 원칙을 계승하되, 카드 간 간격은 `{spacing.base}`(16px)로 통일한다.

---

## 화면별 Section 순서와 Card·Timeline·Gallery 최소 콘텐츠 수

아래 순서·최소 수는 `docs/04_UIUX_PLAN.md` 설계와 승인된 Stitch Screen 실제 구현(`docs/STITCH_VALIDATION_REPORT.md`)을 대조하여 확정한 정본 기준이다.

### SCR-001 `/` 메인 (Header–Footer 사이 7 Section)
1. 검색 Hero — 통합 검색 입력 + 보조 CTA
2. 국내 인기 여행지 — `card-destination` **최소 6개**
3. 해외 인기 여행지 — `card-destination` **최소 6개**
4. 여행 테마 — Chip **최소 6개**
5. 국가별 안전정보 — `card-safety` **최소 6개**
6. 최근 동행 — `card-mate` **최대 3개 노출**(Success) 또는 Empty State
7. 대표 소개 요약 — 수치 카드(50+ Trips / 30+ Countries 등) + CTA → SCR-002

### SCR-002 `/about` 대표 소개 (7 Section)
1. Hero(대표 사진 + 소개 문장)
2. 여행 지표 — 지표 카드 **최소 3개**
3. 소개 — 문단 **최소 2개**
4. 여행 타임라인 — `card-timeline-item` **최소 6개**
5. 방문 국가 — 권역 **최소 4그룹** × 국가 Chip
6. 여행 사진 Gallery — 이미지 **최소 8장**(각 alt 텍스트 필수)
7. 기억에 남는 여행지 — `card-destination` **최소 4개** + CTA Banner

### SCR-003 `/travel-tools` 여행 준비 (공용 2 + 탭별 4 Section)
1. Intro — 3단계 안내(조건 입력 → 요약 확인 → 이동/작성)
2. 탭 전환 — 항공편 / 숙소 / 동행 구하기 **3개 탭 모두 존재**
3. 조건 입력 Form(항공/숙소 탭)
4. 입력 요약 + 외부 이동 Action Card(항공/숙소 탭) — 실시간 가격·예약 UI 금지
5. 고지 + Tip **최소 3개**(항공/숙소 탭)
6. 동행 구하기(동행 탭) — 미인증 시 안내 카드, 인증 시 모집글 Form

### SCR-004 `/mates` 동행 조회 (6 Section)
1. Intro + CTA Banner
2. 검색 Filter(국가/지역/기간/모집상태)
3. 목록 — `card-mate` **최대 8개 우선 노출** + 더 보기
4. 상세 — Desktop 좌(목록)우(상세) 분할 / Mobile 목록→상세 Drawer
5. 신청 방법 안내 — 3단계
6. 안전 안내 — CTA Banner

### SCR-005 `/account` 계정·관리 (역할별 가변)
- **Guest**: 계정 Intro · 인증 Card(로그인/가입/비밀번호 재설정) · 회원 혜택 안내(**최소 3개 항목**) · 보안 안내
- **Member**(탭: 프로필 / 내 활동): 프로필 요약, 내가 쓴 동행 글, 받은/보낸 참가 요청, 차단 목록, 새 동행 글 작성 CTA — 목록형 Section은 0건 시 Empty State 블록으로 대체
- **Admin**(위 탭에 "관리" 영역 추가, 승인된 Stitch 정본 `88c265bbe49740e3a2f1e03eccf8e750` 기준): 관리 Intro, 핵심 KPI 요약 카드 **최소 4개**, 신고 및 긴급 대응 현황, 회원/본인인증 심사 대기, 동행 게시물 검수, 외부 URL·안전정보 동기화 설정 — 통계 차트·대시보드 형태 대신 **목록 + 상태 변경 액션**으로만 구성

---

## 완성형 Empty State와 Placeholder 문구 금지 규칙

- Lorem ipsum, "준비 중", "정보 확인 필요"와 같은 자리표시 문구를 어떤 화면에도 사용하지 않는다.
- 의미 없는 빈 카드(제목만 있고 본문이 없는 카드)를 두지 않는다.
- 콘텐츠 소스가 비어 있는 상태(DB/정적 데이터 없음)에도 반드시 § Loading·Empty·Error의 **완성형 Empty State 블록**(상황 설명 + 이용 방법 + CTA)으로 대체한다 — 빈 화면이나 스피너만 무한 노출하지 않는다.
- 모든 이미지는 실제 장소·상황을 설명하는 alt 텍스트를 가진다. 일반적인 "이미지"/"사진" 라벨은 금지한다.

---

## Do / Do Not

### Do
- 흰 캔버스 + 코랄 단일 액센트 + 사진 중심 카드 그리드 + 절제된 1단계 그림자 구조를 유지한다.
- 모든 색상·타이포·radius·spacing 값은 본 문서 상단 토큰 표에서만 가져온다.
- 모든 상태 배지는 색상 + 텍스트 라벨을 함께 표기한다.
- 모든 Empty State는 3요소(상황 설명 + 이용 방법 + CTA) 완성형으로 만든다.
- Section은 제목·설명·본문(+선택적 CTA) 4계층 구조를 지킨다.
- Hero는 Desktop 뷰포트의 60-70%로 제한해 다음 Section이 첫 화면에 보이게 한다.

### Do Not
- **Airbnb 상표 요소** 금지 — Rausch(#ff385c) 등 Airbnb 고유 색상, Airbnb Cereal 서체, "Guest favorite"/"NEW" 배지 스타일, 손그림 아이콘, Airbnb 로고·워드마크를 사용하지 않는다.
- **구매·예약·결제 UI** 금지 — 항공/숙소는 조건 요약 후 외부 사이트로 링크 이동만 하며, 인앱 예약 캘린더·결제 폼·가격 확정 UI를 만들지 않는다. 실시간 항공권/호텔 가격, 광고, 별점(star-rating) UI도 금지한다.
- **Proprietary Font 파일** 금지 — Inter + 시스템 한글 폰트 스택 외의 라이선스 폰트 파일을 프로젝트에 포함하지 않는다.
- **디자인 토큰이 없는 임의 색상 추가** 금지 — 본 문서 Color Token 표에 없는 hex 값을 코드/디자인에 새로 도입하지 않는다. 새 색상이 필요하면 이 문서를 먼저 개정한다.
- 동일한 Card Grid 레이아웃만 반복해 Section 리듬이 단조로워지는 구성을 하지 않는다.
- Lorem ipsum, "준비 중", "정보 확인 필요" 등 자리표시 문구를 사용하지 않는다.
