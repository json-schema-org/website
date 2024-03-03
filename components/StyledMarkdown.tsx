import React, { useContext } from 'react';
import Markdown from 'markdown-to-jsx';
import Link from 'next/link';
import slugifyMarkdownHeadline from '~/lib/slugifyMarkdownHeadline';
import JsonEditor from '~/components/JsonEditor';
import getFindResultsByGlobalRegExp from '~/lib/getFindResultsByGlobalRegExp';
import Highlight from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import Code from '~/components/Code';
import { FullMarkdownContext } from '~/context';

import {
  Headline1,
  Headline2,
  Headline3,
  Headline4,
} from '~/components/Headlines';
import classnames from 'classnames';

const REGEX_TAB_GROUPS =
  /\[tabs-start\s*"(?<label>.*)"\]((?!\[tabs-start).|\n)*\[tabs-end\]/gm;

type Element = {
  type: 'markdown' | 'tabs-group';
  markdown: string;
};
function transformMarkdownLinks(markdown: string): string {
  const linkDefinitions: Record<string, string> = {};

  // Extract and remove link definitions
  markdown = markdown.replace(
    /^\[([^\]]+)\]:\s*(.+)$/gm,
    (_, key: string, value: string) => {
      linkDefinitions[key.toLowerCase()] = value;
      return '';
    },
  );

  // Replace reference-style links with inline links
  return markdown.replace(
    /\[([^\]]+)\]\[([^\]]*)\]/g,
    (_, text: string, id: string) => {
      const link = linkDefinitions[id.toLowerCase()];
      if (link) {
        return `[${text}](${link})`;
      }
      return _; // Return the original string if no link is found
    },
  );
}

export default function StyledMarkdown({ markdown }: { markdown?: string }) {
  if (!markdown) return null;

  markdown = transformMarkdownLinks(markdown);

  const sortedTabGroups = (
    getFindResultsByGlobalRegExp(markdown, REGEX_TAB_GROUPS) || []
  ).sort((a, b) => (a.index < b.index ? -1 : 1));
  let textCuts = sortedTabGroups.map((tabGroup) => ({
    index: tabGroup.index,
    length: tabGroup.match.length,
  }));

  let elements: Element[] = [];
  let startIndex = 0;
  let sliceMore = true;

  do {
    const endIndex = textCuts[0]?.index || Infinity;
    const length = endIndex - startIndex;
    const slicedMarkdown = markdown.substr(startIndex, length);
    if (slicedMarkdown.length > 0) {
      const markdownElement: Element = {
        type: 'markdown',
        markdown: slicedMarkdown,
      };
      elements = [...elements, markdownElement];
    }

    if (textCuts[0]) {
      const tabsGroupElement: Element = {
        type: 'tabs-group',
        markdown: markdown.substr(textCuts[0].index, textCuts[0].length),
      };
      elements = [...elements, tabsGroupElement];
      startIndex = textCuts[0].index + textCuts[0].length;
      textCuts = textCuts.slice(1);
    } else {
      sliceMore = false;
    }
  } while (sliceMore);

  return (
    <div className='flex-1 min-w-0'>
      {elements.map((tabOrMarkup, index) => {
        if (tabOrMarkup.type === 'markdown') {
          return (
            <StyledMarkdownBlock key={index} markdown={tabOrMarkup.markdown} />
          );
        }
        return <TabsGroup key={index} markdown={tabOrMarkup.markdown} />;
      })}
    </div>
  );
}

