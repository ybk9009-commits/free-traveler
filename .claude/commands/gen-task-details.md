---
description: docs/tasks/TASK_LIST.md의 각 Task에 대해 상세 파일을 1:1로 생성하고 scripts/audit_tasks.py로 검증한다.
argument-hint: "[Task ID ...] (생략 시 상세 파일이 없는 모든 Task를 대상으로 함)"
---

# /gen-task-details $ARGUMENTS

`docs/tasks/TASK_LIST.md`의 각 행에 대응하는 상세 파일 `docs/tasks/details/<Task ID>.md`를 만든다. `$ARGUMENTS`에 특정 Task ID가 주어지면 그 Task(들)만 (재)생성하고, 없으면 상세 파일이 아직 없는 모든 Task를 대상으로 한다.

## 공통 제약(3개 Pipeline 커맨드 공통)

- `.claude/skills/traveler-project-pipeline/SKILL.md`를 매번 실제로 로드해서 따른다.
- `docs/tasks/TASK_LIST.md`, `docs/UIUX_TRACEABILITY.md`, `design-reference/*`, `scripts/.reports/validate_inputs_report.json` 등 아래 절차가 언급하는 파일은 **실제로 Read**해서 확인한다. 추정하거나 이전 실행 기억으로 대체하지 않는다.
- 이 커맨드는 `docs/tasks/details/*.md`(문서)만 만든다. **`src/app`/`src/components`/`src/lib` 등 실제 구현 코드, Git Branch, Commit은 만들지 않는다.**
- 5단계의 `python scripts/audit_tasks.py` 실패는 절대 무시하지 않는다. Exit code 0이 아니면 "일단 완료로 보고하고 나중에 고치기"를 하지 않으며, 사용자에게 완료를 보고하기 전에 반드시 통과시킨다(또는 통과시키지 못한 이유와 남은 오류를 명확히 실패로 보고한다).

## 절차

1. **Skill을 전부 읽는다.** `.claude/skills/traveler-project-pipeline/SKILL.md`, 특히 §1.3(상세 파일 형식), §3(Screen별 Page Owner 특칙), §5(Page Owner AC 계약), §6~11(DB/정적 데이터/항공숙소/테스트/금지기술/Requirement 커버리지)을 로드한다.

2. **선행 조건을 확인한다.**
   - `docs/tasks/TASK_LIST.md`가 없으면 사용자에게 `/gen-tasklist`를 먼저 실행하라고 안내하고 멈춘다.
   - `python scripts/validate_inputs.py`를 다시 실행해 입력 문서가 그 사이 바뀌지 않았는지 확인한다. 실패하면 멈추고 보고한다.

3. **대상 Task를 정한다.** `$ARGUMENTS`가 있으면 해당 Task ID들, 없으면 TASK_LIST.md에 있지만 `docs/tasks/details/<Task ID>.md`가 없는 모든 Task.

4. **각 대상 Task마다 상세 파일을 SKILL.md §1.3 형식 그대로** 작성한다.
   - `task-meta` JSON 블록은 TASK_LIST.md의 Type/Screen/Depends On/Requirements와 **정확히 일치**해야 한다.
   - **모든 Task**: `expected_files`를 쓰기 전에 실제 `src/app` 트리(`scripts/.reports/validate_inputs_report.json` 또는 재스캔)를 확인해 "신규 생성"인지 "기존 파일 교체/확장"인지 정확히 표기한다(규칙 4).
   - **`page_owner` Task**: `section_order`, `min_content_counts`, `empty_state_required: true`, `forbids_placeholder: true`를 반드시 채운다(SKILL.md §5). Acceptance Criteria에 Section 순서·최소 콘텐츠 수·Empty State 3요소·Placeholder 금지를 명시한다.
     - `PO-SCR-001`(`src/app/page.tsx`): `starter_template_removal_required: true` + create-next-app 스타터 제거를 명시하는 AC(규칙 7).
     - `PO-SCR-003`(`/travel-tools`): 항공·숙소·동행 3개 탭을 실제로 조립한다는 AC(규칙 8).
     - `PO-SCR-005`(`/account`): Guest·Member·Admin 3개 상태를 실제로 조립한다는 AC(규칙 9).
   - **SCR-003의 항공/숙소 관련 `component` Task**: `no_server_persistence: true` + "서버 API·DB·URL query에 입력값을 보내지 않는다"는 Out of Scope 서술(규칙 12).
   - **`db` Task**: `tables` 필드에 `docs/PROJECT_SCOPE.md` §5의 5개 테이블 중 일부만 나열(AUDIT_LOG 금지, 전체 합계 6개 초과 금지, 규칙 10).
   - **`data` Task**: 여행지/안전정보/대표 소개 3개 도메인이 모두 존재하고, DB가 아닌 `src/data/*.ts` 정적 데이터로 서술한다(규칙 11).
   - **Playwright `test` Task**: `browser_projects: ["chromium"]` 고정(규칙 13). 다른 브라우저·부하 테스트·Lighthouse CI를 언급하지 않는다.
   - **모든 Task**: EC2, AWS, 자동/무인 Merge Runner, Lighthouse CI 언급을 넣지 않는다(규칙 14).

5. **상세 생성이 끝나면 반드시 감사를 실행한다(규칙 18).**
   ```
   python scripts/audit_tasks.py
   ```
   - Exit code 0이 될 때까지 실패한 항목을 읽고 TASK_LIST.md 또는 해당 상세 파일을 수정한 뒤 재실행한다.
   - 감사 스크립트가 오탐이라고 판단되면(예: 정당한 이유로 특정 키워드가 필요한 경우) 임의로 무시하지 말고, 사용자에게 왜 그렇게 판단했는지와 어떤 조치를 했는지(수정했는지/그대로 두었는지)를 명시적으로 보고한다.

6. **결과를 요약 보고한다.** 이번에 생성/갱신한 Task ID 목록, 최종 `audit_tasks.py` 실행 결과(통과 여부, 남은 경고), 아직 상세 파일이 없는 Task가 있다면 그 목록을 제시한다.
