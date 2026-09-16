---
description: docs/tasks/TASK_LIST.md와 상세 파일을 SKILL.md 규칙에 따라 읽기 전용으로 재검사한다.
---

# /audit-tasks

`scripts/audit_tasks.py`를 실행해 현재 `docs/tasks/TASK_LIST.md`와 `docs/tasks/details/*.md`가 `.claude/skills/traveler-project-pipeline/SKILL.md`의 규칙을 충족하는지 다시 확인한다. **이 커맨드는 어떤 파일도 수정하지 않는다** — 문서든 구현 코드든 만들거나 고치지 않는다. 문제를 고치려면 `/gen-task-details`를 사용한다.

## 공통 제약(3개 Pipeline 커맨드 공통)

- `.claude/skills/traveler-project-pipeline/SKILL.md`를 매번 실제로 로드해서 따른다.
- `python scripts/audit_tasks.py`는 **실제로 실행**하고 그 실제 stdout/exit code만 근거로 보고한다 — 과거 실행 결과를 추정해 재사용하거나 결과를 예측해서 보고하지 않는다.
- 이 커맨드는 어떤 구현 코드나 Task 문서도 새로 만들지 않는다(읽기 전용).
- **Task Audit 실패를 무시하지 않는다.** Exit code가 0이 아니면 어떤 경우에도 "감사 통과"라고 보고하지 않고, 오류 전체를 사용자에게 보여준다. 오류가 경미해 보이더라도 스스로 판단해 조용히 넘어가지 않는다.

## 절차

1. 실행한다.
   ```
   python scripts/audit_tasks.py
   ```

2. 출력의 오류(errors)와 경고(warnings)를 규칙 번호별로 그룹핑해 사용자에게 보고한다. 각 오류에 대해 다음을 함께 제시한다.
   - 위반한 SKILL.md 규칙 번호와 이름
   - 관련 Task ID / 상세 파일 경로
   - 고치는 방법(`/gen-task-details <Task ID>`로 재생성 vs `docs/tasks/TASK_LIST.md` 직접 수정)

3. Exit code가 0이면 "감사 통과"를 보고하고 끝낸다. Task 개수(45~65 등)는 통과/실패 판정에 쓰지 않는다 — `audit_tasks.py`의 규칙 검사 결과만이 기준이다.

4. Exit code가 0이 아니면 오류 개수와 함께, 사용자가 원하면 `/gen-task-details`로 넘어갈 수 있음을 안내한다. 이 커맨드 스스로는 아무것도 고치지 않는다.
