# PO-SCR-004 — 동행 조회 화면 조립 (`/mates`)

```task-meta
{
  "task_id": "PO-SCR-004",
  "type": "page_owner",
  "depends_on": [
    "CMP-SCR-004-intro-cta",
    "CMP-SCR-004-filter",
    "CMP-SCR-004-list",
    "CMP-SCR-004-detail",
    "CMP-SCR-004-apply",
    "CMP-SCR-004-report",
    "CMP-SCR-004-block",
    "CMP-SCR-004-guidance-safety",
    "CMP-COMMON-HEADER-FOOTER",
    "CMP-COMMON-EMPTY-STATE",
    "API-MATE-APPLICATIONS",
    "API-REPORTS",
    "API-BLOCKS"
  ],
  "requirements": [
    "REQ-FUNC-030",
    "REQ-FUNC-033",
    "REQ-FUNC-034",
    "REQ-FUNC-035",
    "REQ-FUNC-036",
    "REQ-FUNC-037",
    "REQ-FUNC-038",
    "REQ-FUNC-039",
    "REQ-FUNC-040",
    "REQ-FUNC-064",
    "REQ-FUNC-065",
    "REQ-FUNC-069"
  ],
  "section_order": [
    "intro-cta-banner",
    "search-filter",
    "mate-list",
    "mate-detail-panel",
    "how-to-apply-3step",
    "safety-notice-cta"
  ],
  "min_content_counts": {
    "mate-list": 8,
    "how-to-apply-3step": 3
  },
  "empty_state_required": true,
  "forbids_placeholder": true
}
```

## Context
이 Task는 SCR-004 화면이 필요로 하는 '동행 조회 화면 조립 (`/mates`)' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-030, 033~040, 064, 065, 069
- 정규화된 Requirement ID: REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-069

## Screen / Route / Page Entry
- Screen: SCR-004
- Route: `/mates`
- Page Entry: `src/app/mates/page.tsx`

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬
- `design-reference/UI_CONTRACT.md` SCR-004 영역 순서·주요 Component·금지 기능 표

## Depends On
- CMP-SCR-004-intro-cta
- CMP-SCR-004-filter
- CMP-SCR-004-list
- CMP-SCR-004-detail
- CMP-SCR-004-apply
- CMP-SCR-004-report
- CMP-SCR-004-block
- CMP-SCR-004-guidance-safety
- CMP-COMMON-HEADER-FOOTER
- CMP-COMMON-EMPTY-STATE
- API-MATE-APPLICATIONS
- API-REPORTS
- API-BLOCKS

## Expected Files
`src/app/mates/page.tsx`(신규 생성)

## Functional AC
- **Section 순서**: 1) Intro 2) Filter·결과 요약 3) 동행 목록(최대 8+더보기) 4) 상세 5) 신청 방법 3단계 6) 안전·신고·차단 안내와 CTA.
  - **데이터 출처**: Supabase `MATE_POST`/`MATE_APPLICATION`/`USER_BLOCK`(`DB-ACCESS`).
  - **반응형 콘텐츠 밀도**: Desktop 좌(목록)+우(상세) 동시 분할, Mobile은 목록 단일 컬럼 + 상세 하단 Drawer(좌우 분할 유지 금지).

## Visual AC
- Lorem ipsum·"준비 중"·빈 카드 금지.
  - 검색 결과 0건/전체 글 0건은 완성형 Empty State 블록(`CMP-COMMON-EMPTY-STATE`, 상황 설명+필터 초기화+"첫 동행 글 작성하기" CTA)로 대체한다.

## Security/Privacy AC
목록·상세 응답에 이메일·전화번호를 포함하지 않는다. 참가 신청은 로그인·성인확인 세션을 서버에서 재검증한다.

## Test Cases
- [Functional AC] **Section 순서**: 1) Intro 2) Filter·결과 요약 3) 동행 목록(최대 8+더보기) 4) 상세 5) 신청 방법 3단계 6) 안전·신고·차단 안내와 CTA. — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] **데이터 출처**: Supabase `MATE_POST`/`MATE_APPLICATION`/`USER_BLOCK`(`DB-ACCESS`). — Verify: TEST-E2E-MATE-AUTH
- [Functional AC] **반응형 콘텐츠 밀도**: Desktop 좌(목록)+우(상세) 동시 분할, Mobile은 목록 단일 컬럼 + 상세 하단 Drawer(좌우 분할 유지 금지). — Verify: TEST-E2E-MATE-AUTH
- [Visual AC] Lorem ipsum·"준비 중"·빈 카드 금지. — Verify: TEST-E2E-MATE-AUTH
- [Security/Privacy AC] 목록·상세 응답에 이메일·전화번호를 포함하지 않는다. 참가 신청은 로그인·성인확인 세션을 서버에서 재검증한다. — Verify: TEST-E2E-MATE-AUTH

## Verify
TEST-E2E-MATE-AUTH

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-MATE-AUTH`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
- `python scripts/audit_tasks.py` 감사를 통과한다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
