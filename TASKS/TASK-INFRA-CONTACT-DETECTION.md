# TASK-INFRA-CONTACT-DETECTION — 공개 연락처 탐지 유틸

- **Category:** Infra
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-032
- **Screen:** — (SCR-003 동행 작성 Form에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** —
- **Expected Files:** `src/lib/mate/contact-detection.ts`
- **Functional AC:**
  - 전화번호, 이메일, 카카오톡·텔레그램 등 일반 메신저 ID 패턴을 정규식/휴리스틱으로 탐지한다.
  - 기준 테스트셋 기준 탐지율 95% 이상, 오탐 5% 이하를 목표로 한다(REQ-FUNC-032 AC).
  - 탐지 시 모집글 제출을 서버에서 차단하고 구체적 수정 안내 메시지를 반환한다.
- **Visual AC:** 해당 없음(오류 UI는 CMP-SCR003-MATE-WRITE-FORM에서 정의).
- **Security/Privacy AC:** 탐지 로직 자체가 개인정보를 저장하지 않는다(요청 단위로만 검사).
- **Verify:** UNIT-CONTACT-DETECTION
- **Priority:** P1
