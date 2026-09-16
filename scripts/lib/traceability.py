"""Shared parser for docs/UIUX_TRACEABILITY.md.

Used by scripts/validate_inputs.py and scripts/audit_tasks.py.
Standard library only — no third-party dependencies.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# Matches a data row such as:
# | REQ-FUNC-001 — 국내·해외 목록 구분 | IMPLEMENT | SCR-001 | ... |
REQ_ROW_RE = re.compile(r"^\|\s*(REQ-(?:FUNC|NF)-\d{3})\s*—[^|]*\|\s*([^|]+?)\s*\|")

EXPECTED_FUNC_COUNT = 80
EXPECTED_NF_COUNT = 34
EXPECTED_TOTAL = EXPECTED_FUNC_COUNT + EXPECTED_NF_COUNT

DEFAULT_TRACEABILITY_PATH = ROOT / "docs" / "UIUX_TRACEABILITY.md"


def load_traceability(path: Path | None = None) -> dict[str, str]:
    """Parse docs/UIUX_TRACEABILITY.md and return {req_id: implementation_status}."""
    path = path or DEFAULT_TRACEABILITY_PATH
    text = path.read_text(encoding="utf-8")
    result: dict[str, str] = {}
    for line in text.splitlines():
        m = REQ_ROW_RE.match(line.strip())
        if not m:
            continue
        req_id, status = m.group(1), m.group(2).strip()
        result[req_id] = status
    return result


def is_implement(status: str) -> bool:
    return status.strip().upper().startswith("IMPLEMENT")


def is_excluded(status: str) -> bool:
    return status.strip().upper() == "EXCLUDED"


def validate_traceability(entries: dict[str, str]) -> list[str]:
    """Return a list of human-readable error strings (empty if the file is valid)."""
    errors: list[str] = []

    func_ids = {i for i in entries if i.startswith("REQ-FUNC-")}
    nf_ids = {i for i in entries if i.startswith("REQ-NF-")}

    expected_func = {f"REQ-FUNC-{n:03d}" for n in range(1, EXPECTED_FUNC_COUNT + 1)}
    expected_nf = {f"REQ-NF-{n:03d}" for n in range(1, EXPECTED_NF_COUNT + 1)}

    missing_func = expected_func - func_ids
    missing_nf = expected_nf - nf_ids
    extra_func = func_ids - expected_func
    extra_nf = nf_ids - expected_nf

    if missing_func:
        errors.append(f"REQ-FUNC 누락 ({len(missing_func)}개): {sorted(missing_func)}")
    if missing_nf:
        errors.append(f"REQ-NF 누락 ({len(missing_nf)}개): {sorted(missing_nf)}")
    if extra_func:
        errors.append(f"알 수 없는 REQ-FUNC ID: {sorted(extra_func)}")
    if extra_nf:
        errors.append(f"알 수 없는 REQ-NF ID: {sorted(extra_nf)}")

    total = len(entries)
    if total != EXPECTED_TOTAL:
        errors.append(
            f"Requirement 총수가 {EXPECTED_TOTAL}이 아니라 {total}입니다 "
            "(REQ-FUNC-001~080, REQ-NF-001~034 삭제/중복 여부를 확인하세요)."
        )

    for req_id, status in entries.items():
        if not (is_implement(status) or is_excluded(status)):
            errors.append(f"{req_id}: 알 수 없는 Implementation Status '{status}'")

    return errors
