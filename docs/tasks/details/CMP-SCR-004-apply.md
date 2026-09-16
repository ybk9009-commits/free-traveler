# CMP-SCR-004-apply — 참가 메시지 신청 폼

```task-meta
{
  "task_id": "CMP-SCR-004-apply",
  "type": "component",
  "depends_on": [
    "CMP-SCR-004-detail",
    "API-MATE-APPLICATIONS",
    "INFRA-ADULT-VERIFICATION"
  ],
  "requirements": [
    "REQ-FUNC-034",
    "REQ-FUNC-035"
  ]
}
```

## Context
이 Task는 SCR-004 화면이 필요로 하는 '참가 메시지 신청 폼' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-034, REQ-FUNC-035
- 정규화된 Requirement ID: REQ-FUNC-034, REQ-FUNC-035

## Screen / Route / Page Entry
- Screen: SCR-004
- Route: `/mates`
- Page Entry: `src/app/mates/page.tsx`(PO-SCR-004가 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Form·Tabs
- `design-reference/UI_CONTRACT.md` SCR-004 영역 순서·주요 Component·금지 기능 표

## Depends On
- CMP-SCR-004-detail
- API-MATE-APPLICATIONS
- INFRA-ADULT-VERIFICATION

## Expected Files
`src/components/screens/scr004/ApplyForm.tsx`

## Functional AC
- 500자 이내 참가 메시지를 `API-MATE-APPLICATIONS`로 제출한다(REQ-FUNC-034).
  - 중복 신청 시 서버 오류를 인라인으로 표시한다(REQ-FUNC-035).
  - 미로그인/미성년 사용자가 신청을 시도하면 `/account`로 유도하는 안내를 표시한다.

## Visual AC
상세 패널 내 인라인 폼.

## Security/Privacy AC
신청 메시지는 신청자 본인과 글 작성자만 조회 가능(RLS).

## Test Cases
- [Functional AC] 500자 이내 참가 메시지를 `API-MATE-APPLICATIONS`로 제출한다(REQ-FUNC-034). — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] 중복 신청 시 서버 오류를 인라인으로 표시한다(REQ-FUNC-035). — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] 미로그인/미성년 사용자가 신청을 시도하면 `/account`로 유도하는 안내를 표시한다. — Verify: TEST-E2E-MATE-AUTH
- [Visual AC] 상세 패널 내 인라인 폼. — Verify: TEST-E2E-MATE-AUTH
- [Security/Privacy AC] 신청 메시지는 신청자 본인과 글 작성자만 조회 가능(RLS). — Verify: TEST-E2E-MATE-AUTH

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
