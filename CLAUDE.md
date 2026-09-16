# CLAUDE.md — Free Traveler (`traveler/app`)

이 파일은 이 저장소(`traveler/app`)에서 작업하는 모든 Agent에게 적용되는 규칙을 **직접** 담는다. 다른 Agent 규칙 파일(`AGENTS.md` 등)을 `@`로 참조하지 않는다 — 필요한 내용은 아래에 전부 인라인으로 옮겨 적었다.

---

## Harness Marker

```
HARNESS_SCHEMA=traveler-screen-route-v1
DESIGN_PATH=design-reference/D-001/DESIGN.md
SCREEN_CONTRACT=design-reference/SCREEN_ROUTE_CONTRACT.json
PROJECT_SCOPE=docs/PROJECT_SCOPE.md
PLAYWRIGHT_ENABLED=true
PLAYWRIGHT_SCOPE=chromium-smoke
AUTO_MERGE=false
AWS_ENABLED=false
```

`HARNESS_SCHEMA`가 `SCREEN_CONTRACT` 파일의 `schema_version`과 다르면 작업을 중단하고 사용자에게 보고한다.

---

## 필수 규칙

1. **작업 전 확인**: 코드를 작성하기 전에 `package.json`(Next.js/React/TypeScript 버전, 의존성)과 현재 설치된 Next.js 버전의 실제 문서를 확인한다. 이 저장소의 Next.js 버전은 API·구조가 학습 데이터와 다를 수 있는 breaking change를 포함할 수 있으므로, 필요하면 `node_modules/next/dist/docs/`의 해당 가이드를 먼저 읽는다.
2. **SRS 정본**은 `docs/06_SRS_UIUX_REVISED.md`다(REQ-FUNC-001~080, REQ-NF-001~034 원문·AC는 `docs/02_SRS_BASELINE.md.md` §4를 그대로 따르며 이 문서가 Route/Screen 대응만 개정한다).
3. **Scope 분류 정본**은 `docs/PROJECT_SCOPE.md`다(IMPLEMENT/IMPLEMENT(축소)/IMPLEMENT(간소화)/IMPLEMENT(목표)/IMPLEMENT(설계 원칙)/EXCLUDED 분류의 근거).
4. **디자인 정본**은 `design-reference/D-001/DESIGN.md`(`status: LOCKED`)다. `design-reference/vendor/airbnb/DESIGN.md`는 구조 참고 전용이며 색상·타이포·토큰의 근거로 쓰지 않는다.
5. **Screen 정본**은 `design-reference/SCREEN_ROUTE_CONTRACT.json`(`schema_version: traveler-screen-route-v1`)이다. 다른 문서와 충돌하면 이 JSON을 따른다.
6. 표준 개발 명령으로 `/run-wave WXX`를 사용한다(`WXX`는 Wave 번호). Wave와 그 내부 Task 구성은 `docs/tasks/TASK_LIST.md`(및 `TASKS/00_TASK_LIST.md`)를 근거로 한다.
7. 하나의 Wave 안에서는 내부 Task를 `Depends On` 순서에 따라 **한 번에 하나만** 구현한다. 여러 Task를 동시에 병행 구현하지 않는다.
8. 지금 수행 중인 Task의 `Expected Files` 목록 밖에 있는 파일은 만들거나 수정하지 않는다.
9. Page Owner Task(`src/app/*/page.tsx`)는 새 시각 요소를 직접 구현하지 않고, 해당 Screen의 Component Task 산출물을 Page Entry에서 **실제로 조립**한다.
10. SCR-001(`src/app/page.tsx`) 관련 Task 완료 시 create-next-app 스타터 템플릿(`next.svg`, "To get started, edit the page.tsx", Vercel/Next.js 학습 링크 등)을 완전히 제거한다.
11. SCR-003(`/travel-tools`)은 항공편·숙소·동행 구하기 3개 탭을 모두 실제 컴포넌트로 조립한다. 스텁 탭을 두지 않는다.
12. 항공·숙소 입력값(국가·지역·날짜)은 서버 API·DB·URL query·서버 로그·클라이언트 분석 이벤트 어디로도 보내지 않는다. 이 두 폼을 위한 서버 API Route를 만들지 않는다.
13. Supabase에 대한 쓰기(write)는 **Auth, 동행(Mate) 모집글/참가요청/차단, 신고(Report), 관리자 설정(외부 URL 등)** 범위로 제한한다. 여행지·안전정보·대표 소개는 Supabase에 쓰지 않는다.
14. RLS를 우회하는 Client Component 코드를 작성하지 않는다(예: Service Role Key로 클라이언트에서 직접 쿼리, RLS가 걸린 테이블에 대해 클라이언트에서 관리자 권한을 자체 판단).
15. `SUPABASE_SERVICE_ROLE_KEY`(또는 그 값을 담는 어떤 시크릿)도 Client Component·Client 전용 코드·`NEXT_PUBLIC_` 접두사 환경변수로 노출하지 않는다. 서버 전용 코드에서만 사용한다.
16. 여행지·국가 안전정보·대표 소개 콘텐츠는 Supabase 테이블이 아니라 `src/data`의 정적 TypeScript 데이터를 사용한다.
17. Prisma 등 ORM, AWS, EC2를 새로 추가하지 않는다. DB 접근은 Supabase JS Client + `supabase/migrations/*.sql`만 사용하고, 배포·런타임은 Vercel + Supabase만 사용한다.
18. Playwright 테스트는 핵심 Smoke Test만 작성한다(`chromium` 프로젝트만, `PLAYWRIGHT_SCOPE=chromium-smoke`). Firefox/WebKit/모바일 매트릭스, Lighthouse CI, 부하 테스트를 추가하지 않는다.
19. `docs/UIUX_TRACEABILITY.md`·`docs/tasks/TASK_LIST.md`에서 Implementation Status가 `EXCLUDED`인 기능은 사용자의 명시적 지시 없이 임의로 구현하지 않는다.
20. `git reset --hard`, `git push --force`, `git clean -f`, `git checkout -- .` 등 destructive Git 명령을 사용자의 명시적 요청 없이 임의로 실행하지 않는다.
21. 자동 PR 생성이나 자동 Merge를 실행하지 않는다(`AUTO_MERGE=false`). PR 생성까지는 요청 시 수행할 수 있으나, Merge는 항상 사람이 직접 수행한다.
22. 한 화면(Screen)의 Wave를 완료했다고 판단해도, 사람이 Preview(Vercel Preview 등)를 확인하기 전에는 다음 화면의 Wave로 임의 진행하지 않는다.
23. 작업 완료 시 (a) 변경된 파일 목록, (b) 검증 결과(포맷/타입체크/Unit/Playwright 등 무엇을 실행했고 통과했는지), (c) 남은 제한사항·미해결 항목을 보고한다.

