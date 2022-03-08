import { deepEqual } from "fast-equals";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { join } from "./path";
import { PlaygroundInputFile } from "./types";
import { useMonaco } from "./use-monaco";
import { inferLanguage } from "./utils";

function useModels(id: string, files: PlaygroundInputFile[]) {
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
    if (!modelsRef.current) {
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
  ref: React.RefObject<HTMLElement>,
  files: PlaygroundInputFile[],
  onChange: (code: string, filename: string) => void,
  activeFileName: string
) {
  const monaco = useMonaco();
  const models = useModels(id, files);
  const [editor, setEditor] = useState<
    import("monaco-editor").editor.IStandaloneCodeEditor | null
  >(null);

  const stateCacheRef = useRef(new Map());

  useEffect(() => {
    if (monaco && ref.current) {
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
        newEditor.dispose();
      };
    }
  }, [monaco, ref]);

  useEffect(() => {
    const stateCache = stateCacheRef.current;
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
  }, [activeFileName, editor, models, onChange]);
  return editor;
}

export function FilesEditor({
  id,
  initialFiles,
  files,
  onChange,
}: {
  id: string;
  initialFiles: PlaygroundInputFile[];
  files: PlaygroundInputFile[];
  onChange: (newFiles: PlaygroundInputFile[]) => void;
}) {
  const filenames = files.filter((f) => !f.hidden).map((f) => f.filename);
  const [activeTab, setActiveTab] = useState(filenames[0]);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<PlaygroundInputFile[]>(files);

  React.useEffect(() => {
    filesRef.current = files;
  });

  const onFileChange = useCallback(
    (newCode: string, filename: string) => {
      const newFiles = [...filesRef.current];
      const idx = newFiles.findIndex((f) => f.filename === filename);
      if (idx !== -1) {
        newFiles[idx] = { ...newFiles[idx], code: newCode };
      }
      onChange(newFiles);
    },
    [onChange]
  );

  const activeFile = files.find((f) => f.filename === activeTab);

  const dirty = !deepEqual(initialFiles, files);

  const doReset = useCallback(() => {
    onChange(initialFiles);
  }, [onChange, initialFiles]);

  useEffect(() => {
    if (!activeFile && files) {
      setActiveTab(filenames[0]);
    }
  }, [activeFile, activeTab, filenames, files]);

  const editor = useMonacoEditor(
    id,
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
        <div className="code-kitchen-editor-loading-text">
          loading editor ...
        </div>
      )}
    </div>
  );
}
