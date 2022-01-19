import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from 'styled-components';
import type { AppProps } from 'next/app';
import { GlobalStyle, theme } from 'app/core/theme';
import { RecoilRoot } from 'recoil';
import LoadingModal from 'app/core/components/LoadingModal';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <RecoilRoot>
          <LoadingModal />
          <Component {...pageProps} />
        </RecoilRoot>
      </ThemeProvider>
    </>
  );
}
