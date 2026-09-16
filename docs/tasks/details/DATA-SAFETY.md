# DATA-SAFETY — 국가 안전정보 정적 데이터

```task-meta
{
  "task_id": "DATA-SAFETY",
  "type": "data",
  "depends_on": [
    "DATA-DESTINATIONS"
  ],
  "requirements": [
    "REQ-FUNC-046",
    "REQ-FUNC-047",
    "REQ-FUNC-048",
    "REQ-FUNC-052",
    "REQ-FUNC-053",
    "REQ-NF-027"
  ]
}
```

## Context
이 Task는 — (SCR-001에서 소비) 화면이 필요로 하는 '국가 안전정보 정적 데이터' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙(정적 데이터 정책), §5 데이터 모델 매핑

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-046, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-052, REQ-FUNC-053, REQ-NF-027
- 정규화된 Requirement ID: REQ-FUNC-046, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-052, REQ-FUNC-053, REQ-NF-027

## Screen / Route / Page Entry
- Screen: — (SCR-001에서 소비)
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- DATA-DESTINATIONS

## Expected Files
`src/data/safety.ts`

## Functional AC
- `DATA-DESTINATIONS`에 등장하는 모든 해외 국가에 대해 안전정보 항목이 1:1로 존재한다(REQ-FUNC-046, `country_code` 매칭).
  - 8개 필수 카테고리(치안, 흔한 사기, 현지 법규, 교통, 재난·기후, 보건, 문화·복장, 긴급연락처)를 모두 포함한다(REQ-FUNC-047).
  - `scopeType`(COUNTRY/REGION), `scopeText`, `advisoryLevel`, `sourceName`, `sourceUrl`, `verifiedAt`, `verifiedBy`를 필드로 둔다(REQ-FUNC-048, 052).
  - 긴급전화·영사콜센터 연결 정보를 포함한다(REQ-FUNC-053).

## Visual AC
해당 없음(비-UI Task).

## Security/Privacy AC
공식 출처(외교부 해외안전여행) URL만 참조한다.

## Test Cases
- [Functional AC] `DATA-DESTINATIONS`에 등장하는 모든 해외 국가에 대해 안전정보 항목이 1:1로 존재한다(REQ-FUNC-046, `country_code` 매칭). — Verify: TEST-DATA-VALIDATION, 코드 리뷰
- [Functional AC] 8개 필수 카테고리(치안, 흔한 사기, 현지 법규, 교통, 재난·기후, 보건, 문화·복장, 긴급연락처)를 모두 포함한다(REQ-FUNC-047). — Verify: TEST-DATA-VALIDATION, 코드 리뷰
- [Functional AC] `scopeType`(COUNTRY/REGION), `scopeText`, `advisoryLevel`, `sourceName`, `sourceUrl`, `verifiedAt`, `verifiedBy`를 필드로 둔다(REQ-FUNC-048, 052). — Verify: TEST-DATA-VALIDATION, 코드 리뷰
- [Functional AC] 긴급전화·영사콜센터 연결 정보를 포함한다(REQ-FUNC-053). — Verify: TEST-DATA-VALIDATION, 코드 리뷰
- [Security/Privacy AC] 공식 출처(외교부 해외안전여행) URL만 참조한다. — Verify: TEST-DATA-VALIDATION, 코드 리뷰

## Verify
TEST-DATA-VALIDATION, 코드 리뷰

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-DATA-VALIDATION, 코드 리뷰`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
