import { ThemeProvider } from 'styled-components';
import type { AppProps } from 'next/app';
import { GlobalStyle, theme } from 'app/core/theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
