import React from 'react';

export enum BlockContextValue {
  Information,
  CodeBlock,
  Details,
}

export const SectionContext = React.createContext<
  | null
  | 'learn'
  | 'docs'
  | 'implementers'
  | 'tools'
  | 'blog'
  | 'community'
  | 'specification'
  | 'overview'
  | 'getting-started'
  | 'reference'
>(null);
export const BlockContext = React.createContext<BlockContextValue | null>(null);
export const FullMarkdownContext = React.createContext<string | null>(null);
