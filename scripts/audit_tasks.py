#!/usr/bin/env python3
"""audit_tasks.py — 생성된 Task List/상세 파일을 SKILL.md 규칙에 따라 감사한다.

`/gen-task-details`의 마지막 단계로 반드시 실행한다(SKILL.md 규칙 18).
언제든 읽기 전용으로 재검증하려면:

    python scripts/audit_tasks.py

이 스크립트는 어떤 파일도 수정하지 않는다. 표준 라이브러리만 사용한다.

Exit code: 0 = 통과, 1 = 규칙 위반 발견.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import traceability as trace  # noqa: E402

TASKS_DIR = ROOT / "docs" / "tasks"
TASK_LIST_PATH = TASKS_DIR / "TASK_LIST.md"
DETAILS_DIR = TASKS_DIR / "details"
CONTRACT_PATH = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
TRACEABILITY_PATH = ROOT / "docs" / "UIUX_TRACEABILITY.md"

FORBIDDEN_TECH_SUBSTRINGS = [
    "ec2",
    " aws ",
    "aws infra",
    "auto-merge",
    "automerge",
    "무인 자동 merge",
    "자동 병합 러너",
    "lighthouse ci",
]

TASK_ID_RE = re.compile(r"^(PO|CMP|DATA|DB|API|INFRA|TEST|CI)-")
TABLE_ROW_RE = re.compile(r"^\|(.+)\|$")
META_BLOCK_RE = re.compile(r"```task-meta\s*(\{.*?\})\s*```", re.DOTALL)

REQUIRED_PAGE_OWNER_META_FIELDS = [
    "section_order",
    "min_content_counts",
    "empty_state_required",
    "forbids_placeholder",
]

GUEST_TERMS = ["Guest", "게스트", "비로그인"]
MEMBER_TERMS = ["Member", "회원"]
ADMIN_TERMS = ["Admin", "관리자"]


class Findings:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, msg: str) -> None:
        self.errors.append(msg)

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)

    @property
    def ok(self) -> bool:
        return not self.errors


def split_cells(row: str) -> list[str]:
    return [c.strip() for c in row.strip().strip("|").split("|")]


def parse_task_list(path: Path, findings: Findings) -> list[dict]:
    if not path.exists():
        findings.error("docs/tasks/TASK_LIST.md가 없습니다. /gen-tasklist를 먼저 실행하세요.")
        return []
    tasks: list[dict] = []
    seen_ids: set[str] = set()
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        m = TABLE_ROW_RE.match(line)
        if not m:
            continue
        cells = split_cells(line)
        if len(cells) < 8:
            continue
        task_id = cells[0]
        if not TASK_ID_RE.match(task_id):
            continue  # 헤더 / 구분선 / "제외된 Requirement" 표 등 다른 표의 행
        if task_id in seen_ids:
            findings.error(f"TASK_LIST.md에 Task ID '{task_id}'가 중복 등장합니다.")
        seen_ids.add(task_id)
        tasks.append(
            {
                "task_id": task_id,
                "type": cells[1],
                "screen": cells[2],
                "title": cells[3],
                "depends_on": [
                    d.strip() for d in cells[4].split(",") if d.strip() and d.strip() != "—"
                ],
                "requirements": [
                    r.strip() for r in cells[5].split(",") if r.strip() and r.strip() != "—"
                ],
                "detail_file": cells[6],
                "status": cells[7],
            }
        )
    return tasks


def load_detail_bodies(findings: Findings, tasks: list[dict]) -> dict[str, str]:
    bodies: dict[str, str] = {}
    if not DETAILS_DIR.exists():
        findings.error("docs/tasks/details/ 디렉터리가 없습니다.")
        return bodies

    listed_ids = {t["task_id"] for t in tasks}
    existing_files = {p.stem for p in DETAILS_DIR.glob("*.md")}

    for t in tasks:
        expected = DETAILS_DIR / f"{t['task_id']}.md"
        if not expected.exists():
            findings.error(f"{t['task_id']}: 상세 파일이 없습니다 ({expected.relative_to(ROOT)})")
            continue
        bodies[t["task_id"]] = expected.read_text(encoding="utf-8")

    orphans = existing_files - listed_ids
    for o in sorted(orphans):
        findings.error(
            f"고아 상세 파일 발견: details/{o}.md — TASK_LIST.md에 대응 행이 없습니다(1:1 위반, 규칙 17)."
        )
    return bodies


def check_meta_consistency(
    findings: Findings, tasks: list[dict], bodies: dict[str, str]
) -> dict[str, dict]:
    metas: dict[str, dict] = {}
    for t in tasks:
        body = bodies.get(t["task_id"])
        if body is None:
            continue
        m = META_BLOCK_RE.search(body)
        if not m:
            findings.error(f"{t['task_id']}: ```task-meta JSON 블록이 없습니다.")
            continue
        try:
            meta = json.loads(m.group(1))
        except json.JSONDecodeError as e:
            findings.error(f"{t['task_id']}: task-meta JSON 파싱 실패: {e}")
            continue
        metas[t["task_id"]] = meta

        if meta.get("task_id") != t["task_id"]:
            findings.error(f"{t['task_id']}: task-meta.task_id 불일치 ({meta.get('task_id')})")
        if meta.get("type") != t["type"]:
            findings.error(f"{t['task_id']}: task-meta.type이 TASK_LIST.md의 Type과 다릅니다.")
        if sorted(meta.get("depends_on", [])) != sorted(t["depends_on"]):
            findings.error(
                f"{t['task_id']}: task-meta.depends_on이 TASK_LIST.md Depends On 열과 다릅니다."
            )
        if sorted(meta.get("requirements", [])) != sorted(t["requirements"]):
            findings.error(
                f"{t['task_id']}: task-meta.requirements가 TASK_LIST.md Requirements 열과 다릅니다."
            )
    return metas


def check_page_owner_coverage(
    findings: Findings, tasks: list[dict], contract: dict
) -> dict[str, dict]:
    expected_screens = {s["screen_id"] for s in contract.get("screens", [])}
    page_owners = [t for t in tasks if t["type"] == "page_owner"]

    if len(page_owners) != 5:
        findings.error(f"Page Owner Task가 정확히 5개가 아닙니다: {len(page_owners)}개(규칙 3)")

    seen_screens: set[str] = set()
    by_screen: dict[str, dict] = {}
    for po in page_owners:
        screen = po["screen"]
        if screen in seen_screens:
            findings.error(f"Screen {screen}에 Page Owner Task가 중복됩니다.")
        seen_screens.add(screen)
        by_screen[screen] = po

    for s in expected_screens - seen_screens:
        findings.error(f"{s}에 대한 Page Owner Task가 없습니다.")
    for s in seen_screens - expected_screens:
        findings.error(f"SCREEN_ROUTE_CONTRACT.json에 없는 Screen '{s}'에 Page Owner Task가 있습니다.")

    return by_screen


def check_page_owner_depends_on_component(
    findings: Findings, tasks: list[dict], page_owners: dict[str, dict]
) -> None:
    by_id = {t["task_id"]: t for t in tasks}
    for screen, po in page_owners.items():
        component_deps = [
            d
            for d in po["depends_on"]
            if by_id.get(d, {}).get("type") == "component"
            and by_id.get(d, {}).get("screen") == screen
        ]
        if not component_deps:
            findings.error(
                f"{po['task_id']}({screen}): 같은 Screen의 Component Task에 의존하지 않습니다(규칙 6)."
            )
        for d in po["depends_on"]:
            if d not in by_id:
                findings.error(f"{po['task_id']}: 존재하지 않는 Task '{d}'에 의존합니다.")


def check_starter_template_removal(
    findings: Findings, page_owners: dict[str, dict], bodies: dict[str, str], metas: dict[str, dict]
) -> None:
    po = page_owners.get("SCR-001")
    if not po:
        return
    body = bodies.get(po["task_id"], "")
    meta = metas.get(po["task_id"], {})
    keyword_hit = any(k in body for k in ["스타터", "starter", "create-next-app"]) and any(
        k in body for k in ["제거", "삭제", "교체", "remove", "replace"]
    )
    if meta.get("starter_template_removal_required") is not True or not keyword_hit:
        findings.error(
            f"{po['task_id']}: Next.js Starter 제거 AC가 확인되지 않습니다(규칙 7) — "
            "task-meta.starter_template_removal_required=true 및 본문 키워드가 모두 필요합니다."
        )


def check_travel_tools_assembly(
    findings: Findings, page_owners: dict[str, dict], bodies: dict[str, str]
) -> None:
    po = page_owners.get("SCR-003")
    if not po:
        return
    body = bodies.get(po["task_id"], "")
    missing = [t for t in ["항공", "숙소", "동행"] if t not in body]
    if missing:
        findings.error(
            f"{po['task_id']}(/travel-tools): 본문에 {missing} 언급이 없어 3탭 조립을 확인할 수 없습니다(규칙 8)."
        )
    if not re.search(r"탭|tab", body, re.IGNORECASE):
        findings.error(f"{po['task_id']}: 탭 조립에 대한 언급이 없습니다(규칙 8).")


def check_account_assembly(
    findings: Findings, page_owners: dict[str, dict], bodies: dict[str, str]
) -> None:
    po = page_owners.get("SCR-005")
    if not po:
        return
    body = bodies.get(po["task_id"], "")
    for label, group in [("Guest", GUEST_TERMS), ("Member", MEMBER_TERMS), ("Admin", ADMIN_TERMS)]:
        if not any(term in body for term in group):
            findings.error(
                f"{po['task_id']}(/account): {label} 상태 조립에 대한 언급이 없습니다(규칙 9)."
            )


def check_page_owner_content_rules(
    findings: Findings,
    page_owners: dict[str, dict],
    bodies: dict[str, str],
    metas: dict[str, dict],
    contract: dict,
) -> None:
    screens_by_id = {s["screen_id"]: s for s in contract.get("screens", [])}
    for screen, po in page_owners.items():
        meta = metas.get(po["task_id"])
        body = bodies.get(po["task_id"], "")
        if meta is None:
            continue

        for field in REQUIRED_PAGE_OWNER_META_FIELDS:
            if field not in meta:
                findings.error(f"{po['task_id']}: task-meta에 '{field}' 필드가 없습니다(규칙 19/20).")

        section_order = meta.get("section_order") or []
        contract_sections = screens_by_id.get(screen, {}).get("sections")
        expected_len = None
        if isinstance(contract_sections, list):
            expected_len = len(contract_sections)
        elif isinstance(contract_sections, dict) and contract_sections:
            expected_len = max(len(v) for v in contract_sections.values())
        if expected_len and len(section_order) < expected_len:
            findings.error(
                f"{po['task_id']}: section_order 항목 수({len(section_order)})가 "
                f"SCREEN_ROUTE_CONTRACT.json sections 수({expected_len})보다 적습니다(규칙 19)."
            )

        if meta.get("empty_state_required") is not True:
            findings.error(f"{po['task_id']}: empty_state_required가 true가 아닙니다(규칙 20).")
        if meta.get("forbids_placeholder") is not True:
            findings.error(f"{po['task_id']}: forbids_placeholder가 true가 아닙니다(규칙 20).")
        if not meta.get("min_content_counts"):
            findings.error(f"{po['task_id']}: min_content_counts가 비어 있습니다(규칙 19).")

        if not any(k in body for k in ["Empty State", "빈 상태", "Empty"]):
            findings.warn(f"{po['task_id']}: 본문에 Empty State 관련 서술이 부족해 보입니다.")
        if not any(k in body for k in ["Placeholder", "플레이스홀더", "준비 중", "Lorem"]):
            findings.warn(f"{po['task_id']}: 본문에 Placeholder 금지 서술이 부족해 보입니다.")


def check_no_server_persistence(
    findings: Findings, tasks: list[dict], metas: dict[str, dict]
) -> None:
    for t in tasks:
        if t["screen"] != "SCR-003" or t["type"] != "component":
            continue
        haystack = f"{t['task_id']} {t['title']}".lower()
        touches_flight_hotel = any(
            kw in haystack for kw in ["flight", "hotel", "항공", "숙소"]
        )
        if not touches_flight_hotel:
            continue
        meta = metas.get(t["task_id"], {})
        if meta.get("no_server_persistence") is not True:
            findings.error(
                f"{t['task_id']}: 항공·숙소 입력 관련 Task인데 "
                "task-meta.no_server_persistence=true가 없습니다(규칙 12)."
            )


def check_db_tables(findings: Findings, tasks: list[dict], metas: dict[str, dict]) -> None:
    all_tables: set[str] = set()
    for t in tasks:
        if t["type"] != "db":
            continue
        meta = metas.get(t["task_id"], {})
        tables = meta.get("tables")
        if not tables:
            findings.error(f"{t['task_id']}: db Task인데 task-meta.tables가 비어 있습니다(규칙 10).")
            continue
        all_tables.update(tables)
        if "AUDIT_LOG" in tables:
            findings.error(f"{t['task_id']}: AUDIT_LOG 테이블은 범위 밖입니다(EXCLUDED, 규칙 10/16).")

    if len(all_tables) > 6:
        findings.error(f"DB 테이블 수가 6개를 초과합니다(규칙 10): {sorted(all_tables)}")


def check_data_tasks(findings: Findings, tasks: list[dict]) -> None:
    data_tasks = [t for t in tasks if t["type"] == "data"]
    domains = {"destination(여행지)": False, "safety(안전정보)": False, "representative(대표 소개)": False}
    for t in data_tasks:
        haystack = f"{t['task_id']} {t['title']}".lower()
        if "destination" in haystack or "여행지" in t["title"]:
            domains["destination(여행지)"] = True
        if "safety" in haystack or "안전" in t["title"]:
            domains["safety(안전정보)"] = True
        if "representative" in haystack or "profile" in haystack or "대표" in t["title"]:
            domains["representative(대표 소개)"] = True
    for name, found in domains.items():
        if not found:
            findings.error(f"정적 데이터(data) Task 중 '{name}' 도메인을 찾지 못했습니다(규칙 11).")

    for t in tasks:
        if t["type"] != "db":
            continue
        if "destination" in t["title"].lower() or "safety" in t["title"].lower() or "여행지" in t["title"] or "안전" in t["title"]:
            findings.error(
                f"{t['task_id']}: 여행지/안전 데이터는 DB Task가 아니라 정적 데이터(data) Task여야 합니다(규칙 11)."
            )


def check_playwright_chromium_only(
    findings: Findings, tasks: list[dict], metas: dict[str, dict]
) -> None:
    test_tasks = [t for t in tasks if t["type"] == "test"]
    playwright_tasks = [
        t
        for t in test_tasks
        if "playwright" in f"{t['task_id']} {t['title']}".lower()
        or "smoke" in f"{t['task_id']} {t['title']}".lower()
    ]
    if not playwright_tasks:
        findings.error("Playwright Smoke Test Task를 찾지 못했습니다(규칙 13).")
    for t in playwright_tasks:
        meta = metas.get(t["task_id"], {})
        projects = meta.get("browser_projects")
        if projects != ["chromium"]:
            findings.error(
                f"{t['task_id']}: browser_projects는 정확히 ['chromium']이어야 하는데 "
                f"{projects} 입니다(규칙 13)."
            )


def check_forbidden_tech(findings: Findings, bodies: dict[str, str]) -> None:
    for task_id, body in bodies.items():
        lowered = f" {body.lower()} "
        for bad in FORBIDDEN_TECH_SUBSTRINGS:
            if bad in lowered:
                findings.error(
                    f"{task_id}: 금지된 기술/문구 '{bad.strip()}'가 본문에 포함되어 있습니다(규칙 14)."
                )


def check_requirement_coverage(
    findings: Findings, tasks: list[dict], trace_entries: dict[str, str]
) -> None:
    covered: dict[str, list[str]] = {}
    for t in tasks:
        for r in t["requirements"]:
            covered.setdefault(r, []).append(t["task_id"])

    for req_id, status in trace_entries.items():
        if trace.is_implement(status) and req_id not in covered:
            findings.error(f"{req_id}(IMPLEMENT): 이 Requirement를 커버하는 Task가 없습니다(규칙 15).")
        elif trace.is_excluded(status) and req_id in covered:
            findings.error(
                f"{req_id}(EXCLUDED): 제외된 Requirement인데 구현 Task {covered[req_id]}가 "
                "존재합니다(규칙 16)."
            )

    for r in sorted(set(covered) - set(trace_entries)):
        findings.error(
            f"Task가 참조하는 '{r}'가 docs/UIUX_TRACEABILITY.md에 없습니다(ID 오타 의심)."
        )


def check_excluded_registry(findings: Findings, trace_entries: dict[str, str]) -> None:
    if not TASK_LIST_PATH.exists():
        return
    text = TASK_LIST_PATH.read_text(encoding="utf-8")
    excluded_ids = {rid for rid, status in trace_entries.items() if trace.is_excluded(status)}
    missing = [rid for rid in sorted(excluded_ids) if rid not in text]
    if missing:
        findings.error(
            "TASK_LIST.md의 '제외된 Requirement' 표에 다음 EXCLUDED ID가 보이지 않습니다"
            f"(규칙 16): {missing}"
        )


def main() -> int:
    findings = Findings()

    contract: dict = {}
    if CONTRACT_PATH.exists():
        try:
            contract = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            findings.error(f"SCREEN_ROUTE_CONTRACT.json 파싱 실패: {e}")
    else:
        findings.error("design-reference/SCREEN_ROUTE_CONTRACT.json이 없습니다.")

    tasks = parse_task_list(TASK_LIST_PATH, findings)
    bodies = load_detail_bodies(findings, tasks)
    metas = check_meta_consistency(findings, tasks, bodies)

    page_owners = check_page_owner_coverage(findings, tasks, contract)
    check_page_owner_depends_on_component(findings, tasks, page_owners)
    check_starter_template_removal(findings, page_owners, bodies, metas)
    check_travel_tools_assembly(findings, page_owners, bodies)
    check_account_assembly(findings, page_owners, bodies)
    check_page_owner_content_rules(findings, page_owners, bodies, metas, contract)
    check_no_server_persistence(findings, tasks, metas)
    check_db_tables(findings, tasks, metas)
    check_data_tasks(findings, tasks)
    check_playwright_chromium_only(findings, tasks, metas)
    check_forbidden_tech(findings, bodies)

    trace_entries: dict[str, str] = {}
    if TRACEABILITY_PATH.exists():
        trace_entries = trace.load_traceability(TRACEABILITY_PATH)
        check_requirement_coverage(findings, tasks, trace_entries)
        check_excluded_registry(findings, trace_entries)
    else:
        findings.error("docs/UIUX_TRACEABILITY.md가 없어 Requirement 커버리지를 검사할 수 없습니다.")

    print("=== audit_tasks.py — Traveler Task 감사 ===\n")
    print(f"Task 수: {len(tasks)}")
    if tasks:
        print(f"  - page_owner: {sum(1 for t in tasks if t['type'] == 'page_owner')}")
        print(f"  - component:  {sum(1 for t in tasks if t['type'] == 'component')}")
        print(f"  - data:       {sum(1 for t in tasks if t['type'] == 'data')}")
        print(f"  - db:         {sum(1 for t in tasks if t['type'] == 'db')}")
        print(f"  - api:        {sum(1 for t in tasks if t['type'] == 'api')}")
        print(f"  - infra:      {sum(1 for t in tasks if t['type'] == 'infra')}")
        print(f"  - test:       {sum(1 for t in tasks if t['type'] == 'test')}")
        print(f"  - ci:         {sum(1 for t in tasks if t['type'] == 'ci')}")
        unique_reqs = {r for t in tasks for r in t["requirements"]}
        print(f"Requirement 커버: 고유 ID {len(unique_reqs)}개 참조")
    print()

    if findings.warnings:
        print("--- 경고 ---")
        for w in findings.warnings:
            print(f"[WARN] {w}")
        print()

    if findings.errors:
        print("--- 오류 ---")
        for e in findings.errors:
            print(f"[ERROR] {e}")
        print(f"\n감사 실패: {len(findings.errors)}개 오류.")
        return 1

    print("감사 통과. Task List와 상세 파일이 SKILL.md 규칙을 충족합니다.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
