#!/usr/bin/env python3
"""audit_task_manifest.py — TASKS/00_TASK_LIST.md + TASKS/TASK-*.md 최종 감사.

입력:
    TASKS/00_TASK_LIST.md               (Task 요약표 + Task별 상세 섹션)
    TASKS/TASK-<TASK_ID>.md             (있으면 해당 Task의 상세 내용을 우선 사용)
    docs/PROJECT_SCOPE.md               (DB 6개 기본 테이블 정의)
    design-reference/SCREEN_ROUTE_CONTRACT.json  (Screen/Route/Page Entry 정본)

출력:
    TASKS/TASK_MANIFEST.csv
    TASKS/TASK_AUDIT_REPORT.md

이 스크립트는 위 두 출력 파일 외에는 어떤 파일도 수정하지 않는다.
표준 라이브러리만 사용한다.

Exit code: 0 = AUDIT_PASS, 1 = AUDIT_FAIL(하나 이상의 검사 실패).
"""
from __future__ import annotations

import csv
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[1]
TASKS_DIR = ROOT / "TASKS"
TASK_LIST_PATH = TASKS_DIR / "00_TASK_LIST.md"
PROJECT_SCOPE_PATH = ROOT / "docs" / "PROJECT_SCOPE.md"
CONTRACT_PATH = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
REPORT_PATH = TASKS_DIR / "TASK_AUDIT_REPORT.md"

BASE_TABLES = ["profiles", "mate_posts", "mate_applications", "blocks", "reports", "app_settings"]
MAX_TABLES = 6

CATEGORY_TYPE_PREFIX = {
    "Page Owner": "page_owner",
    "Component": "component",
    "Data": "data",
    "DB": "db",
    "Infra": "infra",
    "API": "api",
    "Test": "test",
    "CI": "ci",
    "Release Check": "release_check",
}

FIELD_LINE_RE = re.compile(r"^- \*\*([^:*]+):\*\*\s*(.*)$")
SUMMARY_ROW_RE = re.compile(r"^\|(.+)\|$")
DETAIL_HEADING_RE = re.compile(r"^####\s*(\d+)\.\s*`([A-Z0-9\-]+)`\s*—\s*(.+?)\s*$")
BACKTICK_RE = re.compile(r"`([^`]*)`")
NEGATION_RE = re.compile(
    r"(하지\s*않는|않음|금지|제외|구성하지\s*않|사용하지\s*않|만들지\s*않|미구축|미사용|no\b|not\b|forbid|prohibit)",
    re.IGNORECASE,
)
FORBIDDEN_TOKEN_RE = re.compile(
    r"\bec2\b|\baws\b|auto-?merge|automerge|무인\s*자동\s*merge|자동\s*병합\s*러너", re.IGNORECASE
)
TABLE_TOKEN_RE = re.compile(r"`([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+)`")
TABLE_TOKEN_EXCLUDE_RE = re.compile(r"^(NEXT_|SUPABASE_)|KEY|URL|PUBLIC|ANON", re.IGNORECASE)
REQ_TOKEN_RE = re.compile(r"(REQ-(FUNC|NF))?-?(\d{2,3})(?:~(\d{2,3}))?")


class Findings:
    def __init__(self) -> None:
        self.checks: list[dict] = []

    def record(self, num: int, name: str, ok: bool, details: list[str]) -> None:
        self.checks.append({"num": num, "name": name, "ok": ok, "details": details})

    @property
    def passed(self) -> int:
        return sum(1 for c in self.checks if c["ok"])

    @property
    def total(self) -> int:
        return len(self.checks)

    @property
    def all_ok(self) -> bool:
        return all(c["ok"] for c in self.checks)


def split_cells(row: str) -> list[str]:
    return [c.strip() for c in row.strip().strip("|").split("|")]


def strip_backticks(s: str) -> str:
    return BACKTICK_RE.sub(lambda m: m.group(1), s).strip()


