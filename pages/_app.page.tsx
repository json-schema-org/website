import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import React from 'react';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const getLayout = Component.getLayout || ((page: JSX.Element) => page);
  const AnyComponent = Component as any;
  return getLayout(<AnyComponent {...pageProps} />, pageProps);
}

export default MyApp;
