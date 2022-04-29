import * as React from "react";
import * as ReactDOM from "react-dom";

import { usePreviewComponent } from "@code-kitchen/bundler";

import { FilesEditor } from "./files-editor";
import {
  ConnectedIcon,
  DisconnectedIcon,
  ErrorIcon,
  ExitFullscreenIcon,
  FullscreenIcon,
  HideCodeIcon,
  RotateToHorizontalIcon,
  RotateToVerticalIcon,
  ShowCodeIcon,
} from "./icons";
import { InputFile } from "./types";
import { genRandomStr } from "./utils";

import { debug } from "./debug";

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    if (delay < 0) {
      return;
    }
    const id = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [value, delay]);
  return debouncedValue;
}

const cx = (...args: string[]) => args.filter((s) => s).join(" ");

function ControlButton({
  title,
  icon,
  onClick,
  className,
}: {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <div
      role="button"
      title={title}
      className={cx(
        "code-kitchen-preview-panel-header-action-button",
        className
      )}
      onClick={() => {
        onClick();
        debug('ControlButton clicked - "' + title + '"');
      }}
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
    node.classList.add("code-kitchen-portal");
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

const persistFiles = (id: string, files: InputFile[]) => {
  const filesStr = JSON.stringify(files);
  sessionStorage.setItem("code-kitchen:" + id, filesStr);
};

const recoverFiles = (id: string): InputFile[] | undefined => {
  try {
    return JSON.parse(
      sessionStorage.getItem("code-kitchen:" + id) ?? "undefined"
    );
  } catch {
    return undefined;
  }
};

const hash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; ++i)
    hash = Math.imul(31, hash) + str.charCodeAt(i);

  return "" + (hash | 0);
};

const safeId = (id?: string) => hash(id ? id : genRandomStr());

export function Playground({
  initialFiles,
  require,
  style,
  className,
  name,
  id: _id, // if id is given, it will be used as the key for the sessionStorage
  allowDisconnect = false,
  live: defaultLive = true,
  dir: defaultDir = "h",
}: {
  id?: string;
  className?: string;
  initialFiles: InputFile[];
  require: (key: string) => any;
  live?: boolean;
  dir?: "v" | "h";
  allowDisconnect?: boolean;
  style?: React.CSSProperties;
  name?: string;
}) {
  const [id] = React.useState(
    () => "code-kitchen-" + safeId(_id ?? genRandomStr())
  );
  const [files, setFiles] = React.useState(initialFiles);
  const [dir, setDir] = React.useState<"v" | "h">(defaultDir);
  const [connected, setConnected] = React.useState(true);

  const [fullScreen, setFullScreen] = React.useState(false);
  const [showCode, setShowCode] = React.useState(defaultLive);
  const [showError, setShowError] = React.useState(false);

  const realConnected = connected || !showCode;

  const debouncedFiles = useDebouncedValue(files, realConnected ? 100 : -1);
  const { Preview, error, bundling } = usePreviewComponent(
    id,
    debouncedFiles,
    require
  );

  const realShowError = error && (showError || !Preview);

  React.useEffect(() => {
    if (_id) {
      const persisted = recoverFiles(id);
      setFiles(persisted ?? initialFiles);
      if (persisted) {
        debug("Recovered files from sessionStorage");
      }
    }
  }, [_id, id, initialFiles]);

  React.useEffect(() => {
    if (_id) {
      persistFiles(id, files);
    }
  }, [files, _id, id]);

  return (
    <BodyPortal portal={fullScreen ? "body" : undefined}>
      <div
        style={style}
        className={cx(
          "code-kitchen-root",
          !realConnected && "code-kitchen-disconnected",
          className
        )}
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
            {showCode && allowDisconnect && (
              <ControlButton
                title="Toggle Disconnect"
                icon={connected ? <ConnectedIcon /> : <DisconnectedIcon />}
                onClick={() => setConnected((c) => !c)}
              />
            )}
            <div className="code-kitchen-spacer" />
            <div className="code-kitchen-preview-panel-header-actions">
              {showCode && (
                <ControlButton
                  title="Toggle Layout"
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
                title="Show/Hide Code Editor"
                icon={!showCode ? <ShowCodeIcon /> : <HideCodeIcon />}
                onClick={() => setShowCode((c) => !c)}
              />
              <ControlButton
                title="Toggle fullscreen"
                icon={!fullScreen ? <FullscreenIcon /> : <ExitFullscreenIcon />}
                onClick={() => setFullScreen((f) => !f)}
              />
            </div>
          </div>
          <div className="code-kitchen-preview-panel-preview-container">
            <div className="code-kitchen-preview-panel-preview-content">
              {bundling && !Preview ? "loading..." : Preview && <Preview />}
            </div>
            {error && (
              <div
                className="code-kitchen-preview-panel-preview-error"
                style={{
                  opacity: realShowError ? 1 : 0,
                  pointerEvents: realShowError ? "all" : "none",
                }}
              >
                <pre>{error.toString()}</pre>
              </div>
            )}
          </div>
          {error && (
            <div
              title="This preview has errors. Click to show."
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
