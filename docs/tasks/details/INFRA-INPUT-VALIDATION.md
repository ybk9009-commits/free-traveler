# INFRA-INPUT-VALIDATION — 서버 입력 검증·이스케이프 공통 스키마

```task-meta
{
  "task_id": "INFRA-INPUT-VALIDATION",
  "type": "infra",
  "depends_on": [],
  "requirements": [
    "REQ-NF-015"
  ]
}
```

## Context
이 Task는 — (모든 API Task에서 소비) 화면이 필요로 하는 '서버 입력 검증·이스케이프 공통 스키마' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-NF-015
- 정규화된 Requirement ID: REQ-NF-015

## Screen / Route / Page Entry
- Screen: — (모든 API Task에서 소비)
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
— (없음)

## Expected Files
`src/lib/validation/schemas.ts`

## Functional AC
- 모집글/참가요청/신고/관리자 설정 입력에 대한 공용 스키마(zod 등)를 정의하고, 모든 `API-*` Route Handler가 이를 통해 검증한다.
  - React 기본 이스케이프 + 서버 스키마 검증으로 저장 XSS를 차단한다.

## Visual AC
해당 없음.

## Security/Privacy AC
모든 문자열 입력은 최대 길이·허용 문자 제약을 스키마에 명시한다(REQ-NF-015).

## Test Cases
- [Functional AC] 모집글/참가요청/신고/관리자 설정 입력에 대한 공용 스키마(zod 등)를 정의하고, 모든 `API-*` Route Handler가 이를 통해 검증한다. — Verify: 코드 리뷰, API 통합 테스트(각 API Task Verify에 포함)
- [Functional AC] React 기본 이스케이프 + 서버 스키마 검증으로 저장 XSS를 차단한다. — Verify: 코드 리뷰, API 통합 테스트(각 API Task Verify에 포함)
- [Security/Privacy AC] 모든 문자열 입력은 최대 길이·허용 문자 제약을 스키마에 명시한다(REQ-NF-015). — Verify: 코드 리뷰, API 통합 테스트(각 API Task Verify에 포함)

## Verify
코드 리뷰, API 통합 테스트(각 API Task Verify에 포함)

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`코드 리뷰, API 통합 테스트(각 API Task Verify에 포함)`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
