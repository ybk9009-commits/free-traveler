#!/usr/bin/env python3
"""validate_harness.py — Traveler Harness(운영 규칙) 검증 스크립트.

이 저장소의 Agent Harness(CLAUDE.md·Skill·Command·Marker)가 실제로 갖춰져
있는지 13개 검사를 수행한다. `scripts/validate_inputs.py`(SSOT 입력 검증)와는
별개로, "Agent가 따라야 할 규칙 자체가 존재하는가"만 검사한다.

 1. CLAUDE.md 존재
 2. Claude Code Skill 파일 존재 (.claude/skills/traveler-project-pipeline/SKILL.md)
 3. 7개 Command 존재 (.claude/commands/*.md)
 4. traveler-screen-route-v1 Marker 존재
 5. D-001 DESIGN 경로 일치
 6. Screen Contract 경로 일치
 7. Page Owner 5개 규칙 존재
 8. DB Table 6개 기본 범위 존재
 9. 외부 입력 비저장 규칙 존재
 10. Playwright Chromium Smoke 규칙 존재
 11. AUTO_MERGE=false
 12. AWS_ENABLED=false
 13. EXCLUDED 보호 규칙 존재

성공 시(13개 전부 통과) `VALIDATE_HARNESS_PASS`를 출력하고 exit 0으로 종료한다.
하나라도 실패하면 실패한 파일·누락 규칙을 출력하고 exit 1로 종료한다.

Usage:
    python scripts/validate_harness.py

표준 라이브러리만 사용한다(외부 의존성 없음). 이 스크립트는 어떤 파일도 수정하지 않는다.
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

REQUIRED_COMMANDS = [
    "gen-tasklist.md",
    "gen-task-details.md",
    "audit-tasks.md",
    "prepare-task.md",
    "implement-task.md",
    "run-wave.md",
    "release-check.md",
]

HARNESS_SCHEMA_VALUE = "traveler-screen-route-v1"


class Result:
    def __init__(self, number: int, name: str) -> None:
        self.number = number
        self.name = name
        self.messages: list[str] = []

    def fail(self, msg: str) -> None:
        self.messages.append(msg)

    @property
    def passed(self) -> bool:
        return not self.messages


def read_text_or_none(path: Path) -> str | None:
    if not path.exists():
        return None
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return None


def check_1_claude_md(root: Path) -> Result:
    r = Result(1, "CLAUDE.md 존재")
    if not (root / "CLAUDE.md").exists():
        r.fail("파일 없음: CLAUDE.md")
    return r


def check_2_skill_file(root: Path) -> Result:
    r = Result(2, "Claude Code Skill 파일 존재")
    path = root / ".claude" / "skills" / "traveler-project-pipeline" / "SKILL.md"
    if not path.exists():
        r.fail("파일 없음: .claude/skills/traveler-project-pipeline/SKILL.md")
    elif path.stat().st_size == 0:
        r.fail("파일이 비어 있음: .claude/skills/traveler-project-pipeline/SKILL.md")
    return r


def check_3_commands(root: Path) -> Result:
    r = Result(3, "7개 Command 존재")
    cmd_dir = root / ".claude" / "commands"
    for name in REQUIRED_COMMANDS:
        p = cmd_dir / name
        if not p.exists():
            r.fail(f"파일 없음: .claude/commands/{name}")
        elif p.stat().st_size == 0:
            r.fail(f"파일이 비어 있음: .claude/commands/{name}")
    return r


def check_4_harness_marker(root: Path, claude_md: str | None, contract: dict | None) -> Result:
    r = Result(4, f"{HARNESS_SCHEMA_VALUE} Marker 존재")
    if claude_md is None:
        r.fail("CLAUDE.md를 읽을 수 없어 HARNESS_SCHEMA Marker를 확인할 수 없습니다.")
    elif f"HARNESS_SCHEMA={HARNESS_SCHEMA_VALUE}" not in claude_md:
        r.fail(f"CLAUDE.md에 'HARNESS_SCHEMA={HARNESS_SCHEMA_VALUE}' 줄이 없습니다.")

    if contract is None:
        r.fail("design-reference/SCREEN_ROUTE_CONTRACT.json을 읽거나 파싱할 수 없습니다.")
    elif contract.get("schema_version") != HARNESS_SCHEMA_VALUE:
        r.fail(
            "design-reference/SCREEN_ROUTE_CONTRACT.json의 schema_version이 "
            f"'{HARNESS_SCHEMA_VALUE}'가 아닙니다: {contract.get('schema_version')!r}"
        )
    return r


def check_5_design_path(root: Path, claude_md: str | None) -> Result:
    r = Result(5, "D-001 DESIGN 경로 일치")
    expected = "design-reference/D-001/DESIGN.md"
    if claude_md is None:
        r.fail("CLAUDE.md를 읽을 수 없어 DESIGN_PATH Marker를 확인할 수 없습니다.")
    elif f"DESIGN_PATH={expected}" not in claude_md:
        r.fail(f"CLAUDE.md에 'DESIGN_PATH={expected}' 줄이 없습니다.")

    design_path = root / expected
    if not design_path.exists():
        r.fail(f"파일 없음: {expected}")
    else:
        text = read_text_or_none(design_path) or ""
        if "D-001" not in text:
            r.fail(f"{expected}에 'D-001' 버전 표기가 없습니다.")
        if "LOCKED" not in text:
            r.fail(f"{expected}에 'LOCKED' 상태 표기가 없습니다.")
    return r


def check_6_screen_contract_path(root: Path, claude_md: str | None) -> Result:
    r = Result(6, "Screen Contract 경로 일치")
    expected = "design-reference/SCREEN_ROUTE_CONTRACT.json"
    if claude_md is None:
        r.fail("CLAUDE.md를 읽을 수 없어 SCREEN_CONTRACT Marker를 확인할 수 없습니다.")
    elif f"SCREEN_CONTRACT={expected}" not in claude_md:
        r.fail(f"CLAUDE.md에 'SCREEN_CONTRACT={expected}' 줄이 없습니다.")

    contract_path = root / expected
    if not contract_path.exists():
        r.fail(f"파일 없음: {expected}")
    else:
        try:
            json.loads(contract_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            r.fail(f"{expected} JSON 파싱 실패: {e}")
    return r


def check_7_page_owner_rule(root: Path, claude_md: str | None, contract: dict | None) -> Result:
    r = Result(7, "Page Owner 5개 규칙 존재")
    if claude_md is None:
        r.fail("CLAUDE.md를 읽을 수 없어 Page Owner 규칙을 확인할 수 없습니다.")
    else:
        has_page_owner = "Page Owner" in claude_md
        has_assembly = bool(re.search(r"조립", claude_md))
        if not (has_page_owner and has_assembly):
            r.fail(
                "CLAUDE.md에 'Page Owner'가 Page Entry를 '조립'한다는 규칙 문구가 없습니다."
            )

    if contract is None:
        r.fail("design-reference/SCREEN_ROUTE_CONTRACT.json을 읽거나 파싱할 수 없습니다.")
    else:
        screens = contract.get("screens", [])
        if len(screens) != 5:
            r.fail(f"Screen 수가 5가 아닙니다: {len(screens)}개")
        missing_flag = [
            s.get("screen_id") for s in screens if s.get("page_owner_task_required") is not True
        ]
        if missing_flag:
            r.fail(
                "page_owner_task_required=true가 아닌 Screen: "
                f"{sorted(x for x in missing_flag if x)}"
            )
    return r


def check_8_db_table_scope(root: Path) -> Result:
    r = Result(8, "DB Table 6개 기본 범위 존재")
    arch_path = root / "docs" / "ARCHITECTURE.md"
    text = read_text_or_none(arch_path)
    if text is None:
        r.fail("파일 없음(또는 읽기 실패): docs/ARCHITECTURE.md")
        return r

    if "6개" not in text:
        r.fail("docs/ARCHITECTURE.md에 'DB 6개 Table' 범위 서술('6개')이 없습니다.")

    required_tables = [
        "auth.users",
        "USER_PROFILE",
        "MATE_POST",
        "MATE_APPLICATION",
        "USER_BLOCK",
        "REPORT",
    ]
    missing = [t for t in required_tables if t not in text]
    if missing:
        r.fail(f"docs/ARCHITECTURE.md에 다음 테이블 이름이 없습니다: {missing}")

    if "AUDIT_LOG" in text and "만들지 않는다" not in text and "제외" not in text:
        r.fail(
            "docs/ARCHITECTURE.md에 AUDIT_LOG가 언급되지만 제외/미생성 문맥이 확인되지 않습니다."
        )
    return r


def check_9_no_external_input_persistence(root: Path, claude_md: str | None) -> Result:
    r = Result(9, "외부 입력(항공·숙소) 비저장 규칙 존재")
    if claude_md is None:
        r.fail("CLAUDE.md를 읽을 수 없어 비저장 규칙을 확인할 수 없습니다.")
        return r

    has_domain = ("항공" in claude_md) and ("숙소" in claude_md)
    has_no_send = bool(re.search(r"보내지\s*않는다|전달하지\s*않는다", claude_md))
    has_url_query = ("URL" in claude_md) and ("query" in claude_md.lower())
    if not (has_domain and has_no_send and has_url_query):
        r.fail(
            "CLAUDE.md에 '항공·숙소 입력값을 서버/DB/URL query/로그로 보내지 않는다' 규칙이 "
            "명확히 확인되지 않습니다."
        )
    return r


def check_10_playwright_chromium_smoke(root: Path, claude_md: str | None) -> Result:
    r = Result(10, "Playwright Chromium Smoke 규칙 존재")
    if claude_md is None:
        r.fail("CLAUDE.md를 읽을 수 없어 Playwright 규칙을 확인할 수 없습니다.")
        return r

    if "PLAYWRIGHT_ENABLED=true" not in claude_md:
        r.fail("CLAUDE.md에 'PLAYWRIGHT_ENABLED=true' 줄이 없습니다.")
    if "PLAYWRIGHT_SCOPE=chromium-smoke" not in claude_md:
        r.fail("CLAUDE.md에 'PLAYWRIGHT_SCOPE=chromium-smoke' 줄이 없습니다.")
    if not re.search(r"chromium", claude_md, re.IGNORECASE):
        r.fail("CLAUDE.md 본문에 'chromium' Smoke 범위를 명시하는 규칙 문구가 없습니다.")
    return r


def check_11_auto_merge_false(root: Path, claude_md: str | None) -> Result:
    r = Result(11, "AUTO_MERGE=false")
    if claude_md is None:
        r.fail("CLAUDE.md를 읽을 수 없어 AUTO_MERGE Marker를 확인할 수 없습니다.")
    elif "AUTO_MERGE=false" not in claude_md:
        r.fail("CLAUDE.md에 'AUTO_MERGE=false' 줄이 없습니다.")
    return r


def check_12_aws_enabled_false(root: Path, claude_md: str | None) -> Result:
    r = Result(12, "AWS_ENABLED=false")
    if claude_md is None:
        r.fail("CLAUDE.md를 읽을 수 없어 AWS_ENABLED Marker를 확인할 수 없습니다.")
    elif "AWS_ENABLED=false" not in claude_md:
        r.fail("CLAUDE.md에 'AWS_ENABLED=false' 줄이 없습니다.")
    return r


def check_13_excluded_protection(root: Path, claude_md: str | None) -> Result:
    r = Result(13, "EXCLUDED 보호 규칙 존재")
    if claude_md is None:
        r.fail("CLAUDE.md를 읽을 수 없어 EXCLUDED 보호 규칙을 확인할 수 없습니다.")
    else:
        has_excluded = "EXCLUDED" in claude_md
        has_guard = bool(re.search(r"임의로\s*구현하지\s*않는다", claude_md))
        if not (has_excluded and has_guard):
            r.fail(
                "CLAUDE.md에 'EXCLUDED 기능을 임의로 구현하지 않는다'는 보호 규칙 문구가 없습니다."
            )

    audit_script = root / "scripts" / "audit_tasks.py"
    if not audit_script.exists():
        r.fail(
            "EXCLUDED 보호를 기계적으로 강제하는 scripts/audit_tasks.py가 없습니다."
        )
    return r


def load_json_or_none(path: Path) -> dict | None:
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def main() -> int:
    root = ROOT
    claude_md = read_text_or_none(root / "CLAUDE.md")
    contract = load_json_or_none(root / "design-reference" / "SCREEN_ROUTE_CONTRACT.json")

    results: list[Result] = [
        check_1_claude_md(root),
        check_2_skill_file(root),
        check_3_commands(root),
        check_4_harness_marker(root, claude_md, contract),
        check_5_design_path(root, claude_md),
        check_6_screen_contract_path(root, claude_md),
        check_7_page_owner_rule(root, claude_md, contract),
        check_8_db_table_scope(root),
        check_9_no_external_input_persistence(root, claude_md),
        check_10_playwright_chromium_smoke(root, claude_md),
        check_11_auto_merge_false(root, claude_md),
        check_12_aws_enabled_false(root, claude_md),
        check_13_excluded_protection(root, claude_md),
    ]

    print("=== validate_harness.py — Traveler Harness 검증 (13개 검사) ===\n")
    for res in results:
        mark = "PASS" if res.passed else "FAIL"
        print(f"[{mark}] {res.number}. {res.name}")
        if not res.passed:
            for msg in res.messages:
                print(f"    - {msg}")
    print()

    total = len(results)
    passed = sum(1 for r in results if r.passed)

    if passed == total:
        print("VALIDATE_HARNESS_PASS")
        print(f"검사 수: {passed}/{total}")
        return 0

    print("VALIDATE_HARNESS_FAIL")
    print(f"검사 수: {passed}/{total} 통과\n")
    print("--- 실패 상세(파일·누락 규칙) ---")
    for res in results:
        if not res.passed:
            for msg in res.messages:
                print(f"[검사 {res.number}] {msg}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
