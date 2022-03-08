/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/prop-types */
import cx from "classnames";
import { Playground as ReactPlayground, setup, useMonaco } from "code-kitchen";
import esbuildWasmMeta from "esbuild-wasm/package.json";
import monacoEditorMeta from "monaco-editor/package.json";
import React from "react";
import dependencies from "./dependencies";

import { pre } from "./mdx";

const isProd = process.env.NODE_ENV === "production";

setup({
  esbuildWasmPath:
    (isProd ? "/pages/uex/code-kitchen" : "") +
    `/libs/esbuild-wasm/${esbuildWasmMeta.version}`,
  monacoEditorPath:
    (isProd ? "/pages/uex/code-kitchen" : "") +
    `/libs/monaco-editor/${monacoEditorMeta.version}/min`,
});

export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
};

const customRequire = (key: string) => {
  const res = (dependencies as any)[key];

  if (res) {
    return res;
  }

  throw new Error("DEP: " + key + " not found");
};

let typesLoaded = false;

// Ref
// https://github1s.com/reactjs/reactjs.org/blob/main/beta/src/components/MDX/Sandpack/index.tsx

const reactTyping = require("!raw-loader?esModule=false!@types/react/index.d.ts");
const demoLibSrc = require("!raw-loader?esModule=false!demo-lib/index.tsx");

const filePrefix = "file:///";
const typesPrefix = "node_modules/@types";

export const Playground = ({
  children,
  className,
  name,
  live,
  dir,
}: {
  children: string;
  /**
   * A nice name for the playground. Will show in the header
   */
  name?: string;
  className?: string;
  live?: boolean;
  dir?: "v" | "h";
}) => {
  const hasMounted = useHasMounted();
  const monaco = useMonaco();
  React.useEffect(() => {
    if (typesLoaded || !monaco) {
      return;
    }

    const allTypes = [
      [`${filePrefix}/${typesPrefix}/react/index.d.ts`, reactTyping],
      [`${filePrefix}/demo-lib/index.tsx`, demoLibSrc],
    ];

    allTypes.forEach(([path, content]) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(content, path);
    });

    typesLoaded = true;
  }, [monaco]);

  if (!hasMounted) {
    return null;
  }

  const codeSnippets = React.Children.toArray(children) as React.ReactElement[];

  const files = codeSnippets
    .map((codeSnippet: React.ReactElement, index) => {
      if (codeSnippet.type !== "pre" && codeSnippet.type !== pre) {
        return undefined;
      }
      const { props } = codeSnippet.props.children;
      const lang = props.className.split("language-")[1];

      let filename = ""; // path in the folder structure
      let hidden = false; // if the file is available as a tab

      if (props.metastring) {
        const [_filename, ...params] = props.metastring.split(" ");
        filename = _filename;
        if (params.includes("hidden")) {
          hidden = true;
        }
      } else {
        // The first file is always entryfile
        if (["ts", "tsx", "js", "jsx"].includes(lang) && index === 0) {
          filename = "App.jsx";
        } else {
          throw new Error(
            `Code block is missing a filename: ${props.children}`
          );
        }
      }

      return {
        code: props.children as string,
        hidden,
        entry: index === 0,
        filename,
      };
    })
    .filter(Boolean);
  return (
    <div className={cx("my-8")}>
      <ReactPlayground
        name={name}
        initialFiles={files}
        require={customRequire}
        className={className}
        live={live}
        dir={dir}
      />
    </div>
  );
};
