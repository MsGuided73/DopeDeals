import js from "@eslint/js";
import next from "eslint-config-next";

export default [
  js.configs.recommended,
  ...next,
  {
    rules: {
      // Keep strict during migration but don't block on warnings
      "@next/next/no-img-element": "off"
    },
    ignores: [
      // Ignore legacy server while we migrate types
      "server/**",
      "**/*.test.ts"
    ]
  }
];

