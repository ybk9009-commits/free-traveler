# CMP-COMMON-ERROR-BOUNDARIES — 404/500/권한없음/외부연결실패 경계

```task-meta
{
  "task_id": "CMP-COMMON-ERROR-BOUNDARIES",
  "type": "component",
  "depends_on": [],
  "requirements": [
    "REQ-FUNC-078"
  ]
}
```

## Context
이 Task는 —(기술 Route, Screen 수에 미포함) 화면이 필요로 하는 '404/500/권한없음/외부연결실패 경계' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-078
- 정규화된 Requirement ID: REQ-FUNC-078

## Screen / Route / Page Entry
- Screen: —(기술 Route, Screen 수에 미포함)
- Route: 기술 Route(전체 미매칭 경로/렌더 오류/권한없음)
- Page Entry: `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/unauthorized.tsx`

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬

## Depends On
— (없음)

## Expected Files
`src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/unauthorized.tsx`

## Functional AC
- 404(`not-found.tsx`)/500(`error.tsx`)/권한없음(`unauthorized.tsx`)/외부연결실패(각 폼 인라인 오류로 처리, `CMP-SCR-003-flight-form`/`HOTEL-FORM` 참조) 화면 각각에 홈/이전/재시도 중 최소 1개 복구 행동을 제공한다(REQ-FUNC-078).

## Visual AC
5개 Page Owner와 톤을 공유하되, 어떤 Page Owner의 Expected Files에도 포함하지 않는 독립 파일이다(규칙 16 — 한 Task가 여러 Page Entry를 겸하지 않음: 이 Task는 Page Owner가 아니라 기술 경계 전용 Task).

## Security/Privacy AC
500 화면에 스택 트레이스 등 민감 정보를 노출하지 않는다.

## Test Cases
- [Functional AC] - 404(`not-found.tsx`)/500(`error.tsx`)/권한없음(`unauthorized.tsx`)/외부연결실패(각 폼 인라인 오류로 처리, `CMP-SCR-003-flight-form`/`HOTEL-FORM` 참조) 화면 각각에 홈/이전/재시도 중 최소 1개 복구 행동을 제공한다(REQ-FUNC-078). — Verify: 코드 리뷰, TEST-E2E-PUBLIC-SMOKE(404 시나리오)
- [Visual AC] 5개 Page Owner와 톤을 공유하되, 어떤 Page Owner의 Expected Files에도 포함하지 않는 독립 파일이다(규칙 16 — 한 Task가 여러 Page Entry를 겸하지 않음: 이 Task는 Page Owner가 아니라 기술 경계 전용 Task). — Verify: 코드 리뷰, TEST-E2E-PUBLIC-SMOKE(404 시나리오)
- [Security/Privacy AC] 500 화면에 스택 트레이스 등 민감 정보를 노출하지 않는다. — Verify: 코드 리뷰, TEST-E2E-PUBLIC-SMOKE(404 시나리오)

## Verify
코드 리뷰, TEST-E2E-PUBLIC-SMOKE(404 시나리오)

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`코드 리뷰, TEST-E2E-PUBLIC-SMOKE(404 시나리오)`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
