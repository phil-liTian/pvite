import { defineConfig } from "tsdown";

export default defineConfig(() => ({
  entry: ["src/index.ts"],
  minify: true,
  target: "node20",
  fixedExtension: false,
}));
