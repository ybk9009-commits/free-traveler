---
description: 한 Wave 안의 Task를 Depends On 순서로 하나씩 prepare-task→implement-task 규칙에 따라 처리한다. --status/--dry-run/--resume 옵션을 지원하며, 이전 Wave 미완료·Task Blocked 시 즉시 멈추고, Browser Checkpoint 통과 전에는 다음 Wave로 진행하지 않는다. Branch·PR·Merge는 어떤 경우에도 수행하지 않는다.
argument-hint: "<WAVE_ID> [--dry-run|--resume|--status]"
---

# /run-wave $ARGUMENTS

`/prepare-task`(게이트)와 `/implement-task`(구현) 규칙을 하나의 Wave 전체에 반복 적용하는 오케스트레이션 커맨드다. `CLAUDE.md` 규칙 6·7·8·22(Wave 단위 실행, Depends On 순서로 하나씩, Expected Files 밖 금지, Preview Checkpoint 전 다음 Wave 진행 금지)와 `scripts/build_waves.py`가 보장하는 Wave 순차성을 실행 시점에도 그대로 지킨다.

## 입력

- `WAVE_ID` — 진행할 Wave 식별자(예: `W03`). **모든 호출에 필수다** — 옵션 없이도, 어떤 옵션과 함께여도 항상 지정한다.
- 선택 옵션(상호 배타적 — 동시에 두 개 이상 지정하면 사용 방법을 안내하고 멈춘다):
  - `--status` — 지정한 Wave와 그 안의 Task 상태만 보여준다. 읽기 전용.
  - `--dry-run` — 지금 실행하면 어떤 Task를 고르고, 어떤 파일을 만들고, 어떤 검증을 돌리고, Checkpoint에 걸리는지만 시뮬레이션해 보여준다. 읽기 전용.
  - `--resume` — 이 Wave가 `blocked`였거나 중단된 상태여도, 첫 `pending` 또는 `blocked` Task부터 게이트 검사를 다시 수행하며 이어서 진행한다.
  - 옵션이 없으면(**기본 동작**): `pending` Task를 Depends On 순서로 **한 개씩** `prepare` → `implement` 한다.

## 지원 명령

- `/run-wave W03` — 기본 동작. Wave `W03`의 pending Task를 하나씩 처리한다.
- `/run-wave W03 --status` — Wave `W03`과 그 Task들의 현재 상태만 보고한다(아무것도 수정하지 않음).
- `/run-wave W03 --dry-run` — Wave `W03`을 실제로 건드리지 않고 예상 실행 순서·파일·검증·Checkpoint만 보고한다(아무것도 수정하지 않음).
- `/run-wave W03 --resume` — Wave `W03`이 `blocked`이거나 중단된 상태여도 첫 pending/blocked Task부터 게이트를 다시 검사하며 이어서 진행한다.

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
  - `waves[]`는 항상 `wave_id` 오름차순(`W01`, `W02`, ...)으로 저장되며, 이 순서가 곧 Wave 실행 순서다(`build_waves.py`가 순환·순서 위반을 이미 검사해 배치했다).
  - 이 스키마에는 **Task 단위 상태 필드가 없다.** Wave 안에서 "어느 Task까지 끝났는지"는 이 커맨드가 매번 해당 Task의 `Expected Files`(상세 파일에서 읽음)가 실제로 디스크에 존재하는지 **실측**해서 판단한다(`/prepare-task` 3단계와 동일한 방식) — JSON에 별도로 기록하지 않는다.
  - 이 커맨드가 `waves[].status`/`waves[].checkpoint_result`를 바꾸는 시점은 §"기본 동작" 절차의 해당 단계에서만이다. 그 외에는 이 JSON을 직접 편집하지 않는다(`--status`/`--dry-run`은 절대 쓰지 않는다).
  - 파일이 없으면 부트스트랩하지 않고 멈춘다(부트스트랩은 `build_waves.py`의 책임).

## 공통 사전 확인 — 이전 Wave 완료 여부(규칙 1)

