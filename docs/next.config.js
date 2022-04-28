/* eslint-disable */
module.exports = async () => {
  const path = require("path");
  const rimraf = require("rimraf");

  const CopyWebpackPlugin = require("copy-webpack-plugin");

  const withTM = require("next-transpile-modules")([
    "code-kitchen",
    "@code-kitchen/bundler",
    "demo-lib",
  ]);

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
    async redirects() {
      return [
        {
          source: "/",
          destination: "/home",
          permanent: false,
        },
      ];
    },
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
  return withTM(nextConfig);
};
