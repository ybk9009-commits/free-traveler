# CMP-SCR-005-profile — Member 프로필 탭

```task-meta
{
  "task_id": "CMP-SCR-005-profile",
  "type": "component",
  "depends_on": [
    "INFRA-AUTH-SESSION",
    "INFRA-ADULT-VERIFICATION",
    "INFRA-USER-DELETE",
    "CMP-COMMON-FAVORITES-SHARE"
  ],
  "requirements": [
    "REQ-FUNC-028",
    "REQ-FUNC-029",
    "REQ-FUNC-045",
    "REQ-FUNC-068"
  ]
}
```

## Context
이 Task는 SCR-005 화면이 필요로 하는 'Member 프로필 탭' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-045, REQ-FUNC-068
- 정규화된 Requirement ID: REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-045, REQ-FUNC-068

## Screen / Route / Page Entry
- Screen: SCR-005
- Route: `/account`
- Page Entry: `src/app/account/page.tsx`(PO-SCR-005가 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Form·Tabs
- `design-reference/UI_CONTRACT.md` SCR-005 영역 순서·주요 Component·금지 기능 표

## Depends On
- INFRA-AUTH-SESSION
- INFRA-ADULT-VERIFICATION
- INFRA-USER-DELETE
- CMP-COMMON-FAVORITES-SHARE

## Expected Files
`src/components/screens/scr005/ProfileTab.tsx`

## Functional AC
- 닉네임, 연령대, 여행 스타일(필수), 성별(선택), 자기소개를 편집한다(REQ-FUNC-029).
  - 성인 확인 상태(완료/미완료) 및 확인 시각을 표시하고, 미완료 시 확인 절차로 안내한다(REQ-FUNC-028).
  - 비밀번호 변경, 즐겨찾기 목록(`localStorage`, REQ-FUNC-068), 회원 탈퇴(`INFRA-USER-DELETE` 호출)를 제공한다(REQ-FUNC-045).

## Visual AC
Member 상태로만 렌더링(Guest/Admin과 혼합 렌더링 금지).

## Security/Privacy AC
생년월일 입력 필드를 두지 않는다.

## Test Cases
- [Functional AC] 닉네임, 연령대, 여행 스타일(필수), 성별(선택), 자기소개를 편집한다(REQ-FUNC-029). — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] 성인 확인 상태(완료/미완료) 및 확인 시각을 표시하고, 미완료 시 확인 절차로 안내한다(REQ-FUNC-028). — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] 비밀번호 변경, 즐겨찾기 목록(`localStorage`, REQ-FUNC-068), 회원 탈퇴(`INFRA-USER-DELETE` 호출)를 제공한다(REQ-FUNC-045). — Verify: TEST-E2E-MATE-AUTH
- [Visual AC] Member 상태로만 렌더링(Guest/Admin과 혼합 렌더링 금지). — Verify: TEST-E2E-MATE-AUTH
- [Security/Privacy AC] 생년월일 입력 필드를 두지 않는다. — Verify: TEST-E2E-MATE-AUTH

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
