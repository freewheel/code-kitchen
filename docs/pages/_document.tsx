import * as React from "react";

import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // Check if in production
    const isProduction = process.env.NODE_ENV === "production";
    const initialProps = await Document.getInitialProps(ctx);
    // Pass isProduction flag back through props
    return { ...initialProps, isProduction };
  }

  render() {
    const { isProduction } = this.props as any;
    return (
      <Html>
        <Head>
          <link href="fonts/fonts.css" rel="stylesheet" />
          {isProduction && (
            <>
              <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-KLHBQKELR6"
              ></script>
              <script
                id="google-analytics"
                dangerouslySetInnerHTML={{
                  __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){window.dataLayer.push(arguments);}
                  gtag('js', new Date());
        
                  gtag('config', 'G-KLHBQKELR6');`,
                }}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
