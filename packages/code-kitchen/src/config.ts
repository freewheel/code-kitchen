import { setupEsbuild } from "@code-kitchen/bundler";
// TODO: a better way to config this
export const globalConfig = {
  esbuildWasmPath: "https://cdn.jsdelivr.net/npm/esbuild-wasm@latest",
  // Path to the folder containing vs
  monacoEditorPath: "https://cdn.jsdelivr.net/npm/monaco-editor@latest/min",
};

export const setup = (config: Partial<typeof globalConfig>) => {
  Object.assign(globalConfig, config);
  setupEsbuild({
    esbuildWasmPath: config.esbuildWasmPath,
  });
};
