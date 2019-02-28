import Document, { Head, Main, NextScript } from 'next/document';
import { getInitialProps, getStyles } from 'cf-style-nextjs';

export default class MyDocument extends Document {
  static getInitialProps = getInitialProps();

  render() {
    return <html>
        <Head>
          <title>Minesweeper</title>
          {/* <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" /> */}
          <style dangerouslySetInnerHTML={{ __html: `
                *{ box-sizing: border-box; }
                body { margin: 0; }
                html { font-family: 'Open Sans', sans-serif; }
               ` }} />
          {getStyles(this.props)}
          {/* <!-- Required meta tags --> */}
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
          <meta name="theme-color" content="#000000"/>
            {/* <!-- Bootstrap CSS --> */}
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"/>
          <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>;
  }
}
