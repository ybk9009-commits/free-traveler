# CMP-SCR-005-auth — Guest 인증 Card(로그인/가입/재설정)

```task-meta
{
  "task_id": "CMP-SCR-005-auth",
  "type": "component",
  "depends_on": [
    "INFRA-AUTH-SESSION",
    "CMP-COMMON-TOAST"
  ],
  "requirements": [
    "REQ-FUNC-066"
  ]
}
```

## Context
이 Task는 SCR-005 화면이 필요로 하는 'Guest 인증 Card(로그인/가입/재설정)' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-066
- 정규화된 Requirement ID: REQ-FUNC-066

## Screen / Route / Page Entry
- Screen: SCR-005
- Route: `/account`
- Page Entry: `src/app/account/page.tsx`(PO-SCR-005가 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Destination Card
- `design-reference/UI_CONTRACT.md` SCR-005 영역 순서·주요 Component·금지 기능 표

## Depends On
- INFRA-AUTH-SESSION
- CMP-COMMON-TOAST

## Expected Files
`src/components/screens/scr005/AuthCard.tsx`

## Functional AC
- Guest(비로그인) 상태에서만 렌더링한다(로그인 상태면 이 컴포넌트 대신 `CMP-SCR-005-profile`/`CMP-SCR-005-my-activity`가 렌더링된다 — 역할에 없는 영역은 렌더링하지 않음).
  - 로그인/회원가입/비밀번호 재설정 서브탭 + 이메일+비밀번호 Form을 제공한다(REQ-FUNC-066).
  - 계정 Intro(로그인 시 가능한 것 안내) + 회원 혜택 안내(동행 글 작성·참가 요청, 즐겨찾기 저장, 내 활동 확인 3개 항목) + 보안 안내(비밀번호 암호화 저장, 신원 보증 안 함 고지)를 표시한다.

## Visual AC
Form 좌우 분할(Desktop)/세로 스택(Mobile).

## Security/Privacy AC
로그인 실패는 구체 사유를 노출하지 않는 일반 오류 메시지로 표시한다.

## Test Cases
- [Functional AC] Guest(비로그인) 상태에서만 렌더링한다(로그인 상태면 이 컴포넌트 대신 `CMP-SCR-005-profile`/`CMP-SCR-005-my-activity`가 렌더링된다 — 역할에 없는 영역은 렌더링하지 않음). — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] 로그인/회원가입/비밀번호 재설정 서브탭 + 이메일+비밀번호 Form을 제공한다(REQ-FUNC-066). — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] 계정 Intro(로그인 시 가능한 것 안내) + 회원 혜택 안내(동행 글 작성·참가 요청, 즐겨찾기 저장, 내 활동 확인 3개 항목) + 보안 안내(비밀번호 암호화 저장, 신원 보증 안 함 고지)를 표시한다. — Verify: TEST-E2E-MATE-AUTH
- [Visual AC] Form 좌우 분할(Desktop)/세로 스택(Mobile). — Verify: TEST-E2E-MATE-AUTH
- [Security/Privacy AC] 로그인 실패는 구체 사유를 노출하지 않는 일반 오류 메시지로 표시한다. — Verify: TEST-E2E-MATE-AUTH

## Verify
TEST-E2E-MATE-AUTH

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-MATE-AUTH`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