def split_list_field(value: str) -> list[str]:
    value = strip_backticks(value)
    if not value or value in ("—", "-", "없음"):
        return []
    out = []
    for part in value.split(","):
        part = part.strip()
        part = re.sub(r"\(.*?\)$", "", part).strip()
        if part and part not in ("—", "-"):
            out.append(part)
    return out


# ---------------------------------------------------------------------------
# Parsing TASKS/00_TASK_LIST.md
# ---------------------------------------------------------------------------


def parse_summary_table(text: str) -> list[dict]:
    rows: list[dict] = []
    in_table = False
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("| Seq | Task ID"):
            in_table = True
            continue
        if not in_table:
            continue
        if not line.startswith("|"):
            if rows:
                break
            continue
        m = SUMMARY_ROW_RE.match(line)
        if not m:
            continue
        cells = split_cells(line)
        if len(cells) < 6:
            continue
        if cells[0] in ("Seq", "") or set(cells[0]) <= {"-", ":"}:
            continue
        if not cells[0].isdigit():
            continue
        rows.append(
            {
                "seq": cells[0],
                "task_id": cells[1],
                "title": cells[2],
                "category": cells[3],
                "screen": cells[4],
                "priority": cells[5],
            }
        )
    return rows


def parse_detail_blocks(text: str) -> dict[str, dict]:
    lines = text.splitlines()
    blocks: dict[str, dict] = {}
    i = 0
    n = len(lines)
    while i < n:
        m = DETAIL_HEADING_RE.match(lines[i].strip())
        if not m:
            i += 1
            continue
        task_id = m.group(2)
        body_lines = []
        i += 1
        while i < n and not DETAIL_HEADING_RE.match(lines[i].strip()) and not lines[i].strip() == "---":
            body_lines.append(lines[i])
            i += 1
        fields = parse_fields(body_lines)
        blocks[task_id] = {"raw": "\n".join(body_lines), "fields": fields}
    return blocks


def parse_fields(body_lines: list[str]) -> dict[str, str]:
    fields: dict[str, list[str]] = {}
    current: str | None = None
    for raw_line in body_lines:
        m = FIELD_LINE_RE.match(raw_line.strip())
        if m:
            label = m.group(1).strip()
            inline = m.group(2).strip()
            current = label
            fields.setdefault(current, [])
            if inline:
                fields[current].append(inline)
            continue
        if current and raw_line.strip():
            fields[current].append(raw_line.strip())
    return {k: "\n".join(v) for k, v in fields.items()}


def parse_excluded_table(text: str) -> dict[str, str]:
    out: dict[str, str] = {}
    marker = "## 10. NON_IMPLEMENTATION"
    idx = text.find(marker)
    if idx == -1:
        return out
    end = text.find("\n## ", idx + 1)
    section = text[idx:end] if end != -1 else text[idx:]
    for line in section.splitlines():
        line = line.strip()
        mm = SUMMARY_ROW_RE.match(line)
        if not mm:
            continue
        cells = split_cells(line)
        if len(cells) < 2 or not cells[0].startswith("REQ-"):
            continue
        out[cells[0]] = cells[1]
    return out


def parse_traceability(text: str) -> dict[str, dict]:
    out: dict[str, dict] = {}
    marker = "## 11. Requirement Traceability"
    idx = text.find(marker)
    if idx == -1:
        return out
    section = text[idx:]
    for line in section.splitlines():
        line = line.strip()
        mm = SUMMARY_ROW_RE.match(line)
        if not mm:
            continue
        cells = split_cells(line)
        if len(cells) < 3 or not cells[0].startswith("REQ-"):
            continue
        out[cells[0]] = {"status": cells[1], "linked": cells[2]}
    return out


