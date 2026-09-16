---
description: WAVE_ID/TASK_ID를 받아 착수 전 8단계 게이트를 검사하고 READY_TO_IMPLEMENT 또는 BLOCKED_* 상태 하나만 보고한다. 코드를 수정하지 않는다.
argument-hint: "<WAVE_ID> <TASK_ID>"
---

# /prepare-task $ARGUMENTS

Task 구현에 실제로 착수하기 전, 지금 시작해도 안전한지 8가지를 순서대로 검사하는 읽기 전용 게이트다. `traveler-project-pipeline` Skill과 `docs/tasks/TASK_LIST.md`/`docs/tasks/details/*.md`(SKILL.md 규격)를 정본으로 삼는다.

## 입력

- `WAVE_ID` — 이번에 진행 중인 Wave 식별자 (예: `W01`)
- `TASK_ID` — 착수하려는 Task ID (예: `PO-SCR-001`, `CMP-SCR-001-hero-search`)
- **선택된 상세 Task 파일** — `docs/tasks/details/<TASK_ID>.md`. 이 파일이 없으면 `TASKS/00_TASK_LIST.md`의 해당 항목을 대체 입력으로 쓰고, 대체 입력을 썼다는 사실을 보고에 반드시 명시한다.

## 출력 (다음 중 정확히 하나만 최종 결론으로 보고한다)

- `READY_TO_IMPLEMENT`
- `BLOCKED_INPUT`
- `BLOCKED_DEPENDENCY`
- `BLOCKED_DIRTY_TREE`
- `BLOCKED_SCOPE`

## 이 Command가 절대 하지 않는 것

- **코드를 수정하지 않는다.** `src/app`/`src/components`/`src/lib` 등 어떤 구현 파일도 만들거나 고치지 않는다.
- `docs/tasks/*.md` 등 문서도 수정하지 않는다(순수 읽기 전용 게이트).
- `git add`/`git commit`/`git checkout`/`git stash` 등 어떤 git 상태 변경 명령도 실행하지 않는다 — 조회 명령(`git status`, `git diff`)만 사용한다.
- `.env`/`.env.local` 등에 실제로 들어있는 시크릿 **값**을 읽거나 출력하지 않는다. 환경변수는 항상 이름만 확인한다.

## 절차 — 8단계 게이트

**8단계를 이 순서대로 실행하고, 처음으로 실패하는 단계에서 즉시 멈춘 뒤 그 단계에 매핑된 상태를 최종 결론으로 보고한다.** 뒤 단계는 실행하지 않는다(앞 단계가 이미 착수 불가를 확정했으므로).

### 1. Working Tree 상태 → 실패 시 `BLOCKED_DIRTY_TREE`
- `git status --porcelain`을 실행한다.
- 출력이 비어 있지 않으면(커밋되지 않은 변경·추적되지 않은 파일이 있으면) 그 목록 전체를 그대로 보여주고 `BLOCKED_DIRTY_TREE`로 멈춘다. 되돌리거나 커밋하려 시도하지 않는다 — 사용자의 진행 중인 작업일 수 있다.

### 2. Task가 현재 Wave에 포함되는지 → 실패 시 `BLOCKED_INPUT`
- Wave→Task 매핑 정본은 `TASKS/WAVE_PLAN.md`(`scripts/build_waves.py` 산출물)다. 이 파일을 Read한다.
  - 파일이 없으면 "Wave 정의 파일(`TASKS/WAVE_PLAN.md`)이 없다 — `python scripts/build_waves.py`를 먼저 실행하라"고 명시하고 `BLOCKED_INPUT`.
  - `WAVE_ID`가 문서에 없으면 `BLOCKED_INPUT`.
  - `TASK_ID`가 해당 `WAVE_ID`의 Task 목록에 없으면 `BLOCKED_INPUT`(다른 Wave에 속해 있다면 어느 Wave인지 알려준다).

### 3. Depends On 완료 여부 → 실패 시 `BLOCKED_DEPENDENCY`
- 상세 Task 파일의 `task-meta.depends_on`(대체 입력을 썼다면 `TASKS/00_TASK_LIST.md`의 Depends On 열)을 읽는다.
- 각 의존 Task의 Expected Files가 실제로 존재하는지 Glob/Read로 실측한다.
- 하나라도 존재하지 않으면 `BLOCKED_DEPENDENCY`로 멈추고, 어떤 의존 Task의 어떤 파일이 없는지 목록으로 제시한다.
- (참고 신호) `docs/tasks/TASK_LIST.md`/`TASKS/00_TASK_LIST.md`의 Status 열이 `DONE`이 아닌데 파일이 이미 존재하는 경우도 함께 보고한다 — 차단 여부는 파일 존재로만 판단하고, Status 열의 불일치는 참고 사항으로만 덧붙인다.

