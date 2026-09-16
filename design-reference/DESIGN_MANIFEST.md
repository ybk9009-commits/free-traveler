# Design Manifest — Free Traveler

- **Active Design Version**: D-001
- **Status**: LOCKED
- **Active File**: `design-reference/D-001/DESIGN.md`
- **Vendor Reference**: `design-reference/vendor/airbnb/DESIGN.md` (구조 참고 전용 — 상표 요소 제외)
- **Approved Screens**: SCR-001, SCR-002, SCR-003, SCR-004, SCR-005
- **Mobile Variants**: SCR-001, SCR-003

`Status: LOCKED`인 동안 `design-reference/D-001/DESIGN.md`는 모든 화면 구현·리뷰의 단일 기준(Source of Truth)이며, 새 버전(D-002 등)을 만들지 않고 값을 임의로 덮어쓰지 않는다. 토큰·컴포넌트·Section 규칙 변경이 필요하면 새 디자인 버전 디렉터리를 만들고 이 매니페스트를 갱신한다.

---

## 1. 입력 문서 (Provenance)

| 문서 | 역할 |
|---|---|
| `design-reference/vendor/airbnb/DESIGN.md` | 구조적 참고(흰 캔버스·단일 액센트·사진 카드 그리드·1단계 그림자). 색상·서체·상표 요소는 채택하지 않음 |
| `docs/04_UIUX_PLAN.md` | 토큰·컴포넌트·Section 1차 설계, REQ-FUNC 매핑 |
| `docs/STITCH_VALIDATION_REPORT.md` | 승인된 Stitch Screen 검증 결과 (Project `8964223977379653134`) — 실제 구현 Section 순서·콘텐츠 수 대조 근거 |
| 승인된 Stitch Screen (Project `8964223977379653134`) | 최종 시각 정본. 아래 §2 Screen ID 참고 |

---

## 2. Approved Screen ID (정본)

`docs/STITCH_VALIDATION_REPORT.md` §3~4에서 확정한 정본 Screen ID. 동일 개념의 중복 인스턴스가 Stitch 프로젝트에 남아 있을 수 있으나(§3 참고), 디자인 정본 판단·구현 참조는 아래 ID를 기준으로 한다.

| Screen | Device | Screen ID (정본) |
|---|---|---|
| SCR-001 메인 홈 | Desktop | `ed83825ceb03488688eb9d1cf596299f` |
| SCR-001 메인 홈 | Mobile | `122747d136d240d48060a11b52a1dd1b` |
| SCR-002 대표 소개 | Desktop | `f20a34e02a2a4faeb323494b49025e9a` |
| SCR-003 여행 준비 | Desktop | `0c6bcab6b5854b52b95669d47cb23a26` |
| SCR-003 여행 준비 | Mobile | `5f146bb3c9684b6297c5a4e890d51272` |
| SCR-004 동행 찾기 | Desktop | `3c58152c8f314872acb81ef4f37bd328` |
| SCR-005 계정·관리자 콘솔(Member+Admin) | Desktop | `88c265bbe49740e3a2f1e03eccf8e750` |

SCR-002, SCR-004, SCR-005는 Mobile 변형이 승인 대상에 포함되지 않는다(§ Mobile Variants: SCR-001, SCR-003만 해당).

---

## 3. 금지 사항

`design-reference/D-001/DESIGN.md` § Do / Do Not과 동일하게 아래 4가지는 어떤 화면·컴포넌트에도 추가하지 않는다.

1. **Airbnb 상표 요소** — Rausch 색상, Airbnb Cereal 서체, "Guest favorite"/"NEW" 배지 스타일, 손그림 아이콘, 로고·워드마크
2. **구매·예약·결제 UI** — 인앱 예약 캘린더, 결제 폼, 실시간 항공권/호텔 가격, 광고, 별점(star-rating) UI
3. **Proprietary Font 파일** — Inter + 시스템 한글 폰트 스택 외 라이선스 폰트 파일
4. **디자인 토큰이 없는 임의 색상 추가** — `D-001/DESIGN.md` Color Token 표에 없는 hex 값

---

## 4. 변경 이력

| 버전 | 상태 | 날짜 | 비고 |
|---|---|---|---|
| D-001 | LOCKED | 2026-09-15 | Airbnb 참고본 + `04_UIUX_PLAN.md` + 승인된 Stitch Screen(SCR-001~005, SCR-001/003 Mobile)을 통합한 최초 정본 |
