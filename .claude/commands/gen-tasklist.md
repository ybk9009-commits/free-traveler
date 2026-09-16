---
description: Traveler 승인 산출물(SCREEN_ROUTE_CONTRACT.json 등)을 읽어 docs/tasks/TASK_LIST.md를 생성/갱신한다.
---

# /gen-tasklist

Free Traveler의 승인된 5개 Screen을 구현 Task 목록으로 변환한다. 이 커맨드는 **목록만** 만든다 — Task 상세 파일은 `/gen-task-details`가 만든다.

## 공통 제약(3개 Pipeline 커맨드 공통)

- `.claude/skills/traveler-project-pipeline/SKILL.md`를 매번 실제로 로드해서 따른다. 이전 실행에서 읽은 기억에만 의존하지 않는다.
- 아래 절차가 언급하는 모든 입력 파일은 **실제로 Read**해서 확인한다. 내용을 추정하거나 요약만 보고 다음 단계로 넘어가지 않는다.
- 이 커맨드는 `docs/tasks/TASK_LIST.md`(문서)만 만든다. **`src/app`/`src/components`/`src/lib` 등 실제 구현 코드, Git Branch, Commit은 만들지 않는다.**
- 이 단계에서는 `docs/tasks/details/*.md`가 아직 없으므로 `scripts/audit_tasks.py`는 통과할 수 없다. 이 커맨드는 감사를 실행하지 않으며, "Task List 생성 완료"를 "Task Audit 통과"처럼 보고하지 않는다 — 감사는 `/gen-task-details`가 마지막에 실행하고, 실패하면 무시하지 않고 고칠 때까지 반복한다.

## 절차

1. **Skill을 전부 읽는다.** `.claude/skills/traveler-project-pipeline/SKILL.md` 전체를 로드한다. 이 문서의 규칙(20개 핵심 규칙, Task 분류, 파일 규격)이 이 커맨드의 유일한 기준이다.

2. **Gate를 실행한다.**
   ```
   python scripts/validate_inputs.py
   ```
   Exit code가 0이 아니면 **여기서 멈춘다.** 출력된 오류를 사용자에게 그대로 보고하고, 오류가 해결(입력 문서 수정 등)되기 전까지 Task List를 생성하지 않는다.

3. **정본 입력을 읽는다.**
   - `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen/Route/Page Entry/Section의 정본(SKILL.md 규칙 1, 2)
   - `docs/UIUX_TRACEABILITY.md` — 114개 Requirement의 Implementation Status
   - `docs/PROJECT_SCOPE.md` — DB 테이블 5종, 정적 데이터 3종, 관리자 축소 범위, 제외 기능 목록
   - `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md` — Section 순서·최소 콘텐츠 수·금지 사항
   - `scripts/.reports/validate_inputs_report.json` — 2단계에서 생성된 실제 `src/app` 파일 트리 스캔 결과(규칙 4의 근거 데이터)

4. **Task를 도출한다.** SKILL.md §2(Task 분류), §3(Screen별 Page Owner 특칙), §6~11(DB/정적 데이터/항공숙소/테스트/금지기술/Requirement 커버리지 계약)을 따라 아래를 만든다.
   - `page_owner` Task 정확히 5개(Screen당 1개, SKILL.md §3)
   - `component` Task: 각 Screen의 `sections`(SCR-005는 role별 배열)를 근거로, Section 단위 또는 밀접한 Section 묶음 단위로 만든다. 모든 `page_owner`는 같은 Screen의 `component` Task에 최소 1개 의존해야 한다.
   - `data` Task 3개(여행지/안전정보/대표 소개, `src/data/*.ts`)
   - `db` Task(들): `docs/PROJECT_SCOPE.md` §5의 5개 테이블(USER_PROFILE, MATE_POST, MATE_APPLICATION, USER_BLOCK, REPORT)만 참조, 6개 초과 금지, AUDIT_LOG 금지
   - `api`/`infra` Task: 인증 세션, Supabase client, 모집글/참가요청/신고/관리자 설정 등 서버 쓰기 작업(항공·호텔 폼은 서버 API를 만들지 않는다 — SKILL.md §8)
   - 공통(`component`, screen=`—`) Task: 전역 Header/Footer, SEO 메타데이터, 즐겨찾기/공유 유틸 등
   - `test` Task: Playwright **Chromium** Smoke 1개 + axe 접근성 + 데이터 검증(SKILL.md §9). 다른 브라우저/부하테스트/Lighthouse CI Task는 만들지 않는다.
   - `ci` Task: lint/typecheck 게이트

5. **Requirement 커버리지를 맞춘다(규칙 15, 16).**
   - `docs/UIUX_TRACEABILITY.md`에서 Implementation Status가 `IMPLEMENT`로 시작하는 모든 ID를 최소 1개 Task의 Requirements 열에 배치한다.
   - `EXCLUDED`인 ID는 어떤 Task에도 배치하지 않는다. 대신 TASK_LIST.md 하단에 SKILL.md §1.2 형식의 "제외된 Requirement" 표를 만들어 ID와 제외 사유를 그대로 옮긴다. `docs/UIUX_TRACEABILITY.md` 자체는 수정하지 않는다.

6. **`docs/tasks/TASK_LIST.md`를 SKILL.md §1.2 형식 그대로** 작성(또는 갱신)한다. Route/Page Entry/Task ID 중복이 없는지, Depends On이 존재하는 Task ID만 가리키는지 스스로 점검한다.

7. **요약을 보고한다.** Type별 개수, Requirement 커버리지(전체/IMPLEMENT/EXCLUDED), 5개 Page Owner Screen 매핑을 사용자에게 표로 제시한다. Task 총수는 45~65개가 자연스러운 범위지만 하드 게이트는 아니다(개수만으로 성공/실패를 판단하지 않는다).

8. 상세 파일은 만들지 않는다. 다음 단계는 `/gen-task-details`임을 안내한다.

## 재실행

이미 `docs/tasks/TASK_LIST.md`가 있으면 덮어쓰기 전에 기존 Task ID를 보존할지 사용자에게 확인한다(이미 상세 파일이 있는 Task의 ID를 바꾸면 `/audit-tasks`에서 1:1 위반이 발생한다).
