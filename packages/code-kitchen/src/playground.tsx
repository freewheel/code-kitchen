import * as React from "react";
import * as ReactDOM from "react-dom";

import { FilesEditor } from "./files-editor";
import {
  ErrorIcon,
  ExitFullscreenIcon,
  FullscreenIcon,
  HideCodeIcon,
  RotateToHorizontalIcon,
  RotateToVerticalIcon,
  ShowCodeIcon,
} from "./icons";
import { PlaygroundInputFile } from "./types";
import { usePreviewComponent } from "./use-preview-component";
import { genRandomStr } from "./utils";

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
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
  onClick,
}: {
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div
      role="button"
      className="code-kitchen-preview-panel-header-action-button"
      onClick={onClick}
    >
      {icon}
    </div>
  );
}

// Fullscreen will always render to the boday
const BodyPortal = ({
  portal,
  children,
}: {
  portal?: string;
  children: React.ReactNode;
}) => {
  const [anchor, setAnchor] = React.useState(null);
  React.useEffect(() => {
    if (typeof window !== "undefined" && !portal) {
      return;
    }
    const node = document.createElement("div");
    const portalEl = document.querySelector(portal);
    node.setAttribute("data-code-kitchen-portal", "true");
    portalEl.appendChild(node);
    setAnchor(node);
    return () => {
      node.remove();
    };
  }, [portal]);
  return portal ? (
    anchor && ReactDOM.createPortal(children, anchor)
  ) : (
    <>{children}</>
  );
};

export function Playground({
  initialFiles,
  require,
  style,
  className,
  name,
  live: defaultLive = true,
  dir: defaultDir = "h",
}: {
  className?: string;
  initialFiles: PlaygroundInputFile[];
  require: (key: string) => any;
  live?: boolean;
  dir?: "v" | "h";
  style?: React.CSSProperties;
  name?: string;
}) {
  const [id] = React.useState("code-kitchen-" + genRandomStr());
  const [files, setFiles] = React.useState(initialFiles);
  const [dir, setDir] = React.useState<"v" | "h">(defaultDir);
  const [fullScreen, setFullScreen] = React.useState(false);
  const [showCode, setShowCode] = React.useState(defaultLive);
  const [showError, setShowError] = React.useState(false);

  const debouncedFiles = useDebouncedValue(files, 100);
  const { Preview, error, bundling } = usePreviewComponent(
    id,
    debouncedFiles,
    require
  );

  const realShowError = error && (showError || !Preview);

  React.useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  return (
    <BodyPortal portal={fullScreen ? "body" : undefined}>
      <div
        style={style}
        className={"code-kitchen-root" + (className ? " " + className : "")}
        data-dir={dir}
        data-fullscreen={fullScreen ? true : undefined}
        data-show-error={realShowError ? true : undefined}
        data-show-code={showCode}
      >
        <div className="code-kitchen-preview-panel">
          <div className="code-kitchen-preview-panel-header">
            <div className="code-kitchen-preview-panel-header-label">
              {name}
            </div>
            <div className="code-kitchen-preview-panel-header-actions">
              {showCode && (
                <ControlButton
                  icon={
                    dir === "h" ? (
                      <RotateToVerticalIcon />
                    ) : (
                      <RotateToHorizontalIcon />
                    )
                  }
                  onClick={() => setDir(dir === "h" ? "v" : "h")}
                />
              )}
              <ControlButton
                icon={!showCode ? <ShowCodeIcon /> : <HideCodeIcon />}
                onClick={() => setShowCode((c) => !c)}
              />
              <ControlButton
                icon={!fullScreen ? <FullscreenIcon /> : <ExitFullscreenIcon />}
                onClick={() => setFullScreen((f) => !f)}
              />
            </div>
          </div>
          <div className="code-kitchen-preview-panel-preview-container">
            {error && (
              <div
                className="code-kitchen-preview-panel-preview-error"
                style={{ opacity: realShowError ? 1 : 0 }}
              >
                <pre>{error.toString()}</pre>
              </div>
            )}
            <div className="code-kitchen-preview-panel-preview-content">
              {bundling && !Preview ? "loading..." : Preview && <Preview />}
            </div>
          </div>
          {error && (
            <div
              className="code-kitchen-error-toggle"
              onClick={() => setShowError((e) => !e)}
            >
              <ErrorIcon />
            </div>
          )}
        </div>

        {showCode && (
          <FilesEditor
            id={id}
            initialFiles={initialFiles}
            files={files}
            onChange={setFiles}
          />
        )}
      </div>
    </BodyPortal>
  );
}