const TAB_REGEX = /(?<=\[tab )\s*"(?<label>.*)"\](?<markdown>(.|\n)*?)\[tab/gm;

const TabsGroup = ({ markdown }: { markdown: string }) => {
  const groupLabel: string | null =
    getFindResultsByGlobalRegExp(markdown, REGEX_TAB_GROUPS)?.[0]?.groups?.find(
      (g) => g.name === 'label',
    )?.match || null;

  const tabs = getFindResultsByGlobalRegExp(markdown, TAB_REGEX).map((tab) => {
    const label = tab.groups?.find((g) => g.name === 'label')?.match || '';
    const markdown = (
      tab.groups?.find((g) => g.name === 'markdown')?.match || ''
    ).trim();
    return { label, markdown };
  });

  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const activeTab = tabs[activeTabIndex];

  return (
    <div>
      <div className='flex flex-row items-end mt-4'>
        {groupLabel && (
          <div className='p-4 text-slate-400 mr-4 text-sm'>{groupLabel}:</div>
        )}
        <div className='flex flex-row'>
          {tabs.map((tab, index) => {
            const isActive = index === activeTabIndex;
            return (
              <div
                key={index}
                onClick={() => setActiveTabIndex(index)}
                className={classnames(
                  'p-4 px-6 text-slate-700 font-medium border-b-2 rounded-t-lg',
                  {
                    'border-blue-400 text-blue-500 bg-blue-50': isActive,
                    'border-white/0 cursor-pointer text-slate-700 hover:border-blue-50 hover:bg-blue-50/20':
                      !isActive,
                  },
                )}
              >
                {tab.label}
              </div>
            );
          })}
        </div>
      </div>
      <div className='border-slate-100 mb-4 p-6 from-slate-50/50 to-slate-50/100 rounded-xl bg-gradient-to-b'>
        <StyledMarkdownBlock markdown={activeTab.markdown} />
      </div>
    </div>
  );
};

const StyledMarkdownBlock = ({ markdown }: { markdown: string }) => {
  return (
    <FullMarkdownContext.Provider value={markdown}>
      <Markdown
        options={{
          overrides: {
            h1: { component: Headline1 },
            h2: { component: Headline2 },
            h3: { component: Headline3 },
            h4: { component: Headline4 },
            strong: {
              component: ({ children }) => (
                <strong className='font-semibold text-slate-800'>
                  {children}
                </strong>
              ),
            },
            italic: {
              component: ({ children }) => <i>{children}</i>,
            },
            bold: {
              component: ({ children }) => <b>{children}</b>,
            },
            p: {
              component: ({ children }) => (
                <p className='text-slate-600 block leading-7 pb-4'>
                  {children}
                </p>
              ),
            },
            a: {
              component: ({ children, href, title }) => {
                if (!href) return children;
                const link =
                  href.charAt(0) === '/' ? (
                    <Link
                      as={href}
                      href='/'
                      title={title}
                      className='text-blue-500 hover:text-blue-600'
                    >
                      {children}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      title={title}
                      className='text-blue-500 hover:text-blue-600'
                    >
                      {children}
                    </a>
                  );

                return <>{link}</>;
              },
            },
            ol: {
              component: ({ children }) => (
                <ol className='list-decimal mt-2 mb-4 ml-5'>{children}</ol>
              ),
            },
            ul: {
              component: ({ children }) => (
                <ul className='mt-2 mb-4 list-disc list-outside ml-5'>
                  {children}
                </ul>
              ),
            },
            li: {
              component: ({ children }) => (
                <li className='mt-1 leading-7 text-slate-600'>{children}</li>
              ),
            },
            table: {
              component: ({ children }) => (
                <table className='table-auto mb-8'>{children}</table>
              ),
            },
            thead: {
              component: ({ children }) => {
                const isEmpty = !checkHasContent(children);
                if (isEmpty) return null;
                return (
                  <thead className='table-auto bg-slate-100'>{children}</thead>
                );
              },
            },
            th: {
              component: ({ children }) => (
                <th className='border border-slate-300 p-4 font-semibold'>
                  {children}
                </th>
              ),
            },
            td: {
              component: ({ children, rowSpan }) => (
                <td className='border border-slate-200 p-4' rowSpan={rowSpan}>
                  {children}
                </td>
              ),
            },
            tr: {
              component: ({ children }) => (
                <tr className='even:bg-blue-50 even:bg-opacity-40'>
                  {children}
                </tr>
              ),
            },
            code: { component: Code },
            pre: ({ children }) => {
              const language = children?.props?.className;
              const isJsonCode = language === 'lang-json';
              const code = children?.props?.children;
              if (isJsonCode) {
                return <JsonEditor initialCode={code} />;
              }

              return (
                <div className='overflow-x-auto flex-basis-0 max-w-full min-w-0 shrink max-w-[100%] max-w-screen-sm lg:max-w-[800px] xl:max-w-[900px]'>
                  {/* definitely not the best way to prevent overflowing. found no better way that worked */}
                  <Highlight
                    language={language}
                    wrapLines={true}
                    wrapLongLines={true}
                    customStyle={{
                      borderRadius: 10,
                      paddingTop: 15,
                      paddingBottom: 10,
                      paddingLeft: 10,
                      marginBottom: 20,
                      maxWidth: '100%',
                    }}
                    lineNumberStyle={{
                      marginRight: 10,
                    }}
                    style={atomOneDark}
                    showLineNumbers
                    startingLineNumber={1}
                    lineProps={() => {
                      const isHighlighted = false;
                      return {
                        className: `${isHighlighted ? 'bg-code-editor-dark-highlight block ml-10 w-full' : ''} pr-8`,
                      };
                    }}
                    codeTagProps={{
                      className: 'mr-8',
                    }}
                  >
                    {code}
                  </Highlight>
                </div>
              );
            },
            blockquote: {
              component: ({ children }) => (
                <div className='bg-slate-50/50 px-4 pt-4 mt-2 mb-4 border-l-2 border-slate-300'>
                  {children}
                </div>
              ),
            },
            summary: {
              component: ({ children }) => (
                <summary className='bg-slate-100 -mx-4 p-4 rounded-xl my-3 cursor-pointer hover:bg-slate-200'>
                  {children}
                </summary>
              ),
            },
            details: {
              component: ({ children }) => {
                return (
                  <details className='bg-slate-50 p-0 rounded-xl my-3 px-4'>
                    {children}
                  </details>
                );
              },
            },
            Star: {
              component: ({ label }) => {
                return (
                  <div className='flex flex-row items-center text-blue-500 text-lg font-semibold mb-6 mt-10'>
                    <img src='/icons/star.svg' className='h-5 w-5 mr-2 mb-1' />
                    {label}
                  </div>
                );
              },
            },
            StarInline: {
              component: ({ label }) => {
                return (
                  <div className='inline-flex flex-row items-center text-blue-500 font-semibold'>
                    <img src='/icons/star.svg' className='h-3 w-3 mr-1' />
                    {label}
                  </div>
                );
              },
            },
            Warning: {
              component: ({ children, label }) => {
                return (
                  <div className='my-2'>
                    {label && (
                      <div className='bg-amber-100 inline-block text-sm rounded-t-lg px-6 py-1 text-amber-600'>
                        {label}
                      </div>
                    )}
                    <div className='flex flex-row items-center mb-6 bg-amber-50 px-6 py-4 border border-amber-100 rounded text-slate-600 leading-7'>
                      <img
                        src='/icons/info-yellow.svg'
                        className='h-7 w-7 mr-3'
                        alt=''
                      />
                      <div className='font'>{children}</div>
                    </div>
                  </div>
                );
              },
            },
            Infobox: {
              component: ({ children, label }) => {
                return (
                  <div className='my-2'>
                    {label && (
                      <div className='bg-blue-100 inline-block text-sm rounded-t-lg px-6 py-1 text-blue-600'>
                        {label}
                      </div>
                    )}
                    <div className='flex flex-row items-center mb-6 bg-blue-50 px-6 py-4 border border-blue-100 rounded text-slate-600 leading-7'>
                      <img
                        src='/icons/info-blue.svg'
                        className='h-7 w-7 mr-3'
                        alt=''
                      />
                      <div className='font'>{children}</div>
                    </div>
                  </div>
                );
              },
            },
            Tip: {
              component: ({ children, label }) => {
                return (
                  <div className='my-2'>
                    {label && (
                      <div className='bg-green-100 inline-block text-sm rounded-t-lg px-6 py-1 text-green-600'>
                        {label}
                      </div>
                    )}
                    <div className='flex flex-row items-center mb-6 bg-green-50 px-6 py-4 border border-green-100 rounded text-slate-600 leading-7'>
                      <img
                        src='/icons/bulb.svg'
                        className='h-7 w-7 mr-3'
                        alt=''
                      />
                      <div className='font'>{children}</div>
                    </div>
                  </div>
                );
              },
            },
            Danger: {
              component: ({ children, label }) => {
                return (
                  <div className='my-2'>
                    {label && (
                      <div className='bg-red-100 inline-block text-sm rounded-t-lg px-6 py-1 text-red-600'>
                        {label}
                      </div>
                    )}
                    <div className='flex flex-row items-center mb-6 bg-red-50 px-6 py-4 border border-red-100 rounded text-slate-600 leading-7'>
                      <img
                        src='/icons/warning.svg'
                        className='h-7 w-7 mr-3'
                        alt=''
                      />
                      <div className='font'>{children}</div>
                    </div>
                  </div>
                );
              },
            },
            Keywords: {
              component: () => null,
            },
            Bigquote: {
              component: ({ children }) => {
                return (
                  <div className='text-h2mobile md:text-h2 text-center p-10 py-16 font-semibold text-slate-500 bg-slate-50 mb-4 rounded-xl'>
                    "{children}"
                  </div>
                );
              },
            },
            TableOfContent: {
              component: ({ depth }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const fullMarkdown = useContext(FullMarkdownContext);
                if (!fullMarkdown) return null;
                return (
                  <div className='text-blue-500 mt-3 bg-slate-50 pt-6 pb-3 px-3 rounded-l border-l-blue-400 border-l-[3px]'>
                    <TableOfContentMarkdown
                      markdown={fullMarkdown}
                      depth={depth}
                    />
                  </div>
                );
              },
            },
          },
        }}
      >
        {markdown}
      </Markdown>
    </FullMarkdownContext.Provider>
  );
};

export function TableOfContentMarkdown({
  markdown,
  depth = 2,
}: {
  markdown: string;
  depth?: number;
}) {
  return (
    <Markdown
      options={{
        overrides: {
          h1: {
            component: ({ children }) => {
              const slug = slugifyMarkdownHeadline(children);
              return (
                <a
                  href={`#${slug}`}
                  className='block cursor-pointer mb-3 text-sm leading-4 text-slate-700 hover:text-blue-500'
                >
                  {children}
                </a>
              );
            },
          },
          h2: {
            component: ({ children }) => {
              const slug = slugifyMarkdownHeadline(children);
              return (
                <a
                  href={`#${slug}`}
                  className='block cursor-pointer mb-3 text-sm leading-4 ml-3 hover:text-blue-500'
                >
                  {children}
                </a>
              );
            },
          },
          /* eslint-disable */
          h3:
            depth >= 3
              ? {
                  component: ({ children }) => {
                    const slug = slugifyMarkdownHeadline(children);
                    return (
                      <a
                        href={`#${slug}`}
                        className='block cursor-pointer mb-3 text-sm leading-4 ml-7 hover:text-blue-500'
                      >
                        {children}
                      </a>
                    );
                  },
                }
              : { component: () => null },
          h4:
            depth >= 4
              ? {
                  component: ({ children }) => {
                    const slug = slugifyMarkdownHeadline(children);
                    return (
                      <a
                        href={`#${slug}`}
                        className='block cursor-pointer mb-3 text-sm leading-4 ml-10 hover:text-blue-500'
                      >
                        {children}
                      </a>
                    );
                  },
                } /* eslint-enable */
              : { component: () => null },
          ...hiddenElements(
            'strong',
            'p',
            'a',
            'ul',
            'li',
            'table',
            'code',
            'pre',
            'blockquote',
            'span',
            'div',
            'figure',
            'Bigquote',
          ),
        },
      }}
    >
      {markdown}
    </Markdown>
  );
}

const hiddenElements = (...elements: string[]) => {
  return elements.reduce((acc, element) => {
    return {
      ...acc,
      [element]: { component: () => null },
    };
  }, {});
};

const checkHasContent = (reactNode: React.ReactChild) => {
  if (!reactNode) return false;
  if (typeof reactNode === 'string' || typeof reactNode === 'number')
    return true;
  if ((reactNode?.props?.children || []).length === 0) return false;
  return reactNode.props.children.reduce(
    (acc: boolean, reactNode: React.ReactChild) => {
      if (acc) return acc;
      return checkHasContent(reactNode);
    },
    false,
  );
};
