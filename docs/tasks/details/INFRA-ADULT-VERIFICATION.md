# INFRA-ADULT-VERIFICATION — 성인확인 플래그 처리

```task-meta
{
  "task_id": "INFRA-ADULT-VERIFICATION",
  "type": "infra",
  "depends_on": [
    "DB-SCHEMA-BASE",
    "INFRA-AUTH-SESSION"
  ],
  "requirements": [
    "REQ-FUNC-028"
  ]
}
```

## Context
이 Task는 — (SCR-005에서 소비) 화면이 필요로 하는 '성인확인 플래그 처리' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-028
- 정규화된 Requirement ID: REQ-FUNC-028

## Screen / Route / Page Entry
- Screen: — (SCR-005에서 소비)
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- DB-SCHEMA-BASE
- INFRA-AUTH-SESSION

## Expected Files
`src/lib/mate/adult-verification.ts`

## Functional AC
- 사용자가 "만 19세 이상"을 확인하면 `is_adult=true`, `adult_verified_at=now()`만 저장한다. 생년월일·나이 원본값은 어떤 저장소에도 남기지 않는다.
  - 동행 글 작성(CMP-SCR-003-mate-write-form)·참가 요청(CMP-SCR-004-apply) 진입 시 이 플래그를 게이트로 사용한다.

## Visual AC
해당 없음.

## Security/Privacy AC
생년월일 미저장을 코드 리뷰로 확인한다(REQ-FUNC-028 핵심 제약).

## Test Cases
- [Functional AC] 사용자가 "만 19세 이상"을 확인하면 `is_adult=true`, `adult_verified_at=now()`만 저장한다. 생년월일·나이 원본값은 어떤 저장소에도 남기지 않는다. — Verify: 코드 리뷰(스키마 확인), TEST-E2E-MATE-AUTH
- [Functional AC] 동행 글 작성(CMP-SCR-003-mate-write-form)·참가 요청(CMP-SCR-004-apply) 진입 시 이 플래그를 게이트로 사용한다. — Verify: 코드 리뷰(스키마 확인), TEST-E2E-MATE-AUTH
- [Security/Privacy AC] 생년월일 미저장을 코드 리뷰로 확인한다(REQ-FUNC-028 핵심 제약). — Verify: 코드 리뷰(스키마 확인), TEST-E2E-MATE-AUTH

## Verify
코드 리뷰(스키마 확인), TEST-E2E-MATE-AUTH

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`코드 리뷰(스키마 확인), TEST-E2E-MATE-AUTH`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
