# CMP-SCR-001-hero-search — Hero 통합 검색

```task-meta
{
  "task_id": "CMP-SCR-001-hero-search",
  "type": "component",
  "depends_on": [
    "DATA-DESTINATIONS",
    "DATA-SAFETY"
  ],
  "requirements": [
    "REQ-FUNC-003",
    "REQ-FUNC-067"
  ]
}
```

## Context
이 Task는 SCR-001 화면이 필요로 하는 'Hero 통합 검색' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-003, REQ-FUNC-067
- 정규화된 Requirement ID: REQ-FUNC-003, REQ-FUNC-067

## Screen / Route / Page Entry
- Screen: SCR-001
- Route: `/`
- Page Entry: `src/app/page.tsx`(PO-SCR-001이 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬
- `design-reference/UI_CONTRACT.md` SCR-001 영역 순서·주요 Component·금지 기능 표

## Depends On
- DATA-DESTINATIONS
- DATA-SAFETY

## Expected Files
`src/components/screens/scr001/HeroSearch.tsx`

## Functional AC
- `design-reference/D-001/DESIGN.md` § Search·Filter의 Hero pill 검색바(완전 원형, `{rounded.full}`)를 사용한다.
  - 여행지명·국가명·테마 키워드로 한글 부분 일치 검색을 수행하고, 여행지·안전정보를 통합 검색한다(REQ-FUNC-003, 067). 결과 유형 라벨과 하이라이트를 표시한다.
  - 보조 CTA "항공·숙소 준비하기"는 `/travel-tools`로 이동한다.

## Visual AC
Hero는 Desktop 뷰포트 60-70%(약 520-600px)로 제한해 다음 Section이 첫 화면에서 보이게 한다(D-001 § Hero 규칙). Mobile은 세로 스택.

## Security/Privacy AC
해당 없음(공개 정적 검색).

## Test Cases
- [Functional AC] `design-reference/D-001/DESIGN.md` § Search·Filter의 Hero pill 검색바(완전 원형, `{rounded.full}`)를 사용한다. — Verify: TEST-E2E-PUBLIC-SMOKE
- [Functional AC] 여행지명·국가명·테마 키워드로 한글 부분 일치 검색을 수행하고, 여행지·안전정보를 통합 검색한다(REQ-FUNC-003, 067). 결과 유형 라벨과 하이라이트를 표시한다. — Verify: TEST-E2E-PUBLIC-SMOKE
- [Functional AC] 보조 CTA "항공·숙소 준비하기"는 `/travel-tools`로 이동한다. — Verify: TEST-E2E-PUBLIC-SMOKE
- [Visual AC] Hero는 Desktop 뷰포트 60-70%(약 520-600px)로 제한해 다음 Section이 첫 화면에서 보이게 한다(D-001 § Hero 규칙). Mobile은 세로 스택. — Verify: TEST-E2E-PUBLIC-SMOKE

## Verify
TEST-E2E-PUBLIC-SMOKE

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-PUBLIC-SMOKE`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
