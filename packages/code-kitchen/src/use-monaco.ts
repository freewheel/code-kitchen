import monacoLoader from "@monaco-editor/loader";
import { useEffect, useState } from "react";
// TODO: this should be fixed for next js
// import "monaco-editor/min/vs/editor/editor.main.css";
import { globalConfig } from "./config";
import { urlJoin } from "./path";

const filePrefix = "file:///";

let _cached_monaco: typeof import("monaco-editor") | null = null;
let _monacoInitialized: Promise<void> | null = null;

// My own version of useMonaco
export function useMonaco() {
  const [monaco, setMonaco] = useState(_cached_monaco);
  useEffect(() => {
    if (!_monacoInitialized) {
      _monacoInitialized = (async () => {
        monacoLoader.config({
          paths: {
            vs: urlJoin(globalConfig.monacoEditorPath, "vs"),
          },
        });

        const _monaco =
          monacoLoader.__getMonacoInstance() ?? (await monacoLoader.init());
        const tsLang = _monaco.languages.typescript;
        const tsDefaults = tsLang.typescriptDefaults;
        const jsDefaults = _monaco.languages.typescript.javascriptDefaults;

        const tsConfig: Parameters<typeof tsDefaults.setCompilerOptions>[0] = {
          allowSyntheticDefaultImports: true,
          target: tsLang.ScriptTarget.ESNext,
          allowNonTsExtensions: true,
          jsx: tsLang.JsxEmit.Preserve,
          resolveJsonModule: true,
          allowJs: true,
          noImplicitThis: true,
          module: tsLang.ModuleKind.ES2015,
          baseUrl: filePrefix,
          moduleResolution: tsLang.ModuleResolutionKind.NodeJs,
          noImplicitAny: false,
          suppressImplicitAnyIndexErrors: true,
        };

        tsDefaults.addExtraLib(`
        declare module '*.module.css' {
          const classes: { readonly [key: string]: string }
          export default classes
        }
        declare module '*.modules.css' {
          const classes: { readonly [key: string]: string }
          export default classes
        }
        declare module '*.json' {
          const data: { readonly [key: string]: string }
          export default data
        }
        `);

        // validation settings
        tsLang.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: false,
        });
        tsDefaults.setDiagnosticsOptions({
          noSyntaxValidation: false,
        });
        tsDefaults.setEagerModelSync(true);
        jsDefaults.setEagerModelSync(true);
        // compiler options
        tsLang.javascriptDefaults.setCompilerOptions(tsConfig);
        tsDefaults.setCompilerOptions(tsConfig);
        _cached_monaco = _monaco;
      })();
    }

    _monacoInitialized.then(() => {
      setMonaco(_cached_monaco);
    });
  }, []);
  return monaco;
}
