import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import React from 'react'


function MyApp({ Component, pageProps }: { Component: any, pageProps: any }): JSX.Element {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page: JSX.Element) => page)

  return getLayout(<Component {...pageProps} />, pageProps)
}

export default MyApp