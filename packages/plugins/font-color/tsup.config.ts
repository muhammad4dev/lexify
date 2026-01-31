import { defineConfig } from "tsup";
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: { compilerOptions: { composite: false } },
  sourcemap: true, clean: true, treeshake: true,
  external: ["lexical", "@lexical/rich-text", "@lexical/selection", "@lexical/list", "@lexra/core", "@lexra/plugin-utils"],
});
