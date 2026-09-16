#!/usr/bin/env python3
"""build_waves.py — TASKS/00_TASK_LIST.md의 70개 Task를 실행 Wave로 묶는다.

입력:
    TASKS/TASK_MANIFEST.csv                (Task 요약 + depends_on, scripts/audit_task_manifest.py 산출물)
    TASKS/TASK-<TASK_ID>.md                 (Expected Files 등 상세 필드, 실제로는 TASKS/ 바로 아래 평평한 파일 —
                                              사용자 입력 표기 "TASKS/details/TASK-*.md"는 이 경로를 가리키는
                                              것으로 해석했다. scripts/audit_task_manifest.py가 실제로 이 경로를
                                              그렇게 파싱한다)
    design-reference/SCREEN_ROUTE_CONTRACT.json  (Screen/Page Owner 정본)

출력:
    TASKS/TASK_DAG.md            사람이 읽는 의존성 그래프 요약(순환 검사 결과 포함)
    TASKS/WAVE_PLAN.md           Wave 정의(Wave ID/제목/Task 목록/Checkpoint 여부)
    TASKS/WAVE_STATE.json        실행 상태 추적(최초 생성 시 전부 pending)
    TASKS/TASK_MANIFEST.csv      wave_id 열을 추가해 덮어씀(다른 열은 그대로 유지)

규칙(사용자 지정):
    1. 순환 의존성 검사(있으면 exit 1, Wave를 만들지 않음).
    2. 선행 Task가 뒤 Wave에 배치되면 실패(있으면 exit 1).
    3. 기본적으로 Wave당 4~7개 Task(정합성이 우선이며, 지킬 수 없으면 더 작은 Wave를 허용한다).
    4. Page Owner는 해당 화면의 마지막 통합 Task로 배치.
    5. 같은 파일을 크게 수정하는 Task는 서로 다른 Wave로 분리.
    6. 한 Wave 안에서도 Task ID 오름차순으로 한 개씩 실행(이 스크립트는 그 실행 순서가 항상 의존성과
       충돌하지 않도록 Wave 배치 자체를 계산한다).
    7. 이 스크립트에 자동 재시도/자동 수정 같은 반복 로직을 넣지 않는다(1회 계산, 실패 시 그대로 종료).
    8. 자동 Branch 생성·PR 생성·Merge를 하지 않는다(git 명령을 전혀 실행하지 않는다).

Wave ID는 W01, W02, ... 순으로 동적으로 부여한다(고정 개수 아님).
표준 라이브러리만 사용한다. 이 스크립트는 위 4개 출력 파일 외 어떤 파일도 수정하지 않는다.

Exit code: 0 = Wave 생성 성공, 1 = 순환 의존성 또는 배치 규칙 위반으로 실패(아무 출력 파일도 만들지 않음).
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
MANIFEST_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
CONTRACT_PATH = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
DAG_PATH = TASKS_DIR / "TASK_DAG.md"
WAVE_PLAN_PATH = TASKS_DIR / "WAVE_PLAN.md"
WAVE_STATE_PATH = TASKS_DIR / "WAVE_STATE.json"

MIN_WAVE = 4
MAX_WAVE = 7

GROUP_TITLES = {
    1: "Scaffold, 문서, Harness 확인",
    2: "Airbnb 스타일 공통 UI, 정적 데이터, Layout",
    3: "Supabase Auth, 6개 Table, 기본 RLS",
    4: "SCR-001 메인 Component와 Page Owner",
    5: "SCR-002 대표 소개 Component와 Page Owner",
    6: "SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner",
    7: "SCR-004 동행 목록·상세·신청 Component와 Page Owner",
    8: "SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner",
    9: "Unit·Playwright·접근성·CI",
    10: "Vercel Preview와 Release 확인",
}

FILE_TOKEN_RE = re.compile(r"`([^`]+\.[A-Za-z]{2,5})`")


# ---------------------------------------------------------------------------
# 1. 입력 로드
# ---------------------------------------------------------------------------


def load_manifest() -> list[dict]:
    if not MANIFEST_PATH.exists():
        print(f"[ERROR] {MANIFEST_PATH.relative_to(ROOT)}가 없습니다. "
              "먼저 `python scripts/audit_task_manifest.py`를 실행하세요.")
        raise SystemExit(1)
    with MANIFEST_PATH.open(encoding="utf-8", newline="") as fh:
        rows = list(csv.DictReader(fh))
    return rows


def load_contract() -> dict:
    if not CONTRACT_PATH.exists():
        print(f"[ERROR] {CONTRACT_PATH.relative_to(ROOT)}가 없습니다.")
        raise SystemExit(1)
    return json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))


def load_expected_files(task_id: str) -> list[str]:
    """TASKS/TASK-<ID>.md의 Expected Files 필드에서 경로형 토큰만 뽑는다."""
    path = TASKS_DIR / f"TASK-{task_id}.md"
    if not path.exists():
        return []
    text = path.read_text(encoding="utf-8", errors="ignore")
    m = re.search(r"- \*\*Expected Files:\*\*(.*?)(?:\n- \*\*|\Z)", text, re.DOTALL)
    if not m:
        return []
    return sorted(set(FILE_TOKEN_RE.findall(m.group(1))))


# ---------------------------------------------------------------------------
# 2. 그래프 구성 + 순환 검사
# ---------------------------------------------------------------------------


def parse_depends(raw: str) -> list[str]:
    raw = (raw or "").strip()
    if not raw:
        return []
    return [d.strip() for d in raw.split(";") if d.strip()]


def find_cycles(depends_on: dict[str, list[str]]) -> list[str]:
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in depends_on}
    cycles: list[str] = []

    def dfs(node: str, path: list[str]) -> None:
        color[node] = GRAY
        path.append(node)
        for nxt in depends_on.get(node, []):
            if nxt not in color:
                continue
            if color[nxt] == GRAY:
                idx = path.index(nxt)
                cycles.append(" -> ".join(path[idx:] + [nxt]))
            elif color[nxt] == WHITE:
                dfs(nxt, path)
        path.pop()
        color[node] = BLACK

    for tid in sorted(depends_on):
        if color[tid] == WHITE:
            dfs(tid, [])
    return cycles


# ---------------------------------------------------------------------------
# 3. Wave 그룹(1~10) 배정 — 카테고리/Screen 휴리스틱 + 의존성 기반 승격
# ---------------------------------------------------------------------------


def initial_group(row: dict) -> int:
    category = row["category"]
    screen = row["screen"]
    if category == "Data":
        return 2
    if category == "DB" or category == "Infra" or category == "API":
        return 3
    if category == "Component":
        if screen and screen.startswith("SCR-00"):
            return {"SCR-001": 4, "SCR-002": 5, "SCR-003": 6, "SCR-004": 7, "SCR-005": 8}[screen]
        return 2  # 공통 Component(screen == '—' 또는 공통)
    if category == "Page Owner":
        return {"SCR-001": 4, "SCR-002": 5, "SCR-003": 6, "SCR-004": 7, "SCR-005": 8}[screen]
    if category.startswith("Test"):
        return 9
    if category == "CI":
        if row["task_id"] == "DEPLOY-VERCEL-SUPABASE-CHECK":
            return 10
        return 9
    if category == "Release Check":
        return 10
    raise ValueError(f"unmapped category {category!r} for {row['task_id']}")


def promote_groups(ids: list[str], group: dict[str, int], depends_on: dict[str, list[str]]) -> list[str]:
    """규칙 2: 어떤 Task도 자신의 의존 Task보다 이른 그룹에 있을 수 없다.
    위반이 있으면 해당 Task를 의존 Task와 같은 그룹으로 승격한다(고정 그룹 순서가
    실제 의존성과 충돌하는 경우를 스스로 바로잡는다). 승격 이력을 문자열 목록으로 반환한다.
    """
    notes: list[str] = []
    changed = True
    guard = 0
    while changed and guard < 50:
        changed = False
        guard += 1
        for tid in ids:
            for dep in depends_on.get(tid, []):
                if dep not in group:
                    continue
                if group[dep] > group[tid]:
                    notes.append(
                        f"{tid}: 그룹 {group[tid]} -> {group[dep]}로 승격(의존 Task {dep}가 더 늦은 그룹에 있었음)"
                    )
                    group[tid] = group[dep]
                    changed = True
    return notes


# ---------------------------------------------------------------------------
# 4. 그룹 내부 depth 계산(안전/불안전 edge + 파일 충돌 반영) 후 Wave로 청크
# ---------------------------------------------------------------------------


def compute_depths(
    ids: list[str],
    depends_on: dict[str, list[str]],
    expected_files: dict[str, list[str]],
) -> dict[str, int]:
    """같은 그룹 내부에서만 depth를 계산한다.
    - A가 B에 의존하고 id(B) < id(A)면 "안전"(같은 Wave에서 ID 오름차순 실행으로 충분) -> depth(A) >= depth(B).
    - A가 B에 의존하고 id(B) > id(A)면 "불안전"(같은 Wave면 실행 순서가 뒤집힘) -> depth(A) > depth(B).
    - 같은 그룹에서 Expected Files를 공유하는 두 Task는 절대 같은 depth에 두지 않는다(규칙 5).
    """
    depth = {tid: 0 for tid in ids}
    idset = set(ids)

    conflict_pairs: list[tuple[str, str]] = []
    for i, a in enumerate(ids):
        for b in ids[i + 1:]:
            if set(expected_files.get(a, [])) & set(expected_files.get(b, [])):
                conflict_pairs.append((a, b))

    changed = True
    guard = 0
    while changed and guard < 200:
        changed = False
        guard += 1
        for tid in ids:
            for dep in depends_on.get(tid, []):
                if dep not in idset:
                    continue  # 그룹 밖 의존성은 이미 더 이른 그룹으로 해결됨
                required = depth[dep] if dep < tid else depth[dep] + 1
                if depth[tid] < required:
                    depth[tid] = required
                    changed = True
        for a, b in conflict_pairs:
            if depth[a] == depth[b]:
                larger = max(a, b)
                depth[larger] += 1
                changed = True
    return depth


def chunk_ids(sorted_ids: list[str]) -> list[list[str]]:
    """ID 오름차순 목록을 4~7 크기로 나눈다(가능하면 균등하게)."""
    n = len(sorted_ids)
    if n <= MAX_WAVE:
        return [sorted_ids] if sorted_ids else []
    num_chunks = -(-n // MAX_WAVE)  # ceil
    # 가능하면 각 조각이 MIN_WAVE 이상이 되도록 chunk 수를 조정
    while num_chunks > 1 and n / num_chunks < MIN_WAVE:
        num_chunks -= 1
    base = n // num_chunks
    extra = n % num_chunks
    chunks = []
    idx = 0
    for c in range(num_chunks):
        size = base + (1 if c < extra else 0)
        chunks.append(sorted_ids[idx: idx + size])
        idx += size
    return chunks


def crosses_unsafe_edge(
    a_ids: list[str], b_ids: list[str], depends_on: dict[str, list[str]]
) -> bool:
    """a_ids/b_ids 두 집합을 같은 Wave로 합쳤을 때 안전하지 않은 의존 관계가 있는지 본다.
    안전하지 않음 = 의존 대상의 ID가 의존하는 Task의 ID보다 커서, 같은 Wave의
    ID 오름차순 실행 순서상 의존 대상이 나중에 실행되게 되는 경우.
    """
    a_set, b_set = set(a_ids), set(b_ids)
    for tid in a_ids:
        for dep in depends_on.get(tid, []):
            if dep in b_set and dep > tid:
                return True
    for tid in b_ids:
        for dep in depends_on.get(tid, []):
            if dep in a_set and dep > tid:
                return True
    return False


def build_waves_for_group(
    group_num: int,
    ids: list[str],
    depends_on: dict[str, list[str]],
    expected_files: dict[str, list[str]],
) -> list[list[str]]:
    if not ids:
        return []
    depth = compute_depths(ids, depends_on, expected_files)
    by_depth: dict[int, list[str]] = {}
    for tid in ids:
        by_depth.setdefault(depth[tid], []).append(tid)

    # 1차: depth 오름차순으로 버킷을 훑으며, 크기(<=7)와 안전성(unsafe edge 없음)이
    # 모두 보장될 때만 이전 버킷과 합쳐 규칙 3(기본 4~7개)을 최대한 만족시킨다.
    # 규칙 1/2/4/5(정합성)를 깨는 합침은 절대 하지 않는다 — 합칠 수 없으면 작은 Wave로 둔다.
    merged: list[list[str]] = []
    current: list[str] = []
    for d in sorted(by_depth):
        bucket = sorted(by_depth[d])
        if current and len(current) + len(bucket) <= MAX_WAVE and not crosses_unsafe_edge(
            current, bucket, depends_on
        ):
            current = current + bucket
        else:
            if current:
                merged.append(current)
            current = bucket
    if current:
        merged.append(current)

    waves: list[list[str]] = []
    for chunk in merged:
        waves.extend(chunk_ids(sorted(chunk)))
    return waves


# ---------------------------------------------------------------------------
# 5. 검증
# ---------------------------------------------------------------------------


def validate_wave_order(
    wave_of: dict[str, int],
    depends_on: dict[str, list[str]],
) -> list[str]:
    """규칙 2 + 같은 Wave 안 ID 순서 안전성을 최종 검증한다."""
    problems = []
    for tid, deps in depends_on.items():
        if tid not in wave_of:
            continue
        for dep in deps:
            if dep not in wave_of:
                continue
            if wave_of[dep] > wave_of[tid]:
                problems.append(f"{tid}(Wave {wave_of[tid]})가 더 늦은 Wave의 {dep}(Wave {wave_of[dep]})에 의존")
            elif wave_of[dep] == wave_of[tid] and dep > tid:
                problems.append(
                    f"{tid}와 {dep}가 같은 Wave {wave_of[tid]}에 있는데 ID 오름차순 실행 시 "
                    f"{tid}가 의존 대상 {dep}보다 먼저 실행됨"
                )
    return problems


def validate_page_owner_last(
    wave_of: dict[str, int],
    rows_by_id: dict[str, dict],
) -> list[str]:
    """규칙 4: Page Owner는 해당 화면의 마지막 통합 Task여야 한다.
    - 같은 화면의 다른 Task가 Page Owner보다 늦은 Wave에 있으면 안 된다.
    - Page Owner와 같은 Wave를 쓰는 Task가 있다면, ID 오름차순 실행 순서상 Page Owner가
      그 Wave에서 가장 마지막에 실행돼야 한다(= 그 Wave 안에서 ID가 가장 커야 한다).
    """
    problems = []
    screens: dict[str, list[str]] = {}
    for tid, row in rows_by_id.items():
        # 화면 "조립" 대상만 본다(Component/Page Owner). API/Test 등이 참고용으로
        # 같은 Screen 필드를 composite 문자열(예: "SCR-003/SCR-005")로 들고 있는 것은
        # 이 규칙(같은 화면 조립 그룹 안에서 Page Owner가 마지막)과 무관하다.
        if row["category"] in ("Component", "Page Owner") and row["screen"] in (
            "SCR-001", "SCR-002", "SCR-003", "SCR-004", "SCR-005"
        ):
            screens.setdefault(row["screen"], []).append(tid)
    for screen, tids in screens.items():
        owner = [t for t in tids if rows_by_id[t]["category"] == "Page Owner"]
        if len(owner) != 1:
            problems.append(f"{screen}: Page Owner Task가 정확히 1개가 아님({owner})")
            continue
        owner_id = owner[0]
        owner_wave = wave_of[owner_id]
        others = [t for t in tids if t != owner_id]
        later = [t for t in others if wave_of.get(t, -1) > owner_wave]
        if later:
            problems.append(f"{screen}: Page Owner({owner_id}) Wave 뒤에 같은 화면 Task가 남아있음: {later}")
        same_wave = [t for t in others if wave_of.get(t) == owner_wave]
        if same_wave and max(same_wave) > owner_id:
            problems.append(
                f"{screen}: Page Owner({owner_id})가 같은 Wave의 {max(same_wave)}보다 ID가 작아 "
                "먼저 실행됨(마지막 통합 Task 규칙 위반)"
            )
    return problems


# ---------------------------------------------------------------------------
# 6. 출력 작성
# ---------------------------------------------------------------------------


def write_dag(rows_by_id: dict[str, dict], depends_on: dict[str, list[str]], cycles: list[str]) -> None:
    dependents: dict[str, list[str]] = {tid: [] for tid in rows_by_id}
    for tid, deps in depends_on.items():
        for dep in deps:
            dependents.setdefault(dep, []).append(tid)

    lines = ["# TASK_DAG", "", f"- Generated: {datetime.now(timezone.utc).isoformat()}",
             f"- Task 수: {len(rows_by_id)}",
             f"- 순환 의존성 수: {len(cycles)}"]
    if cycles:
        lines.append("- 순환 목록:")
        for c in cycles:
            lines.append(f"  - {c}")
    lines += ["", "## Task별 의존 관계", "",
              "| Task ID | Category | Depends On | Dependents |", "|---|---|---|---|"]
    for tid in sorted(rows_by_id):
        deps = ", ".join(depends_on.get(tid, [])) or "—"
        deps_of = ", ".join(sorted(dependents.get(tid, []))) or "—"
        lines.append(f"| {tid} | {rows_by_id[tid]['category']} | {deps} | {deps_of} |")
    DAG_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_wave_plan(waves: list[dict]) -> None:
    lines = ["# WAVE_PLAN", "",
             f"- Generated: {datetime.now(timezone.utc).isoformat()}",
             "- Source: `scripts/build_waves.py` (입력: `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK-*.md`, "
             "`design-reference/SCREEN_ROUTE_CONTRACT.json`)",
             "- 이 문서의 Wave ID가 이후 `/prepare-task`, `/run-wave`, `/release-check` 등의 정본이다.",
             "", "| Wave ID | Title | Task 수 | Checkpoint 필요 | Task IDs(실행 순서) |",
             "|---|---|---:|:---:|---|"]
    for w in waves:
        lines.append(
            f"| {w['wave_id']} | {w['title']} | {len(w['task_ids'])} | "
            f"{'Y' if w['checkpoint_required'] else '—'} | {', '.join(w['task_ids'])} |"
        )
    WAVE_PLAN_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_wave_state(waves: list[dict]) -> None:
    state = {
        "schema_version": "traveler-wave-state-v1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "waves": [
            {
                "wave_id": w["wave_id"],
                "title": w["title"],
                "task_ids": w["task_ids"],
                "status": "pending",
                "checkpoint_required": w["checkpoint_required"],
                "checkpoint_result": None,
            }
            for w in waves
        ],
    }
    WAVE_STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_manifest_with_wave(rows: list[dict], task_to_wave: dict[str, str]) -> None:
    fieldnames = list(rows[0].keys())
    if "wave_id" not in fieldnames:
        fieldnames.append("wave_id")
    with MANIFEST_PATH.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            r = dict(r)
            r["wave_id"] = task_to_wave.get(r["task_id"], "")
            writer.writerow(r)


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------


def main() -> int:
    rows = load_manifest()
    contract = load_contract()
    rows_by_id = {r["task_id"]: r for r in rows}
    ids = list(rows_by_id)

    depends_on = {tid: parse_depends(rows_by_id[tid]["depends_on"]) for tid in ids}

    print("=== build_waves.py — Wave 생성 ===\n")

    cycles = find_cycles(depends_on)
    print(f"순환 의존성 검사: {len(cycles)}개 발견")
    for c in cycles:
        print(f"  - {c}")
    if cycles:
        print("\n[ERROR] 순환 의존성이 있어 Wave를 생성하지 않습니다(규칙 1). 출력 파일을 만들지 않았습니다.")
        return 1

    group: dict[str, int] = {}
    for tid in ids:
        try:
            group[tid] = initial_group(rows_by_id[tid])
        except ValueError as e:
            print(f"[ERROR] {e}")
            return 1

    promotion_notes = promote_groups(ids, group, depends_on)
    if promotion_notes:
        print("그룹 승격(의존성이 고정 그룹 순서와 충돌해 자동 보정):")
        for n in promotion_notes:
            print(f"  - {n}")

    expected_files = {tid: load_expected_files(tid) for tid in ids}

    waves: list[dict] = []
    wave_num = 0
    task_to_wave: dict[str, str] = {}
    wave_of: dict[str, int] = {}

    for g in range(1, 11):
        group_ids = sorted(tid for tid in ids if group[tid] == g)
        if not group_ids:
            continue
        sub_waves = build_waves_for_group(g, group_ids, depends_on, expected_files)
        total_sub = len(sub_waves)
        for idx, task_ids in enumerate(sub_waves, start=1):
            wave_num += 1
            wave_id = f"W{wave_num:02d}"
            title = GROUP_TITLES[g] if total_sub == 1 else f"{GROUP_TITLES[g]} ({idx}/{total_sub})"
            owner_ids = [t for t in task_ids if rows_by_id[t]["category"] == "Page Owner"]
            checkpoint = bool(owner_ids) or g == 10
            waves.append({
                "wave_id": wave_id,
                "title": title,
                "task_ids": task_ids,
                "checkpoint_required": checkpoint,
            })
            for t in task_ids:
                task_to_wave[t] = wave_id
                wave_of[t] = wave_num

    if not any(group[tid] == 1 for tid in ids):
        print("\n참고: 그룹 1(Scaffold/문서/Harness 확인)에 해당하는 Task가 TASK_LIST에 없어 "
              "Wave를 만들지 않았습니다(harness 확인은 `scripts/validate_harness.py`가 별도로 담당).")

    order_problems = validate_wave_order(wave_of, depends_on)
    owner_problems = validate_page_owner_last(wave_of, rows_by_id)
    problems = order_problems + owner_problems
    if problems:
        print("\n[ERROR] Wave 배치 규칙 위반이 발견되어 출력 파일을 만들지 않았습니다(규칙 2/4):")
        for p in problems:
            print(f"  - {p}")
        return 1

    write_dag(rows_by_id, depends_on, cycles)
    write_wave_plan(waves)
    write_wave_state(waves)
    write_manifest_with_wave(rows, task_to_wave)

    print(f"\n생성 완료:")
    print(f"  {DAG_PATH.relative_to(ROOT)}")
    print(f"  {WAVE_PLAN_PATH.relative_to(ROOT)}")
    print(f"  {WAVE_STATE_PATH.relative_to(ROOT)}")
    print(f"  {MANIFEST_PATH.relative_to(ROOT)} (wave_id 열 추가)")

    print(f"\n순환 의존성 수: {len(cycles)}")
    print(f"Wave 수: {len(waves)}")
    print("\nWave별 Task 수:")
    for w in waves:
        n = len(w["task_ids"])
        flag = " (4~7 범위 밖)" if not (MIN_WAVE <= n <= MAX_WAVE) else ""
        cp = " [Checkpoint]" if w["checkpoint_required"] else ""
        print(f"  {w['wave_id']}: {n}개{flag}{cp} — {w['title']}")

    print("\nPage Owner 위치:")
    for screen in ("SCR-001", "SCR-002", "SCR-003", "SCR-004", "SCR-005"):
        owner = next(
            (tid for tid, r in rows_by_id.items() if r["category"] == "Page Owner" and r["screen"] == screen),
            None,
        )
        if owner:
            print(f"  {screen}: {owner} -> {task_to_wave[owner]}(해당 Wave 마지막 실행 Task)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
