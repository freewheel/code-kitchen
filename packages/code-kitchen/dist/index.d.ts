import * as React from "react";
import * as monaco_editor from "monaco-editor";

interface PlaygroundInputFile {
  filename: string;
  code: string;
  hidden: boolean;
}

declare function Playground({
  initialFiles,
  require,
  style,
  className,
  name,
  live: defaultLive,
  dir: defaultDir,
}: {
  className?: string;
  initialFiles: PlaygroundInputFile[];
  require: (key: string) => any;
  live?: boolean;
  dir?: "v" | "h";
  style?: React.CSSProperties;
  name?: string;
}): JSX.Element;

declare function useMonaco(): typeof monaco_editor;

declare const globalConfig: {
  esbuildWasmPath: string;
  monacoEditorPath: string;
};
declare const setup: (config: Partial<typeof globalConfig>) => void;

export { Playground, setup, useMonaco };
