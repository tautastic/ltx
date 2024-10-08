import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link as="font" type="font/woff2" href="/fonts/inter-roman.var.woff2" crossOrigin="anonymous" />
          <link as="font" type="font/woff2" href="/fonts/inter-italic.var.woff2" crossOrigin="anonymous" />
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
