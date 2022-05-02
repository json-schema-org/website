import React from 'react'
import Markdown from 'markdown-to-jsx'
import Link from 'next/link'
import slugifyMarkdownHeadline from '~/lib/slugifyMarkdownHeadline'
import JsonEditor from '~/components/JsonEditor'
import {
  Headline1
} from '~/components/Content'

const filterFragment = (children: any[]) => {
  return children.map(child => {
    if (typeof child !== 'string') return child
    return child.replace(/\[#(\w|-|_)*\]/g, '')
  })
}

export default function StyledMarkdown ({ markdown }: { markdown: string }) {
  return (
    <Markdown
      options={{
        overrides: {
          h1: {
            component: ({ children }) => {
              const slug = slugifyMarkdownHeadline(children)
              return <Headline1 slug={slug}>{filterFragment(children)}</Headline1>
            }
          },
          h2: {
            component: ({ children }) => {
              const slug = slugifyMarkdownHeadline(children)
              console.log('slug', slug)
              return (
                <h2 className='text-2xl font-semibold mt-10 mb-4' id={slug}>
                  {filterFragment(children)}
                </h2>
              )
            }
          },
          h3: {
            component: ({ children }) => {
              const slug = slugifyMarkdownHeadline(children)
              return (
                <h3 className='text-xl font-semibold mt-6 mb-2' id={slug}>
                  {filterFragment(children)}
                </h3>
              )
            }
          },
          strong: {
            component: ({ children }) => <strong className='font-semibold text-slate-800'>{children}</strong>
          },
          p: {
            component: ({ children }) => (
              <p className='text-slate-600 leading-7 pb-4'>
                {children}
              </p>
            )
          },
          a: {
            component: ({ children, href, title }) => {
              if (!href) return children
              return (
                <Link href={href}>
                  <a title={title} className='text-blue-500 hover:text-blue-600'>{children}</a>
                </Link>
              )
            }
          },
          ul: {
            component: ({ children }) => (
              <ul className='mt-2 mb-4 list-disc list-inside ml-3'>
                {children}
              </ul>
            )
          },
          li: {
            component: ({ children }) => (
              <li className='mt-1'>
                {children}
              </li>
            )
          },
          table: {
            component: ({ children }) => ( <table className='table-auto mb-8'>{children}</table>)
          },
          thead: {
            component: ({ children }) => {
              const isEmpty = !checkHasContent(children)
              if (isEmpty) return null
              return ( <thead className='table-auto bg-slate-100'>{children}</thead>)
            }
          },
          th: {
            component: ({ children }) => ( <th className='border border-slate-300 p-4 font-semibold'>{children}</th>)
          },
          td: {
            component: ({ children }) => ( <td className='border border-slate-200 p-4'>{children}</td>)
          },
          tr: {
            component: ({ children }) => ( <tr className='even:bg-blue-50 even:bg-opacity-40'>{children}</tr>)
          },
          code: {
            component: ({ children }) => (
              <code className='font-mono bg-slate-100 rounded px-1.5 py-0.5 '>
                {children}
              </code>
            )
          },
          pre: ({ children }) => {
            const isJsonCode = children?.props?.className === 'lang-json'
            const code = children?.props?.children
            if (isJsonCode) {
              return (
                <JsonEditor initialCode={code} />
              )
            }

            return (
              <pre>
                {children}
              </pre>
            )
          },
          blockquote: {
            component: ({ children }) => (
              <div className='bg-slate-50/50 px-4 pt-4 mt-2 mb-4 border-l-2 border-slate-300'>
                {children}
              </div>
            )
          },
        }
      }}
    >
      {markdown}
    </Markdown>
  )
}

export function TableOfContentMarkdown ({ markdown }: { markdown: string }) {
  return (
    <Markdown
      options={{
        overrides: {
          h1: {
            component: ({ children }) => {
              const slug = slugifyMarkdownHeadline(children)
              return (
                <a
                  href={`#${slug}`}
                  className='block cursor-pointer mb-3 text-sm leading-5 hover:text-blue-500'
                >{children}</a>
              )
            }
          },
          h2: {
            component: ({ children }) => {
              const slug = slugifyMarkdownHeadline(children)
              return (
                <a
                  href={`#${slug}`}
                  className='block cursor-pointer mb-3 text-sm leading-6 ml-3 hover:text-blue-500'
                >{children}</a>
              )
            }
          }
        }
      }}
    >
      {markdown}
    </Markdown>
  )
}

const checkHasContent = (reactNode: React.ReactChild) => {
  if (!reactNode) return false
  if (typeof reactNode === 'string' || typeof reactNode === 'number') return true
  if ((reactNode?.props?.children || []).length === 0) return false
  return reactNode.props.children.reduce((acc: boolean, reactNode: React.ReactChild) => {
    if (acc) return acc
    return checkHasContent(reactNode)
  }, false)
}