def load_task_detail_files() -> dict[str, str]:
    out: dict[str, str] = {}
    if not TASKS_DIR.exists():
        return out
    for p in TASKS_DIR.glob("TASK-*.md"):
        task_id = p.stem[len("TASK-"):]
        out[task_id] = p.read_text(encoding="utf-8")
    return out


def expand_req_refs(value: str) -> set[str]:
    ids: set[str] = set()
    prefix = None
    if not value:
        return ids
    for token in re.split(r",", value):
        token = token.strip()
        token = re.sub(r"\(.*?\)", "", token).strip()
        if not token:
            continue
        pm = re.match(r"^(REQ-(FUNC|NF))-(\d+)(?:~(\d+))?$", token)
        if pm:
            prefix = f"REQ-{pm.group(2)}"
            start = int(pm.group(3))
            end = int(pm.group(4)) if pm.group(4) else start
            for n in range(start, end + 1):
                ids.add(f"{prefix}-{n:03d}")
            continue
        nm = re.match(r"^(\d+)(?:~(\d+))?$", token)
        if nm and prefix:
            start = int(nm.group(1))
            end = int(nm.group(2)) if nm.group(2) else start
            for n in range(start, end + 1):
                ids.add(f"{prefix}-{n:03d}")
    return ids


# ---------------------------------------------------------------------------
# Task registry helper
# ---------------------------------------------------------------------------


class TaskRegistry:
    def __init__(self, summary_rows: list[dict], detail_blocks: dict[str, dict], detail_files: dict[str, str]):
        self.summary_by_id: dict[str, dict] = {r["task_id"]: r for r in summary_rows}
        self.summary_rows = summary_rows
        self.detail_blocks = detail_blocks
        self.detail_files = detail_files

    def ids(self) -> set[str]:
        return set(self.summary_by_id)

    def category(self, task_id: str) -> str:
        return self.summary_by_id.get(task_id, {}).get("category", "")

    def field(self, task_id: str, label: str) -> str:
        if task_id in self.detail_files:
            f = parse_fields(self.detail_files[task_id].splitlines())
            if label in f and f[label]:
                return f[label]
        block = self.detail_blocks.get(task_id)
        if block:
            return block["fields"].get(label, "")
        return ""

    def full_text(self, task_id: str) -> str:
        parts = []
        if task_id in self.detail_files:
            parts.append(self.detail_files[task_id])
        block = self.detail_blocks.get(task_id)
        if block:
            parts.append(block["raw"])
        row = self.summary_by_id.get(task_id)
        if row:
            parts.append(row.get("title", ""))
        return "\n".join(parts)

    def depends_on(self, task_id: str) -> list[str]:
        return split_list_field(self.field(task_id, "Depends On"))


# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------


def check_1_one_to_one(reg: TaskRegistry, f: Findings) -> None:
    details = []
    missing = [tid for tid in reg.ids() if tid not in reg.detail_files]
    for tid in sorted(missing):
        details.append(f"상세 파일 없음: TASKS/TASK-{tid}.md")
    orphans = [tid for tid in reg.detail_files if tid not in reg.ids()]
    for tid in sorted(orphans):
        details.append(f"고아 상세 파일: TASKS/TASK-{tid}.md (Task List에 없는 ID)")
    f.record(1, "Task List 구현 ID와 상세 Task 파일 1:1", not details, details)


def check_2_duplicate_ids(reg: TaskRegistry, f: Findings) -> None:
    seen: dict[str, int] = {}
    for r in reg.summary_rows:
        seen[r["task_id"]] = seen.get(r["task_id"], 0) + 1
    dups = [tid for tid, c in seen.items() if c > 1]
    details = [f"중복 Task ID: {tid} ({seen[tid]}회)" for tid in sorted(dups)]
    f.record(2, "중복 Task ID 0", not details, details)


def check_3_depends_missing(reg: TaskRegistry, f: Findings) -> None:
    details = []
    ids = reg.ids()
    for tid in sorted(ids):
        for dep in reg.depends_on(tid):
            if dep not in ids:
                details.append(f"{tid}: 존재하지 않는 Task '{dep}'에 의존")
    f.record(3, "Depends On 누락 0", not details, details)


