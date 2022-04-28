/* eslint-disable react/prop-types */
import * as React from "react";
import Head from "next/head";
import Script from "next/script";

import "../styles/tailwind.css";

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
      <main className="max-w-3xl mx-auto py-12 px-8">
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default App;
