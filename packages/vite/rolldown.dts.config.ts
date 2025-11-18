import { defineConfig } from "rolldown";

console.log("a====>");

export default defineConfig({
  input: {
    index: "./src/node/index.ts",
  },
  output: {
    dir: "./dist/node",
    chunkFileNames: "chunks/[name].d.ts",
    format: "esm",
  },
});
