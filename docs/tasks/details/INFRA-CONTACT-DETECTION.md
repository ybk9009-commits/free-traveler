# INFRA-CONTACT-DETECTION — 공개 연락처 탐지 유틸

```task-meta
{
  "task_id": "INFRA-CONTACT-DETECTION",
  "type": "infra",
  "depends_on": [],
  "requirements": [
    "REQ-FUNC-032"
  ]
}
```

## Context
이 Task는 — (SCR-003 동행 작성 Form에서 소비) 화면이 필요로 하는 '공개 연락처 탐지 유틸' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-032
- 정규화된 Requirement ID: REQ-FUNC-032

## Screen / Route / Page Entry
- Screen: — (SCR-003 동행 작성 Form에서 소비)
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
— (없음)

## Expected Files
`src/lib/mate/contact-detection.ts`

## Functional AC
- 전화번호, 이메일, 카카오톡·텔레그램 등 일반 메신저 ID 패턴을 정규식/휴리스틱으로 탐지한다.
  - 기준 테스트셋 기준 탐지율 95% 이상, 오탐 5% 이하를 목표로 한다(REQ-FUNC-032 AC).
  - 탐지 시 모집글 제출을 서버에서 차단하고 구체적 수정 안내 메시지를 반환한다.

## Visual AC
해당 없음(오류 UI는 CMP-SCR-003-mate-write-form에서 정의).

## Security/Privacy AC
탐지 로직 자체가 개인정보를 저장하지 않는다(요청 단위로만 검사).

## Test Cases
- [Functional AC] 전화번호, 이메일, 카카오톡·텔레그램 등 일반 메신저 ID 패턴을 정규식/휴리스틱으로 탐지한다. — Verify: TEST-UNIT-CONTACT-DETECTION
- [Functional AC] 기준 테스트셋 기준 탐지율 95% 이상, 오탐 5% 이하를 목표로 한다(REQ-FUNC-032 AC). — Verify: TEST-UNIT-CONTACT-DETECTION
- [Functional AC] 탐지 시 모집글 제출을 서버에서 차단하고 구체적 수정 안내 메시지를 반환한다. — Verify: TEST-UNIT-CONTACT-DETECTION
- [Security/Privacy AC] 탐지 로직 자체가 개인정보를 저장하지 않는다(요청 단위로만 검사). — Verify: TEST-UNIT-CONTACT-DETECTION

## Verify
TEST-UNIT-CONTACT-DETECTION

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-UNIT-CONTACT-DETECTION`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
