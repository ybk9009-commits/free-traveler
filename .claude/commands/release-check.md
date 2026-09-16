---
description: 7개 카테고리(Task·Wave 상태, Page Owner 5개, CI, Playwright Smoke, Supabase 6테이블/RLS 기록, Vercel Preview Checkpoint, EXCLUDED)를 모두 확인해 RELEASE_READY/RELEASE_BLOCKED를 판정한다. 읽기 전용, 어떤 파일도 고치지 않는다.
---

# /release-check

릴리스 직전 최종 게이트다. `docs/06_SRS_UIUX_REVISED.md` §5.3의 Release Acceptance Criteria(AC-REL-01~10)를 실제로 재확인하는 커맨드이며, 7개 카테고리를 **전부 독립적으로 검사한 뒤** 하나로 합쳐 판정한다. `/prepare-task`/`/run-wave`와 달리 첫 실패에서 멈추지 않고 **모든 카테고리를 끝까지 확인**해 전체 그림을 보여준다 — 릴리스 여부 판단에는 부분 정보보다 전체 목록이 필요하기 때문이다.

## 판정

- **`RELEASE_READY`** — 아래 7개 카테고리가 전부 PASS일 때만.
- **`RELEASE_BLOCKED`** — 하나라도 FAIL이면. FAIL한 카테고리를 전부 나열한다(첫 번째만 보고하지 않는다).

이 커맨드는 **읽기 전용**이다. 배포, Merge, 파일 수정, 상태 파일(`docs/WAVE_STATE.json` 등) 변경 중 어떤 것도 하지 않는다 — 문제를 고치려면 `/run-wave`·`/implement-task` 등 해당 커맨드로 돌아간다.

## 검사 7개

### 1. Task·Wave 상태
- `docs/tasks/TASK_LIST.md`(SKILL.md 규격, 70개 Task 정본)와 `docs/WAVE_PLAN.md`/`docs/WAVE_STATE.json`을 대조한다.
- **PASS 조건**: `TASK_LIST.md`의 모든 Task ID가 `WAVE_PLAN.md`의 어떤 Wave에도 정확히 1번씩 배정되어 있고, `WAVE_STATE.json`에서 그 Task ID 전부가 `DONE`이다. 배정되지 않은 Task, 또는 `DONE`이 아닌 Task가 하나라도 있으면 FAIL이며 그 Task ID를 전부 나열한다.
- `WAVE_PLAN.md`/`WAVE_STATE.json`이 없으면 자동으로 FAIL(둘 다 없다는 사실을 그대로 보고).

### 2. 5개 Page Owner DONE
- `PO-SCR-001`~`PO-SCR-005` 5개의 `WAVE_STATE.json` 상태가 전부 `DONE`인지 확인한다(AC-REL-01, AC-REL-04).
- 각 Page Entry 파일(`design-reference/SCREEN_ROUTE_CONTRACT.json`의 `page_entry`)이 실제로 존재하는지 Glob으로 실측한다.
- `src/app/page.tsx`(SCR-001)에서 create-next-app 스타터 흔적(`next.svg`, "To get started, edit the page.tsx", Vercel/Next.js 학습 링크 등)이 남아 있지 않은지 grep한다(AC-REL-02).
- `src/app/travel-tools/page.tsx`(SCR-003)에 항공/숙소/동행 3개 탭 조립을 나타내는 코드가 존재하는지 확인한다(AC-REL-03).
- `src/app/account/page.tsx`(SCR-005)에 Guest/Member/Admin 3개 영역 조립을 나타내는 코드가 존재하는지 확인한다(AC-REL-04).
- 위 중 하나라도 미달이면 FAIL, 구체적으로 어떤 Screen·파일·마커가 문제인지 나열한다.

### 3. CI PASS
- CI 워크플로(`.github/workflows/ci.yml`)의 **가장 최근 실행 결과**를 확인한다(예: `gh run list --workflow=ci.yml --limit 1`, `gh` CLI가 있고 인증되어 있을 때만).
- `tsc --noEmit`, ESLint, 데이터 검증 스크립트, Vitest Unit 3종이 모두 성공했는지 확인한다(AC-REL-05, AC-REL-10).
- **`gh` CLI를 쓸 수 없거나 결과를 가져올 수 없으면 PASS로 추정하지 않는다.** "확인 불가"로 FAIL 처리하고 이유를 그대로 보고한다.

