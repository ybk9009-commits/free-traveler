import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Next.js는 .env.local을 자동으로 읽지만 Vitest(Node 실행)는 그렇지
  // 않다 — tests/integration이 NEXT_PUBLIC_SUPABASE_URL 등을
  // process.env에서 직접 읽으므로 여기서 명시적으로 로드한다.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    resolve: {
      // tsconfig.json의 paths(@/* → ./src/*)를 Vite는 자동으로 읽지 않는다.
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    test: {
      include: [
        "src/**/*.{test,spec}.{ts,tsx}",
        "tests/unit/**/*.{test,spec}.{ts,tsx}",
        "tests/integration/**/*.{test,spec}.{ts,tsx}",
      ],
      exclude: ["node_modules/**", ".next/**", "tests/e2e/**"],
      passWithNoTests: true,
    },
  };
});
