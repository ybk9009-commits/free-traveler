#!/usr/bin/env python3
"""check_screen_contract.py — Traveler 5개 Screen 계약 검사.

입력:
    design-reference/SCREEN_ROUTE_CONTRACT.json  (Screen/Route/Page Entry 정본)
    TASKS/TASK_MANIFEST.csv                       (Page Owner Task 등 Task 요약)
    src/app 디렉터리                              (--mode=ci/release에서만 실제 Page 파일을 스캔)

Usage:
    python scripts/check_screen_contract.py --mode=plan
    python scripts/check_screen_contract.py --mode=ci
    python scripts/check_screen_contract.py --mode=release

mode=plan   : Page Owner Task와 Route 계획만 검사한다(TASK_MANIFEST.csv 기준, src/app 실측 없음).
mode=ci     : plan 검사 + src/app에 실제 구현된 Page 파일과 공개 경로를 실측 검사한다.
mode=release: ci 검사 + docs/preview-checks/SCR-001.md ~ SCR-005.md Preview Checkpoint 존재를 확인한다.
--mode을 생략하면 ci로 동작한다.

검사(사용자 지정 6개):
 1. 고정 화면 5개가 정확히 존재한다.
 2. 각 화면 Page Owner Task가 정확히 하나다.
 3. 기술 경로(/auth/callback, /api/**, not-found 등)를 사용자 화면으로 세지 않는다.
 4. 여행지 상세·안전정보를 새 Page로 만들지 않았는지 검사한다.
 5. SCR-003 Page Owner Task가 여행 입력(항공/숙소)과 동행 작성 요구를 모두 포함한다.
 6. (release 전용) docs/preview-checks/SCR-001.md ~ SCR-005.md 존재를 확인한다.

성공 시(모든 검사 통과) `SCREEN_CONTRACT_PASS`를 출력하고 exit 0으로 종료한다.
하나라도 실패하면 각 오류를 파일·화면 ID·수정 힌트와 함께 출력하고 exit 1로 종료한다.
표준 라이브러리만 사용한다. 이 스크립트는 어떤 파일도 수정하지 않는다.
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[1]
CONTRACT_PATH = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_PATH = ROOT / "TASKS" / "TASK_MANIFEST.csv"
APP_DIR = ROOT / "src" / "app"
PREVIEW_CHECKS_DIR = ROOT / "docs" / "preview-checks"

CONTRACT_REL = CONTRACT_PATH.relative_to(ROOT).as_posix()
MANIFEST_REL = MANIFEST_PATH.relative_to(ROOT).as_posix()

# 고정 화면 5개(사용자 지정) — SCREEN_ROUTE_CONTRACT.json·TASK_MANIFEST.csv가 이 값과
# 일치하는지가 검사 1/2의 기준이 된다.
FIXED_SCREENS = [
    {"screen_id": "SCR-001", "route": "/", "page_entry": "src/app/page.tsx"},
    {"screen_id": "SCR-002", "route": "/about", "page_entry": "src/app/about/page.tsx"},
    {"screen_id": "SCR-003", "route": "/travel-tools", "page_entry": "src/app/travel-tools/page.tsx"},
    {"screen_id": "SCR-004", "route": "/mates", "page_entry": "src/app/mates/page.tsx"},
    {"screen_id": "SCR-005", "route": "/account", "page_entry": "src/app/account/page.tsx"},
]
FIXED_SCREEN_IDS = {s["screen_id"] for s in FIXED_SCREENS}
FIXED_ROUTES = {s["route"] for s in FIXED_SCREENS}
SCREEN_BY_ID = {s["screen_id"]: s for s in FIXED_SCREENS}

# 허용 기술 경로(사용자 지정) — 화면(Screen) 수에 포함하지 않는다.
TECHNICAL_ROUTE_PATTERNS = [
    re.compile(r"^/auth/callback$"),
    re.compile(r"^/api(/.*)?$"),
]
TECHNICAL_ROUTE_LABEL = "/auth/callback, /api/**, not-found"

DESTINATION_SAFETY_KEYWORDS = [
    "destination",
    "destinations",
    "safety",
    "여행지",
    "안전정보",
    "안전",
]

TRAVEL_INPUT_DEP_RE = re.compile(r"FLIGHT|HOTEL", re.IGNORECASE)
MATE_WRITE_DEP_RE = re.compile(r"MATE-WRITE|MATE-POST", re.IGNORECASE)


@dataclass
class Issue:
    screen_id: str
    file: str
    message: str
    hint: str


@dataclass
class CheckResult:
    number: int
    name: str
    issues: list[Issue] = field(default_factory=list)
    skipped: bool = False

    @property
    def passed(self) -> bool:
        return not self.issues


def load_contract() -> dict:
    if not CONTRACT_PATH.exists():
        print(f"[ERROR] 파일 없음: {CONTRACT_REL}")
        raise SystemExit(1)
    try:
        return json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"[ERROR] JSON 파싱 실패: {CONTRACT_REL} — {e}")
        raise SystemExit(1)


def load_manifest_rows() -> list[dict]:
    if not MANIFEST_PATH.exists():
        print(f"[ERROR] 파일 없음: {MANIFEST_REL}")
        raise SystemExit(1)
    with MANIFEST_PATH.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def route_from_page_file(path: Path) -> str:
    rel_parts = path.relative_to(APP_DIR).parts[:-1]
    segments = [p for p in rel_parts if not (p.startswith("(") and p.endswith(")"))]
    return "/" + "/".join(segments) if segments else "/"


def scan_app_pages() -> dict[str, Path]:
    """src/app 밑의 page.tsx/page.ts를 스캔해 route -> 파일 경로로 매핑한다.

    Private 폴더(`_`로 시작하는 경로 세그먼트)는 Next.js App Router가 라우팅에서
    제외하므로 화면으로 세지 않는다.
    """
    found: dict[str, Path] = {}
    if not APP_DIR.exists():
        return found
    for pattern in ("page.tsx", "page.ts"):
        for p in APP_DIR.rglob(pattern):
            if any(seg.startswith("_") for seg in p.relative_to(APP_DIR).parts):
                continue
            found[route_from_page_file(p)] = p
    return found


def is_technical_route(route: str) -> bool:
    return any(pat.match(route) for pat in TECHNICAL_ROUTE_PATTERNS)


def looks_like_destination_or_safety(*texts: str) -> bool:
    joined = " ".join(t for t in texts if t)
    lowered = joined.lower()
    return any(kw in joined or kw.lower() in lowered for kw in DESTINATION_SAFETY_KEYWORDS)


def check_1_fixed_screens(
    contract: dict, mode: str, found_pages: dict[str, Path] | None
) -> CheckResult:
    r = CheckResult(1, "고정 화면 5개가 정확히 존재한다")
    screens = contract.get("screens", [])
    contract_by_id = {s.get("screen_id"): s for s in screens}

    if len(screens) != 5:
        r.issues.append(
            Issue(
                "-",
                CONTRACT_REL,
                f"Screen 수가 5가 아님: {len(screens)}개",
                "screens 배열을 고정 화면 5개(SCR-001~005)로 맞춘다",
            )
        )

    for screen in FIXED_SCREENS:
        sid = screen["screen_id"]
        c = contract_by_id.get(sid)
        if c is None:
            r.issues.append(
                Issue(
                    sid,
                    CONTRACT_REL,
                    f"{sid}가 contract에 없음",
                    f"SCREEN_ROUTE_CONTRACT.json에 {sid}(route={screen['route']}) 항목을 추가한다",
                )
            )
            continue
        if c.get("route") != screen["route"]:
            r.issues.append(
                Issue(
                    sid,
                    CONTRACT_REL,
                    f"route 불일치: contract='{c.get('route')}' / 고정='{screen['route']}'",
                    f"{sid}의 route를 '{screen['route']}'로 맞춘다",
                )
            )
        if c.get("page_entry") != screen["page_entry"]:
            r.issues.append(
                Issue(
                    sid,
                    CONTRACT_REL,
                    f"page_entry 불일치: contract='{c.get('page_entry')}' / 고정='{screen['page_entry']}'",
                    f"{sid}의 page_entry를 '{screen['page_entry']}'로 맞춘다",
                )
            )

    for extra_id in sorted(set(contract_by_id) - FIXED_SCREEN_IDS):
        r.issues.append(
            Issue(
                extra_id,
                CONTRACT_REL,
                "고정 화면 5개 목록 밖의 Screen이 contract에 존재함",
                "고정 화면 5개(SCR-001~005) 외 Screen을 추가하지 않는다",
            )
        )

    if mode in ("ci", "release"):
        for screen in FIXED_SCREENS:
            file_path = ROOT / screen["page_entry"]
            if not file_path.exists():
                r.issues.append(
                    Issue(
                        screen["screen_id"],
                        screen["page_entry"],
                        "Page 파일이 존재하지 않음(미구현)",
                        f"{screen['page_entry']}를 생성해 {screen['screen_id']} Page Owner Task를 구현한다",
                    )
                )
        if found_pages is not None:
            for route, path in found_pages.items():
                if route in FIXED_ROUTES or is_technical_route(route):
                    continue
                rel = path.relative_to(ROOT).as_posix()
                if looks_like_destination_or_safety(route, rel):
                    continue  # 검사 4에서 더 구체적으로 보고한다.
                r.issues.append(
                    Issue(
                        "-",
                        rel,
                        f"고정 화면 5개 외 추가 Page 경로 발견: '{route}'",
                        "고정 화면(SCR-001~005) 외 새 Page를 만들지 않는다 — 필요하면 기존 화면의 Section/Drawer로 구현한다",
                    )
                )

    return r


def check_2_page_owner_count(rows: list[dict]) -> CheckResult:
    r = CheckResult(2, "각 화면 Page Owner Task가 정확히 하나다")
    owners_by_screen: dict[str, list[dict]] = {}
    for row in rows:
        if row.get("category") == "Page Owner":
            owners_by_screen.setdefault((row.get("screen") or "").strip(), []).append(row)

    for sid in FIXED_SCREEN_IDS:
        owner_rows = owners_by_screen.get(sid, [])
        if not owner_rows:
            r.issues.append(
                Issue(
                    sid,
                    MANIFEST_REL,
                    "Page Owner Task 없음",
                    f"{sid}의 Page Owner Task를 TASK_MANIFEST.csv(및 원본 Task List)에 추가한다",
                )
            )
        elif len(owner_rows) > 1:
            ids = ", ".join(row["task_id"] for row in owner_rows)
            r.issues.append(
                Issue(
                    sid,
                    MANIFEST_REL,
                    f"Page Owner Task가 {len(owner_rows)}개로 중복됨: {ids}",
                    f"{sid}의 Page Owner Task를 정확히 1개로 줄인다",
                )
            )
        else:
            owner = owner_rows[0]
            expected = SCREEN_BY_ID[sid]
            if owner.get("route") != expected["route"]:
                r.issues.append(
                    Issue(
                        sid,
                        MANIFEST_REL,
                        f"Page Owner Task route 불일치: '{owner.get('route')}' / 고정='{expected['route']}'",
                        f"{owner['task_id']}의 route를 '{expected['route']}'로 맞춘다",
                    )
                )
            if owner.get("page_entry") != expected["page_entry"]:
                r.issues.append(
                    Issue(
                        sid,
                        MANIFEST_REL,
                        f"Page Owner Task page_entry 불일치: '{owner.get('page_entry')}' / 고정='{expected['page_entry']}'",
                        f"{owner['task_id']}의 page_entry를 '{expected['page_entry']}'로 맞춘다",
                    )
                )

    for sid in sorted(set(owners_by_screen) - FIXED_SCREEN_IDS - {"", "—"}):
        ids = ", ".join(row["task_id"] for row in owners_by_screen[sid])
        r.issues.append(
            Issue(
                sid,
                MANIFEST_REL,
                f"정의되지 않은 화면에 대한 Page Owner Task 존재: {ids}",
                "고정 화면 5개(SCR-001~005) 외 Page Owner Task를 만들지 않는다",
            )
        )

    return r


def check_3_technical_routes(
    rows: list[dict], mode: str, found_pages: dict[str, Path] | None
) -> CheckResult:
    r = CheckResult(3, "기술 경로를 사용자 화면으로 세지 않는다")

    for row in rows:
        if row.get("category") != "Page Owner":
            continue
        route = (row.get("route") or "").strip()
        if route and is_technical_route(route):
            r.issues.append(
                Issue(
                    (row.get("screen") or "-").strip() or "-",
                    MANIFEST_REL,
                    f"기술 경로 '{route}'가 Page Owner Task({row['task_id']})로 등록됨",
                    f"기술 경로({TECHNICAL_ROUTE_LABEL})는 Page Owner Task로 세지 않는다",
                )
            )

    if mode in ("ci", "release") and found_pages is not None:
        for route, path in found_pages.items():
            if is_technical_route(route):
                rel = path.relative_to(ROOT).as_posix()
                r.issues.append(
                    Issue(
                        "-",
                        rel,
                        f"기술 경로 '{route}'에 Page(page.tsx) 파일이 존재함",
                        "기술 경로는 Route Handler(route.ts)로 구현하고 page.tsx를 만들지 않는다",
                    )
                )

    return r


def check_4_no_destination_or_safety_page(
    rows: list[dict], mode: str, found_pages: dict[str, Path] | None
) -> CheckResult:
    r = CheckResult(4, "여행지 상세·안전정보를 새 Page로 만들지 않았는지 검사")

    for row in rows:
        if row.get("category") != "Page Owner":
            continue
        sid = (row.get("screen") or "").strip()
        if sid in FIXED_SCREEN_IDS:
            continue
        if looks_like_destination_or_safety(row.get("title") or "", row.get("task_id") or ""):
            r.issues.append(
                Issue(
                    sid or row["task_id"],
                    MANIFEST_REL,
                    f"여행지 상세/안전정보로 추정되는 새 Page Owner Task 발견: {row['task_id']}({row.get('title')})",
                    "여행지 상세·안전정보는 SCR-001/SCR-002의 Drawer 또는 기존 Section으로 구현하고 새 Page를 만들지 않는다",
                )
            )

    if mode in ("ci", "release") and found_pages is not None:
        for route, path in found_pages.items():
            if route in FIXED_ROUTES or is_technical_route(route):
                continue
            rel = path.relative_to(ROOT).as_posix()
            if looks_like_destination_or_safety(route, rel):
                r.issues.append(
                    Issue(
                        "-",
                        rel,
                        f"여행지 상세/안전정보로 추정되는 새 Page 경로 발견: '{route}'",
                        "해당 Page를 제거하고 기존 화면(SCR-001/SCR-002)의 Drawer·Section으로 대체한다",
                    )
                )

    return r


def check_5_scr003_dual_requirements(rows: list[dict]) -> CheckResult:
    r = CheckResult(
        5, "SCR-003 Page Owner Task가 여행 입력과 동행 작성 요구를 모두 포함한다"
    )
    owner = next(
        (
            row
            for row in rows
            if row.get("category") == "Page Owner" and row.get("screen") == "SCR-003"
        ),
        None,
    )
    if owner is None:
        r.issues.append(
            Issue(
                "SCR-003",
                MANIFEST_REL,
                "SCR-003 Page Owner Task를 찾지 못함",
                "SCR-003 Page Owner Task(예: PAGE-SCR003)를 TASK_MANIFEST.csv에 등록한다",
            )
        )
        return r

    deps = owner.get("depends_on") or ""
    if not TRAVEL_INPUT_DEP_RE.search(deps):
        r.issues.append(
            Issue(
                "SCR-003",
                MANIFEST_REL,
                f"{owner['task_id']}의 depends_on에 항공/숙소(여행 입력) 관련 Task가 없음",
                "CMP-SCR003-FLIGHT-FORM/CMP-SCR003-HOTEL-FORM 같은 여행 입력 Component Task를 depends_on에 추가한다",
            )
        )
    if not MATE_WRITE_DEP_RE.search(deps):
        r.issues.append(
            Issue(
                "SCR-003",
                MANIFEST_REL,
                f"{owner['task_id']}의 depends_on에 동행 작성 관련 Task가 없음",
                "CMP-SCR003-MATE-WRITE-FORM 같은 동행 작성 Component Task를 depends_on에 추가한다",
            )
        )
    return r


def check_6_preview_checkpoints(mode: str) -> CheckResult:
    r = CheckResult(6, "release 모드: Preview Checkpoint 문서 존재")
    if mode != "release":
        r.skipped = True
        return r

    for screen in FIXED_SCREENS:
        sid = screen["screen_id"]
        path = PREVIEW_CHECKS_DIR / f"{sid}.md"
        if not path.exists():
            rel = path.relative_to(ROOT).as_posix()
            r.issues.append(
                Issue(
                    sid,
                    rel,
                    "Preview Checkpoint 문서 없음",
                    f"사람이 Vercel Preview에서 {sid}를 확인한 뒤 {rel}를 작성한다",
                )
            )
    return r


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Traveler 5개 Screen 계약 검사")
    parser.add_argument(
        "--mode",
        choices=["plan", "ci", "release"],
        default="ci",
        help="plan=계획만 검사, ci=구현 Page 실측 추가, release=Preview Checkpoint 확인 추가(기본: ci)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    mode = args.mode

    contract = load_contract()
    rows = load_manifest_rows()
    found_pages = scan_app_pages() if mode in ("ci", "release") else None

    results = [
        check_1_fixed_screens(contract, mode, found_pages),
        check_2_page_owner_count(rows),
        check_3_technical_routes(rows, mode, found_pages),
        check_4_no_destination_or_safety_page(rows, mode, found_pages),
        check_5_scr003_dual_requirements(rows),
        check_6_preview_checkpoints(mode),
    ]

    print(f"=== check_screen_contract.py — Traveler Screen 계약 검사 (mode={mode}) ===\n")

    total_issues = 0
    for res in results:
        if res.skipped:
            print(f"[SKIP] {res.number}. {res.name} — mode={mode}에서는 검사하지 않음")
            continue
        mark = "PASS" if res.passed else "FAIL"
        print(f"[{mark}] {res.number}. {res.name}")
        for issue in res.issues:
            total_issues += 1
            print(f"    - 화면: {issue.screen_id} | 파일: {issue.file}")
            print(f"      문제: {issue.message}")
            print(f"      수정 힌트: {issue.hint}")
    print()

    if total_issues == 0:
        print("SCREEN_CONTRACT_PASS")
        print(f"mode={mode}")
        return 0

    print("SCREEN_CONTRACT_FAIL")
    print(f"mode={mode} — 오류 {total_issues}건")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
