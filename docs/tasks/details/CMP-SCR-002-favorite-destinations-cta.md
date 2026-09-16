# CMP-SCR-002-favorite-destinations-cta — 기억에 남는 여행지 4개 + CTA

```task-meta
{
  "task_id": "CMP-SCR-002-favorite-destinations-cta",
  "type": "component",
  "depends_on": [
    "DATA-DESTINATIONS",
    "CMP-SCR-001-destination-detail-drawer"
  ],
  "requirements": [
    "REQ-FUNC-062",
    "REQ-FUNC-063"
  ]
}
```

## Context
이 Task는 SCR-002 화면이 필요로 하는 '기억에 남는 여행지 4개 + CTA' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-062, REQ-FUNC-063
- 정규화된 Requirement ID: REQ-FUNC-062, REQ-FUNC-063

## Screen / Route / Page Entry
- Screen: SCR-002
- Route: `/about`
- Page Entry: `src/app/about/page.tsx`(PO-SCR-002가 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Destination Card
- `design-reference/UI_CONTRACT.md` SCR-002 영역 순서·주요 Component·금지 기능 표

## Depends On
- DATA-DESTINATIONS
- CMP-SCR-001-destination-detail-drawer

## Expected Files
`src/components/screens/scr002/FavoriteDestinationsCta.tsx`

## Functional AC
- `card.destination` 4개(비공개 여행지는 자동 제외, 대체 후보 표시)를 SCR-001 상세 Drawer로 딥링크한다(REQ-FUNC-063).
  - CTA Banner "항공·숙소 준비하기"(`/travel-tools`), "동행과 함께 떠나기"(`/mates`)를 표시한다.
  - 관리자 설정 기반 문의·SNS 링크를 제공하며, 빈 링크는 렌더링하지 않고 허용 프로토콜(https)만 연다(REQ-FUNC-062).

## Visual AC
Card Grid(2×2) + CTA Banner.

## Security/Privacy AC
SNS 링크는 `INFRA-EXTERNAL-LINK-SAFETY` 규칙(허용 프로토콜만)을 따른다.

## Test Cases
- [Functional AC] `card.destination` 4개(비공개 여행지는 자동 제외, 대체 후보 표시)를 SCR-001 상세 Drawer로 딥링크한다(REQ-FUNC-063). — Verify: TEST-E2E-PUBLIC-SMOKE
- [Functional AC] CTA Banner "항공·숙소 준비하기"(`/travel-tools`), "동행과 함께 떠나기"(`/mates`)를 표시한다. — Verify: TEST-E2E-PUBLIC-SMOKE
- [Functional AC] 관리자 설정 기반 문의·SNS 링크를 제공하며, 빈 링크는 렌더링하지 않고 허용 프로토콜(https)만 연다(REQ-FUNC-062). — Verify: TEST-E2E-PUBLIC-SMOKE
- [Visual AC] Card Grid(2×2) + CTA Banner. — Verify: TEST-E2E-PUBLIC-SMOKE
- [Security/Privacy AC] SNS 링크는 `INFRA-EXTERNAL-LINK-SAFETY` 규칙(허용 프로토콜만)을 따른다. — Verify: TEST-E2E-PUBLIC-SMOKE

## Verify
TEST-E2E-PUBLIC-SMOKE

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-PUBLIC-SMOKE`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
