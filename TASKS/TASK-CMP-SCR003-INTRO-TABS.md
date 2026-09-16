# TASK-CMP-SCR003-INTRO-TABS — Intro 3단계 안내 + 탭 Shell

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** —(디자인 계약, PAGE-SCR003이 조립할 탭 shell)
- **Screen:** SCR-003
- **Route:** `/travel-tools`
- **Page Entry:** `src/app/travel-tools/page.tsx`(PAGE-SCR003이 조립)
- **Depends On:** —
- **Expected Files:** `src/components/screens/scr003/IntroTabs.tsx`
- **Functional AC:**
  - "조건 입력 → 요약 확인 → 이동/작성" 3단계 안내 문단을 표시한다.
  - `tab.underline` 3개(항공편/숙소/동행 구하기)를 렌더링하며, 탭 전환 시 다른 탭의 입력 상태는 세션 동안 유지하되 검증·제출 상태는 탭별로 독립 관리한다(D-001 § Form·Tabs).
- **Visual AC:** 활성 탭 = `{colors.ink}` + 2px `{colors.primary}` 밑줄, 비활성 = `{colors.muted}`.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-TRAVEL-TOOLS
- **Priority:** P1
