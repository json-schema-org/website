import React from 'react'

export enum BlockContextValue {
  Infobox,
  CodeBlock,
  Details
}

export const SectionContext = React.createContext<null | 'learn' | 'docs' | 'implementations' | 'blog' | 'community' | 'specification'>(null)
export const BlockContext = React.createContext<BlockContextValue | null>(null)
export const FullMarkdownContext = React.createContext<string | null>(null)