# TASK-RELEASE-CHECK-MANUAL — 브라우저 수동 릴리스 점검

- **Category:** Release Check
- **Implementation Status:** IMPLEMENT(목표/축소, 항목별로 아래 참조)
- **Requirement Ref:** REQ-NF-001, REQ-NF-002, REQ-NF-003, REQ-NF-004, REQ-NF-005, REQ-NF-019, REQ-NF-025, REQ-NF-028
- **Screen:** SCR-001~SCR-005(전체)
- **Route:** 공통(5개 Route)
- **Page Entry:** —
- **Depends On:** E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH, TEST-A11Y-AXE
- **Expected Files:** 없음(체크리스트 실행 Task — 결과는 릴리스 노트/체크리스트 문서에 기록하되 이번 작업에서는 문서를 생성하지 않는다)
- **Functional AC — 브라우저 확인이 필요해 자동화하지 않는 항목(규칙 4)을 모은다**:
  - Lighthouse 수동 측정으로 LCP p75 ≤2.5s, INP p75 ≤200ms, CLS p75 ≤0.1 목표 확인(REQ-NF-001~003, 목표치이며 지속 RUM 모니터링은 구축하지 않음).
  - 개발자 도구 타이밍으로 필터 응답(REQ-NF-004)·쓰기 API 응답(REQ-NF-005)·신고 접수 응답(REQ-NF-019)이 목표 이내인지 수동 확인(부하 테스트 아님, 단일 요청 기준).
  - 키보드 전용 탐색 + 스크린리더(NVDA/VoiceOver 등)로 핵심 UC(REQ-NF-025) 수동 통과 확인.
  - 안전정보 최신 확인 비율(7일 이내 95%+) 수동 점검(REQ-NF-028 축소, 지표 대시보드 없음).
  - 외부 링크(항공/호텔/외교부/SNS) 배포 전 수동 클릭 점검 체크리스트(REQ-NF-011 EXCLUDED의 대체 수단 — §10 참조).
- **Visual AC:** 위 점검을 Desktop 1440px, Mobile 390px 두 뷰포트에서 각각 수행한다.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** 사람이 직접 수행하고 결과를 PR/릴리스 노트에 기록(자동 스크립트 없음)
- **Priority:** P3
