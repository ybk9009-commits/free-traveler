# CMP-SCR-004-guidance-safety — 신청 방법 3단계 + 안전 안내 CTA

```task-meta
{
  "task_id": "CMP-SCR-004-guidance-safety",
  "type": "component",
  "depends_on": [],
  "requirements": []
}
```

## Context
이 Task는 SCR-004 화면이 필요로 하는 '신청 방법 3단계 + 안전 안내 CTA' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): —(디자인 계약: 콘텐츠 계약 "신청 방법 3단계")
- 정규화된 Requirement ID: — (없음, 조립/기반 Task)

## Screen / Route / Page Entry
- Screen: SCR-004
- Route: `/mates`
- Page Entry: `src/app/mates/page.tsx`(PO-SCR-004가 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Alert·Toast(경보 배지) + Drawer·Modal
- `design-reference/UI_CONTRACT.md` SCR-004 영역 순서·주요 Component·금지 기능 표

## Depends On
— (없음)

## Expected Files
`src/components/screens/scr004/GuidanceSafety.tsx`

## Functional AC
- "모집글 확인 → 비공개 메시지로 참가 요청 → 작성자 승인 후 대화 시작" 3단계 안내를 표시한다.
  - 안전수칙 요약 + 신고/차단 안내 + "항공·숙소도 함께 준비하기" CTA(`/travel-tools`)를 CTA Banner로 표시한다.

## Visual AC
3단계 안내 + CTA Banner.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] "모집글 확인 → 비공개 메시지로 참가 요청 → 작성자 승인 후 대화 시작" 3단계 안내를 표시한다. — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] 안전수칙 요약 + 신고/차단 안내 + "항공·숙소도 함께 준비하기" CTA(`/travel-tools`)를 CTA Banner로 표시한다. — Verify: TEST-E2E-MATE-AUTH
- [Visual AC] 3단계 안내 + CTA Banner. — Verify: TEST-E2E-MATE-AUTH

## Verify
TEST-E2E-MATE-AUTH

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-MATE-AUTH`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
