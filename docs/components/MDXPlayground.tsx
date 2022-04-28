/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/prop-types */
import cx from "classnames";
import { Playground as ReactPlayground, setup } from "code-kitchen";
import esbuildWasmMeta from "esbuild-wasm/package.json";
import monacoEditorMeta from "monaco-editor/package.json";
import React, { useId } from "react";
import dependencies from "./dependencies";
import { pre } from "./mdx";
import { useInitMonaco } from "./use-init-monaco";

const isProd = process.env.NODE_ENV === "production";

setup({
  esbuildWasmPath:
    (isProd ? "/code-kitchen" : "") +
    `/libs/esbuild-wasm/${esbuildWasmMeta.version}`,
  monacoEditorPath:
    (isProd ? "/code-kitchen" : "") +
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

  useInitMonaco();
  const id = useId();

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
        id={id}
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
