# TASK-CMP-SCR005-AUTH — Guest 인증 Card(로그인/가입/재설정)

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-066
- **Screen:** SCR-005
- **Route:** `/account`
- **Page Entry:** `src/app/account/page.tsx`(PAGE-SCR005가 조립)
- **Depends On:** INFRA-AUTH-SESSION, CMP-COMMON-TOAST
- **Expected Files:** `src/components/screens/scr005/AuthCard.tsx`
- **Functional AC:**
  - Guest(비로그인) 상태에서만 렌더링한다(로그인 상태면 이 컴포넌트 대신 `CMP-SCR005-PROFILE`/`CMP-SCR005-MY-ACTIVITY`가 렌더링된다 — 역할에 없는 영역은 렌더링하지 않음).
  - 로그인/회원가입/비밀번호 재설정 서브탭 + 이메일+비밀번호 Form을 제공한다(REQ-FUNC-066).
  - 계정 Intro(로그인 시 가능한 것 안내) + 회원 혜택 안내(동행 글 작성·참가 요청, 즐겨찾기 저장, 내 활동 확인 3개 항목) + 보안 안내(비밀번호 암호화 저장, 신원 보증 안 함 고지)를 표시한다.
- **Visual AC:** Form 좌우 분할(Desktop)/세로 스택(Mobile).
- **Security/Privacy AC:** 로그인 실패는 구체 사유를 노출하지 않는 일반 오류 메시지로 표시한다.
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1
