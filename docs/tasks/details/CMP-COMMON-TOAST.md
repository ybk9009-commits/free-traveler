# CMP-COMMON-TOAST — Toast 알림(성공/오류)

```task-meta
{
  "task_id": "CMP-COMMON-TOAST",
  "type": "component",
  "depends_on": [],
  "requirements": [
    "REQ-FUNC-043"
  ]
}
```

## Context
이 Task는 공통(5개 Screen) 화면이 필요로 하는 'Toast 알림(성공/오류)' 기능을 제공한다. Implementation Status가 `IMPLEMENT(축소)`인 것은 자동화·모니터링 인프라를 최소화하는 원칙(docs/PROJECT_SCOPE.md §1)에 따라 범위를 축소했다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-043
- 정규화된 Requirement ID: REQ-FUNC-043

## Screen / Route / Page Entry
- Screen: 공통(5개 Screen)
- Route: 공통(5개 Route)
- Page Entry: —(공용 컴포넌트)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Alert·Toast

## Depends On
— (없음)

## Expected Files
`src/components/common/Toast.tsx`, `src/lib/hooks/useToast.ts`

## Functional AC
- **참가 요청 접수·승인·거절·신고 처리 결과 등은 인앱 Toast로만 알린다. 실제 이메일 발송은 만들지 않는다**(`docs/PROJECT_SCOPE.md` §1, REQ-FUNC-043 축소 범위).
  - 알림 상태는 1분 이내 화면에 반영되어야 한다(REQ-FUNC-043 AC 취지, 클라이언트 갱신 기준).

## Visual AC
위치 우하단(Desktop)/상단(Mobile), `{rounded.md}`, 3-5초 자동 소멸 + 수동 닫기. 성공은 `{colors.success}` 아이콘, 오류는 `{colors.danger}` 아이콘 좌측 배치.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] **참가 요청 접수·승인·거절·신고 처리 결과 등은 인앱 Toast로만 알린다. 실제 이메일 발송은 만들지 않는다**(`docs/PROJECT_SCOPE.md` §1, REQ-FUNC-043 축소 범위). — Verify: TEST-E2E-MATE-AUTH(Toast 노출 assertion)
- [Functional AC] 알림 상태는 1분 이내 화면에 반영되어야 한다(REQ-FUNC-043 AC 취지, 클라이언트 갱신 기준). — Verify: TEST-E2E-MATE-AUTH(Toast 노출 assertion)
- [Visual AC] 위치 우하단(Desktop)/상단(Mobile), `{rounded.md}`, 3-5초 자동 소멸 + 수동 닫기. 성공은 `{colors.success}` 아이콘, 오류는 `{colors.danger}` 아이콘 좌측 배치. — Verify: TEST-E2E-MATE-AUTH(Toast 노출 assertion)

## Verify
TEST-E2E-MATE-AUTH(Toast 노출 assertion)

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-MATE-AUTH(Toast 노출 assertion)`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
