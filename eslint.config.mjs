import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Allow unused vars
      "@typescript-eslint/no-explicit-any": "off", // Allow 'any' type
      "@typescript-eslint/explicit-module-boundary-types": "off", // Don't require explicit return types
      "@typescript-eslint/no-inferrable-types": "off", // Allow redundant type annotations
    },
  },
];

export default eslintConfig;
