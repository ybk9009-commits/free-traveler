# CMP-SCR-002-countries-gallery — 방문 국가 30개 + 사진 Gallery 8개

```task-meta
{
  "task_id": "CMP-SCR-002-countries-gallery",
  "type": "component",
  "depends_on": [
    "DATA-REPRESENTATIVE"
  ],
  "requirements": [
    "REQ-FUNC-059",
    "REQ-FUNC-061",
    "REQ-NF-006"
  ]
}
```

## Context
이 Task는 SCR-002 화면이 필요로 하는 '방문 국가 30개 + 사진 Gallery 8개' 기능을 제공한다. Implementation Status가 `IMPLEMENT(축소)`인 것은 자동화·모니터링 인프라를 최소화하는 원칙(docs/PROJECT_SCOPE.md §1)에 따라 범위를 축소했다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-059(축소), REQ-FUNC-061(축소), REQ-NF-006
- 정규화된 Requirement ID: REQ-FUNC-059, REQ-FUNC-061, REQ-NF-006

## Screen / Route / Page Entry
- Screen: SCR-002
- Route: `/about`
- Page Entry: `src/app/about/page.tsx`(PO-SCR-002가 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Destination Card
- `design-reference/UI_CONTRACT.md` SCR-002 영역 순서·주요 Component·금지 기능 표

## Depends On
- DATA-REPRESENTATIVE

## Expected Files
`src/components/screens/scr002/CountriesGallery.tsx`

## Functional AC
권역 4그룹(아시아/유럽/북미/오세아니아) × 국가 Chip 목록 30개(지도 대신 목록형, REQ-FUNC-059 축소). 이미지 8장 이상(각 alt에 실제 장소 설명, REQ-FUNC-061)을 Masonry/Grid로 표시한다.

## Visual AC
Desktop Grid → Mobile 1~2열, `Next/Image` lazy 로딩(REQ-NF-006).

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] 권역 4그룹(아시아/유럽/북미/오세아니아) × 국가 Chip 목록 30개(지도 대신 목록형, REQ-FUNC-059 축소). 이미지 8장 이상(각 alt에 실제 장소 설명, REQ-FUNC-061)을 Masonry/Grid로 표시한다. — Verify: TEST-E2E-PUBLIC-SMOKE
- [Visual AC] Desktop Grid → Mobile 1~2열, `Next/Image` lazy 로딩(REQ-NF-006). — Verify: TEST-E2E-PUBLIC-SMOKE
- Depends On 목록의 선행 Task가 모두 완료된 상태에서 통합 동작을 확인한다. Verify: TEST-E2E-PUBLIC-SMOKE

## Verify
TEST-E2E-PUBLIC-SMOKE

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-PUBLIC-SMOKE`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
