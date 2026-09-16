# CMP-SCR-005-admin — Admin 관리 영역(신고 큐·외부 URL)

```task-meta
{
  "task_id": "CMP-SCR-005-admin",
  "type": "component",
  "depends_on": [
    "API-ADMIN-SETTINGS"
  ],
  "requirements": [
    "REQ-FUNC-041",
    "REQ-FUNC-042",
    "REQ-FUNC-077"
  ]
}
```

## Context
이 Task는 SCR-005 화면이 필요로 하는 'Admin 관리 영역(신고 큐·외부 URL)' 기능을 제공한다. Implementation Status가 `IMPLEMENT(간소화)`인 것은 관리자 범위를 신고 처리·외부 URL 설정으로 한정하는 원칙(docs/PROJECT_SCOPE.md §2)에 따라 기능을 간소화했다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리 관리 영역은 통계 차트·대시보드 없이 목록+상태 변경 액션으로만 구성한다(§2).

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-077
- 정규화된 Requirement ID: REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-077

## Screen / Route / Page Entry
- Screen: SCR-005
- Route: `/account`
- Page Entry: `src/app/account/page.tsx`(PO-SCR-005가 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬
- `design-reference/UI_CONTRACT.md` SCR-005 영역 순서·주요 Component·금지 기능 표

## Depends On
- API-ADMIN-SETTINGS

## Expected Files
`src/components/screens/scr005/AdminConsole.tsx`

## Functional AC
- Moderator/Admin 역할에서만 "관리" 영역을 렌더링한다(일반 Member/Guest에게는 이 컴포넌트 자체를 렌더링하지 않는다 — role 판정은 서버에서 수행).
  - 신고 큐: 대상/사유코드/접수시각/상태 목록 + OPEN→RESOLVED/DISMISSED 상태 변경 + 대상 게시물 숨김 액션(REQ-FUNC-041, 042).
  - 외부 URL 설정: `FLIGHT_OUTBOUND_URL`/`HOTEL_OUTBOUND_URL` 등 HTTPS 허용목록 Form(REQ-FUNC-077).
  - **통계 차트·대시보드 시각화는 사용하지 않고 목록 + 상태 변경 액션으로만 구성한다**(D-001 § Do Not, `docs/PROJECT_SCOPE.md` §2).

## Visual AC
관리 Intro 1~2문장 + 목록형 UI(카드 그리드 아님).

## Security/Privacy AC
클라이언트에서 role을 신뢰하지 않고 `API-ADMIN-SETTINGS` 서버 측 role 검사에 의존한다.

## Test Cases
- [Functional AC] Moderator/Admin 역할에서만 "관리" 영역을 렌더링한다(일반 Member/Guest에게는 이 컴포넌트 자체를 렌더링하지 않는다 — role 판정은 서버에서 수행). — Verify: TEST-E2E-MATE-AUTH, TEST-RLS-BASIC
- [Functional AC] 신고 큐: 대상/사유코드/접수시각/상태 목록 + OPEN→RESOLVED/DISMISSED 상태 변경 + 대상 게시물 숨김 액션(REQ-FUNC-041, 042). — Verify: TEST-E2E-MATE-AUTH, TEST-RLS-BASIC
- [Functional AC] 외부 URL 설정: `FLIGHT_OUTBOUND_URL`/`HOTEL_OUTBOUND_URL` 등 HTTPS 허용목록 Form(REQ-FUNC-077). — Verify: TEST-E2E-MATE-AUTH, TEST-RLS-BASIC
- [Functional AC] **통계 차트·대시보드 시각화는 사용하지 않고 목록 + 상태 변경 액션으로만 구성한다**(D-001 § Do Not, `docs/PROJECT_SCOPE.md` §2). — Verify: TEST-E2E-MATE-AUTH, TEST-RLS-BASIC
- [Visual AC] 관리 Intro 1~2문장 + 목록형 UI(카드 그리드 아님). — Verify: TEST-E2E-MATE-AUTH, TEST-RLS-BASIC
- [Security/Privacy AC] 클라이언트에서 role을 신뢰하지 않고 `API-ADMIN-SETTINGS` 서버 측 role 검사에 의존한다. — Verify: TEST-E2E-MATE-AUTH, TEST-RLS-BASIC

## Verify
TEST-E2E-MATE-AUTH, TEST-RLS-BASIC

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-MATE-AUTH, TEST-RLS-BASIC`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
- 통계 차트·대시보드 시각화를 사용하지 않는다(목록 + 상태 변경 액션으로만 구성).
