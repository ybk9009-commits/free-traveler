# CMP-SCR-005-my-activity — Member 내 활동 탭

```task-meta
{
  "task_id": "CMP-SCR-005-my-activity",
  "type": "component",
  "depends_on": [
    "API-MATE-POSTS",
    "API-MATE-APPLICATIONS",
    "API-BLOCKS",
    "CMP-COMMON-EMPTY-STATE"
  ],
  "requirements": [
    "REQ-FUNC-036",
    "REQ-FUNC-037",
    "REQ-FUNC-038",
    "REQ-FUNC-040"
  ]
}
```

## Context
이 Task는 SCR-005 화면이 필요로 하는 'Member 내 활동 탭' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-036, REQ-FUNC-037(축소), REQ-FUNC-038, REQ-FUNC-040
- 정규화된 Requirement ID: REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-040

## Screen / Route / Page Entry
- Screen: SCR-005
- Route: `/account`
- Page Entry: `src/app/account/page.tsx`(PO-SCR-005가 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Form·Tabs
- `design-reference/UI_CONTRACT.md` SCR-005 영역 순서·주요 Component·금지 기능 표

## Depends On
- API-MATE-POSTS
- API-MATE-APPLICATIONS
- API-BLOCKS
- CMP-COMMON-EMPTY-STATE

## Expected Files
`src/components/screens/scr005/MyActivityTab.tsx`

## Functional AC
- "내가 쓴 동행 글" 목록(상태 배지, 수정·마감·삭제 액션) + "받은 참가 요청"(승인/거절, REQ-FUNC-036) + "내가 보낸 참가 신청"(상태별 목록, REQ-FUNC-034) + "차단 목록"(해제 버튼, REQ-FUNC-040) + "새 동행 글 작성" CTA(`/travel-tools`)를 표시한다.
  - 승인된 신청자가 있는 글을 수정/마감하면 확인 모달로 경고한다(REQ-FUNC-038).
  - 각 목록이 0건이면 상황별 문구("아직 작성한 동행 글이 없어요" 등) + "동행 글 작성하기"/"동행 찾아보기" CTA의 Empty State로 대체한다.

## Visual AC
탭 구조, `card.mate` 관리형 변형.

## Security/Privacy AC
본인 글/신청만 노출(RLS 의존).

## Test Cases
- [Functional AC] "내가 쓴 동행 글" 목록(상태 배지, 수정·마감·삭제 액션) + "받은 참가 요청"(승인/거절, REQ-FUNC-036) + "내가 보낸 참가 신청"(상태별 목록, REQ-FUNC-034) + "차단 목록"(해제 버튼, REQ-FUNC-040) + "새 동행 글 작성" CTA(`/travel-tools`)를 표시한다. — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] 승인된 신청자가 있는 글을 수정/마감하면 확인 모달로 경고한다(REQ-FUNC-038). — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] 각 목록이 0건이면 상황별 문구("아직 작성한 동행 글이 없어요" 등) + "동행 글 작성하기"/"동행 찾아보기" CTA의 Empty State로 대체한다. — Verify: TEST-E2E-MATE-AUTH
- [Visual AC] 탭 구조, `card.mate` 관리형 변형. — Verify: TEST-E2E-MATE-AUTH
- [Security/Privacy AC] 본인 글/신청만 노출(RLS 의존). — Verify: TEST-E2E-MATE-AUTH

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
