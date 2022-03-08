/* eslint-disable react/prop-types */
import * as React from "react";
import Head from "next/head";
import Script from "next/script";

import "./tailwind.css";

import { MDXProvider } from "@mdx-js/react";
import { Playground } from "../components/MDXPlayground";

import * as mdxComponents from "../components/mdx";

const components = { Playground, ...mdxComponents };

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Code Kitchen</title>
        {process.env.NODE_ENV !== "production" && (
          <Script
            dangerouslySetInnerHTML={{
              __html: `  window.addEventListener('error', event => {
              event.stopImmediatePropagation()
            })
          
            window.addEventListener('unhandledrejection', event => {
              event.stopImmediatePropagation()
            })`,
            }}
          />
        )}
      </Head>
      <MDXProvider components={components}>
        <main className="max-w-3xl mx-auto py-12 px-8">
          <Component {...pageProps} />
        </main>
      </MDXProvider>
    </>
  );
};

export default App;
