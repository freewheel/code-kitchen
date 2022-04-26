import * as esbuild from "esbuild-wasm";
import {
  compile,
  middleware,
  prefixer,
  RULESET,
  serialize,
  stringify,
} from "stylis";
import { globalConfig } from "./config";
import { urlJoin } from "./path";
import { InputFile } from "./types";
import { inferLoader } from "./utils";

function injectCSS(css: string, id: string) {
  // Append or replace the styles for ID
  return `
  (function () {
    let styleEl = document.querySelector("[data-code-kitchen-style-id=${id}]");
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.setAttribute('data-code-kitchen-style-id', "${id}");
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = ${JSON.stringify(css)};
  })()
  `;
}

function compileCssModule(css: string, buildId: string) {
  const classMapping = {};
  const res = serialize(
    compile(css),
    middleware([
      (element) => {
        if (element.length > -1) {
          if (element.type === RULESET && element.props) {
            element.props = (
              Array.isArray(element.props)
                ? [...element.props]
                : [element.props]
            ).map((prop) => {
              // TODO: this is a es2021 feature
              return prop.replaceAll(/\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g, (m) => {
                const varName = m.slice(1);
                if (!classMapping[varName]) {
                  classMapping[varName] = varName + "_" + buildId;
                }
                return "." + classMapping[varName];
              });
            });
          }
        }
      },
      stringify,
    ])
  );

  return {
    contents: `${injectCSS(res, buildId)}
    export default ${JSON.stringify(classMapping)}`,
  };
}

function compileScopedCss(css: string, buildId: string) {
  const value = serialize(
    compile(`.${buildId}{${css}}`),
    middleware([prefixer, stringify])
  );

  return {
    contents: injectCSS(value, buildId),
  };
}

function compileGlobalCss(css: string, buildId: string) {
  const value = serialize(compile(css), middleware([prefixer, stringify]));
  return {
    contents: injectCSS(value, buildId),
  };
}

/**
 * Reference Implementation based on
 * https://github1s.com/egoist/play-esbuild/blob/HEAD/src/components/App.vue#L67
 */

let _init: Promise<void> | null = null;

const initEsbuild = async () => {
  try {
    if (!_init) {
      _init = esbuild.initialize({
        wasmURL: urlJoin(globalConfig.esbuildWasmPath, "esbuild.wasm"),
      });
    }
    await _init;
  } catch (err: any) {
    if (!err.toString().includes('Cannot call "initialize" more than once')) {
      throw err;
    }
    // ignore
  }
};

export function formatBuildErrors(errors: esbuild.PartialMessage[]) {
  return esbuild
    .formatMessages(errors, { kind: "error" })
    .then((res) => res.join("\n\n"));
}

class Logger {
  lines: Set<string>;

  constructor() {
    this.lines = new Set();
  }

  log(message: string) {
    this.lines.add(message);
  }

  clear() {
    this.lines.clear();
  }
}

const logger = new Logger();

// https://esbuild.github.io/api/#resolve-extensions
const RESOLVE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ""];

const RESOLVE_NAMESPACE = "playground-input";

function resolvePlugin(files: InputFile[], buildId: string): esbuild.Plugin {
  return {
    name: "resolve",
    setup(build) {
      build.onStart(() => {
        logger.clear();
      });

      build.onEnd(() => {
        logger.clear();
      });

      build.onResolve({ filter: /.*/ }, (args) => {
        if (/^https?:\/\//.test(args.path)) {
          throw new Error(`importing HTTP modules is not supported`);
        }

        let file = files.find((f) => f.filename === args.path);
        if (!file && args.path.startsWith("./")) {
          for (const ext of RESOLVE_EXTENSIONS) {
            file = files.find((f) => "./" + f.filename === args.path + ext);
            if (file) {
              break;
            }
          }
          if (!file) {
            throw new Error(`'${args.path}' not found`);
          }
        }

        if (file) {
          return {
            path: file.filename,
            namespace: RESOLVE_NAMESPACE,
          };
        }

        // Treat all others as external - to be resolved by the require function
        return {
          path: args.path,
          external: true,
        };
      });

      build.onLoad(
        { filter: /.*/, namespace: RESOLVE_NAMESPACE },
        async (args) => {
          const file = files.find((f) => f.filename === args.path);
          if (file) {
            if (/\.modules?.css$/.test(file.filename)) {
              return compileCssModule(file.code, buildId);
            } else if (/\.global.css$/.test(file.filename)) {
              return compileGlobalCss(file.code, buildId);
            } else if (/\.css$/.test(file.filename)) {
              return compileScopedCss(file.code, buildId);
            }
            return {
              contents: file.code,
              loader: inferLoader(file.filename),
            };
          }
        }
      );
    },
  };
}

export async function bundle(files: InputFile[], buildId: string) {
  if (!files.length || files.length === 0 || !buildId) {
    return;
  }
  let buildError = "";
  try {
    await initEsbuild();
    const result = await esbuild.build({
      entryPoints: [files[0].filename],
      format: "cjs",
      bundle: true,
      plugins: [resolvePlugin(files, buildId)],
      incremental: true,
      treeShaking: false,
      sourcemap: false,
      target: "esnext",
    });

    const code = result.outputFiles.map((f) => f.text).join("\n");
    return code;
  } catch (error: any) {
    if (error.errors) {
      buildError = await formatBuildErrors(error.errors);
    } else if (error instanceof Error) {
      buildError = error.message;
    } else {
      console.error(error);
    }
    if (buildError) {
      throw new Error(buildError);
    }
  }
}
