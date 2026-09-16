# INFRA-USER-DELETE — 탈퇴 시 즉시 비식별화

```task-meta
{
  "task_id": "INFRA-USER-DELETE",
  "type": "infra",
  "depends_on": [
    "DB-SCHEMA-BASE",
    "INFRA-AUTH-SESSION"
  ],
  "requirements": [
    "REQ-FUNC-045",
    "REQ-NF-018"
  ]
}
```

## Context
이 Task는 — (SCR-005에서 소비) 화면이 필요로 하는 '탈퇴 시 즉시 비식별화' 기능을 제공한다. Implementation Status가 `IMPLEMENT(축소)`인 것은 자동화·모니터링 인프라를 최소화하는 원칙(docs/PROJECT_SCOPE.md §1)에 따라 범위를 축소했다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-045, REQ-NF-018
- 정규화된 Requirement ID: REQ-FUNC-045, REQ-NF-018

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
`src/lib/account/delete.ts`

## Functional AC
- 탈퇴 요청 시 `USER_PROFILE`의 닉네임·자기소개 등 공개 식별 정보를 즉시 비식별화한다.
  - 유예기간 후 배치 삭제(법적 보존 예외 처리 등)는 만들지 않는다(`docs/PROJECT_SCOPE.md` REQ-FUNC-045 처리 방법 축소 범위).
  - 개인정보 **내보내기**(다운로드) 기능은 만들지 않는다(REQ-NF-018 축소 범위 — 삭제만 구현).

## Visual AC
해당 없음(탈퇴 버튼 UI는 CMP-SCR-005-profile에서 정의).

## Security/Privacy AC
비식별화 처리 결과를 코드 리뷰로 확인한다. 배치 삭제·감사 로그는 EXCLUDED 범위(REQ-FUNC-076)와 무관하게 만들지 않는다.

## Test Cases
- [Functional AC] 탈퇴 요청 시 `USER_PROFILE`의 닉네임·자기소개 등 공개 식별 정보를 즉시 비식별화한다. — Verify: 코드 리뷰, 수동 확인
- [Functional AC] 유예기간 후 배치 삭제(법적 보존 예외 처리 등)는 만들지 않는다(`docs/PROJECT_SCOPE.md` REQ-FUNC-045 처리 방법 축소 범위). — Verify: 코드 리뷰, 수동 확인
- [Functional AC] 개인정보 **내보내기**(다운로드) 기능은 만들지 않는다(REQ-NF-018 축소 범위 — 삭제만 구현). — Verify: 코드 리뷰, 수동 확인
- [Security/Privacy AC] 비식별화 처리 결과를 코드 리뷰로 확인한다. 배치 삭제·감사 로그는 EXCLUDED 범위(REQ-FUNC-076)와 무관하게 만들지 않는다. — Verify: 코드 리뷰, 수동 확인

## Verify
코드 리뷰, 수동 확인

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`코드 리뷰, 수동 확인`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
