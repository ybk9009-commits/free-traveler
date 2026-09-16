# DATA-DESTINATIONS — 여행지 정적 데이터

```task-meta
{
  "task_id": "DATA-DESTINATIONS",
  "type": "data",
  "depends_on": [],
  "requirements": [
    "REQ-FUNC-007",
    "REQ-FUNC-008",
    "REQ-NF-026"
  ]
}
```

## Context
이 Task는 — (SCR-001, SCR-002에서 소비) 화면이 필요로 하는 '여행지 정적 데이터' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙(정적 데이터 정책), §5 데이터 모델 매핑

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-007(축소), REQ-FUNC-008, REQ-NF-026
- 정규화된 Requirement ID: REQ-FUNC-007, REQ-FUNC-008, REQ-NF-026

## Screen / Route / Page Entry
- Screen: — (SCR-001, SCR-002에서 소비)
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
— (없음)

## Expected Files
`src/data/destinations.ts`, `src/data/types.ts`(공용 타입)

## Functional AC
- `docs/PROJECT_SCOPE.md` §1 원칙대로 Supabase 테이블이 아닌 **정적 TypeScript 배열/객체**로 작성한다(DB 미사용).
  - 국내 10개 이상, 해외 15개국 30개 도시 이상을 포함한다(REQ-FUNC-008).
  - 각 항목은 `overview`(300자 이상), `highlights`(5개 이상), `bestTime`, `itinerary1d`, `itinerary3d`, `budget`, `transport`, `foods`(3개 이상), `etiquette`(3개 이상), `sources`(1개 이상)를 모두 채운다(REQ-FUNC-004의 데이터 전제).
  - 모든 이미지 URL에 실제 장소를 설명하는 `alt` 텍스트를 함께 저장한다(REQ-FUNC-007, alt만 필수 보증하고 출처·작가·라이선스는 참고 기록만 한다).

## Visual AC
해당 없음(비-UI Task, 소비 측 Visual AC는 CMP-SCR-001-destination-grid/DETAIL-DRAWER에서 정의).

## Security/Privacy AC
개인정보 없음. 외부 이미지 URL은 HTTPS만 허용한다.

## Test Cases
- [Functional AC] `docs/PROJECT_SCOPE.md` §1 원칙대로 Supabase 테이블이 아닌 **정적 TypeScript 배열/객체**로 작성한다(DB 미사용). — Verify: TEST-DATA-VALIDATION(수량·필드 완전성), 코드 리뷰(alt 텍스트 존재 확인)
- [Functional AC] 국내 10개 이상, 해외 15개국 30개 도시 이상을 포함한다(REQ-FUNC-008). — Verify: TEST-DATA-VALIDATION(수량·필드 완전성), 코드 리뷰(alt 텍스트 존재 확인)
- [Functional AC] 각 항목은 `overview`(300자 이상), `highlights`(5개 이상), `bestTime`, `itinerary1d`, `itinerary3d`, `budget`, `transport`, `foods`(3개 이상), `etiquette`(3개 이상), `sources`(1개 이상)를 모두 채운다(REQ-FUNC-004의 데이터 전제). — Verify: TEST-DATA-VALIDATION(수량·필드 완전성), 코드 리뷰(alt 텍스트 존재 확인)
- [Functional AC] 모든 이미지 URL에 실제 장소를 설명하는 `alt` 텍스트를 함께 저장한다(REQ-FUNC-007, alt만 필수 보증하고 출처·작가·라이선스는 참고 기록만 한다). — Verify: TEST-DATA-VALIDATION(수량·필드 완전성), 코드 리뷰(alt 텍스트 존재 확인)
- [Security/Privacy AC] 개인정보 없음. 외부 이미지 URL은 HTTPS만 허용한다. — Verify: TEST-DATA-VALIDATION(수량·필드 완전성), 코드 리뷰(alt 텍스트 존재 확인)

## Verify
TEST-DATA-VALIDATION(수량·필드 완전성), 코드 리뷰(alt 텍스트 존재 확인)

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-DATA-VALIDATION(수량·필드 완전성), 코드 리뷰(alt 텍스트 존재 확인)`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
