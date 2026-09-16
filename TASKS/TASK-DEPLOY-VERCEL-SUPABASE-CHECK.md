# TASK-DEPLOY-VERCEL-SUPABASE-CHECK — Vercel/Supabase 배포·환경 확인

- **Category:** CI
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-NF-012, REQ-NF-016, REQ-NF-034
- **Screen:** —
- **Route:** —
- **Page Entry:** —
- **Depends On:** DB-SCHEMA-BASE, DB-RLS-BASE, INFRA-AUTH-SESSION
- **Expected Files:** `.env.example`, `supabase/config.toml`(검토), 배포 체크리스트(문서화는 이 Task 구현 시 별도 산출물로 생성 — 지금은 만들지 않음)
- **Functional AC:**
  - Vercel 프로젝트에 Next.js 앱을 배포하고 TLS 1.2+(REQ-NF-012, Vercel 기본 제공)를 확인한다.
  - 비밀키는 Vercel 환경변수로만 관리하고 클라이언트 번들에 포함되지 않음을 빌드 산출물 검사로 확인한다(REQ-NF-016).
  - Vercel/Supabase 무료~저가 티어 조합으로 월 인프라 비용(콘텐츠 인건비 제외) 100,000원 이하 목표를 요금제 문서로 검토한다(REQ-NF-034, 설계 원칙 — 별도 비용 모니터링 도구는 구축하지 않음).
  - EC2/AWS 등 별도 인프라를 구성하지 않는다(`docs/PROJECT_SCOPE.md` 아키텍처 원칙).
- **Visual AC:** 해당 없음.
- **Security/Privacy AC:** `SUPABASE_SERVICE_ROLE_KEY` 등 서버 전용 값이 `NEXT_PUBLIC_` 접두사로 노출되지 않는지 확인한다.
- **Verify:** 배포 후 수동 확인(RELEASE-CHECK-MANUAL과 연계)
- **Priority:** P2