def check_4_dependency_cycle(reg: TaskRegistry, f: Findings) -> None:
    graph = {tid: [d for d in reg.depends_on(tid) if d in reg.ids()] for tid in reg.ids()}
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in graph}
    cycles: list[str] = []

    def dfs(node: str, path: list[str]) -> None:
        color[node] = GRAY
        path.append(node)
        for nxt in graph.get(node, []):
            if color.get(nxt) == GRAY:
                cyc_start = path.index(nxt)
                cycles.append(" -> ".join(path[cyc_start:] + [nxt]))
            elif color.get(nxt, WHITE) == WHITE:
                dfs(nxt, path)
        path.pop()
        color[node] = BLACK

    for tid in sorted(graph):
        if color[tid] == WHITE:
            dfs(tid, [])
    f.record(4, "Dependency Cycle 0", not cycles, cycles)


def check_5_page_owner_per_screen(
    reg: TaskRegistry, contract: dict, f: Findings
) -> dict[str, str]:
    contract_screens = [s["screen_id"] for s in contract.get("screens", [])]
    owners_by_screen: dict[str, list[str]] = {s: [] for s in contract_screens}
    details = []
    for r in reg.summary_rows:
        if r["category"] != "Page Owner":
            continue
        screen = r["screen"]
        owners_by_screen.setdefault(screen, [])
        owners_by_screen[screen].append(r["task_id"])
    for s in contract_screens:
        owners = owners_by_screen.get(s, [])
        if len(owners) == 0:
            details.append(f"{s}: Page Owner Task 없음")
        elif len(owners) > 1:
            details.append(f"{s}: Page Owner Task 중복 {owners}")
    for s, owners in owners_by_screen.items():
        if s not in contract_screens and owners:
            details.append(f"SCREEN_ROUTE_CONTRACT.json에 없는 Screen '{s}'에 Page Owner Task {owners}")
    f.record(5, "Screen 5개 모두 Page Owner 정확히 1개", not details, details)
    return {s: owners[0] for s, owners in owners_by_screen.items() if len(owners) == 1}


def check_6_route_page_entry_expected_files(
    reg: TaskRegistry, contract: dict, page_owner_by_screen: dict[str, str], f: Findings
) -> None:
    details = []
    for s in contract.get("screens", []):
        screen_id = s["screen_id"]
        owner = page_owner_by_screen.get(screen_id)
        if not owner:
            continue
        route = strip_backticks(reg.field(owner, "Route"))
        page_entry = strip_backticks(reg.field(owner, "Page Entry"))
        expected_files = reg.field(owner, "Expected Files")
        if route != s["route"]:
            details.append(f"{owner}: Route '{route}' != 계약 '{s['route']}'")
        if s["page_entry"] not in page_entry:
            details.append(f"{owner}: Page Entry '{page_entry}' != 계약 '{s['page_entry']}'")
        if s["page_entry"] not in expected_files:
            details.append(f"{owner}: Expected Files에 '{s['page_entry']}'가 없음")
    f.record(6, "Route·Page Entry·Expected Files 일치", not details, details)


def check_7_component_only_screen(
    reg: TaskRegistry, contract: dict, page_owner_by_screen: dict[str, str], f: Findings
) -> None:
    contract_screens = {s["screen_id"] for s in contract.get("screens", [])}
    details = []
    for r in reg.summary_rows:
        if r["category"] != "Component":
            continue
        screen = r["screen"]
        if screen in ("—", "-", "공통", ""):
            continue
        if screen not in contract_screens:
            details.append(f"{r['task_id']}: 알 수 없는 Screen '{screen}' 참조")
            continue
        if screen not in page_owner_by_screen:
            details.append(f"Screen '{screen}'에 Component는 있으나 Page Owner가 없음 ({r['task_id']})")
    f.record(7, "Component-only Screen 0", not details, details)


