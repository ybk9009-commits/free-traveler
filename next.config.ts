import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Playwright(webServer)가 127.0.0.1로 접속하는데, Next.js 16의 allowedDevOrigins
  // 기본값이 이를 차단해 dev 리소스 요청이 실패하고 클라이언트 하이드레이션이
  // 조용히 멈추는 문제가 있었다(이벤트 핸들러가 전혀 바인딩되지 않음). 개발 서버
  // 전용 설정이며 프로덕션 빌드에는 영향이 없다.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
