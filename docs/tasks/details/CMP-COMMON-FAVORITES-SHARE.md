# CMP-COMMON-FAVORITES-SHARE — 즐겨찾기(localStorage) + URL 공유 훅

```task-meta
{
  "task_id": "CMP-COMMON-FAVORITES-SHARE",
  "type": "component",
  "depends_on": [],
  "requirements": [
    "REQ-FUNC-068",
    "REQ-FUNC-069"
  ]
}
```

## Context
이 Task는 공통(SCR-001, SCR-004, SCR-005에서 소비) 화면이 필요로 하는 '즐겨찾기(localStorage) + URL 공유 훅' 기능을 제공한다. Implementation Status가 `IMPLEMENT(축소)`인 것은 자동화·모니터링 인프라를 최소화하는 원칙(docs/PROJECT_SCOPE.md §1)에 따라 범위를 축소했다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-068, REQ-FUNC-069
- 정규화된 Requirement ID: REQ-FUNC-068, REQ-FUNC-069

## Screen / Route / Page Entry
- Screen: 공통(SCR-001, SCR-004, SCR-005에서 소비)
- Route: 공통
- Page Entry: —(훅/유틸, 특정 Page Entry 소유 없음)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬

## Depends On
— (없음)

## Expected Files
`src/lib/hooks/useFavorites.ts`, `src/lib/hooks/useShare.ts`

## Functional AC
- **즐겨찾기는 서버 저장이 아닌 `localStorage`에만 저장한다**(`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙). 여행지 ID 기준 중복 추가를 방지한다(REQ-FUNC-068).
  - URL 공유는 Web Share API를 우선 사용하고, 미지원 브라우저에서는 클립보드 복사로 폴백한다(REQ-FUNC-069).

## Visual AC
해당 없음(소비 컴포넌트의 Visual AC를 따름).

## Security/Privacy AC
`localStorage` 값에 개인정보를 저장하지 않는다(여행지 ID만 저장).

## Test Cases
- [Functional AC] **즐겨찾기는 서버 저장이 아닌 `localStorage`에만 저장한다**(`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙). 여행지 ID 기준 중복 추가를 방지한다(REQ-FUNC-068). — Verify: TEST-E2E-PUBLIC-SMOKE(중복 방지 assertion)
- [Functional AC] URL 공유는 Web Share API를 우선 사용하고, 미지원 브라우저에서는 클립보드 복사로 폴백한다(REQ-FUNC-069). — Verify: TEST-E2E-PUBLIC-SMOKE(중복 방지 assertion)
- [Security/Privacy AC] `localStorage` 값에 개인정보를 저장하지 않는다(여행지 ID만 저장). — Verify: TEST-E2E-PUBLIC-SMOKE(중복 방지 assertion)

## Verify
TEST-E2E-PUBLIC-SMOKE(중복 방지 assertion)

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-PUBLIC-SMOKE(중복 방지 assertion)`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
