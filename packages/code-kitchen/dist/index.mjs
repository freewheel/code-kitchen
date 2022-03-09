var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/playground.tsx
import * as React5 from "react";

// ../../node_modules/.pnpm/fast-equals@3.0.0/node_modules/fast-equals/dist/fast-equals.esm.js
var HAS_WEAKSET_SUPPORT = typeof WeakSet === "function";
var keys = Object.keys;
function sameValueZeroEqual(a, b) {
  return a === b || a !== a && b !== b;
}
function isPlainObject(value) {
  return value.constructor === Object || value.constructor == null;
}
function isPromiseLike(value) {
  return !!value && typeof value.then === "function";
}
function isReactElement(value) {
  return !!(value && value.$$typeof);
}
function getNewCacheFallback() {
  var values = [];
  return {
    add: function(value) {
      values.push(value);
    },
    has: function(value) {
      return values.indexOf(value) !== -1;
    }
  };
}
var getNewCache = function(canUseWeakMap) {
  if (canUseWeakMap) {
    return function _getNewCache() {
      return /* @__PURE__ */ new WeakSet();
    };
  }
  return getNewCacheFallback;
}(HAS_WEAKSET_SUPPORT);
function createCircularEqualCreator(isEqual) {
  return function createCircularEqual(comparator) {
    var _comparator = isEqual || comparator;
    return function circularEqual(a, b, indexOrKeyA, indexOrKeyB, parentA, parentB, cache) {
      if (cache === void 0) {
        cache = getNewCache();
      }
      var isCacheableA = !!a && typeof a === "object";
      var isCacheableB = !!b && typeof b === "object";
      if (isCacheableA || isCacheableB) {
        var hasA = isCacheableA && cache.has(a);
        var hasB = isCacheableB && cache.has(b);
        if (hasA || hasB) {
          return hasA && hasB;
        }
        if (isCacheableA) {
          cache.add(a);
        }
        if (isCacheableB) {
          cache.add(b);
        }
      }
      return _comparator(a, b, cache);
    };
  };
}
function areArraysEqual(a, b, isEqual, meta) {
  var index = a.length;
  if (b.length !== index) {
    return false;
  }
  while (index-- > 0) {
    if (!isEqual(a[index], b[index], index, index, a, b, meta)) {
      return false;
    }
  }
  return true;
}
function areMapsEqual(a, b, isEqual, meta) {
  var isValueEqual = a.size === b.size;
  if (isValueEqual && a.size) {
    var matchedIndices_1 = {};
    var indexA_1 = 0;
    a.forEach(function(aValue, aKey) {
      if (isValueEqual) {
        var hasMatch_1 = false;
        var matchIndexB_1 = 0;
        b.forEach(function(bValue, bKey) {
          if (!hasMatch_1 && !matchedIndices_1[matchIndexB_1]) {
            hasMatch_1 = isEqual(aKey, bKey, indexA_1, matchIndexB_1, a, b, meta) && isEqual(aValue, bValue, aKey, bKey, a, b, meta);
            if (hasMatch_1) {
              matchedIndices_1[matchIndexB_1] = true;
            }
          }
          matchIndexB_1++;
        });
        indexA_1++;
        isValueEqual = hasMatch_1;
      }
    });
  }
  return isValueEqual;
}
var OWNER = "_owner";
var hasOwnProperty = Function.prototype.bind.call(Function.prototype.call, Object.prototype.hasOwnProperty);
function areObjectsEqual(a, b, isEqual, meta) {
  var keysA = keys(a);
  var index = keysA.length;
  if (keys(b).length !== index) {
    return false;
  }
  if (index) {
    var key = void 0;
    while (index-- > 0) {
      key = keysA[index];
      if (key === OWNER) {
        var reactElementA = isReactElement(a);
        var reactElementB = isReactElement(b);
        if ((reactElementA || reactElementB) && reactElementA !== reactElementB) {
          return false;
        }
      }
      if (!hasOwnProperty(b, key) || !isEqual(a[key], b[key], key, key, a, b, meta)) {
        return false;
      }
    }
  }
  return true;
}
function areRegExpsEqual(a, b) {
  return a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.unicode === b.unicode && a.sticky === b.sticky && a.lastIndex === b.lastIndex;
}
function areSetsEqual(a, b, isEqual, meta) {
  var isValueEqual = a.size === b.size;
  if (isValueEqual && a.size) {
    var matchedIndices_2 = {};
    a.forEach(function(aValue, aKey) {
      if (isValueEqual) {
        var hasMatch_2 = false;
        var matchIndex_1 = 0;
        b.forEach(function(bValue, bKey) {
          if (!hasMatch_2 && !matchedIndices_2[matchIndex_1]) {
            hasMatch_2 = isEqual(aValue, bValue, aKey, bKey, a, b, meta);
            if (hasMatch_2) {
              matchedIndices_2[matchIndex_1] = true;
            }
          }
          matchIndex_1++;
        });
        isValueEqual = hasMatch_2;
      }
    });
  }
  return isValueEqual;
}
var HAS_MAP_SUPPORT = typeof Map === "function";
var HAS_SET_SUPPORT = typeof Set === "function";
function createComparator(createIsEqual) {
  var isEqual = typeof createIsEqual === "function" ? createIsEqual(comparator) : function(a, b, indexOrKeyA, indexOrKeyB, parentA, parentB, meta) {
    return comparator(a, b, meta);
  };
  function comparator(a, b, meta) {
    if (a === b) {
      return true;
    }
    if (a && b && typeof a === "object" && typeof b === "object") {
      if (isPlainObject(a) && isPlainObject(b)) {
        return areObjectsEqual(a, b, isEqual, meta);
      }
      var aShape = Array.isArray(a);
      var bShape = Array.isArray(b);
      if (aShape || bShape) {
        return aShape === bShape && areArraysEqual(a, b, isEqual, meta);
      }
      aShape = a instanceof Date;
      bShape = b instanceof Date;
      if (aShape || bShape) {
        return aShape === bShape && sameValueZeroEqual(a.getTime(), b.getTime());
      }
      aShape = a instanceof RegExp;
      bShape = b instanceof RegExp;
      if (aShape || bShape) {
        return aShape === bShape && areRegExpsEqual(a, b);
      }
      if (isPromiseLike(a) || isPromiseLike(b)) {
        return a === b;
      }
      if (HAS_MAP_SUPPORT) {
        aShape = a instanceof Map;
        bShape = b instanceof Map;
        if (aShape || bShape) {
          return aShape === bShape && areMapsEqual(a, b, isEqual, meta);
        }
      }
      if (HAS_SET_SUPPORT) {
        aShape = a instanceof Set;
        bShape = b instanceof Set;
        if (aShape || bShape) {
          return aShape === bShape && areSetsEqual(a, b, isEqual, meta);
        }
      }
      return areObjectsEqual(a, b, isEqual, meta);
    }
    return a !== a && b !== b;
  }
  return comparator;
}
var deepEqual = createComparator();
var shallowEqual = createComparator(function() {
  return sameValueZeroEqual;
});
var circularDeepEqual = createComparator(createCircularEqualCreator());
var circularShallowEqual = createComparator(createCircularEqualCreator(sameValueZeroEqual));

