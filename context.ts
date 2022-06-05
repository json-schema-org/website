import React from 'react'

export enum BlockContextValue {
  Infobox,
  CodeBlock,
  Details
}

export const BlockContext = React.createContext<BlockContextValue | null>(null)