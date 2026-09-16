# TASK-CMP-COMMON-EMPTY-STATE — 완성형 Empty State 공용 컴포넌트

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-005(지원)
- **Screen:** 공통(5개 Screen)
- **Route:** 공통(5개 Route)
- **Page Entry:** —(공용 컴포넌트)
- **Depends On:** —
- **Expected Files:** `src/components/common/EmptyState.tsx`
- **Functional AC:**
  - **3요소를 props로 강제한다**: ① 상황 설명 한 문장(왜 비어 있는지) ② 이용 방법 또는 조건 안내 ③ 다음 행동 CTA 버튼. 아이콘/일러스트는 장식용으로만 허용하며 텍스트 없이 아이콘만 두는 사용을 금지한다(D-001 § Empty State 규칙).
  - Lorem ipsum, "준비 중", "정보 확인 필요" 등 자리표시 문구를 props/기본값 어디에도 두지 않는다.
- **Visual AC:** 모든 Empty State 사용처(CMP-SCR001-DESTINATION-GRID, CMP-SCR001-RECENT-MATES, CMP-SCR004-LIST, CMP-SCR005-MY-ACTIVITY)가 이 컴포넌트를 재사용한다.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** TEST-A11Y-AXE, E2E-PUBLIC-SMOKE/E2E-MATE-AUTH의 Empty 상태 시나리오
- **Priority:** P1