**옵션 여부와 관계없이 매 호출마다 가장 먼저** 확인한다.

1. `WAVE_STATE.waves[]`에서 `WAVE_ID`의 배열 인덱스를 찾는다. 없으면 `BLOCKED_INPUT`(존재하지 않는 Wave ID)으로 멈춘다.
2. 인덱스가 0(즉 `WAVE_ID`가 목록의 첫 Wave, 보통 `W01`)이면 이 확인을 건너뛴다(앞 Wave가 없음).
3. 그 외에는 배열에서 바로 앞(인덱스 - 1)에 있는 Wave의 `status`를 읽는다.
   - `status`가 `completed`가 아니면: **기본 동작과 `--resume`은 여기서 멈춘다.** 결론을 `BLOCKED_PREVIOUS_WAVE`로 보고하고, 앞 Wave의 `wave_id`·`status`와 "그 Wave를 먼저 완료(또는 `/run-wave <앞 Wave ID> --resume`으로 재개)하라"는 안내를 출력한다. `WAVE_STATE`는 아직 수정하지 않는다(이 Wave를 `in_progress`로 바꾸지 않는다).
   - **`--status`/`--dry-run`은 이 조건으로 멈추지 않는다.** 위반 사실("앞 Wave `W0X`가 아직 `completed`가 아님")을 보고 내용에 포함하고 계속 진행한다 — 두 옵션은 정보 제공이 목적이기 때문이다.

## `/run-wave WXX` 절차 (기본 동작)

1. 위 "공통 사전 확인"을 통과해야 한다(실패 시 그 결과대로 종료).
2. **읽기** — `WAVE_PLAN`과 `WAVE_STATE`를 Read한다.
   - 현재 `status`가 `blocked`이면 **여기서 멈춘다.** "이 Wave는 이전에 blocked 상태로 멈췄다 — 이어서 진행하려면 `/run-wave WXX --resume`을 사용하라"고 안내하고 `BLOCKED_NEEDS_RESUME`으로 종료한다(사용자가 실수로 이전 실패를 못 보고 넘기지 않도록, 명시적 재개 의사 없이는 `blocked` Wave를 기본 동작으로 계속하지 않는다).
   - `status`가 `pending`이면 `in_progress`로 갱신한다. 이미 `in_progress`/`completed`면 그대로 두고 이어서 진행/보고한다.
3. **다음 Task 선택** — `WAVE_STATE.waves[WXX].task_ids`(Task ID 오름차순으로 저장돼 있다) 중, 아직 완료되지 않은(= Expected Files가 전부 존재하지 않는) 첫 Task를 그 순서대로 골라 **정확히 1개**를 고른다. 이미 완료된 것으로 보이는 Task는 건너뛴다. 후보가 없으면(전부 완료) 9단계로 간다.
4. **게이트 검사** — 선택된 Task에 대해 `/prepare-task WXX TASK_ID`의 8단계 게이트를 그대로 수행한다.
   - `READY_TO_IMPLEMENT`가 아니면(**규칙 2**) **여기서 전체 실행을 멈춘다.** 다른 Task로 건너뛰지 않는다 — Working Tree 오염·범위 위반 같은 조건은 대개 다른 Task에도 영향을 주는 전역 조건이기 때문이다. `WAVE_STATE.waves[WXX].status = "blocked"`로 갱신하고, 반환된 `BLOCKED_*` 상태와 Task ID를 그대로 보고하고 종료한다.
5. **구현** — `/implement-task WXX TASK_ID`의 절차(Expected Files 범위, Functional/Visual/Security AC 준수, Page Owner는 조립만)를 그대로 수행한다.
6. **검증 결과 처리(규칙 3)** — 이 Task의 상세 파일 `Verify` 필드에 지정된 검증만 실행한다(그 이상의 임의 검증을 추가하지 않고, 명시된 것을 건너뛰지도 않는다): 관련 Unit Test, 해당 시(Page Owner 또는 `TEST-E2E-*` 자신일 때만) Playwright.
   - **전부 PASS**하면 이 Task는 완료로 본다(Expected Files 존재로 다음 실행 시 자동 판별된다 — JSON에 따로 기록하지 않는다).
   - 하나라도 FAIL이면(**규칙 2**) `WAVE_STATE.waves[WXX].status = "blocked"`로 갱신하고 **여기서 전체 실행을 멈춘다.** 실패 내용을 그대로 보고한다(다른 Task로 넘어가 실패를 덮지 않는다).
