<<<<<<< HEAD
// <<<<<<< HEAD
// import '../styles/globals.css';
// import 'tailwindcss/tailwind.css';
// import React from 'react';
// import type { AppProps } from 'next/app';

// function MyApp({ Component, pageProps }: AppProps) {
//   // @ts-ignore
//   const getLayout = Component.getLayout || ((page: JSX.Element) => page);
//   const AnyComponent = Component as any;
//   return getLayout(<AnyComponent {...pageProps} />, pageProps);
// =======
=======
>>>>>>> 46ec3fa (resolved code)
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
<<<<<<< HEAD
  // >>>>>>> 932a9ad (added dark theme)
=======
>>>>>>> 46ec3fa (resolved code)
}

export default MyApp;
