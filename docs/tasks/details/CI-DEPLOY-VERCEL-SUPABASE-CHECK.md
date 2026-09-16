# CI-DEPLOY-VERCEL-SUPABASE-CHECK — Vercel/Supabase 배포·환경 확인

```task-meta
{
  "task_id": "CI-DEPLOY-VERCEL-SUPABASE-CHECK",
  "type": "ci",
  "depends_on": [
    "DB-SCHEMA-BASE",
    "DB-RLS-BASE",
    "INFRA-AUTH-SESSION"
  ],
  "requirements": [
    "REQ-NF-012",
    "REQ-NF-016",
    "REQ-NF-034"
  ]
}
```

## Context
이 Task는 여러 화면 또는 인프라 계층에서 공통으로 소비되는 기반 요소이 필요로 하는 'Vercel/Supabase 배포·환경 확인' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §6 테스트 전략, §7 배포

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-NF-012, REQ-NF-016, REQ-NF-034
- 정규화된 Requirement ID: REQ-NF-012, REQ-NF-016, REQ-NF-034

## Screen / Route / Page Entry
- Screen: —
- Route: —
- Page Entry: —

## Design Ref
해당 없음(비-UI Task).

## Depends On
- DB-SCHEMA-BASE
- DB-RLS-BASE
- INFRA-AUTH-SESSION

## Expected Files
`.env.example`, `supabase/config.toml`(검토), 배포 체크리스트(문서화는 이 Task 구현 시 별도 산출물로 생성 — 지금은 만들지 않음)

## Functional AC
- Vercel 프로젝트에 Next.js 앱을 배포하고 TLS 1.2+(REQ-NF-012, Vercel 기본 제공)를 확인한다.
  - 비밀키는 Vercel 환경변수로만 관리하고 클라이언트 번들에 포함되지 않음을 빌드 산출물 검사로 확인한다(REQ-NF-016).
  - Vercel/Supabase 무료~저가 티어 조합으로 월 인프라 비용(콘텐츠 인건비 제외) 100,000원 이하 목표를 요금제 문서로 검토한다(REQ-NF-034, 설계 원칙 — 별도 비용 모니터링 도구는 구축하지 않음).
  - 클라우드 VM/cloud-infra 등 별도 인프라를 구성하지 않는다(`docs/PROJECT_SCOPE.md` 아키텍처 원칙).

## Visual AC
해당 없음.

## Security/Privacy AC
`SUPABASE_SERVICE_ROLE_KEY` 등 서버 전용 값이 `NEXT_PUBLIC_` 접두사로 노출되지 않는지 확인한다.

## Test Cases
- [Functional AC] Vercel 프로젝트에 Next.js 앱을 배포하고 TLS 1.2+(REQ-NF-012, Vercel 기본 제공)를 확인한다. — Verify: 배포 후 수동 확인(TEST-RELEASE-CHECK-MANUAL과 연계)
- [Functional AC] 비밀키는 Vercel 환경변수로만 관리하고 클라이언트 번들에 포함되지 않음을 빌드 산출물 검사로 확인한다(REQ-NF-016). — Verify: 배포 후 수동 확인(TEST-RELEASE-CHECK-MANUAL과 연계)
- [Functional AC] Vercel/Supabase 무료~저가 티어 조합으로 월 인프라 비용(콘텐츠 인건비 제외) 100,000원 이하 목표를 요금제 문서로 검토한다(REQ-NF-034, 설계 원칙 — 별도 비용 모니터링 도구는 구축하지 않음). — Verify: 배포 후 수동 확인(TEST-RELEASE-CHECK-MANUAL과 연계)
- [Functional AC] 클라우드 VM/cloud-infra 등 별도 인프라를 구성하지 않는다(`docs/PROJECT_SCOPE.md` 아키텍처 원칙). — Verify: 배포 후 수동 확인(TEST-RELEASE-CHECK-MANUAL과 연계)
- [Security/Privacy AC] `SUPABASE_SERVICE_ROLE_KEY` 등 서버 전용 값이 `NEXT_PUBLIC_` 접두사로 노출되지 않는지 확인한다. — Verify: 배포 후 수동 확인(TEST-RELEASE-CHECK-MANUAL과 연계)

## Verify
배포 후 수동 확인(TEST-RELEASE-CHECK-MANUAL과 연계)

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`배포 후 수동 확인(TEST-RELEASE-CHECK-MANUAL과 연계)`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
- 클라우드 VM(가상 서버)을 별도로 직접 구성하지 않는다 — Vercel/Supabase 관리형 서비스만 사용한다.
- 무인 병합 자동화 도구를 구성하지 않는다.
