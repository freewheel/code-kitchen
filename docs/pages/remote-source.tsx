import React, { useState } from "react";
import { useInitMonaco } from "../components/use-init-monaco";
import { InputFile } from "code-kitchen/src/types";
import { Playground } from "code-kitchen";
import dependencies from "../components/dependencies";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonText = isOpen ? "Close Playground" : "Open Playground";
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: "lightgray",
          border: "solid 1px darkgrey",
          borderRadius: "4px",
          padding: "4px 8px",
          margin: "8px 16px",
        }}
      >
        {buttonText}
      </button>
      {isOpen ? <RemoteSourcePlayground src="remote-src" /> : null}
    </>
  );
}

function useRemoteSources(src?: string) {
  const [files, setFiles] = React.useState<InputFile[] | null>(null);
  React.useEffect(() => {
    if (src) {
      let cancelled = false;
      fetch(`/api/remote-files?src=${encodeURIComponent(src)}`).then(
        async (res) => {
          if (cancelled) {
            return;
          }
          const { files } = await res.json();
          setFiles(files);
        }
      );
      return () => {
        cancelled = true;
      };
    }
  }, [src]);
  return files;
}

const customRequire = (key: string) => {
  const res = (dependencies as any)[key];

  if (res) {
    return res;
  }

  throw new Error("DEP: " + key + " not found");
};

function RemoteSourcePlayground({ src }: { src: string }) {
  useInitMonaco();
  const remoteSources = useRemoteSources(src);
  const [initialFiles, setInitialFiles] = React.useState<InputFile[]>([]);
  const latestInitialFiles = React.useRef<InputFile[]>([]);

  React.useEffect(() => {
    const newInitialFiles = remoteSources ?? [];
    setInitialFiles(newInitialFiles);
    latestInitialFiles.current = newInitialFiles;
  }, [remoteSources]);

  return (
    <Playground
      id={"code-kitchen-playground"}
      allowDisconnect
      name="Playground"
      className="h-screen"
      require={customRequire}
      initialFiles={initialFiles}
    />
  );
}