def check_8_scr001_starter(reg: TaskRegistry, page_owner_by_screen: dict[str, str], f: Findings) -> None:
    owner = page_owner_by_screen.get("SCR-001")
    details = []
    if not owner:
        details.append("SCR-001 Page Owner Task를 찾지 못함")
    else:
        text = reg.full_text(owner)
        has_starter = any(k in text for k in ["스타터", "starter", "create-next-app"])
        has_removal = any(k in text for k in ["제거", "삭제", "교체", "remove", "replace"])
        if not (has_starter and has_removal):
            details.append(f"{owner}: 스타터 템플릿 제거 AC를 찾지 못함")
    f.record(8, "SCR-001 Starter 제거 AC 존재", not details, details)


def check_9_scr003_tabs(reg: TaskRegistry, page_owner_by_screen: dict[str, str], f: Findings) -> None:
    owner = page_owner_by_screen.get("SCR-003")
    details = []
    if not owner:
        details.append("SCR-003 Page Owner Task를 찾지 못함")
    else:
        text = reg.full_text(owner)
        missing = [k for k in ["항공", "숙소", "동행"] if k not in text]
        if missing:
            details.append(f"{owner}: 본문에 {missing} 언급 없음")
        if not re.search(r"탭|tab", text, re.IGNORECASE):
            details.append(f"{owner}: 탭 조립 언급 없음")
    f.record(9, "SCR-003 세 탭 조립 AC 존재", not details, details)


def check_10_scr005_roles(reg: TaskRegistry, page_owner_by_screen: dict[str, str], f: Findings) -> None:
    owner = page_owner_by_screen.get("SCR-005")
    details = []
    if not owner:
        details.append("SCR-005 Page Owner Task를 찾지 못함")
    else:
        text = reg.full_text(owner)
        for label, group in [
            ("Guest", ["Guest", "게스트", "비로그인"]),
            ("Member", ["Member", "회원"]),
            ("Admin", ["Admin", "관리자"]),
        ]:
            if not any(term in text for term in group):
                details.append(f"{owner}: {label} 상태 조립 언급 없음")
    f.record(10, "SCR-005 역할별 상태 조립 AC 존재", not details, details)


def check_11_db_tasks_exist(reg: TaskRegistry, f: Findings) -> None:
    required = ["DB-SCHEMA-BASE", "DB-RLS-BASE", "DB-ACCESS", "DB-SEED-BASE"]
    details = []
    for tid in required:
        if tid not in reg.ids():
            details.append(f"필수 DB Task 없음: {tid}")
        elif reg.category(tid) != "DB":
            details.append(f"{tid}의 Category가 'DB'가 아님: {reg.category(tid)}")
    f.record(11, "DB Schema·RLS·Access·Seed Task 존재", not details, details)


def check_12_db_table_scope(reg: TaskRegistry, f: Findings) -> list[str]:
    tokens: set[str] = set()
    audit_log_unnegated = False
    for r in reg.summary_rows:
        if r["category"] != "DB":
            continue
        text = reg.full_text(r["task_id"])
        for line in text.splitlines():
            negated = bool(NEGATION_RE.search(line))
            for m in TABLE_TOKEN_RE.finditer(line):
                tok = m.group(1)
                if TABLE_TOKEN_EXCLUDE_RE.search(tok):
                    continue
                if tok == "AUDIT_LOG":
                    if negated:
                        continue
                    audit_log_unnegated = True
                tokens.add(tok)
    details = []
    if audit_log_unnegated:
        details.append("AUDIT_LOG 테이블이 부정문 없이 DB Task 본문에 등장함(범위 밖)")
    if len(tokens) > MAX_TABLES:
        details.append(f"DB Task에서 발견된 테이블 수 {len(tokens)}개가 기준({MAX_TABLES}개)를 초과: {sorted(tokens)}")
    f.record(12, "DB Table 범위가 6개 기본 테이블을 크게 넘지 않음", not details, details)
    return sorted(tokens)


