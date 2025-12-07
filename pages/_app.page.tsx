import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps }: AppProps) {
  // Use type assertion for getLayout since Next.js allows custom properties on components
  const getLayout =
    (
      Component as {
        getLayout?: (page: JSX.Element, pageProps?: unknown) => JSX.Element;
      }
    ).getLayout || ((page: JSX.Element) => page);
  return (
    <ThemeProvider attribute='class'>
      {getLayout(<Component {...pageProps} />, pageProps)}
    </ThemeProvider>
  );
}

export default MyApp;
