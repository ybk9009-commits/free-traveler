# INFRA-EXTERNAL-LINK-SAFETY — 외부 링크 새 탭·noopener 공용 유틸

```task-meta
{
  "task_id": "INFRA-EXTERNAL-LINK-SAFETY",
  "type": "infra",
  "depends_on": [],
  "requirements": [
    "REQ-FUNC-016",
    "REQ-FUNC-024",
    "REQ-FUNC-049"
  ]
}
```

## Context
이 Task는 — (SCR-001, SCR-003에서 소비) 화면이 필요로 하는 '외부 링크 새 탭·noopener 공용 유틸' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §1 아키텍처 원칙

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-016, REQ-FUNC-024, REQ-FUNC-049
- 정규화된 Requirement ID: REQ-FUNC-016, REQ-FUNC-024, REQ-FUNC-049

## Screen / Route / Page Entry
- Screen: — (SCR-001, SCR-003에서 소비)
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
— (없음)

## Expected Files
`src/lib/links/external-link.ts`

## Functional AC
- 항공/호텔 외부 이동, 외교부 안전정보 원문 링크, 대표 소개 SNS 링크가 공통으로 사용할 `openExternal(url)` 유틸을 제공한다.
  - `target="_blank"` + `rel="noopener noreferrer"`를 강제하고, 목적지·날짜 쿼리 파라미터를 URL에 절대 추가하지 않는다(CON-02).
  - 허용목록(HTTPS만) 밖 URL이나 `javascript:` 스킴은 열지 않고 호출부에 오류를 반환한다(REQ-FUNC-018, 026 전제).

## Visual AC
해당 없음.

## Security/Privacy AC
URL이 허용목록의 HTTPS 프로토콜인지 유틸 내부에서 검증한다.

## Test Cases
- [Functional AC] 항공/호텔 외부 이동, 외교부 안전정보 원문 링크, 대표 소개 SNS 링크가 공통으로 사용할 `openExternal(url)` 유틸을 제공한다. — Verify: 코드 리뷰, TEST-E2E-TRAVEL-TOOLS(속성 확인)
- [Functional AC] `target="_blank"` + `rel="noopener noreferrer"`를 강제하고, 목적지·날짜 쿼리 파라미터를 URL에 절대 추가하지 않는다(CON-02). — Verify: 코드 리뷰, TEST-E2E-TRAVEL-TOOLS(속성 확인)
- [Functional AC] 허용목록(HTTPS만) 밖 URL이나 `javascript:` 스킴은 열지 않고 호출부에 오류를 반환한다(REQ-FUNC-018, 026 전제). — Verify: 코드 리뷰, TEST-E2E-TRAVEL-TOOLS(속성 확인)
- [Security/Privacy AC] URL이 허용목록의 HTTPS 프로토콜인지 유틸 내부에서 검증한다. — Verify: 코드 리뷰, TEST-E2E-TRAVEL-TOOLS(속성 확인)

## Verify
코드 리뷰, TEST-E2E-TRAVEL-TOOLS(속성 확인)

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`코드 리뷰, TEST-E2E-TRAVEL-TOOLS(속성 확인)`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
