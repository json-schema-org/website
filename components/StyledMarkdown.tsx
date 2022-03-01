import React from 'react'
import Markdown from 'markdown-to-jsx'

export default function StyledMarkdown ({ markdown }: { markdown: string }) {
  return (
    <Markdown
      options={{
        overrides: {
          h1: {
            component: ({ children }) => <h1 className='font-bold text-xl'>{ children }</h1>
          }
        }
      }}
    >
      {markdown}
    </Markdown>
  )
}