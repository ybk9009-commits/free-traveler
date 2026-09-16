# TASK-CMP-SCR002-COUNTRIES-GALLERY — 방문 국가 30개 + 사진 Gallery 8개

- **Category:** Component
- **Implementation Status:** IMPLEMENT(축소)
- **Requirement Ref:** REQ-FUNC-059(축소), REQ-FUNC-061(축소), REQ-NF-006
- **Screen:** SCR-002
- **Route:** `/about`
- **Page Entry:** `src/app/about/page.tsx`(PAGE-SCR002가 조립)
- **Depends On:** DATA-REPRESENTATIVE
- **Expected Files:** `src/components/screens/scr002/CountriesGallery.tsx`
- **Functional AC:** 권역 4그룹(아시아/유럽/북미/오세아니아) × 국가 Chip 목록 30개(지도 대신 목록형, REQ-FUNC-059 축소). 이미지 8장 이상(각 alt에 실제 장소 설명, REQ-FUNC-061)을 Masonry/Grid로 표시한다.
- **Visual AC:** Desktop Grid → Mobile 1~2열, `Next/Image` lazy 로딩(REQ-NF-006).
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P2
