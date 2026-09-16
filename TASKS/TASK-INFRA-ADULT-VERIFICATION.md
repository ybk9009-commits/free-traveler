# TASK-INFRA-ADULT-VERIFICATION — 성인확인 플래그 처리

- **Category:** Infra
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-028
- **Screen:** — (SCR-005에서 소비)
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE, INFRA-AUTH-SESSION
- **Expected Files:** `src/lib/mate/adult-verification.ts`
- **Functional AC:**
  - 사용자가 "만 19세 이상"을 확인하면 `is_adult=true`, `adult_verified_at=now()`만 저장한다. 생년월일·나이 원본값은 어떤 저장소에도 남기지 않는다.
  - 동행 글 작성(CMP-SCR003-MATE-WRITE-FORM)·참가 요청(CMP-SCR004-APPLY) 진입 시 이 플래그를 게이트로 사용한다.
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** 생년월일 미저장을 코드 리뷰로 확인한다(REQ-FUNC-028 핵심 제약).
- **Verify:** 코드 리뷰(스키마 확인), E2E-MATE-AUTH
- **Priority:** P1