def check_13_no_external_persistence(reg: TaskRegistry, f: Findings) -> None:
    candidates = [
        r["task_id"]
        for r in reg.summary_rows
        if r["screen"] == "SCR-003"
        and (
            "FLIGHT" in r["task_id"] or "HOTEL" in r["task_id"] or r["category"] == "Page Owner"
        )
    ]
    details = []
    found = False
    for tid in candidates:
        text = reg.field(tid, "Security/Privacy AC") or reg.full_text(tid)
        mentions_target = any(k in text for k in ["서버", "DB", "URL"])
        if mentions_target and NEGATION_RE.search(text):
            found = True
    if not found:
        details.append("SCR-003 항공/숙소 관련 Task 중 '서버/DB/URL에 전달·저장하지 않는다' AC를 찾지 못함")
    f.record(13, "외부 입력 비저장 AC 존재", not details, details)


def check_14_auth_adult_rls(reg: TaskRegistry, f: Findings) -> None:
    required = {
        "INFRA-AUTH-SESSION": ["인증", "세션", "auth", "Auth"],
        "INFRA-ADULT-VERIFICATION": ["성인"],
        "DB-RLS-BASE": ["RLS"],
    }
    details = []
    for tid, keywords in required.items():
        if tid not in reg.ids():
            details.append(f"필수 Task 없음: {tid}")
            continue
        text = reg.full_text(tid)
        if not any(k in text for k in keywords):
            details.append(f"{tid}: 관련 키워드({keywords}) 언급 없음")
    f.record(14, "Auth·성인·기본 RLS AC 존재", not details, details)


def check_15_playwright_chromium(reg: TaskRegistry, f: Findings) -> None:
    found_tasks = []
    for r in reg.summary_rows:
        if not r["category"].startswith("Test"):
            continue
        text = reg.full_text(r["task_id"])
        if re.search(r"playwright", text, re.IGNORECASE) and re.search(r"chromium", text, re.IGNORECASE):
            found_tasks.append(r["task_id"])
    details = [] if found_tasks else ["Playwright + Chromium을 명시한 Test Task를 찾지 못함"]
    f.record(15, "Playwright Chromium Smoke Task 존재", not details, details)


def check_16_forbidden_tech(reg: TaskRegistry, f: Findings) -> None:
    details = []
    for tid in reg.ids():
        text = reg.full_text(tid)
        for line in text.splitlines():
            if FORBIDDEN_TOKEN_RE.search(line) and not NEGATION_RE.search(line):
                details.append(f"{tid}: 금지 기술이 부정문 없이 언급됨 -> {line.strip()[:120]}")
    f.record(16, "AWS·EC2·자동 Merge 구현 Task 0", not details, details)


def check_17_requirement_coverage(trace: dict[str, dict], f: Findings) -> set[str]:
    details = []
    expected_func = {f"REQ-FUNC-{n:03d}" for n in range(1, 81)}
    expected_nf = {f"REQ-NF-{n:03d}" for n in range(1, 35)}
    expected = expected_func | expected_nf
    found = set(trace.keys())
    missing = sorted(expected - found)
    extra = sorted(found - expected)
    for rid in missing:
        details.append(f"Traceability 표에 없음: {rid}")
    for rid in extra:
        details.append(f"Traceability 표에 알 수 없는 ID: {rid}")
    excluded_ids = set()
    for rid, info in trace.items():
        status = info["status"]
        if status != "EXCLUDED" and not status.startswith("IMPLEMENT"):
            details.append(f"{rid}: 알 수 없는 Implementation Status '{status}'")
        if status == "EXCLUDED":
            excluded_ids.add(rid)
    f.record(17, "REQ-FUNC 80개와 REQ-NF 34개가 Task 또는 EXCLUDED 표에 존재", not details, details)
    return excluded_ids


