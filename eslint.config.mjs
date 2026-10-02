import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // Portraits are fixed-size, pre-cropped assets served as-is so they
      // render byte-identical to the original site; next/image would
      // re-encode and resize them.
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Scene runtime + animation sources executed in the browser by
    // public/support.js; shipped verbatim, not part of the app bundle.
    "public/**",
  ]),
]);

export default eslintConfig;
