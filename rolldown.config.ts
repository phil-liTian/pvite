/*
 * @Author: phil
 * @Date: 2025-11-13 20:23:17
 */
import { defineConfig } from "rolldown";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const sharedNodeOptions = defineConfig({
  output: {
    dir: "./dist",
    entryFileNames: "node/[name].js",
  },
});

const envConfig = defineConfig({
  input: path.resolve(__dirname, "src/client/env.ts"),
  output: {
    dir: path.resolve(__dirname, "dist"),
    entryFileNames: "client/env.mjs",
  },
});

const nodeConfig = defineConfig({
  ...sharedNodeOptions,
  input: {
    index: path.resolve(__dirname, "src/node/index.ts"),
    cli: path.resolve(__dirname, "src/node/cli.ts"),
  },
});

export default defineConfig([envConfig, nodeConfig]);
