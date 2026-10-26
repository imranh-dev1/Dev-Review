import { isBuiltin } from "node:module";
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: { server: "src/server.ts" },
  platform: "node",
  target: "esnext",
  format: "esm",
  clean: true,
  hash: false,
  outputOptions: {
    codeSplitting: false,
  },
  deps: {
    onlyBundle: false,
    alwaysBundle: (id) =>
      !isBuiltin(id),
  },

  fixedExtension: false,
});
