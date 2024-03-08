import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const getLayout = Component.getLayout || ((page: JSX.Element) => page);
  const AnyComponent = Component as any;
  return (
    <ThemeProvider attribute='class'>
      {getLayout(<AnyComponent {...pageProps} />, pageProps)}
    </ThemeProvider>
  );
}

export default MyApp;
