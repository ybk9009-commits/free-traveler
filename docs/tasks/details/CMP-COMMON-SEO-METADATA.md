# CMP-COMMON-SEO-METADATA — Next Metadata API 공통 적용

```task-meta
{
  "task_id": "CMP-COMMON-SEO-METADATA",
  "type": "component",
  "depends_on": [],
  "requirements": [
    "REQ-FUNC-070",
    "REQ-NF-030"
  ]
}
```

## Context
이 Task는 공통(5개 Screen) 화면이 필요로 하는 'Next Metadata API 공통 적용' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-070, REQ-NF-030
- 정규화된 Requirement ID: REQ-FUNC-070, REQ-NF-030

## Screen / Route / Page Entry
- Screen: 공통(5개 Screen)
- Route: 공통(5개 Route)
- Page Entry: 5개 `page.tsx` + `src/app/layout.tsx`

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬

## Depends On
— (없음)

## Expected Files
`src/lib/seo/metadata.ts`, 각 `page.tsx`에 `generateMetadata`/`metadata` export 추가(구현 시)

## Functional AC
5개 공개 페이지 각각에 title, description, canonical, Open Graph, 구조화 데이터를 제공한다(REQ-FUNC-070). SEO 자동 검사에서 필수 메타 누락 0건을 목표로 한다(REQ-NF-030).

## Visual AC
해당 없음(비시각 요소).

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] 5개 공개 페이지 각각에 title, description, canonical, Open Graph, 구조화 데이터를 제공한다(REQ-FUNC-070). SEO 자동 검사에서 필수 메타 누락 0건을 목표로 한다(REQ-NF-030). — Verify: 코드 리뷰(메타 태그 존재 확인)
- Depends On 목록의 선행 Task가 모두 완료된 상태에서 통합 동작을 확인한다. Verify: 코드 리뷰(메타 태그 존재 확인)

## Verify
코드 리뷰(메타 태그 존재 확인)

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Verify에 명시된 검증(`코드 리뷰(메타 태그 존재 확인)`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
