/* eslint-disable */
const path = require("path");
const rimraf = require("rimraf");

const visit = require("unist-util-visit");

const codeMetaPlugin = () => {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "code" && node.data && node.data.meta) {
        node.properties.metastring = node.data.meta;
      }
    });
  };
};

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [codeMetaPlugin],
    providerImportSource: "@mdx-js/react",
  },
});

const CopyWebpackPlugin = require("copy-webpack-plugin");

const withTM = require("next-transpile-modules")(["code-kitchen", "demo-lib"]);

const isProd = process.env.NODE_ENV === "production";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  basePath: process.env.BASE_PATH ?? "",
  swcMinify: false,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  assetPrefix: isProd ? "/code-kitchen/" : "",
  webpack: (config, { webpack }) => {
    const monacoEditorVersion = require("monaco-editor/package.json").version;
    const esbuildWasmVersion = require("esbuild-wasm/package.json").version;

    const publicLibDir = path.resolve(__dirname, "public/libs");
    const publicTypesDir = path.resolve(__dirname, "public/types");

    rimraf.sync(publicLibDir);
    rimraf.sync(publicTypesDir);

    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: require.resolve("esbuild-wasm/esbuild.wasm"),
            to: path.join(
              publicLibDir,
              `esbuild-wasm`,
              esbuildWasmVersion,
              `esbuild.wasm`
            ),
          },
          {
            from: path.join(
              path.dirname(require.resolve("monaco-editor/package.json")),
              "min"
            ),
            to: path.join(
              publicLibDir,
              `monaco-editor`,
              monacoEditorVersion,
              `min`
            ),
          },

          // also include React types
          {
            from: "react/**/*.d.ts",
            to({ context, absoluteFilename }) {
              return path.join(
                publicTypesDir,
                path.relative(context, absoluteFilename)
              );
            },
            context: "node_modules/@types",
          },

          // ... and demo lib src
          {
            from: path.resolve(__dirname, "../packages/demo-lib"),
            to: path.join(publicTypesDir, `demo-lib`),
          },
        ],
      })
    );
    return config;
  },
};

module.exports = withTM(withMDX(nextConfig));
