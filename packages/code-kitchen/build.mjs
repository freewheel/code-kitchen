#!/usr/bin/env zx
/* eslint-disable no-undef */
import "zx/globals";
import fs from "fs";

await $`rimraf dist`;

// Build with [tsup](https://tsup.egoist.sh)
await $`tsup src/index.ts --format cjs,esm --dts-resolve`;

await $`mv dist/index.css dist/styles.css`;

// Prepare package.json file
const packageJson = fs.readFileSync("package.json", "utf8");
const glob = JSON.parse(packageJson);
Object.assign(glob, {
  main: "./index.js",
  module: "./index.mjs",
  types: "./index.d.ts",
});

fs.writeFileSync("dist/package.json", JSON.stringify(glob, null, 2));

await $`cp ../../LICENSE ../../readme.md ../../NOTICE.md dist`;