def check_18_excluded_no_detail_file(
    reg: TaskRegistry, excluded_ids: set[str], excluded_table: dict[str, str], f: Findings
) -> None:
    details = []
    table_mismatch = excluded_ids ^ set(excluded_table.keys())
    if table_mismatch:
        details.append(f"§10 EXCLUDED 표와 §11 Traceability EXCLUDED 목록이 불일치: {sorted(table_mismatch)}")
    for rid in sorted(excluded_ids):
        detail_file = TASKS_DIR / f"TASK-{rid}.md"
        if detail_file.exists():
            details.append(f"EXCLUDED Requirement '{rid}'에 대한 상세 구현 파일이 존재함: {detail_file.name}")
    for tid in reg.ids():
        req_text = reg.field(tid, "Requirement Ref")
        refs = expand_req_refs(req_text)
        hit = refs & excluded_ids
        if hit:
            details.append(f"{tid}: Requirement Ref에 EXCLUDED ID 포함 {sorted(hit)}")
    f.record(18, "EXCLUDED 상세 구현 파일이 생성되지 않음", not details, details)


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------


def load_wave_ids() -> dict[str, str]:
    """TASKS/WAVE_STATE.json(scripts/build_waves.py 산출물)이 있으면 task_id -> wave_id를
    읽어온다. 없으면 빈 dict — write_manifest는 이 경우 wave_id 열을 비워 둔다(TASK_MANIFEST.csv를
    재생성해도 build_waves.py가 계산한 배치가 사라지지 않도록, 있으면 항상 우선 보존한다).
    """
    state_path = TASKS_DIR / "WAVE_STATE.json"
    if not state_path.exists():
        return {}
    try:
        state = json.loads(state_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}
    out: dict[str, str] = {}
    for w in state.get("waves", []):
        for tid in w.get("task_ids", []):
            out[tid] = w.get("wave_id", "")
    return out


def write_manifest(reg: TaskRegistry) -> None:
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    wave_ids = load_wave_ids()
    with MANIFEST_PATH.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(
            [
                "seq",
                "task_id",
                "title",
                "category",
                "type",
                "screen",
                "priority",
                "route",
                "page_entry",
                "depends_on",
                "requirement_ref",
                "detail_file",
                "detail_file_exists",
                "verify",
                "wave_id",
            ]
        )
        for r in reg.summary_rows:
            tid = r["task_id"]
            detail_file = f"TASK-{tid}.md"
            writer.writerow(
                [
                    r["seq"],
                    tid,
                    r["title"],
                    r["category"],
                    CATEGORY_TYPE_PREFIX.get(r["category"], r["category"].lower()),
                    r["screen"],
                    r["priority"],
                    strip_backticks(reg.field(tid, "Route")),
                    strip_backticks(reg.field(tid, "Page Entry")),
                    "; ".join(reg.depends_on(tid)),
                    strip_backticks(reg.field(tid, "Requirement Ref")).replace("\n", " "),
                    detail_file,
                    (TASKS_DIR / detail_file).exists(),
                    strip_backticks(reg.field(tid, "Verify")).replace("\n", " "),
                    wave_ids.get(tid, ""),
                ]
            )