### 4. Playwright Smoke PASS
- Playwright Chromium Smoke(공개 흐름/여행 준비/인증·동행·신고·관리자) 3개 Spec과 axe-core 접근성 점검의 **가장 최근 실행 결과**를 확인한다(AC-REL-08, AC-REL-09). CI 워크플로 Job 결과나 최신 테스트 리포트 아티팩트를 근거로 쓴다.
- 마찬가지로 결과를 확인할 수 없으면 PASS로 추정하지 않고 FAIL 처리한다.

### 5. Supabase 6개 Table·기본 RLS 확인 기록
- 이 커맨드는 살아있는 Supabase DB에 직접 접속하지 않는다(자격증명이 없을 수 있고, 이 커맨드는 읽기 전용 문서/코드 검사만 한다) — **"확인 기록"이 실제로 존재하는지**를 검사한다.
- `supabase/migrations/*.sql`에 5개 커스텀 테이블(`USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`) 스키마와 RLS 정책이 실제로 존재하는지 확인한다(`docs/ARCHITECTURE.md` §8·§10 — `auth.users`를 포함해 6개).
- `TEST-RLS-BASIC`(`tests/integration/rls.test.ts` 등)이 존재하고, 3번 CI 확인 결과에서 그 테스트가 통과했는지 확인한다.
- 마이그레이션 파일이 없거나, RLS 테스트가 없거나 통과 기록이 없으면 FAIL.

### 6. Vercel Preview Checkpoint
- `docs/WAVE_STATE.json`의 `checkpoints`에서 이번 릴리스 대상 Wave(들)가 전부 `"CLEARED"`인지 확인한다(사람이 Preview를 확인했다는 기록, `CLAUDE.md` 규칙 22).
- 가능하면 `gh pr checks`(또는 PR의 Vercel 배포 댓글)로 최신 Vercel Preview 배포가 성공 상태인지도 함께 확인한다.
- 하나라도 `"WAITING_FOR_PREVIEW"`이거나 Preview 배포가 실패 상태면 FAIL.

### 7. EXCLUDED 목록
- `python scripts/audit_tasks.py`를 실행해 exit code 0을 확인한다(EXCLUDED Requirement가 어떤 Task에도 연결되지 않았음을 기계적으로 재확인, AC-REL-07).
- `docs/tasks/TASK_LIST.md`의 "제외된 Requirement" 표와 `docs/PROJECT_SCOPE.md` §8이 여전히 일치하는지(항목이 임의로 줄지 않았는지) 확인한다.
- `audit_tasks.py`가 실패하거나 EXCLUDED 표가 원본과 달라졌으면 FAIL.

## AC-REL 대응표 (`docs/06_SRS_UIUX_REVISED.md` §5.3)

| 검사 | 대응 AC-REL |
|---|---|
| 1. Task·Wave 상태 | AC-REL-01 |
| 2. Page Owner 5개 | AC-REL-01, 02, 03, 04, 06 |
| 3. CI PASS | AC-REL-05, 10 |
| 4. Playwright Smoke PASS | AC-REL-08, 09 |
| 5. Supabase 6 Table/RLS | (RLS 관련 REQ-FUNC-044/REQ-NF-013, AC-REL 표에 별도 항목 없음 — 이 커맨드가 추가한 자체 게이트) |
| 6. Vercel Preview Checkpoint | (SRS AC-REL에는 없음 — `CLAUDE.md` 규칙 22 기반 자체 게이트) |
| 7. EXCLUDED 목록 | AC-REL-07 |

## 이 Command가 절대 하지 않는 것

- 코드·문서·상태 파일(`docs/WAVE_STATE.json` 포함) 등 **어떤 파일도 수정하지 않는다.**
- 배포·Merge·PR·Commit을 실행하지 않는다.
- 확인할 수 없는 항목(CI 결과 조회 불가 등)을 임의로 PASS로 간주하지 않는다 — 항상 FAIL 또는 "확인 불가"로 명시한다.

## 보고 형식

1. 최종 판정(`RELEASE_READY` 또는 `RELEASE_BLOCKED`)을 첫 줄에 단독으로 명시한다.
2. 7개 검사 전부를 표로 제시한다: 번호/이름, PASS/FAIL, 근거(확인한 파일·명령 결과 요약), 대응 AC-REL.
3. `RELEASE_BLOCKED`면 FAIL한 항목마다 "무엇을 어떻게 고쳐야 하는지"(예: `/run-wave` 재실행, CI 재실행, 사람의 Preview 확인 요청)를 제안한다. 이 커맨드 스스로는 그 조치를 수행하지 않는다.
