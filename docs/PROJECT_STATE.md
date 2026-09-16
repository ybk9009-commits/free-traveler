# PROJECT_STATE — Free Traveler

- **Document ID:** STATE-TRAVEL-001
- **성격:** 이 문서는 스냅샷이다. 시점에 따라 값이 바뀌며, **허위로 앞서가지 않는다**(구현이 안 됐는데 DONE으로 적지 않는다 — `docs/UIUX_TRACEABILITY.md`·`docs/tasks/TASK_LIST.md`와 동일한 원칙). Wave가 진행될 때마다 이 문서를 갱신한다.
- **최종 갱신 시각:** 2026-09-16 (최초 작성, 구현 착수 전)
- **갱신 주체:** 각 필드를 실제로 바꾸는 커맨드는 아래 "필드별 갱신 주체" 절에 명시한다. 사람이 직접 고쳐도 되지만, `/run-wave`가 관리하는 필드는 `docs/WAVE_STATE.json`과 반드시 일치시킨다.

---

## 필드

| 필드 | 현재 값 |
|---|---|
| **Harness Schema** | `traveler-screen-route-v1` (`design-reference/SCREEN_ROUTE_CONTRACT.json`, `CLAUDE.md` `HARNESS_SCHEMA`) |
| **Design Version** | `D-001` (`design-reference/D-001/DESIGN.md`, `status: LOCKED`) |
| **Scope Mode** | `docs/PROJECT_SCOPE.md` 기준 축소 범위 — Requirement 114개 중 IMPLEMENT 계열 96개(FUNC 73 + NF 23), EXCLUDED 18개(FUNC 7 + NF 11) |
| **Current Wave** | `NONE` — `TASKS/WAVE_PLAN.md`/`TASKS/WAVE_STATE.json`이 `scripts/build_waves.py`로 생성되어 19개 Wave(W01~W19)가 정의됐지만, 전부 `status: "pending"`이며 아직 시작되지 않았다 |
| **Current Task** | `NONE` |
| **Completed Tasks** | `0 / 70` (`docs/tasks/TASK_LIST.md` 기준, 전 Task `Status = NOT_STARTED`) |
| **Blocked Tasks** | `NONE`(아직 어떤 Task도 착수하지 않아 Task 단위 차단은 없음). 착수 자체를 막는 구조적 차단 요인은 `docs/ARCHITECTURE.md` §16 참조(`TASKS/TASK_MANIFEST.csv` 없음, Supabase/외부 URL 환경변수 없음, `supabase/` 디렉터리 없음) |
| **Latest CI** | `NONE` — `.github/workflows/ci.yml`이 아직 생성되지 않아 실행 이력 없음 |
| **Supabase State** | `NOT_PROVISIONED` — `supabase/` 디렉터리·마이그레이션 없음, `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`/`SUPABASE_SERVICE_ROLE_KEY` 미설정 |
| **Vercel Preview URL** | `NONE` — 아직 배포되지 않음 |
| **Screen Checkpoints** | 아래 표 참조(전체 `PENDING`) |
| **Playwright State** | `NOT_RUN` — Smoke Spec 파일 없음(`tests/e2e/*.spec.ts` 미생성), `PLAYWRIGHT_SCOPE=chromium-smoke`만 `CLAUDE.md`에 정책으로 선언된 상태 |
| **Deferred Items** | `EXCLUDED` 18개(FUNC 7: 055·056·071·072·073·075·076 + NF 11: 007·008·009·010·011·020·021·022·029·032·033). 근거·후속 방향은 `docs/tasks/TASK_LIST.md`의 "제외된 Requirement" 표와 `docs/ARCHITECTURE.md` §17에 있다. 이 목록은 사용자의 명시적 지시 없이 줄거나 늘지 않는다(`CLAUDE.md` 규칙 19) |
| **Next Action** | `/run-wave W01`로 첫 Wave(`CMP-COMMON-*` 공통 UI 5개) 착수. 그 전에 최소한 `DATA-*`/`DB-*` 계열(W02~W06) 착수를 위한 Supabase 환경변수·`supabase/` 초기화가 필요하다(`docs/ARCHITECTURE.md` §16) |

---

## Screen Checkpoints (초기값)

| Screen | Route | Checkpoint |
|---|---|---|
| SCR-001 | `/` | PENDING |
| SCR-002 | `/about` | PENDING |
| SCR-003 | `/travel-tools` | PENDING |
| SCR-004 | `/mates` | PENDING |
| SCR-005 | `/account` | PENDING |
| FINAL | — | PENDING |

각 Screen의 Checkpoint는 해당 Screen의 Page Owner Task(`PO-SCR-00X`)가 `DONE`이 되고 사람이 Vercel Preview를 확인한 뒤 `CLEARED`로 바뀐다(`CLAUDE.md` 규칙 22, `docs/DECISION_LOG.md` DEC-012). `FINAL`은 5개 Screen이 모두 `CLEARED`이고 `/release-check`가 `RELEASE_READY`를 반환할 때만 `CLEARED`로 바뀐다.

---

## 필드별 갱신 주체

| 필드 | 갱신 주체 |
|---|---|
| Current Wave, Current Task, Completed Tasks, Blocked Tasks, Screen Checkpoints | `/run-wave`(내부적으로 `TASKS/WAVE_STATE.json`을 갱신하며, 이 문서는 그 값을 그대로 반영해야 한다) |
| Latest CI | CI 워크플로 실행 후 사람 또는 `/release-check` 조회 결과를 바탕으로 갱신 |
| Supabase State | `DB-SCHEMA-BASE`/`DB-RLS-BASE`/`DB-SEED-BASE` Task 완료 및 실제 프로비저닝 후 갱신 |
| Vercel Preview URL | 배포 발생 시 갱신 |
| Playwright State | Smoke Spec 실행 후 갱신 |
| Harness Schema, Design Version, Scope Mode, Deferred Items | 해당 정본 문서(`SCREEN_ROUTE_CONTRACT.json`, `D-001/DESIGN.md`, `PROJECT_SCOPE.md`, `UIUX_TRACEABILITY.md`)가 개정될 때만 갱신 |
| Next Action | 매 Wave 종료 시점에 사람 또는 `/run-wave`/`/release-check` 보고를 바탕으로 갱신 |
