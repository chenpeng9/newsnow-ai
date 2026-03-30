import { ourongxing } from "@ourongxing/eslint-config"
import reactHooks from "eslint-plugin-react-hooks"

export default ourongxing({
  type: "app",
  ignores: ["src/routeTree.gen.ts", "imports.app.d.ts", "public/", ".vscode", "**/*.json", "**/*.md"],
}).append({
  plugins: {
    "react-hooks": reactHooks,
  },
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
})
