# DATA-REPRESENTATIVE — 대표 소개 정적 데이터

```task-meta
{
  "task_id": "DATA-REPRESENTATIVE",
  "type": "data",
  "depends_on": [],
  "requirements": [
    "REQ-FUNC-057",
    "REQ-FUNC-058",
    "REQ-FUNC-059",
    "REQ-FUNC-060",
    "REQ-FUNC-061"
  ]
}
```

## Context
이 Task는 — (SCR-001, SCR-002에서 소비) 화면이 필요로 하는 '대표 소개 정적 데이터' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙(정적 데이터 정책), §5 데이터 모델 매핑

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059(축소), REQ-FUNC-060, REQ-FUNC-061(축소)
- 정규화된 Requirement ID: REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-061

## Screen / Route / Page Entry
- Screen: — (SCR-001, SCR-002에서 소비)
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
— (없음)

## Expected Files
`src/data/representative-profile.ts`

## Functional AC
- 단일 정적 객체로 `displayName`("free_traveler"), `tripCountLabel`("50+ Trips"), `countryCountLabel`("30+ Countries")를 고정한다(REQ-FUNC-057). 이 값은 SCR-001/SCR-002 어디서 참조하든 동일해야 한다.
  - `bio`, `philosophy`, `editorialPrinciples` 텍스트 필드를 포함한다(REQ-FUNC-058).
  - `visitedCountries` 30개 이상(권역 4그룹: 아시아/유럽/북미/오세아니아)을 포함한다(REQ-FUNC-059, 지도 대신 목록형).
  - `timeline` 6개 이상(연도/장소/요약)을 포함한다(REQ-FUNC-060).
  - 대표 이미지에 `alt` 텍스트를 포함한다(REQ-FUNC-061).

## Visual AC
해당 없음(비-UI Task).

## Security/Privacy AC
개인정보 없음(공개 프로필 정보만).

## Test Cases
- [Functional AC] 단일 정적 객체로 `displayName`("free_traveler"), `tripCountLabel`("50+ Trips"), `countryCountLabel`("30+ Countries")를 고정한다(REQ-FUNC-057). 이 값은 SCR-001/SCR-002 어디서 참조하든 동일해야 한다. — Verify: TEST-DATA-VALIDATION, 코드 리뷰
- [Functional AC] `bio`, `philosophy`, `editorialPrinciples` 텍스트 필드를 포함한다(REQ-FUNC-058). — Verify: TEST-DATA-VALIDATION, 코드 리뷰
- [Functional AC] `visitedCountries` 30개 이상(권역 4그룹: 아시아/유럽/북미/오세아니아)을 포함한다(REQ-FUNC-059, 지도 대신 목록형). — Verify: TEST-DATA-VALIDATION, 코드 리뷰
- [Functional AC] `timeline` 6개 이상(연도/장소/요약)을 포함한다(REQ-FUNC-060). — Verify: TEST-DATA-VALIDATION, 코드 리뷰
- [Security/Privacy AC] 개인정보 없음(공개 프로필 정보만). — Verify: TEST-DATA-VALIDATION, 코드 리뷰

## Verify
TEST-DATA-VALIDATION, 코드 리뷰

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-DATA-VALIDATION, 코드 리뷰`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