7. **Browser Checkpoint 확인(규칙 4)** — 방금 완료된 Task가 이 Wave의 마지막 Task이고, 이 Wave에 Page Owner Task가 포함되어 있어 `WAVE_STATE.waves[WXX].checkpoint_required`가 `true`이면, `checkpoint_result`가 아직 `"CLEARED"`가 아닌 한 **여기서 멈추고** `checkpoint_result = "WAITING_FOR_PREVIEW"`로 갱신한 뒤 `WAITING_FOR_PREVIEW`로 종료한다 — 사람이 실제 Browser(Vercel Preview 등)에서 화면을 확인하기 전에는 진행하지 않는다(`CLAUDE.md` 규칙 22).
8. **다음 Task로 반복** — Checkpoint 대기가 아니면 3단계로 돌아가 같은 Wave의 다음 미완료 Task를 계속 처리한다.
9. **Wave 완료** — 이 Wave의 모든 Task가 완료됐고(Checkpoint가 필요 없거나 이미 `CLEARED`라면) `status = "completed"`로 갱신하고 `WAVE_COMPLETE`로 종료한다. **이 커맨드는 여기서 다음 Wave(예: `W(XX+1)`)로 자동 진행하지 않는다(규칙 5).** 사람의 확인 후 사용자가 별도로 `/run-wave W(XX+1)`을 호출해야 한다.

## `/run-wave WXX --status`

- "공통 사전 확인"을 실행하되(위반이어도 멈추지 않고 보고에 포함), `WAVE_PLAN`과 `WAVE_STATE`만 Read해서 **지정한 `WXX` 하나에 대해서만** 표로 보고한다: `wave_id`/`status`/`checkpoint_required`/`checkpoint_result`, 이전 Wave 완료 여부, 그 Wave 안의 각 Task ID와 Expected Files 기준 완료 여부(완료/pending/이전 실행에서 blocked였는지), 다음에 선택될 Task.
- **아무 파일도 수정하지 않는다.**

## `/run-wave WXX --resume`

- "공통 사전 확인"을 그대로 적용한다 — 이전 Wave가 `completed`가 아니면 `--resume`도 `BLOCKED_PREVIOUS_WAVE`로 멈춘다(재개 대상은 `WXX`이지 그 앞 Wave가 아니다).
- 기본 동작과 달리, `WAVE_STATE.waves[WXX].status`가 `blocked`여도(또는 `in_progress`로 남아 중단된 상태여도) 2단계의 "blocked면 멈추고 --resume 안내" 분기를 적용하지 않고 곧바로 통과시킨다.
- `task_ids` 중 첫 `pending`(Expected Files 미완성) 또는 직전 실행에서 `blocked`를 유발한 것으로 보이는 Task부터, 위 "기본 동작" 절차의 4단계(게이트 검사)부터 다시 시작한다 — 시간이 지났으므로 Working Tree 등 조건을 처음부터 다시 확인한다.
- 이후 흐름(구현 → 검증 → Checkpoint → 반복 → 완료)은 기본 동작과 동일하다.

## `/run-wave WXX --dry-run`

