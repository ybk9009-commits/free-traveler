# TASK-CMP-COMMON-TOAST — Toast 알림(성공/오류)

- **Category:** Component
- **Implementation Status:** IMPLEMENT(축소)
- **Requirement Ref:** REQ-FUNC-043
- **Screen:** 공통(5개 Screen)
- **Route:** 공통(5개 Route)
- **Page Entry:** —(공용 컴포넌트)
- **Depends On:** —
- **Expected Files:** `src/components/common/Toast.tsx`, `src/lib/hooks/useToast.ts`
- **Functional AC:**
  - **참가 요청 접수·승인·거절·신고 처리 결과 등은 인앱 Toast로만 알린다. 실제 이메일 발송은 만들지 않는다**(`docs/PROJECT_SCOPE.md` §1, REQ-FUNC-043 축소 범위).
  - 알림 상태는 1분 이내 화면에 반영되어야 한다(REQ-FUNC-043 AC 취지, 클라이언트 갱신 기준).
- **Visual AC:** 위치 우하단(Desktop)/상단(Mobile), `{rounded.md}`, 3-5초 자동 소멸 + 수동 닫기. 성공은 `{colors.success}` 아이콘, 오류는 `{colors.danger}` 아이콘 좌측 배치.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-MATE-AUTH(Toast 노출 assertion)
- **Priority:** P1
