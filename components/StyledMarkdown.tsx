import React, { useContext } from 'react'
import Markdown from 'markdown-to-jsx'
import Link from 'next/link'
import slugifyMarkdownHeadline from '~/lib/slugifyMarkdownHeadline'
import JsonEditor from '~/components/JsonEditor'
import getFindResultsByGlobalRegExp from '~/lib/getFindResultsByGlobalRegExp'

import {
  Headline1
} from '~/components/Content'
import classnames from 'classnames'

const filterFragment = (children: any[]) => {
  return children.map(child => {
    if (typeof child !== 'string') return child
    return child.replace(/\[#(\w|-|_)*\]/g, '')
  })
}

const REGEX_TAB_GROUPS = /\[tabs-start\s*"(?<label>.*)"\]((?!\[tabs-start).|\n)*\[tabs-end\]/gm

enum BlockContextValue {
  Infobox
}

type Element = {
  type: 'markdown' | 'tabs-group'
  markdown: string
}

const BlockContext = React.createContext<BlockContextValue | null>(null)

export default function StyledMarkdown ({ markdown }: { markdown: string }) {
  console.log('markdown', markdown, typeof markdown)


  const sortedTabGroups = (getFindResultsByGlobalRegExp(markdown, REGEX_TAB_GROUPS) || [])
    .sort((a, b) => a.index < b.index ? -1 : 1)
  let textCuts = sortedTabGroups.map(tabGroup => ({
    index: tabGroup.index,
    length: tabGroup.match.length
  }))

  let elements: Element[] = []
  let startIndex = 0
  let sliceMore = true

  do {
    const endIndex = textCuts[0]?.index || Infinity
    const length = endIndex - startIndex
    const slicedMarkdown = markdown.substr(startIndex, length)
    if (slicedMarkdown.length > 0) {
      const markdownElement: Element = {
        type: 'markdown',
        markdown: slicedMarkdown
      }
      elements = [...elements, markdownElement]
    }

    if (textCuts[0]) {
      const tabsGroupElement: Element = {
        type: 'tabs-group',
        markdown: markdown.substr(textCuts[0].index, textCuts[0].length)
      }
      elements = [...elements, tabsGroupElement]
      startIndex = textCuts[0].index + textCuts[0].length
      textCuts = textCuts.slice(1)
    } else {
      sliceMore = false
    }
  } while (sliceMore)

  return (
    <div>
      {elements.map((tabOrMarkup, index) => {
        if (tabOrMarkup.type === 'markdown') {
          return <StyledMarkdownBlock key={index} markdown={tabOrMarkup.markdown} />
        }
        return (
          <TabsGroup key={index} markdown={tabOrMarkup.markdown} />
        )
      })}
    </div>
  )

}

const TAB_REGEX = /(?<=\[tab )\s*"(?<label>.*)"\](?<markdown>(.|\n)*?)\[tab/gm

const TabsGroup = ({ markdown }: { markdown: string }) => {
  const groupLabel: string | null = getFindResultsByGlobalRegExp(markdown, REGEX_TAB_GROUPS)
    ?.[0]?.groups?.find(g => g.name === 'label')?.match || null

  const tabs = getFindResultsByGlobalRegExp(markdown, TAB_REGEX)
    .map(tab => {
      const label = tab.groups?.find(g => g.name === 'label')?.match || ''
      const markdown = (tab.groups?.find(g => g.name === 'markdown')?.match || '').trim()
      return { label, markdown }
    })

  const [activeTabIndex, setActiveTabIndex] = React.useState(0)
  const activeTab = tabs[activeTabIndex]


  return (
    <div>
      <div about='tabs-group-header' className='flex flex-row items-end mt-4'>
        {groupLabel && (
          <div className='p-4 text-slate-400 mr-4 text-sm'>
            {groupLabel}:
          </div>
        )}
        <div className='flex flex-row'>
          {tabs.map((tab, index) => {
            const isActive = index === activeTabIndex
            return (
              <div
                key={index}
                onClick={() => setActiveTabIndex(index)}
                className={classnames('p-4 px-6 text-slate-700 font-medium border-b-2 rounded-t-lg', {
                  'border-blue-400 text-blue-500 bg-blue-50': isActive,
                  'border-white/0 cursor-pointer text-slate-700 hover:border-blue-50 hover:bg-blue-50/20': !isActive
                })}
              >
                {tab.label}
              </div>
            )
          })}
        </div>
      </div>
      <div className='border-slate-100 mb-4 p-6 from-slate-50/50 to-slate-50/100 rounded-xl bg-gradient-to-b'>
        <StyledMarkdownBlock markdown={activeTab.markdown} />
      </div>
    </div>
  )
}

const StyledMarkdownBlock = ({ markdown }: { markdown: string }) => {
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
          h4: {
            component: ({ children }) => {
              const slug = slugifyMarkdownHeadline(children)
              return (
                <h4 className='font-semibold mt-4 mb-2' id={slug}>
                  {filterFragment(children)}
                </h4>
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
              <ul className='mt-2 mb-4 list-disc list-outside ml-5'>
                {children}
              </ul>
            )
          },
          li: {
            component: ({ children }) => (
              <li className='mt-1 leading-7'>
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
            component: ({ children }) => {
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const blockContext = useContext(BlockContext)
              return (
                <code
                  className={classnames('font-mono rounded px-1.5 py-0.5', {
                    'bg-slate-100': blockContext === null,
                    'bg-amber-200': blockContext === BlockContextValue.Infobox
                  })}
                >
                  {children}
                </code>
              )
            }
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
          Star: {
            component: ({ label }) => {
              return (
                <div className='flex flex-row items-center text-blue-500 text-lg font-semibold mb-6 mt-10'>
                  <img src='/icons/star.svg' className='h-5 w-5 mr-2 mb-1' />
                  {label}
                </div>
              )
            }
          },
          StarInline: {
            component: ({ label }) => {
              return (
                <div className='inline-flex flex-row items-center text-blue-500 font-semibold'>
                  <img src='/icons/star.svg' className='h-3 w-3 mr-1' />
                  {label}
                </div>
              )
            }
          },
          Infobox: {
            component: ({ children, label }) => {
              return (
                <BlockContext.Provider value={BlockContextValue.Infobox}>
                  <div className='my-2'>
                    <div className='bg-amber-100 inline-block text-sm rounded-t-lg px-6 py-1 text-amber-600'>
                      {label}
                    </div>
                    <div className='flex flex-row items-center mb-6 bg-amber-50 px-6 py-4 border border-amber-100 rounded text-slate-600 leading-7'>
                      <div className='font'>
                        {children}
                      </div>
                    </div>
                  </div>
                </BlockContext.Provider>
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
                  className='block cursor-pointer mb-3 text-sm leading-4 text-slate-700 hover:text-blue-500'
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
                  className='block cursor-pointer mb-3 text-sm leading-4 ml-3 hover:text-blue-500'
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