---

## Task 완료 순서

1. **Task 읽기** — `docs/tasks/details/<TASK_ID>.md`(또는 `TASKS/00_TASK_LIST.md`의 해당 항목)를 읽는다.
2. **입력 확인** — Depends On의 선행 Task가 완료되어 있는지, Expected Files 경로가 실제로 맞는지 확인한다.
3. **구현** — Expected Files 목록 안에서만 코드를 작성한다.
4. **관련 포맷·Unit Test** — 해당 Task와 관련된 포맷/Lint/타입체크와 Unit Test를 실행한다.
5. **필요 시 Playwright** — 해당 Task의 Verify에 E2E/A11y가 명시된 경우에만 `chromium` Smoke를 실행한다.
6. **Diff 확인** — 변경 사항이 Expected Files 밖으로 새어나가지 않았는지 diff로 확인한다.
7. **완료 보고** — 위 "필수 규칙 23"의 3가지(변경 파일/검증 결과/남은 제한사항)를 보고한다.

---

## 정본 문서 지도

| 목적 | 문서 |
|---|---|
| Requirement 원문·Route Contract | `docs/06_SRS_UIUX_REVISED.md`, `docs/02_SRS_BASELINE.md.md` |
| Scope 분류(IMPLEMENT/EXCLUDED) | `docs/PROJECT_SCOPE.md` |
| Requirement Traceability(114개 전수) | `docs/UIUX_TRACEABILITY.md` |
| 디자인 토큰·컴포넌트 | `design-reference/D-001/DESIGN.md` |
| Screen별 서술형 계약 | `design-reference/UI_CONTRACT.md` |
| Screen/Route 기계판독 계약 | `design-reference/SCREEN_ROUTE_CONTRACT.json` |
| Task 목록·상세(SKILL.md 규격) | `docs/tasks/TASK_LIST.md`, `docs/tasks/details/*.md` |
| Task 목록·상세(원본) | `TASKS/00_TASK_LIST.md` |
| 구현 경계(Architecture) | `docs/ARCHITECTURE.md` |
| 확정 결정 기록 | `docs/DECISION_LOG.md` |
| Task 감사 스크립트 | `scripts/audit_tasks.py`, `scripts/validate_inputs.py` |
