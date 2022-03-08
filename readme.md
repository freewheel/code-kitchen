# Code Kitchen 🧑‍🍳

**Code Kitchen** is a React live-coding playground which allows the developers to embed React component demos into a React UI library’s web documents.

Compared to other solutions, it supports the following features:

- Private source code dependencies support
- Multiple files in a single demo
- CSS (CSS modules) and JSON files
- A completely static solution without the need for a remote server
- Type hints in the code editor

## Demo 🎩

Check out the demo at <PLACEHOLDER>

## Usage

Install it with `npm install code-kitchen`.

Note: due to the size of esbuild-wasm and monaco-editor, they are not bundled with this library. By default they are loaded via jsDelivr CDN. You can configure this by calling `setup` in the runtime.

A minimum example is shown below.

```tsx
import * as React from "react";
import { Playground, setup } from "code-kitchen";

import * as privateLib from "my-private-lib";

const dependencies = {
  react: React,
  "my-private-lib": privateLib,
};

const customRequire = (key: string) => {
  const res = (dependencies as any)[key];

  if (res) {
    return res;
  }

  throw new Error("DEP: " + key + " not found");
};

// Two files for the demo playground
const files = [
  {
    code: `
import { Button } from "my-private-lib";
import "./styles.css";

export default function Demo() {
  return <Button>Button</Button>;
}
  `,
    filename: "App.jsx",
  },
  {
    code: `button { width: 200px; }`,
    filename: "styles.css",
  },
];

export default () => {
  return <Playground initialFiles={files} require={customRequire} />;
};
```

### With MDX

Most of the time you may want to use Code Kitchen in a MDX document. You can checkout `docs/components/MDXPlayground.mdx` as a real-life example.

## Project Structure

The project is a monorepo managed by pnpm.

```
├── docs # Documentation site
│   ├── components
│   │   └── MDXPlayground.tsx # configure Code Kitchen for MDX and how to load user-land types
│   └── pages
│       └── index.mdx # A real-life multi-file playground demo in MDX
└── packages
    ├── demo-lib # a private React UI library for demo purpose
    └── src # ⭐ the core source code for Code Kitchen
      ├── playground.tsx # the main playground component
      ├── bundle.ts # the in-browser bundler implemented by [esbuild-wasm](https://esbuild.github.io/api/#running-in-the-browser)
      ├── index.ts # the main library entry point
      └── use-monaco.ts # monaco-editor loader that wrapped into a React hook
```

# Local Development

## Prerequisites

- Node.js
- pnpm

## Install and start

```bash
# Under the root of the repository
pnpm i
pnpm dev
```

Now you will be able to preview the document in `localhost:3000`

## TODO

- [x] Bundle and publish scripts
- [ ] Modulation like "react-live"
- [ ] More Docs
- [x] Tests
- [ ] CICD
- [x] Customizable styles
- [ ] Vue support
- [ ] React HMR for playground to preserve states

# Q/A

## How the in-browser bundler works?

See [this explanation](./docs/pages/how-it-works.mdx)

# License

[Apache-2.0](/LICENSE) by FreeWheel