- "공통 사전 확인"을 먼저 시뮬레이션해 보고한다(이전 Wave가 미완료면 그 사실을 "실제 실행 시 `BLOCKED_PREVIOUS_WAVE`로 즉시 멈춤"이라고 명시하되, 계속 진행해 아래 시뮬레이션도 보여준다).
- 기본 동작 절차의 3~4단계(다음 Task 선택 → 게이트 검사)까지만, **실제 구현·Unit Test·Playwright 실행 없이** 반복 시뮬레이션한다.
- Task마다 다음을 표로 제시한다: Task ID, 예상 Expected Files 목록, 게이트 결과(`READY_TO_IMPLEMENT`/`BLOCKED_*`), 실행될 최소 검증(Verify 필드 그대로), 이 Task가 Wave의 마지막이면서 Checkpoint가 걸리는지 여부.
- 각 가상 단계에서 "이 Task가 실제로 DONE이 됐다고 가정"하고 다음 후보를 계속 골라, Wave 끝까지(또는 첫 Checkpoint·첫 게이트 실패까지) 예상 실행 순서를 제시한다.
- **`WAVE_STATE`를 포함해 어떤 파일도 쓰지 않는다.** 보고에는 "이는 시뮬레이션이며 실제 실행 시 Working Tree 상태 등이 다르면 결과가 달라질 수 있다"는 문구를 반드시 포함한다.

## 이 Command가 절대 하지 않는 것

- **자동 Branch 생성·전환을 하지 않는다.**
- **자동 PR 생성을 하지 않는다.**
- **자동 Merge를 하지 않는다.**
- 위 3가지는 사용자가 `/run-wave` 호출 안에서 명시적으로 요청해도 수행하지 않는다 — Branch/PR/Merge는 이 커맨드의 범위 밖이며 사용자가 별도로 직접 수행한다(`docs/DECISION_LOG.md` DEC-011, DEC-012; **규칙 6**).
- **Commit**은 `/implement-task`와 동일한 정책을 그대로 물려받는다: 기본적으로 하지 않으며, 사용자가 명시적으로 요청한 경우에만 각 Task가 `DONE`이 될 때마다 그 Task의 Expected Files만 담아 Task 단위 Commit을 허용한다(Wave 전체를 한 커밋으로 묶지 않는다).
- 같은 Wave 안에서 두 Task를 동시에(병렬로) 구현하지 않는다 — 항상 하나씩 순차로 처리한다(`CLAUDE.md` 규칙 7, DEC-011).
- **Wave를 완료해도 다음 Wave를 이어서 실행하지 않는다(규칙 5)** — 사람이 Browser Checkpoint를 확인하기 전에는(Checkpoint가 없는 Wave라도) 항상 사용자의 다음 `/run-wave` 호출을 기다린다.

## 종료 보고

1. 최종 결론을 첫 줄에 단독으로 명시한다: `WAVE_COMPLETE` / `WAITING_FOR_PREVIEW` / `BLOCKED_PREVIOUS_WAVE` / `BLOCKED_NEEDS_RESUME` / `BLOCKED_*`(중단된 Task 기준) 중 하나. `--status`/`--dry-run`은 `STATUS_REPORT`/`DRY_RUN_REPORT`로 시작한다.
2. 아래 5가지를 항상 함께 보고한다:
   - **완료 Task** — 이번 호출에서 새로 `DONE`이 된 Task ID 목록(표: Task ID/최종 상태/실행한 검증과 결과).
   - **변경 파일** — 실제로 만들거나 수정한 파일 목록(Expected Files와 1:1 대조). `--status`/`--dry-run`이면 "없음(읽기 전용)".
   - **통과한 검사** — Task별로 실행한 포맷/Lint/타입체크/Unit Test/Playwright 각각의 통과 여부(무엇을 실행하지 않았는지도 명시).
   - **남은 수동 Browser 확인** — `checkpoint_required`인 Wave가 `WAITING_FOR_PREVIEW`로 멈췄다면 어떤 화면(Screen/Route)을 사람이 확인해야 하는지, 이미 `CLEARED`이거나 Checkpoint가 필요 없으면 "없음".
   - **다음에 입력할 명령** — 사용자가 바로 이어서 입력할 정확한 명령 한 줄(예: Preview 확인 후 `/run-wave W08`(다음 Wave), 실패 해결 후 `/run-wave W03 --resume`, Wave 정의 보완이 필요하면 `python scripts/build_waves.py`).
3. 처리된 Task 목록과 남은 Task 목록을 표로 제시한다.
