import React from 'react'

export const Headline1 = ({ children, slug }: { children: React.ReactNode, slug?: string }) => (
  <h1 className='text-4xl font-bold mt-10 mb-6' id={slug}>{children}</h1>
)