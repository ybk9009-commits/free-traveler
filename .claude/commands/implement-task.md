---
description: prepare-task가 READY_TO_IMPLEMENT로 판정한 Task 1개를 실제로 구현한다. Expected Files 안에서만 작업하고, 기본적으로 Commit·Push·PR을 자동 수행하지 않는다.
argument-hint: "<WAVE_ID> <TASK_ID>"
---

# /implement-task $ARGUMENTS

`/prepare-task`가 `READY_TO_IMPLEMENT`로 판정한 Task **정확히 1개**를 구현하는 커맨드다. `CLAUDE.md`의 "Task 완료 순서"(읽기 → 입력 확인 → 구현 → 관련 포맷·Unit Test → 필요 시 Playwright → Diff 확인 → 완료 보고)를 그대로 따르며, 이 커맨드가 그 절차의 실제 실행체다.

## 입력

- `WAVE_ID`, `TASK_ID` — `/prepare-task`와 동일한 두 값.
- 대상은 **항상 Task 1개**다. 여러 `TASK_ID`가 주어지면 실행하지 않고, 사용자에게 Task마다 이 커맨드를 각각 실행해야 한다고 안내한다(CLAUDE.md 규칙 7 — 한 번에 하나만 구현).

## 0단계 — 게이트 확인(필수, 건너뛰지 않는다)

1. `/prepare-task WAVE_ID TASK_ID`를 먼저 실행(또는 그 8단계 게이트를 동일하게 수행)해 현재 상태를 확인한다.
2. 결과가 **`READY_TO_IMPLEMENT`가 아니면 여기서 멈춘다.** 반환된 `BLOCKED_*` 상태와 근거를 그대로 보고하고, 어떤 파일도 만들거나 고치지 않는다. "일단 구현해보고 문제가 있으면 나중에 고친다" 식으로 우회하지 않는다.
3. `READY_TO_IMPLEMENT`일 때만 아래 절차로 진행한다.

## 절차 (CLAUDE.md "Task 완료 순서")

1. **Task 읽기** — `docs/tasks/details/<TASK_ID>.md`(없으면 `TASKS/00_TASK_LIST.md`의 해당 항목)를 다시 Read해 Expected Files·Functional AC·Visual AC·Security/Privacy AC·Depends On·Verify를 확인한다.
2. **입력 확인** — Depends On의 선행 Task들이 실제로 존재하는지(Expected Files 실측) 다시 한 번 확인한다. `/prepare-task` 실행 이후 상태가 바뀌었을 수 있다.
3. **구현**
   - **Expected Files 목록 안에서만** 파일을 만들거나 수정한다. 목록 밖의 파일은 절대 건드리지 않는다(CLAUDE.md 규칙 8).
   - Functional AC·Visual AC·Security/Privacy AC를 전부 만족하도록 구현한다. AC에 없는 기능을 추가하지 않는다(범위 확장 금지).
   - **Page Owner Task**(`type: page_owner`, `src/app/*/page.tsx`)라면 새 시각 요소를 직접 만들지 않고, Depends On에 있는 이미 구현된 Component/Data/API Task의 산출물을 Page Entry에서 **실제로 조립**만 한다. 조립 대상 Component가 아직 구현되어 있지 않으면(파일 없음) 즉시 멈추고 `BLOCKED_DEPENDENCY`처럼 보고한다 — 직접 대신 구현하지 않는다.
   - `docs/ARCHITECTURE.md` §3의 Server/Client Component 경계, §4·§5의 항공·숙소 입력값 비전달 원칙, §8~§11의 DB/RLS/ORM 경계를 지킨다.
4. **관련 Unit Test 실행** — Task의 `Verify`에 명시된 Vitest Unit Test가 있으면 실행한다. 실패하면 통과할 때까지 고치거나, 고칠 수 없는 이유를 명확히 보고한다(조용히 건너뛰지 않는다).
5. **필요 시 Playwright 실행** — **이 Task가 `page_owner`이거나 Task 자신이 E2E Test(`TEST-E2E-*`)일 때만** 관련 Playwright Chromium Smoke Spec을 실행한다. 그 외 `component`/`data`/`db`/`api`/`infra` Task에서는 Playwright를 실행하지 않는다(불필요한 전체 E2E 재실행 방지).
6. **Diff 확인** — `git status --porcelain`과 `git diff`로 실제 변경분이 Expected Files 목록과 정확히 일치하는지 확인한다. 목록 밖 파일이 바뀌었으면 되돌리거나(신중하게) 사용자에게 알리고 그 이유를 밝힌다.
7. **완료 보고** — 아래 "보고 형식"대로 보고한다.

## 금지 사항 (CLAUDE.md와 동일, 이 커맨드에서도 재확인)

- **AWS·EC2를 추가하지 않는다** — 클라우드 VM/AWS 리소스를 직접 구성하는 코드·설정·워크플로를 만들지 않는다.
- **ORM을 추가하지 않는다** — Prisma·Drizzle 등 어떤 ORM/쿼리 빌더도 도입하지 않는다. DB 접근은 Supabase JS Client + `supabase/migrations/*.sql`만 사용한다.
- **자동 Merge 기능을 추가하지 않는다** — CI 워크플로에 자동 병합 트리거를 넣지 않는다.
- `EXCLUDED` Requirement에 해당하는 기능을 구현하지 않는다(`docs/UIUX_TRACEABILITY.md`, `docs/PROJECT_SCOPE.md` §8).
- `SUPABASE_SERVICE_ROLE_KEY` 등 서버 전용 시크릿을 Client Component·`NEXT_PUBLIC_` 변수로 노출하지 않는다.

## Commit·Push·PR 정책

- **기본값: 아무것도 하지 않는다.** 이 커맨드는 구현이 끝나도 `git add`/`git commit`/`git push`/PR 생성을 스스로 실행하지 않는다.
- **사용자가 이번 요청에서 명시적으로 Commit을 요청한 경우에만**, 지금 완료한 **이 Task의 Expected Files만** `git add`한 뒤(다른 미관련 변경분은 포함하지 않는다) Task ID와 제목을 포함한 커밋 메시지로 **Task 단위 Commit 1개까지만** 수행한다.
- **Push와 PR 생성은 이 커맨드가 절대 하지 않는다** — 사용자가 요청해도 이 커맨드 범위 밖이며, 이는 "PR·Merge는 사용자가 수동 수행"(`docs/DECISION_LOG.md` DEC-012) 결정에 따른다. Push/PR이 필요하면 사용자가 별도로 직접 요청·수행해야 함을 안내한다.

## 보고 형식

완료(또는 중단) 시 아래 3가지를 항상 함께 보고한다(CLAUDE.md 규칙 23).

1. **변경 파일** — 실제로 만들거나 수정한 파일 목록(Expected Files와 1:1 대조).
2. **검증 결과** — 실행한 포맷/Lint/타입체크/Unit Test/Playwright 각각의 통과 여부(무엇을 실행하지 않았는지도 명시, 예: "component Task라 Playwright는 실행하지 않음").
3. **남은 제약사항** — 이 Task의 AC 중 의도적으로 뒤로 미룬 부분, 다음 Task가 채워야 할 의존 관계, Commit을 했다면 그 커밋 해시, 하지 않았다면 "Commit 없음"을 명시.