// src/files-editor.tsx
import React2, { useCallback, useEffect as useEffect3, useRef, useState as useState3 } from "react";

// src/path.ts
function assertPath(path) {
  if (typeof path !== "string") {
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(path)}`);
  }
}
var CHAR_DOT = 46;
var CHAR_FORWARD_SLASH = 47;
function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i = 0, len = path.length; i <= len; ++i) {
    if (i < len)
      code = path.charCodeAt(i);
    else if (isPathSeparator(code))
      break;
    else
      code = CHAR_FORWARD_SLASH;
    if (isPathSeparator(code)) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += `${separator}..`;
          else
            res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += separator + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === CHAR_DOT && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function isPosixPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH;
}
function normalize(path) {
  assertPath(path);
  if (path.length === 0)
    return ".";
  const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
  const trailingSeparator = path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH;
  path = normalizeString(path, !isAbsolute, "/", isPosixPathSeparator);
  if (path.length === 0 && !isAbsolute)
    path = ".";
  if (path.length > 0 && trailingSeparator)
    path += "/";
  if (isAbsolute)
    return `/${path}`;
  return path;
}
function join(...paths) {
  if (paths.length === 0)
    return ".";
  let joined;
  for (let i = 0, len = paths.length; i < len; ++i) {
    const path = paths[i];
    assertPath(path);
    if (path.length > 0) {
      if (!joined)
        joined = path;
      else
        joined += `/${path}`;
    }
  }
  if (!joined)
    return ".";
  return normalize(joined);
}
function extname(path) {
  const m = /(\.[a-zA-Z0-9]+)$/.exec(path);
  return m ? m[1] : "";
}
function urlJoin(url, ...args) {
  var _a;
  const u = new URL(url, (_a = globalThis.location) == null ? void 0 : _a.origin);
  u.pathname = join(u.pathname, ...args);
  return u.toString();
}

// src/use-monaco.ts
import monacoLoader from "@monaco-editor/loader";
import { useEffect, useState } from "react";

// src/config.ts
var globalConfig = {
  esbuildWasmPath: "https://cdn.jsdelivr.net/npm/esbuild-wasm@latest",
  monacoEditorPath: "https://cdn.jsdelivr.net/npm/monaco-editor@latest/min"
};
var setup = (config) => {
  Object.assign(globalConfig, config);
};

// src/use-monaco.ts
var filePrefix = "file:///";
var _cached_monaco = null;
var _monacoInitialized = null;
function useMonaco() {
  const [monaco, setMonaco] = useState(_cached_monaco);
  useEffect(() => {
    if (!_monacoInitialized) {
      _monacoInitialized = (async () => {
        var _a;
        monacoLoader.config({
          paths: {
            vs: urlJoin(globalConfig.monacoEditorPath, "vs")
          }
        });
        const _monaco = (_a = monacoLoader.__getMonacoInstance()) != null ? _a : await monacoLoader.init();
        const tsLang = _monaco.languages.typescript;
        const tsDefaults = tsLang.typescriptDefaults;
        const jsDefaults = _monaco.languages.typescript.javascriptDefaults;
        const tsConfig = {
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
          suppressImplicitAnyIndexErrors: true
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
        tsLang.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: false
        });
        tsDefaults.setDiagnosticsOptions({
          noSyntaxValidation: false
        });
        tsDefaults.setEagerModelSync(true);
        jsDefaults.setEagerModelSync(true);
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

// src/utils.ts
import * as React from "react";
var inferLoader = (filename) => {
  const ext = extname(filename);
  if (ext === ".js" || ext === ".jsx" || ext === ".ts" || ext === ".tsx") {
    return "tsx";
  }
  if (ext === ".json") {
    return "json";
  }
  if (ext === ".css") {
    return "css";
  }
  throw new Error(`File format not supported for ${filename}`);
};
var inferLanguage = (filename) => {
  const loader = inferLoader(filename);
  if (loader === "tsx") {
    return "typescript";
  }
  return loader;
};
var genRandomStr = () => Math.random().toString(36).replace(/[^a-z]+/g, "").substring(0, 5);

// src/files-editor.tsx
function useModels(id, files) {
  const monaco = useMonaco();
  const modelsRef = useRef(null);
  const [_, setCounter] = useState3(0);
  useEffect3(() => {
    return () => {
      if (modelsRef.current) {
        modelsRef.current.forEach((m) => m.dispose());
        modelsRef.current = null;
      }
    };
  }, [id]);
  useEffect3(() => {
    if (!monaco) {
      return;
    }
    const getFileUri = (filename) => monaco.Uri.file(join(id, filename));
    if (!modelsRef.current) {
      const newModels = files.map((f) => {
        return monaco.editor.createModel(f.code, inferLanguage(f.filename), getFileUri(f.filename));
      });
      modelsRef.current = newModels;
      setCounter((c) => c + 1);
    } else {
      modelsRef.current.forEach((m) => {
        var _a;
        const latestCode = (_a = files.find((f) => getFileUri(f.filename).path === m.uri.path)) == null ? void 0 : _a.code;
        if (!m.isDisposed() && m.getValue() !== latestCode) {
          m.setValue(latestCode != null ? latestCode : "");
        }
      });
    }
  }, [files, id, monaco]);
  return modelsRef.current;
}
function useMonacoEditor(id, ref, files, onChange, activeFileName) {
  const monaco = useMonaco();
  const models = useModels(id, files);
  const [editor, setEditor] = useState3(null);
  const stateCacheRef = useRef(/* @__PURE__ */ new Map());
  useEffect3(() => {
    if (monaco && ref.current) {
      const newEditor = monaco.editor.create(ref.current, {
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        smoothScrolling: true,
        scrollbar: {
          alwaysConsumeMouseWheel: true,
          handleMouseWheel: false
        }
      });
      setEditor(newEditor);
      newEditor.onDidFocusEditorText(() => {
        newEditor == null ? void 0 : newEditor.updateOptions({
          scrollbar: {
            handleMouseWheel: true
          }
        });
      });
      newEditor.onDidBlurEditorText(() => {
        newEditor == null ? void 0 : newEditor.updateOptions({
          scrollbar: {
            handleMouseWheel: false
          }
        });
      });
      return () => {
        newEditor.dispose();
      };
    }
  }, [monaco, ref]);
  useEffect3(() => {
    const stateCache = stateCacheRef.current;
    const activeModel = models == null ? void 0 : models.find((m) => m.uri.path.endsWith(activeFileName));
    if (editor && activeModel && !activeModel.isDisposed() && editor.getModel() !== activeModel) {
      editor.setModel(activeModel);
      const listener = editor.onDidChangeModelContent(() => {
        onChange(editor.getValue(), activeFileName);
      });
      if (stateCache.get(activeFileName)) {
        editor.restoreViewState(stateCache.get(activeFileName));
      }
      return () => {
        stateCache.set(activeFileName, editor.saveViewState());
        listener.dispose();
      };
    }
  }, [activeFileName, editor, models, onChange]);
  return editor;
}
function FilesEditor({
  id,
  initialFiles,
  files,
  onChange
}) {
  const filenames = files.filter((f) => !f.hidden).map((f) => f.filename);
  const [activeTab, setActiveTab] = useState3(filenames[0]);
  const editorWrapperRef = useRef(null);
  const filesRef = useRef(files);
  React2.useEffect(() => {
    filesRef.current = files;
  });
  const onFileChange = useCallback((newCode, filename) => {
    const newFiles = [...filesRef.current];
    const idx = newFiles.findIndex((f) => f.filename === filename);
    if (idx !== -1) {
      newFiles[idx] = __spreadProps(__spreadValues({}, newFiles[idx]), { code: newCode });
    }
    onChange(newFiles);
  }, [onChange]);
  const activeFile = files.find((f) => f.filename === activeTab);
  const dirty = !deepEqual(initialFiles, files);
  const doReset = useCallback(() => {
    onChange(initialFiles);
  }, [onChange, initialFiles]);
  useEffect3(() => {
    if (!activeFile && files) {
      setActiveTab(filenames[0]);
    }
  }, [activeFile, activeTab, filenames, files]);
  const editor = useMonacoEditor(id, editorWrapperRef, files, onFileChange, activeTab);
  return /* @__PURE__ */ React2.createElement("div", {
    className: "code-kitchen-files-editor-panel",
    "data-dirty": dirty
  }, /* @__PURE__ */ React2.createElement("div", {
    className: "code-kitchen-files-editor-panel-header"
  }, /* @__PURE__ */ React2.createElement("div", {
    className: "code-kitchen-files-editor-panel-header-tabs"
  }, filenames.map((filename) => /* @__PURE__ */ React2.createElement("div", {
    role: "button",
    key: filename,
    onClick: () => setActiveTab(filename),
    "data-active": activeTab === filename ? true : void 0,
    className: "code-kitchen-files-editor-panel-header-tab"
  }, filename))), /* @__PURE__ */ React2.createElement("div", {
    className: "code-kitchen-files-editor-panel-header-actions"
  }, /* @__PURE__ */ React2.createElement("div", {
    role: "button",
    onClick: doReset,
    className: "code-kitchen-action-button",
    "data-action": "reset"
  }, "Reset"))), /* @__PURE__ */ React2.createElement("div", {
    className: `code-kitchen-monaco-editor-anchor ${editor ? "" : "hidden"}`,
    ref: editorWrapperRef
  }), !editor && /* @__PURE__ */ React2.createElement("div", {
    className: "code-kitchen-editor-loading-text"
  }, "loading editor ..."));
}

// src/icons.tsx
import * as React3 from "react";
var RotateToHorizontalIcon = (props) => /* @__PURE__ */ React3.createElement("svg", __spreadValues({
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24"
}, props), /* @__PURE__ */ React3.createElement("path", {
  d: "M12 5v14h7V5h-7zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z",
  fill: "currentColor"
}));
var RotateToVerticalIcon = (props) => /* @__PURE__ */ React3.createElement(RotateToHorizontalIcon, __spreadProps(__spreadValues({}, props), {
  style: { transform: "rotate(-90deg)" }
}));
var ErrorIcon = (props) => /* @__PURE__ */ React3.createElement("svg", __spreadValues({
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24"
}, props), /* @__PURE__ */ React3.createElement("path", {
  d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
  fill: "currentColor"
}));
var FullscreenIcon = (props) => /* @__PURE__ */ React3.createElement("svg", __spreadValues({
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24"
}, props), /* @__PURE__ */ React3.createElement("path", {
  d: "M5 5h5v2H7v3H5V5m9 0h5v5h-2V7h-3V5m3 9h2v5h-5v-2h3v-3m-7 3v2H5v-5h2v3h3z",
  fill: "currentColor"
}));
var ExitFullscreenIcon = (props) => /* @__PURE__ */ React3.createElement("svg", __spreadValues({
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24"
}, props), /* @__PURE__ */ React3.createElement("path", {
  d: "M14 14h5v2h-3v3h-2v-5m-9 0h5v5H8v-3H5v-2m3-9h2v5H5V8h3V5m11 3v2h-5V5h2v3h3z",
  fill: "currentColor"
}));
var ShowCodeIcon = (props) => /* @__PURE__ */ React3.createElement("svg", __spreadValues({
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24"
}, props), /* @__PURE__ */ React3.createElement("path", {
  d: "M8.7 15.9L4.8 12l3.9-3.9a.984.984 0 0 0 0-1.4a.984.984 0 0 0-1.4 0l-4.59 4.59a.996.996 0 0 0 0 1.41l4.59 4.6c.39.39 1.01.39 1.4 0a.984.984 0 0 0 0-1.4zm6.6 0l3.9-3.9l-3.9-3.9a.984.984 0 0 1 0-1.4a.984.984 0 0 1 1.4 0l4.59 4.59c.39.39.39 1.02 0 1.41l-4.59 4.6a.984.984 0 0 1-1.4 0a.984.984 0 0 1 0-1.4z",
  fill: "currentColor"
}));
var HideCodeIcon = (props) => /* @__PURE__ */ React3.createElement("svg", __spreadValues({
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24"
}, props), /* @__PURE__ */ React3.createElement("path", {
  d: "M19.17 12l-3.88-3.88a.996.996 0 1 1 1.41-1.41l4.59 4.59c.39.39.39 1.02 0 1.41l-2.88 2.88L17 14.17L19.17 12zM2.1 4.93l3.49 3.49l-2.88 2.88a.996.996 0 0 0 0 1.41L7.3 17.3a.996.996 0 1 0 1.41-1.41L4.83 12L7 9.83L19.07 21.9a.996.996 0 1 0 1.41-1.41L3.51 3.51a.996.996 0 0 0-1.41 0c-.39.4-.39 1.03 0 1.42z",
  fill: "currentColor"
}));

// src/use-preview-component.tsx
import React4, { Component } from "react";

// src/bundle.ts
import * as esbuild from "esbuild-wasm";

// ../../node_modules/.pnpm/stylis@4.0.13/node_modules/stylis/src/Enum.js
var MS = "-ms-";
var MOZ = "-moz-";
var WEBKIT = "-webkit-";
var COMMENT = "comm";
var RULESET = "rule";
var DECLARATION = "decl";
var IMPORT = "@import";
var KEYFRAMES = "@keyframes";

// ../../node_modules/.pnpm/stylis@4.0.13/node_modules/stylis/src/Utility.js
var abs = Math.abs;
var from = String.fromCharCode;
var assign = Object.assign;
function hash(value, length2) {
  return (((length2 << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3);
}
function trim(value) {
  return value.trim();
}
function match(value, pattern) {
  return (value = pattern.exec(value)) ? value[0] : value;
}
function replace(value, pattern, replacement) {
  return value.replace(pattern, replacement);
}
function indexof(value, search) {
  return value.indexOf(search);
}
function charat(value, index) {
  return value.charCodeAt(index) | 0;
}
function substr(value, begin, end) {
  return value.slice(begin, end);
}
function strlen(value) {
  return value.length;
}
function sizeof(value) {
  return value.length;
}
function append(value, array) {
  return array.push(value), value;
}
function combine(array, callback) {
  return array.map(callback).join("");
}

// ../../node_modules/.pnpm/stylis@4.0.13/node_modules/stylis/src/Tokenizer.js
var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = "";
function node(value, root, parent, type, props, children, length2) {
  return { value, root, parent, type, props, children, line, column, length: length2, return: "" };
}
function copy(root, props) {
  return assign(node("", null, null, "", null, null, 0), root, { length: -root.length }, props);
}
function char() {
  return character;
}
function prev() {
  character = position > 0 ? charat(characters, --position) : 0;
  if (column--, character === 10)
    column = 1, line--;
  return character;
}
function next() {
  character = position < length ? charat(characters, position++) : 0;
  if (column++, character === 10)
    column = 1, line++;
  return character;
}
function peek() {
  return charat(characters, position);
}
function caret() {
  return position;
}
function slice(begin, end) {
  return substr(characters, begin, end);
}
function token(type) {
  switch (type) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function alloc(value) {
  return line = column = 1, length = strlen(characters = value), position = 0, [];
}
function dealloc(value) {
  return characters = "", value;
}
function delimit(type) {
  return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
}
function whitespace(type) {
  while (character = peek())
    if (character < 33)
      next();
    else
      break;
  return token(type) > 2 || token(character) > 3 ? "" : " ";
}
function escaping(index, count) {
  while (--count && next())
    if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
      break;
  return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
}
function delimiter(type) {
  while (next())
    switch (character) {
      case type:
        return position;
      case 34:
      case 39:
        if (type !== 34 && type !== 39)
          delimiter(character);
        break;
      case 40:
        if (type === 41)
          delimiter(type);
        break;
      case 92:
        next();
        break;
    }
  return position;
}
function commenter(type, index) {
  while (next())
    if (type + character === 47 + 10)
      break;
    else if (type + character === 42 + 42 && peek() === 47)
      break;
  return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
}
function identifier(index) {
  while (!token(peek()))
    next();
  return slice(index, position);
}

// ../../node_modules/.pnpm/stylis@4.0.13/node_modules/stylis/src/Parser.js
function compile(value) {
  return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
}
function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
  var index = 0;
  var offset = 0;
  var length2 = pseudo;
  var atrule = 0;
  var property = 0;
  var previous = 0;
  var variable = 1;
  var scanning = 1;
  var ampersand = 1;
  var character2 = 0;
  var type = "";
  var props = rules;
  var children = rulesets;
  var reference = rule;
  var characters2 = type;
  while (scanning)
    switch (previous = character2, character2 = next()) {
      case 40:
        if (previous != 108 && characters2.charCodeAt(length2 - 1) == 58) {
          if (indexof(characters2 += replace(delimit(character2), "&", "&\f"), "&\f") != -1)
            ampersand = -1;
          break;
        }
      case 34:
      case 39:
      case 91:
        characters2 += delimit(character2);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        characters2 += whitespace(previous);
        break;
      case 92:
        characters2 += escaping(caret() - 1, 7);
        continue;
      case 47:
        switch (peek()) {
          case 42:
          case 47:
            append(comment(commenter(next(), caret()), root, parent), declarations);
            break;
          default:
            characters2 += "/";
        }
        break;
      case 123 * variable:
        points[index++] = strlen(characters2) * ampersand;
      case 125 * variable:
      case 59:
      case 0:
        switch (character2) {
          case 0:
          case 125:
            scanning = 0;
          case 59 + offset:
            if (property > 0 && strlen(characters2) - length2)
              append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2), declarations);
            break;
          case 59:
            characters2 += ";";
          default:
            append(reference = ruleset(characters2, root, parent, index, offset, rules, points, type, props = [], children = [], length2), rulesets);
            if (character2 === 123)
              if (offset === 0)
                parse(characters2, root, reference, reference, props, rulesets, length2, points, children);
              else
                switch (atrule) {
                  case 100:
                  case 109:
                  case 115:
                    parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2), children), rules, children, length2, points, rule ? props : children);
                    break;
                  default:
                    parse(characters2, reference, reference, reference, [""], children, 0, points, children);
                }
        }
        index = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
        break;
      case 58:
        length2 = 1 + strlen(characters2), property = previous;
      default:
        if (variable < 1) {
          if (character2 == 123)
            --variable;
          else if (character2 == 125 && variable++ == 0 && prev() == 125)
            continue;
        }
        switch (characters2 += from(character2), character2 * variable) {
          case 38:
            ampersand = offset > 0 ? 1 : (characters2 += "\f", -1);
            break;
          case 44:
            points[index++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
            break;
          case 64:
            if (peek() === 45)
              characters2 += delimit(next());
            atrule = peek(), offset = length2 = strlen(type = characters2 += identifier(caret())), character2++;
            break;
          case 45:
            if (previous === 45 && strlen(characters2) == 2)
              variable = 0;
        }
    }
  return rulesets;
}
function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length2) {
  var post = offset - 1;
  var rule = offset === 0 ? rules : [""];
  var size = sizeof(rule);
  for (var i = 0, j = 0, k = 0; i < index; ++i)
    for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x)
      if (z = trim(j > 0 ? rule[x] + " " + y : replace(y, /&\f/g, rule[x])))
        props[k++] = z;
  return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length2);
}
function comment(value, root, parent) {
  return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0);
}
function declaration(value, root, parent, length2) {
  return node(value, root, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2);
}

// ../../node_modules/.pnpm/stylis@4.0.13/node_modules/stylis/src/Prefixer.js
function prefix(value, length2) {
  switch (hash(value, length2)) {
    case 5103:
      return WEBKIT + "print-" + value + value;
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return WEBKIT + value + value;
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return WEBKIT + value + MOZ + value + MS + value + value;
    case 6828:
    case 4268:
      return WEBKIT + value + MS + value + value;
    case 6165:
      return WEBKIT + value + MS + "flex-" + value + value;
    case 5187:
      return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + value;
    case 5443:
      return WEBKIT + value + MS + "flex-item-" + replace(value, /flex-|-self/, "") + value;
    case 4675:
      return WEBKIT + value + MS + "flex-line-pack" + replace(value, /align-content|flex-|-self/, "") + value;
    case 5548:
      return WEBKIT + value + MS + replace(value, "shrink", "negative") + value;
    case 5292:
      return WEBKIT + value + MS + replace(value, "basis", "preferred-size") + value;
    case 6060:
      return WEBKIT + "box-" + replace(value, "-grow", "") + WEBKIT + value + MS + replace(value, "grow", "positive") + value;
    case 4554:
      return WEBKIT + replace(value, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + value;
    case 6187:
      return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"), value, "") + value;
    case 5495:
    case 3959:
      return replace(value, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
    case 4968:
      return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + WEBKIT + value + value;
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return replace(value, /(.+)-inline(.+)/, WEBKIT + "$1$2") + value;
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (strlen(value) - 1 - length2 > 6)
        switch (charat(value, length2 + 1)) {
          case 109:
            if (charat(value, length2 + 4) !== 45)
              break;
          case 102:
            return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (charat(value, length2 + 3) == 108 ? "$3" : "$2-$3")) + value;
          case 115:
            return ~indexof(value, "stretch") ? prefix(replace(value, "stretch", "fill-available"), length2) + value : value;
        }
      break;
    case 4949:
      if (charat(value, length2 + 1) !== 115)
        break;
    case 6444:
      switch (charat(value, strlen(value) - 3 - (~indexof(value, "!important") && 10))) {
        case 107:
          return replace(value, ":", ":" + WEBKIT) + value;
        case 101:
          return replace(value, /(.+:)([^;!]+)(;|!.+)?/, "$1" + WEBKIT + (charat(value, 14) === 45 ? "inline-" : "") + "box$3$1" + WEBKIT + "$2$3$1" + MS + "$2box$3") + value;
      }
      break;
    case 5936:
      switch (charat(value, length2 + 11)) {
        case 114:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
        case 108:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
        case 45:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
      }
      return WEBKIT + value + MS + value + value;
  }
  return value;
}

// ../../node_modules/.pnpm/stylis@4.0.13/node_modules/stylis/src/Serializer.js
function serialize(children, callback) {
  var output = "";
  var length2 = sizeof(children);
  for (var i = 0; i < length2; i++)
    output += callback(children[i], i, children, callback) || "";
  return output;
}
function stringify(element, index, children, callback) {
  switch (element.type) {
    case IMPORT:
    case DECLARATION:
      return element.return = element.return || element.value;
    case COMMENT:
      return "";
    case KEYFRAMES:
      return element.return = element.value + "{" + serialize(element.children, callback) + "}";
    case RULESET:
      element.value = element.props.join(",");
  }
  return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
}

// ../../node_modules/.pnpm/stylis@4.0.13/node_modules/stylis/src/Middleware.js
function middleware(collection) {
  var length2 = sizeof(collection);
  return function(element, index, children, callback) {
    var output = "";
    for (var i = 0; i < length2; i++)
      output += collection[i](element, index, children, callback) || "";
    return output;
  };
}
function prefixer(element, index, children, callback) {
  if (element.length > -1) {
    if (!element.return)
      switch (element.type) {
        case DECLARATION:
          element.return = prefix(element.value, element.length);
          break;
        case KEYFRAMES:
          return serialize([copy(element, { value: replace(element.value, "@", "@" + WEBKIT) })], callback);
        case RULESET:
          if (element.length)
            return combine(element.props, function(value) {
              switch (match(value, /(::plac\w+|:read-\w+)/)) {
                case ":read-only":
                case ":read-write":
                  return serialize([copy(element, { props: [replace(value, /:(read-\w+)/, ":" + MOZ + "$1")] })], callback);
                case "::placeholder":
                  return serialize([
                    copy(element, { props: [replace(value, /:(plac\w+)/, ":" + WEBKIT + "input-$1")] }),
                    copy(element, { props: [replace(value, /:(plac\w+)/, ":" + MOZ + "$1")] }),
                    copy(element, { props: [replace(value, /:(plac\w+)/, MS + "input-$1")] })
                  ], callback);
              }
              return "";
            });
      }
  }
}

// src/bundle.ts
function injectCSS(css, id) {
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
function compileCssModule(css, buildId) {
  const classMapping = {};
  const res = serialize(compile(css), middleware([
    (element) => {
      if (element.length > -1) {
        if (element.type === RULESET && element.props) {
          element.props = (Array.isArray(element.props) ? [...element.props] : [element.props]).map((prop) => {
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
    stringify
  ]));
  return {
    contents: `${injectCSS(res, buildId)}
    export default ${JSON.stringify(classMapping)}`
  };
}
function compileScopedCss(css, buildId) {
  const value = serialize(compile(`.${buildId}{${css}}`), middleware([prefixer, stringify]));
  return {
    contents: injectCSS(value, buildId)
  };
}
function compileGlobalCss(css, buildId) {
  const value = serialize(compile(css), middleware([prefixer, stringify]));
  return {
    contents: injectCSS(value, buildId)
  };
}
var _init = null;
var initEsbuild = async () => {
  try {
    if (!_init) {
      _init = esbuild.initialize({
        wasmURL: urlJoin(globalConfig.esbuildWasmPath, "esbuild.wasm")
      });
    }
    await _init;
  } catch (err) {
    if (!err.toString().includes('Cannot call "initialize" more than once')) {
      throw err;
    }
  }
};
function formatBuildErrors(errors) {
  return esbuild.formatMessages(errors, { kind: "error" }).then((res) => res.join("\n\n"));
}
var Logger = class {
  constructor() {
    this.lines = /* @__PURE__ */ new Set();
  }
  log(message) {
    this.lines.add(message);
  }
  clear() {
    this.lines.clear();
  }
};
var logger = new Logger();
var RESOLVE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ""];
var RESOLVE_NAMESPACE = "playground-input";
function resolvePlugin(files, buildId) {
  return {
    name: "resolve",
    setup(build2) {
      build2.onStart(() => {
        logger.clear();
      });
      build2.onEnd(() => {
        logger.clear();
      });
      build2.onResolve({ filter: /.*/ }, (args) => {
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
            namespace: RESOLVE_NAMESPACE
          };
        }
        return {
          path: args.path,
          external: true
        };
      });
      build2.onLoad({ filter: /.*/, namespace: RESOLVE_NAMESPACE }, async (args) => {
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
            loader: inferLoader(file.filename)
          };
        }
      });
    }
  };
}
async function bundle(files, buildId) {
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
      target: "esnext"
    });
    const code = result.outputFiles.map((f) => f.text).join("\n");
    return code;
  } catch (error) {
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

// src/use-preview-component.tsx
var errorBoundary = (id, Element, errorCallback) => {
  return class ErrorBoundary extends Component {
    constructor() {
      super(...arguments);
      this.state = { error: null };
    }
    componentDidCatch(error) {
      errorCallback(error);
    }
    static getDerivedStateFromError(error) {
      return { error };
    }
    render() {
      if (this.state.error) {
        return null;
      }
      return /* @__PURE__ */ React4.createElement("div", {
        className: id,
        style: { display: "contents" }
      }, typeof Element === "function" ? /* @__PURE__ */ React4.createElement(Element, null) : Element);
    }
  };
};
var evalCode = (code, scope) => {
  const scopeKeys = Object.keys(scope);
  const scopeValues = scopeKeys.map((key) => scope[key]);
  const res = new Function(...scopeKeys, code);
  return res(...scopeValues);
};
var generatePreviewComponent = (id, {
  input,
  scope = {}
}, errorCallback) => {
  try {
    const _module = {
      exports: {}
    };
    evalCode(input, __spreadProps(__spreadValues({}, scope), {
      exports: _module.exports,
      module: _module,
      React: React4
    }));
    const El = _module.exports.default;
    return errorBoundary(id, El, errorCallback);
  } catch (err) {
    errorCallback(err);
  }
};
var usePreviewComponent = (id, files, require2) => {
  const [bundling, setBundling] = React4.useState(false);
  const [Preview, setPreview] = React4.useState(null);
  const [error, setError] = React4.useState(null);
  React4.useEffect(() => {
    let canceled = false;
    const startTime = performance.now();
    setBundling(true);
    (async () => {
      try {
        const bundledCode = await bundle(files, id);
        if (canceled || !bundledCode) {
          return;
        }
        setBundling(false);
        console.debug(`Bundled code in ${(performance.now() - startTime).toFixed()}ms: `, { bundledCode });
        const El = generatePreviewComponent(id, {
          input: bundledCode,
          scope: { require: require2 }
        }, setError);
        if (El) {
          setError(null);
          setPreview(() => El);
        }
      } catch (err) {
        if (canceled) {
          return;
        }
        setError(err);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [require2, files, id]);
  React4.useEffect(() => {
    return () => {
      var _a;
      (_a = document.querySelector(`[data-code-kitchen-style-id="${id}"]`)) == null ? void 0 : _a.remove();
    };
  }, [id]);
  return {
    Preview,
    bundling,
    error
  };
};

// src/playground.tsx
function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = React5.useState(value);
  React5.useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(id);
    };
  }, [value, delay]);
  return debouncedValue;
}
function ControlButton({
  icon,
  onClick
}) {
  return /* @__PURE__ */ React5.createElement("div", {
    role: "button",
    className: "code-kitchen-preview-panel-header-action-button",
    onClick
  }, icon);
}
function Playground({
  initialFiles,
  require: require2,
  style,
  className,
  name,
  live: defaultLive = true,
  dir: defaultDir = "h"
}) {
  const [id] = React5.useState("code-kitchen-" + genRandomStr());
  const [files, setFiles] = React5.useState(initialFiles);
  const [dir, setDir] = React5.useState(defaultDir);
  const [fullScreen, setFullScreen] = React5.useState(false);
  const [showCode, setShowCode] = React5.useState(defaultLive);
  const [showError, setShowError] = React5.useState(false);
  const debouncedFiles = useDebouncedValue(files, 100);
  const { Preview, error, bundling } = usePreviewComponent(id, debouncedFiles, require2);
  const realShowError = error && (showError || !Preview);
  React5.useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);
  return /* @__PURE__ */ React5.createElement("div", {
    style,
    className: "code-kitchen-root" + (className ? " " + className : ""),
    "data-dir": dir,
    "data-fullscreen": fullScreen ? true : void 0,
    "data-show-error": realShowError ? true : void 0,
    "data-show-code": showCode
  }, /* @__PURE__ */ React5.createElement("div", {
    className: "code-kitchen-preview-panel"
  }, /* @__PURE__ */ React5.createElement("div", {
    className: "code-kitchen-preview-panel-header"
  }, /* @__PURE__ */ React5.createElement("div", {
    className: "code-kitchen-preview-panel-header-label"
  }, name), /* @__PURE__ */ React5.createElement("div", {
    className: "code-kitchen-preview-panel-header-actions"
  }, showCode && /* @__PURE__ */ React5.createElement(ControlButton, {
    icon: dir === "h" ? /* @__PURE__ */ React5.createElement(RotateToVerticalIcon, null) : /* @__PURE__ */ React5.createElement(RotateToHorizontalIcon, null),
    onClick: () => setDir(dir === "h" ? "v" : "h")
  }), /* @__PURE__ */ React5.createElement(ControlButton, {
    icon: !showCode ? /* @__PURE__ */ React5.createElement(ShowCodeIcon, null) : /* @__PURE__ */ React5.createElement(HideCodeIcon, null),
    onClick: () => setShowCode((c) => !c)
  }), /* @__PURE__ */ React5.createElement(ControlButton, {
    icon: !fullScreen ? /* @__PURE__ */ React5.createElement(FullscreenIcon, null) : /* @__PURE__ */ React5.createElement(ExitFullscreenIcon, null),
    onClick: () => setFullScreen((f) => !f)
  }))), /* @__PURE__ */ React5.createElement("div", {
    className: "code-kitchen-preview-panel-preview-container"
  }, error && /* @__PURE__ */ React5.createElement("div", {
    className: "code-kitchen-preview-panel-preview-error",
    style: { opacity: realShowError ? 1 : 0 }
  }, /* @__PURE__ */ React5.createElement("pre", null, error.toString())), /* @__PURE__ */ React5.createElement("div", {
    className: "code-kitchen-preview-panel-preview-content"
  }, bundling && !Preview ? "loading..." : Preview && /* @__PURE__ */ React5.createElement(Preview, null))), error && /* @__PURE__ */ React5.createElement("div", {
    className: "code-kitchen-error-toggle",
    onClick: () => setShowError((e) => !e)
  }, /* @__PURE__ */ React5.createElement(ErrorIcon, null))), showCode && /* @__PURE__ */ React5.createElement(FilesEditor, {
    id,
    initialFiles,
    files,
    onChange: setFiles
  }));
}
export {
  Playground,
  setup,
  useMonaco
};
