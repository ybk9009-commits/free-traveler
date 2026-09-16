# CI-LINT-TYPECHECK-DATA — Lint·Typecheck·데이터검증 CI 게이트

```task-meta
{
  "task_id": "CI-LINT-TYPECHECK-DATA",
  "type": "ci",
  "depends_on": [
    "TEST-DATA-VALIDATION",
    "TEST-UNIT-TRAVEL-DATES",
    "TEST-UNIT-CONTACT-DETECTION",
    "TEST-UNIT-MATE-STATE"
  ],
  "requirements": [
    "REQ-NF-031"
  ]
}
```

## Context
이 Task는 여러 화면 또는 인프라 계층에서 공통으로 소비되는 기반 요소이 필요로 하는 'Lint·Typecheck·데이터검증 CI 게이트' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §6 테스트 전략, §7 배포

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-NF-031
- 정규화된 Requirement ID: REQ-NF-031

## Screen / Route / Page Entry
- Screen: —
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- TEST-DATA-VALIDATION
- TEST-UNIT-TRAVEL-DATES
- TEST-UNIT-CONTACT-DETECTION
- TEST-UNIT-MATE-STATE

## Expected Files
`.github/workflows/ci.yml`(또는 동등 CI 설정)

## Functional AC
- `tsc --noEmit`, ESLint, `scripts/validate_content.ts`(TEST-DATA-VALIDATION), Unit Test 3종을 main 병합 전 게이트로 실행한다(REQ-NF-031).
  - Playwright E2E/axe는 별도 워크플로(또는 동일 워크플로의 후속 Job)로 실행하되 병합 필수 게이트 여부는 팀 결정에 맡긴다(배포 전 성능 점검 자동화 게이트는 REQ-NF-007 EXCLUDED이므로 포함하지 않는다).

## Visual AC
해당 없음.

## Security/Privacy AC
CI 로그에 `.env` 값·서비스 롤 키를 출력하지 않는다.

## Test Cases
- [Functional AC] `tsc --noEmit`, ESLint, `scripts/validate_content.ts`(TEST-DATA-VALIDATION), Unit Test 3종을 main 병합 전 게이트로 실행한다(REQ-NF-031). — Verify: 실제 PR에서 워크플로 성공 확인
- [Functional AC] Playwright E2E/axe는 별도 워크플로(또는 동일 워크플로의 후속 Job)로 실행하되 병합 필수 게이트 여부는 팀 결정에 맡긴다(배포 전 성능 점검 자동화 게이트는 REQ-NF-007 EXCLUDED이므로 포함하지 않는다). — Verify: 실제 PR에서 워크플로 성공 확인
- [Security/Privacy AC] CI 로그에 `.env` 값·서비스 롤 키를 출력하지 않는다. — Verify: 실제 PR에서 워크플로 성공 확인

## Verify
실제 PR에서 워크플로 성공 확인

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`실제 PR에서 워크플로 성공 확인`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
- 지속적 성능 측정 자동화(배포 전 성능 점검 자동화 게이트)는 이 CI 게이트에 포함하지 않는다(REQ-NF-007 EXCLUDED).
