/* eslint-disable react/prop-types */
import React from "react";

import { Playground } from "code-kitchen";
import { useInitMonaco } from "../components/use-init-monaco";
import dependencies from "../components/dependencies";

const customRequire = (key: string) => {
  const res = (dependencies as any)[key];

  if (res) {
    return res;
  }

  throw new Error("DEP: " + key + " not found");
};

const files = [
  {
    code: `
import React from "react";
import { MovingDot } from "demo-lib";

import styles from "./styles.module.css";

export default () => {
  return (
    <div className={styles.container}>
      <MovingDot color="white" size={50}>
        <div className={styles.tada}>🎉</div>
      </MovingDot>
    </div>
  );
};
  `,
    filename: "App.tsx",
  },
  {
    code: `
.container {
  background: #aaa;
  cursor: none;
  user-select: none;
  min-height: 160px;
  height: 100%;
}

.container:active > div {
  filter: brightness(0.9);
}

.tada {
  font-size: 20px;
}`,
    filename: "styles.module.css",
  },
];

export default function PlaygroundPage() {
  useInitMonaco();
  const id = React.useId();
  return (
    <Playground
      id={id}
      name="Playground"
      className="h-screen"
      require={customRequire}
      initialFiles={files}
    />
  );
}
