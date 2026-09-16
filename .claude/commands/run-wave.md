---
description: 한 Wave 안의 Task를 Depends On 순서로 하나씩 prepare-task→implement-task 규칙에 따라 처리한다. status/resume/dry-run 서브커맨드를 지원하며, Branch·PR·Merge는 어떤 경우에도 수행하지 않는다.
argument-hint: "<WXX> | status | resume | dry-run <WXX>"
---

# /run-wave $ARGUMENTS

`/prepare-task`(게이트)와 `/implement-task`(구현) 규칙을 하나의 Wave 전체에 반복 적용하는 오케스트레이션 커맨드다. `CLAUDE.md` 규칙 6·7·10·11·22(Wave 단위 실행, Depends On 순서로 하나씩, Single Agent 순차 처리, Preview Checkpoint 전 다음 Wave 진행 금지)를 그대로 실행한다.

## 지원 명령

- `/run-wave W03` — Wave `W03`을 새로 시작하거나 이어서 진행한다.
- `/run-wave status` — 아무것도 실행하지 않고 현재 Wave/Task 상태만 보고한다(읽기 전용).
- `/run-wave resume` — 마지막으로 활성화됐던 Wave를 `WAVE_STATE`에서 찾아 그 지점부터 이어서 진행한다.
- `/run-wave dry-run W03` — Wave `W03`을 실제로 구현하지 않고, 지금 실행하면 어떤 순서로 어떤 Task가 선택될지와 각 Task가 현재 `READY_TO_IMPLEMENT`인지만 시뮬레이션해 보고한다(파일·상태 변경 없음).

## 정본 상태 파일

- **`WAVE_PLAN`** = `TASKS/WAVE_PLAN.md` — `scripts/build_waves.py`가 생성하는 Wave→Task ID 목록·순서·Checkpoint 위치의 정본. 이 커맨드는 이 파일을 **읽지만 수정하지 않는다.** 파일이 없으면 모든 서브커맨드는 "`python scripts/build_waves.py`를 먼저 실행하라"고 안내하고 멈춘다.
- **`WAVE_STATE`** = `TASKS/WAVE_STATE.json` — `scripts/build_waves.py`가 최초 생성하고(모든 Wave `status: "pending"`), 이 커맨드가 실행 중 갱신하는 상태 파일. 실제 스키마(최소 필드):
  ```json
  {
    "schema_version": "traveler-wave-state-v1",
    "generated_at": "2026-...",
    "waves": [
      {
        "wave_id": "W03",
        "title": "...",
        "task_ids": ["..."],
        "status": "pending | in_progress | blocked | completed",
        "checkpoint_required": true,
        "checkpoint_result": null
      }
    ]
  }
  ```
  - 이 스키마에는 **Task 단위 상태 필드가 없다.** Wave 안에서 "어느 Task까지 끝났는지"는 이 커맨드가 매번 해당 Task의 `Expected Files`(상세 파일에서 읽음)가 실제로 디스크에 존재하는지 **실측**해서 판단한다(`/prepare-task` 3단계와 동일한 방식) — JSON에 별도로 기록하지 않는다.
  - 이 커맨드가 `waves[].status`/`waves[].checkpoint_result`를 바꾸는 시점은 §ᅟ절차 1·5·6·8에서만이다. 그 외에는 이 JSON을 직접 편집하지 않는다.
  - 파일이 없으면 부트스트랩하지 않고 멈춘다(부트스트랩은 `build_waves.py`의 책임).

## `/run-wave WXX` 절차

1. **읽기** — `WAVE_PLAN`과 `WAVE_STATE`를 Read한다. `WXX`에 대응하는 wave 항목의 `status`가 `pending`이면 `in_progress`로 갱신한다(이미 `in_progress`/`completed`면 그대로 두고 이어서 진행/보고).
2. **다음 Task 선택** — `WAVE_STATE.waves[WXX].task_ids`(이미 Task ID 오름차순으로 저장돼 있다) 중, 아직 완료되지 않은(= Expected Files가 전부 존재하지 않는) 첫 Task를 그 순서대로 골라 **정확히 1개**를 고른다. 이미 완료된 것으로 보이는 Task는 건너뛴다. 후보가 없으면(전부 완료) 8단계로 간다.
3. **게이트 검사** — 선택된 Task에 대해 `/prepare-task WXX TASK_ID`의 8단계 게이트를 그대로 수행한다.
   - `READY_TO_IMPLEMENT`가 아니면 **여기서 전체 실행을 멈춘다.** 다른 Task로 건너뛰지 않는다 — Working Tree 오염·범위 위반 같은 조건은 대개 다른 Task에도 영향을 주는 전역 조건이기 때문이다. `WAVE_STATE.waves[WXX].status = "blocked"`로 갱신하고, 반환된 `BLOCKED_*` 상태와 Task ID를 그대로 보고하고 종료한다.
4. **구현** — `/implement-task WXX TASK_ID`의 절차(Expected Files 범위, Functional/Visual/Security AC 준수, Page Owner는 조립만, 관련 Unit Test, Page Owner/E2E일 때만 Playwright)를 그대로 수행한다.
5. **검증 결과 처리**
   - 관련 검증(Unit Test, 해당 시 Playwright)이 **전부 PASS**하면 이 Task는 완료로 본다(Expected Files 존재로 다음 실행 시 자동 판별된다 — JSON에 따로 기록하지 않는다).
   - 하나라도 FAIL이면 `WAVE_STATE.waves[WXX].status = "blocked"`로 갱신하고 **여기서 전체 실행을 멈춘다.** 실패 내용을 그대로 보고한다(다른 Task로 넘어가 실패를 덮지 않는다).
