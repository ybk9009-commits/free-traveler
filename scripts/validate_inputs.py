#!/usr/bin/env python3
"""validate_inputs.py — Traveler 프로젝트 입력 검증 스크립트.

11개 검사를 수행한다.

 1. package.json에 Next.js 의존성이 있다.
 2. src/app/page.tsx와 src/app/layout.tsx가 존재한다.
 3. PRD·SRS·Project Scope·UI 문서가 존재한다.
 4. D-001 DESIGN.md와 LOCKED Manifest가 존재한다.
 5. SCREEN_ROUTE_CONTRACT.json을 JSON으로 파싱할 수 있다.
 6. Screen 수가 정확히 5개다.
 7. SCR-001~005가 모두 존재한다.
 8. Route가 `/`, `/about`, `/travel-tools`, `/mates`, `/account`다.
 9. Page Entry가 실제 Next.js App Router 경로 형식이다.
 10. PROJECT_SCOPE에 REQ-FUNC 80개와 REQ-NF 34개가 모두 등장한다.
 11. AWS·EC2가 활성 기술로 정의되지 않았다.

검사 성공 시(11개 전부 통과) `VALIDATE_INPUTS_PASS`와 통과한 검사 수를 출력하고
exit 0으로 종료한다. 하나라도 실패하면 `VALIDATE_INPUTS_FAIL`과 함께 누락된
파일·Screen·Requirement ID 등 실패 상세를 출력하고 exit 1로 종료한다.

Usage:
    python scripts/validate_inputs.py

표준 라이브러리만 사용한다(외부 의존성 없음).
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

EXPECTED_ROUTES = {"/", "/about", "/travel-tools", "/mates", "/account"}
EXPECTED_SCREEN_IDS = {f"SCR-00{i}" for i in range(1, 6)}
EXPECTED_FUNC_COUNT = 80
EXPECTED_NF_COUNT = 34

# src/app/page.tsx, src/app/about/page.tsx, src/app/[id]/page.tsx 등을 허용한다.
PAGE_ENTRY_RE = re.compile(r"^src/app(/[A-Za-z0-9_\-\[\]().]+)*/page\.tsx$")

# 검사 3: PRD·SRS·Project Scope·UI 문서.
FOUNDATIONAL_DOCS = [
    ("PRD", "docs/01_PRD.md.md"),
    ("SRS(Baseline)", "docs/02_SRS_BASELINE.md.md"),
    ("SRS(UIUX Revised)", "docs/06_SRS_UIUX_REVISED.md"),
    ("Project Scope", "docs/PROJECT_SCOPE.md"),
    ("UI Coverage", "docs/03_UI_COVERAGE_ANALYSIS.md"),
    ("UIUX Plan", "docs/04_UIUX_PLAN.md"),
    ("UI Contract", "design-reference/UI_CONTRACT.md"),
]

# 검사 11: 이 키워드 중 하나라도 같은 줄에 있으면 "AWS/EC2를 쓰지 않는다"는
# 부정(미사용) 문맥으로 간주한다. 하나도 없으면 활성 기술 정의로 간주해 실패시킨다.
AWS_EC2_NEGATION_KEYWORDS = [
    "없다", "없음", "제외", "않는다", "아니다", "미사용", "구성하지 않",
]

AWS_EC2_RE = re.compile(r"\bAWS\b|\bEC2\b", re.IGNORECASE)


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


def check_1_next_dependency(root: Path) -> Result:
    r = Result(1, "package.json에 Next.js 의존성 존재")
    path = root / "package.json"
    if not path.exists():
        r.fail("파일 없음: package.json")
        return r
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        r.fail(f"package.json 파싱 실패: {e}")
        return r
    deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
    if "next" not in deps:
        r.fail("package.json의 dependencies/devDependencies에 'next'가 없습니다.")
    return r


def check_2_app_router_entries(root: Path) -> Result:
    r = Result(2, "src/app/page.tsx, src/app/layout.tsx 존재")
    for rel in ("src/app/page.tsx", "src/app/layout.tsx"):
        if not (root / rel).exists():
            r.fail(f"파일 없음: {rel}")
    return r


def check_3_foundational_docs(root: Path) -> Result:
    r = Result(3, "PRD·SRS·Project Scope·UI 문서 존재")
    for label, rel in FOUNDATIONAL_DOCS:
        p = root / rel
        if not p.exists():
            r.fail(f"파일 없음: {rel} ({label})")
        elif p.stat().st_size == 0:
            r.fail(f"파일이 비어 있음: {rel} ({label})")
    return r


def check_4_design_locked(root: Path) -> Result:
    r = Result(4, "D-001 DESIGN.md 및 LOCKED Manifest 존재")
    design = root / "design-reference" / "D-001" / "DESIGN.md"
    manifest = root / "design-reference" / "DESIGN_MANIFEST.md"
    if not design.exists():
        r.fail("파일 없음: design-reference/D-001/DESIGN.md")
    if not manifest.exists():
        r.fail("파일 없음: design-reference/DESIGN_MANIFEST.md")
    else:
        text = manifest.read_text(encoding="utf-8", errors="ignore")
        if "D-001" not in text:
            r.fail(
                "design-reference/DESIGN_MANIFEST.md에 Active Design Version "
                "'D-001' 표기가 없습니다."
            )
        if "LOCKED" not in text:
            r.fail("design-reference/DESIGN_MANIFEST.md에 'LOCKED' 상태 표기가 없습니다.")
    return r


def check_5_contract_json_parse(root: Path) -> tuple[Result, dict]:
    r = Result(5, "SCREEN_ROUTE_CONTRACT.json JSON 파싱 가능")
    path = root / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
    if not path.exists():
        r.fail("파일 없음: design-reference/SCREEN_ROUTE_CONTRACT.json")
        return r, {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        r.fail(f"JSON 파싱 실패: {e}")
        return r, {}
    return r, data


def check_6_screen_count(contract: dict) -> Result:
    r = Result(6, "Screen 수 정확히 5개")
    screens = contract.get("screens", [])
    if len(screens) != 5:
        r.fail(f"Screen 수가 5가 아닙니다: {len(screens)}개")
    return r


def check_7_screen_ids(contract: dict) -> Result:
    r = Result(7, "SCR-001~005 모두 존재")
    screen_ids = {s.get("screen_id") for s in contract.get("screens", [])}
    for missing in sorted(EXPECTED_SCREEN_IDS - screen_ids):
        r.fail(f"Screen 누락: {missing}")
    return r


def check_8_routes(contract: dict) -> Result:
    r = Result(8, "Route가 정확히 /, /about, /travel-tools, /mates, /account")
    routes = {s.get("route") for s in contract.get("screens", [])}
    for missing in sorted(EXPECTED_ROUTES - routes):
        r.fail(f"Route 누락: {missing}")
    for extra in sorted(routes - EXPECTED_ROUTES):
        r.fail(f"예상치 못한 Route: {extra}")
    return r


def check_9_page_entry_format(contract: dict) -> Result:
    r = Result(9, "Page Entry가 Next.js App Router 경로 형식")
    for s in contract.get("screens", []):
        entry = s.get("page_entry") or ""
        if not PAGE_ENTRY_RE.match(entry):
            r.fail(f"{s.get('screen_id')}: page_entry 형식이 잘못됨 -> '{entry}'")
    return r


def check_10_requirement_ids(root: Path) -> Result:
    r = Result(10, "PROJECT_SCOPE에 REQ-FUNC 80개·REQ-NF 34개 모두 등장")
    path = root / "docs" / "PROJECT_SCOPE.md"
    if not path.exists():
        r.fail("파일 없음: docs/PROJECT_SCOPE.md")
        return r

    text = path.read_text(encoding="utf-8")
    func_ids = set(re.findall(r"REQ-FUNC-(\d{3})", text))
    nf_ids = set(re.findall(r"REQ-NF-(\d{3})", text))

    expected_func = {f"{n:03d}" for n in range(1, EXPECTED_FUNC_COUNT + 1)}
    expected_nf = {f"{n:03d}" for n in range(1, EXPECTED_NF_COUNT + 1)}

    for m in sorted(expected_func - func_ids):
        r.fail(f"Requirement 누락: REQ-FUNC-{m}")
    for m in sorted(expected_nf - nf_ids):
        r.fail(f"Requirement 누락: REQ-NF-{m}")
    return r


def check_11_no_active_aws_ec2(root: Path) -> Result:
    r = Result(11, "AWS·EC2가 활성 기술로 정의되지 않음")

    # 11a. package.json에 AWS/EC2 관련 의존성이 실제로 설치돼 있으면 안 된다.
    pkg_path = root / "package.json"
    if pkg_path.exists():
        try:
            data = json.loads(pkg_path.read_text(encoding="utf-8"))
            deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
            for d in sorted(deps):
                if "aws" in d.lower() or "ec2" in d.lower():
                    r.fail(f"package.json에 AWS/EC2 관련 의존성이 설치되어 있습니다: {d}")
        except json.JSONDecodeError:
            pass  # 검사 1에서 이미 보고됨

    # 11b. 문서에서 AWS/EC2가 "쓰지 않는다"는 부정 문맥 없이 언급되면 실패시킨다.
    doc_paths = [
        root / "docs" / "PROJECT_SCOPE.md",
        root / "docs" / "02_SRS_BASELINE.md.md",
        root / "docs" / "06_SRS_UIUX_REVISED.md",
    ]
    for doc in doc_paths:
        if not doc.exists():
            continue
        lines = doc.read_text(encoding="utf-8", errors="ignore").splitlines()
        for lineno, line in enumerate(lines, start=1):
            if not AWS_EC2_RE.search(line):
                continue
            if not any(kw in line for kw in AWS_EC2_NEGATION_KEYWORDS):
                rel = doc.relative_to(root).as_posix()
                r.fail(
                    f"{rel}:{lineno} — AWS/EC2가 미사용 문맥 없이 언급됨: \"{line.strip()}\""
                )
    return r


def main() -> int:
    root = ROOT
    results: list[Result] = [
        check_1_next_dependency(root),
        check_2_app_router_entries(root),
        check_3_foundational_docs(root),
        check_4_design_locked(root),
    ]

    r5, contract = check_5_contract_json_parse(root)
    results.append(r5)

    if r5.passed:
        results.append(check_6_screen_count(contract))
        results.append(check_7_screen_ids(contract))
        results.append(check_8_routes(contract))
        results.append(check_9_page_entry_format(contract))
    else:
        for n, name in (
            (6, "Screen 수 정확히 5개"),
            (7, "SCR-001~005 모두 존재"),
            (8, "Route가 정확히 /, /about, /travel-tools, /mates, /account"),
            (9, "Page Entry가 Next.js App Router 경로 형식"),
        ):
            skipped = Result(n, name)
            skipped.fail("검사 5(JSON 파싱)가 실패해 건너뜀")
            results.append(skipped)

    results.append(check_10_requirement_ids(root))
    results.append(check_11_no_active_aws_ec2(root))
    results.sort(key=lambda x: x.number)

    print("=== validate_inputs.py — Traveler 입력 검증 (11개 검사) ===\n")
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
        print("VALIDATE_INPUTS_PASS")
        print(f"검사 수: {passed}/{total}")
        return 0

    print("VALIDATE_INPUTS_FAIL")
    print(f"검사 수: {passed}/{total} 통과\n")
    print("--- 실패 상세(파일·Screen·Requirement ID) ---")
    for res in results:
        if not res.passed:
            for msg in res.messages:
                print(f"[검사 {res.number}] {msg}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
