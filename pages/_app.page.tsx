import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { inter, jetbrainsMono, sourceSerif } from '~/lib/fonts';

function MyApp({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const getLayout = Component.getLayout || ((page: JSX.Element) => page);
  const AnyComponent = Component as any;
  return (
    <div
      className={`${inter.variable} ${jetbrainsMono.variable} ${sourceSerif.variable}`}
    >
      <ThemeProvider attribute='class'>
        {getLayout(<AnyComponent {...pageProps} />, pageProps)}
      </ThemeProvider>
    </div>
  );
}

export default MyApp;
