import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import React from 'react'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
