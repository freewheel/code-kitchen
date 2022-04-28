/* eslint-disable @typescript-eslint/no-var-requires */
import { useMonaco } from "code-kitchen";
import React from "react";

let typesLoaded = false;

// Ref
// https://github1s.com/reactjs/reactjs.org/blob/main/beta/src/components/MDX/Sandpack/index.tsx

const reactTyping = require("!raw-loader?esModule=false!../node_modules/@types/react/index.d.ts");
const demoLibSrc = require("!raw-loader?esModule=false!../node_modules/demo-lib/index.tsx");

const filePrefix = "file:///";
const typesPrefix = "node_modules/@types";

export const useInitMonaco = () => {
  const monaco = useMonaco();
  React.useEffect(() => {
    if (typesLoaded || !monaco) {
      return;
    }

    const allTypes = [
      [`${filePrefix}/${typesPrefix}/react/index.d.ts`, reactTyping],
      [`${filePrefix}/demo-lib/index.tsx`, demoLibSrc],
    ];

    // Dispose?
    allTypes.map(([path, content]) => {
      return monaco.languages.typescript.typescriptDefaults.addExtraLib(
        content,
        path
      );
    });

    typesLoaded = true;
  }, [monaco]);
};