def write_report(f: Findings, reg: TaskRegistry, extra_notes: list[str]) -> None:
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    now = datetime.now(timezone.utc).isoformat()
    lines = []
    lines.append("# TASK_AUDIT_REPORT")
    lines.append("")
    lines.append(f"- Generated: {now}")
    lines.append(f"- Source: `TASKS/00_TASK_LIST.md` (+ `TASKS/TASK-*.md` 있으면 우선 사용)")
    lines.append(f"- Total tasks (요약표): {len(reg.summary_rows)}")
    lines.append(f"- Checks passed: {f.passed}/{f.total}")
    lines.append(f"- Result: {'AUDIT_PASS' if f.all_ok else 'AUDIT_FAIL'}")
    lines.append("")
    lines.append("## Checks")
    lines.append("")
    for c in f.checks:
        status = "PASS" if c["ok"] else "FAIL"
        lines.append(f"### {c['num']}. {c['name']} — {status}")
        if c["details"]:
            for d in c["details"]:
                lines.append(f"- {d}")
        else:
            lines.append("- (문제 없음)")
        lines.append("")
    if extra_notes:
        lines.append("## Notes")
        for n in extra_notes:
            lines.append(f"- {n}")
        lines.append("")
    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> int:
    if not TASK_LIST_PATH.exists():
        print(f"[ERROR] {TASK_LIST_PATH.relative_to(ROOT)}가 없습니다.")
        return 1
    if not CONTRACT_PATH.exists():
        print(f"[ERROR] {CONTRACT_PATH.relative_to(ROOT)}가 없습니다.")
        return 1
    if not PROJECT_SCOPE_PATH.exists():
        print(f"[ERROR] {PROJECT_SCOPE_PATH.relative_to(ROOT)}가 없습니다.")
        return 1

    text = TASK_LIST_PATH.read_text(encoding="utf-8")
    contract = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))

    summary_rows = parse_summary_table(text)
    detail_blocks = parse_detail_blocks(text)
    detail_files = load_task_detail_files()
    excluded_table = parse_excluded_table(text)
    trace = parse_traceability(text)

    reg = TaskRegistry(summary_rows, detail_blocks, detail_files)
    f = Findings()

    check_1_one_to_one(reg, f)
    check_2_duplicate_ids(reg, f)
    check_3_depends_missing(reg, f)
    check_4_dependency_cycle(reg, f)
    page_owner_by_screen = check_5_page_owner_per_screen(reg, contract, f)
    check_6_route_page_entry_expected_files(reg, contract, page_owner_by_screen, f)
    check_7_component_only_screen(reg, contract, page_owner_by_screen, f)
    check_8_scr001_starter(reg, page_owner_by_screen, f)
    check_9_scr003_tabs(reg, page_owner_by_screen, f)
    check_10_scr005_roles(reg, page_owner_by_screen, f)
    check_11_db_tasks_exist(reg, f)
    found_tables = check_12_db_table_scope(reg, f)
    check_13_no_external_persistence(reg, f)
    check_14_auth_adult_rls(reg, f)
    check_15_playwright_chromium(reg, f)
    check_16_forbidden_tech(reg, f)
    excluded_ids = check_17_requirement_coverage(trace, f)
    check_18_excluded_no_detail_file(reg, excluded_ids, excluded_table, f)

    extra_notes = [
        f"요약표 Task 수: {len(summary_rows)}, 상세 파일(TASKS/TASK-*.md) 존재 수: {len(detail_files)}",
        f"DB Task 본문에서 발견된 테이블 토큰: {found_tables}",
        f"EXCLUDED Requirement 수(§11 기준): {len(excluded_ids)}",
    ]

    write_manifest(reg)
    write_report(f, reg, extra_notes)

    print("=== audit_task_manifest.py — TASKS/ Task 감사 ===\n")
    for c in f.checks:
        status = "PASS" if c["ok"] else "FAIL"
        print(f"[{status}] {c['num']:>2}. {c['name']}")
        for d in c["details"]:
            print(f"        - {d}")
    print()
    print(f"Manifest: {MANIFEST_PATH.relative_to(ROOT)}")
    print(f"Report:   {REPORT_PATH.relative_to(ROOT)}")
    print()

    if f.all_ok:
        print(f"AUDIT_PASS  검사 수 {f.passed}/{f.total}")
        return 0
    print(f"AUDIT_FAIL  검사 수 {f.passed}/{f.total} 통과, {f.total - f.passed}개 실패")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