6. **Checkpoint 확인** — 방금 완료된 Task가 이 Wave의 마지막 Task이고 `WAVE_STATE.waves[WXX].checkpoint_required`가 `true`이면(예: 한 Screen의 Page Owner Task로 끝나는 Wave), `checkpoint_result`가 아직 `"CLEARED"`가 아닌 한 **여기서 멈추고** `checkpoint_result = "WAITING_FOR_PREVIEW"`로 갱신한 뒤 `WAITING_FOR_PREVIEW`로 종료한다(`CLAUDE.md` 규칙 22 — 사람의 Preview 확인 전에는 다음으로 진행하지 않는다).
7. **다음 Task로 반복** — Checkpoint 대기가 아니면 2단계로 돌아가 같은 Wave의 다음 미완료 Task를 계속 처리한다.
8. **Wave 완료** — 이 Wave의 모든 Task가 완료됐고(Checkpoint가 필요 없거나 이미 `CLEARED`라면) `status = "completed"`로 갱신하고 `WAVE_COMPLETE`로 종료한다.

## `/run-wave status`

- `WAVE_STATE`(와 `WAVE_PLAN`)만 Read해서 표로 보고한다: 각 Wave의 `wave_id`/`status`/`checkpoint_required`/`checkpoint_result`, 그 Wave 안에서 Expected Files 기준으로 몇 개 Task가 완료된 것으로 보이는지, 다음에 선택될 Task.
- **아무 파일도 수정하지 않는다.**

## `/run-wave resume`

- `WAVE_STATE.waves[]`에서 `status`가 `in_progress` 또는 `blocked`인 Wave를 찾는다(보통 1개). 여러 개면 `wave_id`가 가장 앞선 것부터 보고하고 사용자에게 어느 것을 재개할지 확인한다.
- 찾은 Wave ID로 위 "`/run-wave WXX` 절차"를 1단계부터 다시 시작한다(시간이 지났으므로 Working Tree 등 조건을 다시 확인해야 한다).
- `in_progress`/`blocked` Wave가 없으면(전부 `pending` 또는 `completed`) 그 사실을 보고하고 아무것도 하지 않는다.
- `checkpoint_result == "WAITING_FOR_PREVIEW"`인 Wave를 재개하는 것은 **사람이 Preview를 확인했다는 사용자의 명시적 언급이 있을 때만** 한다. 언급이 없으면 아직 Preview 대기 중임을 보고하고 멈춘다.

## `/run-wave dry-run WXX`

- 1~3단계(읽기 → 다음 Task 선택 → 게이트 검사)까지만, **실제 구현·Unit Test·Playwright 실행 없이** 반복 시뮬레이션한다.
- 각 가상 단계에서 "이 Task가 실제로 DONE이 됐다고 가정"하고 다음 후보를 계속 골라, Wave 끝까지(또는 첫 Checkpoint·첫 게이트 실패까지) 예상 실행 순서를 표로 제시한다.
- **`WAVE_STATE`를 포함해 어떤 파일도 쓰지 않는다.** 예상 결과에는 "이는 시뮬레이션이며 실제 실행 시 Working Tree 상태 등이 다르면 결과가 달라질 수 있다"는 문구를 반드시 포함한다.

## 이 Command가 절대 하지 않는 것

- **자동 Branch 생성·전환을 하지 않는다.**
- **자동 PR 생성을 하지 않는다.**
- **자동 Merge를 하지 않는다.**
- 위 3가지는 사용자가 `/run-wave` 호출 안에서 명시적으로 요청해도 수행하지 않는다 — Branch/PR/Merge는 이 커맨드의 범위 밖이며 사용자가 별도로 직접 수행한다(`docs/DECISION_LOG.md` DEC-011, DEC-012).
- **Commit**은 `/implement-task`와 동일한 정책을 그대로 물려받는다: 기본적으로 하지 않으며, 사용자가 명시적으로 요청한 경우에만 각 Task가 `DONE`이 될 때마다 그 Task의 Expected Files만 담아 Task 단위 Commit을 허용한다(Wave 전체를 한 커밋으로 묶지 않는다).
- 같은 Wave 안에서 두 Task를 동시에(병렬로) 구현하지 않는다 — 항상 하나씩 순차로 처리한다(`CLAUDE.md` 규칙 7, DEC-011).

## 보고 형식

- 각 Task 처리 후: Task ID, 최종 상태(`DONE`/`BLOCKED_*`), 실행한 검증과 결과.
- 종료 시 최종 결론을 첫 줄에 단독으로 명시한다: `WAVE_COMPLETE` / `WAITING_FOR_PREVIEW` / `BLOCKED_*`(중단된 Task 기준) 중 하나.
- 처리된 Task 목록과 남은 Task 목록을 표로 제시하고, 멈췄다면 다음 행동(예: Working Tree 정리 후 `/run-wave resume`, Preview 확인 후 재개, `python scripts/build_waves.py` 재실행으로 `TASKS/WAVE_PLAN.md` 보완)을 안내한다.