### 4. Expected Files → 실패 시 `BLOCKED_INPUT`(필드 누락) 또는 `BLOCKED_SCOPE`(소유권 충돌)
- 상세 파일에 Expected Files가 비어 있거나 서술이 모호하면 `BLOCKED_INPUT`.
- 각 경로가 `traveler/app` 하위 상대경로인지 확인한다. 상위 디렉터리 이탈(`../`) 경로가 있으면 `BLOCKED_INPUT`.
- `docs/tasks/TASK_LIST.md` 전체를 훑어 이 Task의 Expected Files가 **다른 Task의 Expected Files와 겹치는지** 확인한다. 겹치면 `BLOCKED_SCOPE`로 멈추고 충돌하는 Task ID와 겹치는 파일 경로를 제시한다.

### 5. SRS·Scope·Design·Screen Ref → 실패 시 `BLOCKED_INPUT`
- Requirement Ref의 각 `REQ-FUNC-*`/`REQ-NF-*` ID가 `docs/UIUX_TRACEABILITY.md`에 실존하는지 확인한다.
- Screen/Route/Page Entry가 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 값과 정확히 일치하는지 확인한다.
- Design Ref가 가리키는 절이 `design-reference/D-001/DESIGN.md`(또는 `design-reference/UI_CONTRACT.md`)에 실제로 존재하는지 확인한다.
- Scope 근거가 `docs/PROJECT_SCOPE.md`의 실제 절 번호를 가리키는지 확인한다.
- 하나라도 존재하지 않거나 오탈자로 보이면 `BLOCKED_INPUT`으로 멈추고 어떤 참조가 깨졌는지 구체적으로 제시한다.

### 6. 필요한 환경변수 이름 → 실패 시 `BLOCKED_INPUT`
- 이 Task의 Expected Files/구현 범위가 필요로 하는 환경변수 **이름**을 나열한다(예: Supabase 접근 Task → `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`/`SUPABASE_SERVICE_ROLE_KEY`, 외부 이동 Task → `FLIGHT_OUTBOUND_URL`/`HOTEL_OUTBOUND_URL`).
- `.env.example`(있다면 키 이름만 확인) 또는 `docs/ARCHITECTURE.md` §16(착수 차단 표)과 대조해 그 이름들이 어딘가에 문서화되어 있는지 확인한다. **실제 값은 절대 열지도 출력하지도 않는다.**
- 이 Task에 필수인 환경변수 이름이 어디에도 선언·문서화되어 있지 않으면 `BLOCKED_INPUT`으로 멈추고 어떤 이름이 빠졌는지 나열한다.

### 7. Secret 하드코딩 위험 → 실패 시 `BLOCKED_SCOPE`
- Expected Files 중 이미 디스크에 존재하는 파일이 있으면(재실행 시나리오), 그 내용에서 시크릿처럼 보이는 패턴을 grep한다 — 예: `SUPABASE_SERVICE_ROLE_KEY\s*=\s*['"]`, `NEXT_PUBLIC_`가 아닌데 키 값이 리터럴로 대입된 경우, `sk-`/`eyJ` 접두 토큰, 32자 이상의 연속 base64/hex 리터럴.
- 하나라도 발견되면 해당 값을 그대로 출력하지 않고(파일 경로·줄 번호만, 값은 마스킹) `BLOCKED_SCOPE`로 멈춘다.

### 8. EXCLUDED 범위 침범 여부 → 실패 시 `BLOCKED_SCOPE`
- 상세 파일의 Requirements 목록에 `docs/UIUX_TRACEABILITY.md`상 `EXCLUDED`인 ID가 있으면 `BLOCKED_SCOPE`.
- Functional AC/Context에 EXCLUDED로 분류된 기능(콘텐츠 CMS, 범용 감사 로그, 외부 Email 발송, 운영 모니터링 대시보드 등 — `docs/PROJECT_SCOPE.md` §8, `docs/ARCHITECTURE.md` §17)을 구현하겠다는 서술이 있으면 `BLOCKED_SCOPE`.

## 8단계를 모두 통과하면 → `READY_TO_IMPLEMENT`

모든 검사를 통과했을 때만 `READY_TO_IMPLEMENT`를 보고한다. 이때도 실제 구현은 시작하지 않는다 — 이 커맨드는 착수 가능 여부만 판정한다.

## 보고 형식

1. 최종 상태를 첫 줄에 단독으로 명시한다(`READY_TO_IMPLEMENT` 또는 `BLOCKED_*` 중 하나).
2. 8단계 체크리스트를 표로 제시한다: 단계 번호/이름, 결과(PASS/FAIL/SKIPPED — 실패 이후 단계는 SKIPPED), 근거(확인한 파일·명령 출력 요약).
3. `BLOCKED_*`인 경우 다음 행동을 제안한다(예: Working Tree 정리 후 재실행, `python scripts/build_waves.py` 재실행으로 `TASKS/WAVE_PLAN.md` 보완, `/gen-task-details`로 참조 오류 수정, 의존 Task 먼저 완료 등). 이 커맨드 스스로는 그 행동을 수행하지 않는다.
