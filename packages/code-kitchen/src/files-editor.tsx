import { inferLanguage } from "@code-kitchen/bundler";
import { deepEqual } from "fast-equals";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { debug } from "./debug";
import { join } from "./path";
import { InputFile } from "./types";
import { useMonaco } from "./use-monaco";

declare global {
  interface Window {
    __monaco_editors__: Record<
      string,
      import("monaco-editor/esm/vs/editor/editor.api").editor.IStandaloneCodeEditor
    >;
  }
}

function useModels(id: string, files: InputFile[]) {
  const monaco = useMonaco();
  const modelsRef = useRef<import("monaco-editor").editor.IModel[] | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCounter] = useState(0);

  useEffect(() => {
    return () => {
      // dispose models
      if (modelsRef.current) {
        modelsRef.current.forEach((m) => m.dispose());
        modelsRef.current = null;
      }
    };
  }, [id]);

  useEffect(() => {
    if (!monaco) {
      return;
    }
    const getFileUri = (filename: string) =>
      monaco.Uri.file(join(id, filename));
    if (
      !modelsRef.current ||
      (modelsRef.current.length === 0 && files.length > 0)
    ) {
      const newModels = files.map((f) => {
        return monaco.editor.createModel(
          f.code,
          inferLanguage(f.filename),
          getFileUri(f.filename)
        );
      });
      modelsRef.current = newModels;
      setCounter((c) => c + 1);
    } else {
      modelsRef.current.forEach((m) => {
        const latestCode = files.find(
          (f) => getFileUri(f.filename).path === m.uri.path
        )?.code;
        if (!m.isDisposed() && m.getValue() !== latestCode) {
          m.setValue(latestCode ?? "");
        }
      });
    }
  }, [files, id, monaco]);

  return modelsRef.current;
}

function useMonacoEditor(
  id: string,
  internalId: string,
  ref: React.RefObject<HTMLElement>,
  files: InputFile[],
  onChange: (code: string, filename: string) => void,
  activeFileName: string
) {
  const monaco = useMonaco();
  const models = useModels(internalId, files);
  const [editor, setEditor] = useState<
    import("monaco-editor").editor.IStandaloneCodeEditor | null
  >(null);

  const [stateCache] = useState(() => new Map());

  useEffect(() => {
    if (monaco && ref.current) {
      // TODO: allow users to overwrite this?
      const newEditor = monaco.editor.create(ref.current, {
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        smoothScrolling: true,
        scrollbar: {
          alwaysConsumeMouseWheel: true,
          handleMouseWheel: false,
        },
      });
      setEditor(newEditor);
      if (window.__monaco_editors__) {
        window.__monaco_editors__[id] = newEditor;
      }
      newEditor.onDidFocusEditorText(() => {
        newEditor?.updateOptions({
          scrollbar: {
            handleMouseWheel: true,
          },
        });
      });
      newEditor.onDidBlurEditorText(() => {
        newEditor?.updateOptions({
          scrollbar: {
            handleMouseWheel: false,
          },
        });
      });
      return () => {
        if (window.__monaco_editors__) {
          window.__monaco_editors__[id] = undefined;
        }
        newEditor.dispose();
      };
    }
  }, [id, monaco, ref]);

  useEffect(() => {
    const activeModel = models?.find((m) =>
      m.uri.path.endsWith(activeFileName)
    );
    if (
      editor &&
      activeModel &&
      !activeModel.isDisposed() &&
      editor.getModel() !== activeModel
    ) {
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
  }, [activeFileName, editor, models, onChange, stateCache]);
  return editor;
}

export function FilesEditor({
  id,
  internalId,
  initialFiles,
  files,
  onChange,
}: {
  id: string;
  internalId: string;
  initialFiles: InputFile[];
  files: InputFile[];
  onChange: (newFiles: InputFile[]) => void;
}) {
  const filenames = files.filter((f) => !f.hidden).map((f) => f.filename);
  const [activeTab, setActiveTab] = useState(filenames[0]);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<InputFile[]>(files);

  React.useLayoutEffect(() => {
    filesRef.current = files;
  });

  const onFileChange = useCallback(
    (newCode: string, filename: string) => {
      const newFiles = [...filesRef.current];
      const idx = newFiles.findIndex((f) => f.filename === filename);
      if (idx !== -1) {
        newFiles[idx] = { ...newFiles[idx], code: newCode };
      }
      if (!deepEqual(newFiles, filesRef.current)) {
        debug("tab #" + idx + " changed");
        onChange(newFiles);
      }
    },
    [onChange]
  );

  const activeFile = files.find((f) => f.filename === activeTab);
  const dirty = !deepEqual(initialFiles, files);

  const doReset = useCallback(() => {
    onChange(initialFiles);
    debug("reset");
  }, [onChange, initialFiles]);

  useEffect(() => {
    if (!activeFile && files) {
      setActiveTab(filenames[0]);
      debug("change tab to " + filenames[0]);
    }
  }, [activeFile, activeTab, filenames, files]);

  const editor = useMonacoEditor(
    id,
    internalId,
    editorWrapperRef,
    files,
    onFileChange,
    activeTab
  );

  return (
    <div className="code-kitchen-files-editor-panel" data-dirty={dirty}>
      <div className="code-kitchen-files-editor-panel-header">
        <div className="code-kitchen-files-editor-panel-header-tabs">
          {filenames.map((filename) => (
            <div
              role="button"
              key={filename}
              onClick={() => setActiveTab(filename)}
              data-active={activeTab === filename ? true : undefined}
              className="code-kitchen-files-editor-panel-header-tab"
            >
              {filename}
            </div>
          ))}
        </div>
        <div className="code-kitchen-files-editor-panel-header-actions">
          <div
            role="button"
            onClick={doReset}
            className="code-kitchen-action-button"
            data-action="reset"
          >
            Reset
          </div>
        </div>
      </div>
      <div
        className={`code-kitchen-monaco-editor-anchor ${
          editor ? "" : "hidden"
        }`}
        ref={editorWrapperRef}
      />

      {!editor && (
        <div className="code-kitchen-editor-loading-text">loading ...</div>
      )}
    </div>
  );
}
