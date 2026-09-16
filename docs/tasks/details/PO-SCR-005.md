# PO-SCR-005 — 계정·관리 화면 조립 (`/account`)

```task-meta
{
  "task_id": "PO-SCR-005",
  "type": "page_owner",
  "depends_on": [
    "CMP-SCR-005-auth",
    "CMP-SCR-005-profile",
    "CMP-SCR-005-my-activity",
    "CMP-SCR-005-admin",
    "CMP-COMMON-HEADER-FOOTER",
    "CMP-COMMON-EMPTY-STATE",
    "INFRA-AUTH-SESSION",
    "INFRA-USER-DELETE",
    "API-ADMIN-SETTINGS"
  ],
  "requirements": [
    "REQ-FUNC-027",
    "REQ-FUNC-028",
    "REQ-FUNC-029",
    "REQ-FUNC-036",
    "REQ-FUNC-037",
    "REQ-FUNC-038",
    "REQ-FUNC-040",
    "REQ-FUNC-041",
    "REQ-FUNC-042",
    "REQ-FUNC-045",
    "REQ-FUNC-064",
    "REQ-FUNC-065",
    "REQ-FUNC-066",
    "REQ-FUNC-068",
    "REQ-FUNC-077"
  ],
  "section_order": [
    "account-intro",
    "auth-card",
    "profile-and-activity-summary",
    "role-specific-management-console",
    "next-action-cta",
    "security-or-help-notice"
  ],
  "min_content_counts": {
    "member-benefits": 3,
    "admin-kpi-summary-cards": 4
  },
  "empty_state_required": true,
  "forbids_placeholder": true
}
```

## Context
이 Task는 SCR-005 화면이 필요로 하는 '계정·관리 화면 조립 (`/account`)' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-027~029, 036~038, 040~042, 045, 064, 065, 066, 068, 077
- 정규화된 Requirement ID: REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-040, REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-045, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-066, REQ-FUNC-068, REQ-FUNC-077

## Screen / Route / Page Entry
- Screen: SCR-005
- Route: `/account`
- Page Entry: `src/app/account/page.tsx`

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬
- `design-reference/UI_CONTRACT.md` SCR-005 영역 순서·주요 Component·금지 기능 표

## Depends On
- CMP-SCR-005-auth
- CMP-SCR-005-profile
- CMP-SCR-005-my-activity
- CMP-SCR-005-admin
- CMP-COMMON-HEADER-FOOTER
- CMP-COMMON-EMPTY-STATE
- INFRA-AUTH-SESSION
- INFRA-USER-DELETE
- API-ADMIN-SETTINGS

## Expected Files
`src/app/account/page.tsx`(신규 생성)

## Functional AC
- **역할별 조립(규칙 11)**: Auth(Guest), Profile(Member), My Activity(Member), Admin(Moderator/Admin)을 각각 독립 Component로 분리하고, **현재 세션 역할에 해당하지 않는 영역은 렌더링 자체를 하지 않는다**(props로 숨기는 CSS 방식 금지 — 서버에서 역할을 판정해 컴포넌트 트리에서 제외).
  - Guest·Member·Admin 중 현재 역할의 **Intro → 핵심 작업 → 도움말 또는 다음 행동** 순서를 지킨다(콘텐츠 계약).
    - Guest: 계정 Intro → 인증 Form(핵심 작업) → 회원 혜택 안내/보안 안내(도움말).
    - Member: 프로필/내 활동 탭 Intro → 프로필 편집·글 관리·신청 관리(핵심 작업) → 새 글 작성 CTA(다음 행동).
    - Admin: 관리 Intro → 신고 처리·외부 URL 설정(핵심 작업) → 처리 결과 상태(도움말).
  - Admin 관리 탭은 신고 상태 변경 + 외부 URL 설정 2개만 제공한다(콘텐츠 CRUD 탭 없음, `docs/PROJECT_SCOPE.md` §2).

## Visual AC
- Lorem ipsum·"준비 중"·빈 카드 금지.
  - 내 글/신청/차단 목록 0건은 완성형 Empty State 블록(`CMP-COMMON-EMPTY-STATE`)으로 대체한다.
  - 관리 영역은 통계 차트 없이 목록+상태 변경 액션으로만 구성한다.

## Security/Privacy AC
관리 탭은 클라이언트 role 값을 신뢰하지 않고, 서버(API-ADMIN-SETTINGS, 미들웨어)에서 role을 재검증한 뒤에만 렌더링 데이터를 채운다.

## Test Cases
- [Functional AC] **역할별 조립(규칙 11)**: Auth(Guest), Profile(Member), My Activity(Member), Admin(Moderator/Admin)을 각각 독립 Component로 분리하고, **현재 세션 역할에 해당하지 않는 영역은 렌더링 자체를 하지 않는다**(props로 숨기는 CSS 방식 금지 — 서버에서 역할을 판정해 컴포넌트 트리에서 제외). — Verify: TEST-E2E-MATE-AUTH, TEST-RLS-BASIC
- [Functional AC] Guest·Member·Admin 중 현재 역할의 **Intro → 핵심 작업 → 도움말 또는 다음 행동** 순서를 지킨다(콘텐츠 계약). — Verify: TEST-E2E-MATE-AUTH, TEST-RLS-BASIC
- [Functional AC] Guest: 계정 Intro → 인증 Form(핵심 작업) → 회원 혜택 안내/보안 안내(도움말). — Verify: TEST-E2E-MATE-AUTH, TEST-RLS-BASIC
- [Functional AC] Member: 프로필/내 활동 탭 Intro → 프로필 편집·글 관리·신청 관리(핵심 작업) → 새 글 작성 CTA(다음 행동). — Verify: TEST-E2E-MATE-AUTH, TEST-RLS-BASIC
- [Visual AC] Lorem ipsum·"준비 중"·빈 카드 금지. — Verify: TEST-E2E-MATE-AUTH, TEST-RLS-BASIC
- [Security/Privacy AC] 관리 탭은 클라이언트 role 값을 신뢰하지 않고, 서버(API-ADMIN-SETTINGS, 미들웨어)에서 role을 재검증한 뒤에만 렌더링 데이터를 채운다. — Verify: TEST-E2E-MATE-AUTH, TEST-RLS-BASIC

## Verify
TEST-E2E-MATE-AUTH, TEST-RLS-BASIC

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-MATE-AUTH, TEST-RLS-BASIC`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
- `python scripts/audit_tasks.py` 감사를 통과한다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
