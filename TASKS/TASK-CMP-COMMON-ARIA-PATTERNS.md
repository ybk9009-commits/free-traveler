# TASK-CMP-COMMON-ARIA-PATTERNS — 폼·모달·탭·알림 공용 ARIA 패턴

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-079, REQ-NF-023
- **Screen:** 공통(5개 Screen)
- **Route:** 공통(5개 Route)
- **Page Entry:** —(공용 프리미티브)
- **Depends On:** —
- **Expected Files:** `src/components/common/Modal.tsx`, `src/components/common/Tabs.tsx`, `src/components/common/FormField.tsx`
- **Functional AC:**
  - 폼(라벨-입력 연결, `aria-describedby` 오류 연결), 모달(포커스 트랩, `role="dialog"`), 탭(`role="tablist"`/`aria-selected`), 알림(`role="status"`/`aria-live`)의 공용 패턴을 제공한다(REQ-FUNC-079).
  - 키보드 포커스는 항상 `{colors.focus-ring}` 2px 아웃라인+2px 오프셋으로 표시하며 `outline: none`으로 제거하지 않는다(D-001 접근성 원칙, REQ-NF-023).
  - 모든 클릭 가능 요소는 최소 44×44px 히트 영역을 확보한다.
- **Visual AC:** 해당 없음(접근성 프리미티브).
- **Security/Privacy AC:** 해당 없음.
- **Verify:** TEST-A11Y-AXE, RELEASE-CHECK-MANUAL(키보드·스크린리더 수동)
- **Priority:** P1
