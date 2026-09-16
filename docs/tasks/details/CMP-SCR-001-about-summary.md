# CMP-SCR-001-about-summary — 대표 소개 요약 카드

```task-meta
{
  "task_id": "CMP-SCR-001-about-summary",
  "type": "component",
  "depends_on": [
    "DATA-REPRESENTATIVE"
  ],
  "requirements": [
    "REQ-FUNC-057"
  ]
}
```

## Context
이 Task는 SCR-001 화면이 필요로 하는 '대표 소개 요약 카드' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-057
- 정규화된 Requirement ID: REQ-FUNC-057

## Screen / Route / Page Entry
- Screen: SCR-001
- Route: `/`
- Page Entry: `src/app/page.tsx`(PO-SCR-001이 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬
- `design-reference/UI_CONTRACT.md` SCR-001 영역 순서·주요 Component·금지 기능 표

## Depends On
- DATA-REPRESENTATIVE

## Expected Files
`src/components/screens/scr001/AboutSummary.tsx`

## Functional AC
- `DATA-REPRESENTATIVE`의 `displayName`/`tripCountLabel`/`countryCountLabel`을 그대로 표시하며 `/about`(`CMP-SCR-002-hero-profile`)과 값이 100% 일치해야 한다(REQ-FUNC-057, 단일 데이터 소스 사용으로 보증).
  - "대표 소개 더 보기" CTA는 `/about`로 이동한다.

## Visual AC
좌우 분할(이미지+텍스트) 레이아웃.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] `DATA-REPRESENTATIVE`의 `displayName`/`tripCountLabel`/`countryCountLabel`을 그대로 표시하며 `/about`(`CMP-SCR-002-hero-profile`)과 값이 100% 일치해야 한다(REQ-FUNC-057, 단일 데이터 소스 사용으로 보증). — Verify: TEST-E2E-PUBLIC-SMOKE(값 일치 assertion), TEST-DATA-VALIDATION
- [Functional AC] "대표 소개 더 보기" CTA는 `/about`로 이동한다. — Verify: TEST-E2E-PUBLIC-SMOKE(값 일치 assertion), TEST-DATA-VALIDATION
- [Visual AC] 좌우 분할(이미지+텍스트) 레이아웃. — Verify: TEST-E2E-PUBLIC-SMOKE(값 일치 assertion), TEST-DATA-VALIDATION

## Verify
TEST-E2E-PUBLIC-SMOKE(값 일치 assertion), TEST-DATA-VALIDATION

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-PUBLIC-SMOKE(값 일치 assertion), TEST-DATA-VALIDATION`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
