/* eslint-disable linebreak-style */
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useContext, useEffect, useState } from 'react';
import Markdown from 'markdown-to-jsx';
import Link from 'next/link';
import slugifyMarkdownHeadline from '~/lib/slugifyMarkdownHeadline';
import JsonEditor from '~/components/JsonEditor';
import getFindResultsByGlobalRegExp from '~/lib/getFindResultsByGlobalRegExp';
import Code from '~/components/Code';
import { FullMarkdownContext } from '~/context';
import Image from 'next/image';

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
                    'border-blue-400 text-blue-500 bg-blue-50 dark:bg-slate-900 dark:text-white':
                      isActive,
                    'border-white/0 cursor-pointer dark:text-white text-slate-700 hover:border-blue-50  hover:bg-blue-50/20':
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
      <div className='border-slate-100 mb-4 p-6 from-slate-50/50 to-slate-50/100 rounded-xl bg-gradient-to-b dark:from-slate-700/50 dark:to-slate-900/50'>
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
          forceBlock: true,
          overrides: {
            h1: { component: Headline1 },
            h2: { component: Headline2 },
            h3: { component: Headline3 },
            h4: { component: Headline4 },
            strong: {
              component: ({ children }) => (
                <strong className='font-semibold text-slate-800 dark:text-slate-200'>
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
                <p className='text-slate-600 block leading-7 pb-4 dark:text-slate-300'>
                  {children}
                </p>
              ),
            },
            specialBox: {
              component: ({ children }) => {
                return (
                  <div className='bg-blue-200 border-l-4 border-blue-500 px-4 py-1 relative text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200'>
                    {children}
                  </div>
                );
              },
            },

            a: {
              component: ({ children, href, title, className }) => {
                if (!href) return children;

                // Check if the existing className starts with 'plausible-event-name'
                const additionalClass =
                  className && className.startsWith('plausible-event-name')
                    ? className
                    : '';

                // Define the base className
                const baseClassName = 'text-blue-500 hover:text-blue-600';

                // Combine the base className with the additionalClass if it exists
                const combinedClassName =
                  `${baseClassName} ${additionalClass}`.trim();

                const link =
                  href.charAt(0) === '/' ? (
                    <Link
                      as={href}
                      href='/'
                      title={title}
                      className={combinedClassName} // Use the combined className
                    >
                      {children}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      title={title}
                      className={combinedClassName} // Use the combined className
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
                <li className='mt-1 leading-7 text-slate-600 dark:text-slate-300'>
                  {children}
                </li>
              ),
            },
            table: {
              component: ({ children }) => (
                <div className='max-w-[100%] mx-auto mb-8 overflow-auto'>
                  <table className='table-auto'>{children}</table>
                </div>
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
                <th className='border border-slate-300 dark:text-white p-4 dark:bg-slate-900 font-semibold text-black'>
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
                <tr className='even:bg-blue-50 dark:even:bg-slate-900 even:bg-opacity-40'>
                  {children}
                </tr>
              ),
            },
            code: { component: Code },
            pre: ({ children }) => {
              const language = children?.props?.className;
              const isJsonCode = language === 'lang-json';
              const isJsoncCode = language === 'lang-jsonc';
              const code = children?.props?.children;

              if (isJsonCode) {
                return <JsonEditor initialCode={code} />;
              }

              if (isJsoncCode) {
                return <JsonEditor initialCode={code} isJsonc={true} />;
              }

              // Use JsonEditor for regular code blocks
              return <JsonEditor language={language} code={code} />;
            },
            blockquote: {
              component: ({ children }) => (
                <div className='bg-slate-50/50 dark:bg-slate-700 px-4 pt-4 mt-2 mb-4 border-l-2 border-slate-300'>
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
            userevent: {
              component: ({ children, type }) => {
                // Use React.Children.map to iterate over each child element
                const modifiedChildren = React.Children.map(
                  children,
                  (child) => {
                    // Clone each child element
                    const clonedChild = React.cloneElement(child, {
                      // Append the type class to the existing className
                      className: classnames(child.props.className, type),
                    });

                    return clonedChild;
                  },
                );

                return <>{modifiedChildren}</>;
              },
            },
            Star: {
              component: ({ label }) => {
                return (
                  <div className='flex flex-row items-center text-blue-500 text-lg font-semibold mb-6 mt-10'>
                    <Image
                      src='/icons/star.svg'
                      width={20}
                      height={20}
                      className='mr-2 mb-1'
                      alt='star'
                    />
                    {label}
                  </div>
                );
              },
            },
            StarInline: {
              component: ({ label }) => {
                return (
                  <div className='inline-flex flex-row items-center text-blue-500 font-semibold'>
                    <Image
                      src='/icons/info-yellow.svg'
                      className='mr-1'
                      width={12}
                      height={12}
                      alt='info yellow'
                    />
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
                    <div className='flex flex-row items-center mb-6 bg-amber-100 px-6 py-4 border border-amber-100 rounded text-slate-500 leading-7'>
                      <Image
                        src='/icons/info-yellow.svg'
                        className='h-7 w-7 mr-3'
                        width={28}
                        height={28}
                        alt='info yellow'
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
                      <div className='bg-blue-100 dark:bg-slate-950 dark:text-white inline-block text-sm rounded-t-lg px-6 py-1 text-blue-600'>
                        {label}
                      </div>
                    )}
                    <div className='flex flex-row items-center mb-6 bg-blue-50 px-6 py-4 border border-blue-100 rounded dark:bg-slate-900 dark:text-slate-300 text-slate-600 leading-7'>
                      <Image
                        src='/icons/info-blue.svg'
                        className='mr-3'
                        width={28}
                        height={28}
                        alt='info blue'
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
                      <Image
                        src='/icons/bulb.svg'
                        className='mr-3'
                        width={28}
                        height={28}
                        alt='bulb'
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
                      <Image
                        src='/icons/warning.svg'
                        className='mr-3'
                        width={28}
                        height={28}
                        alt='warning'
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
            Regularquote: {
              component: ({ children }) => {
                return (
                  <div className='text-2xl my-5 mx-8 border-gray-300 bg-gray-300 dark:bg-gray-300 p-4 p-t-6 text-center dark:text-slate-800 rounded-xl'>
                    {children}
                  </div>
                );
              },
            },
            tableofcontent: {
              component: ({ depth }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const fullMarkdown = useContext(FullMarkdownContext);
                if (!fullMarkdown) return null;
                return (
                  <>
                    <div className='flex flex-row gap-2 text-slate-600 dark:text-slate-300 text-h5 max-sm:text-[1rem]  items-center'>
                      <Image
                        src={'/icons/toc-menu.svg'}
                        height={'15'}
                        width={'15'}
                        alt='menu-icon'
                        className='max-sm:w-3 max-sm:h-3'
                      />
                      <span>Table of Contents</span>
                    </div>
                    <div className='mt-2 bg-slate-50 dark:bg-slate-900 pt-6 pb-3 pr-3 border border-r-0 border-y-0 border-l-blue-400/40 border-l-[2.5px]'>
                      <TableOfContentMarkdown
                        markdown={fullMarkdown}
                        depth={depth}
                      />
                    </div>
                  </>
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
                  className='flex cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-6  font-medium'
                >
                  {children}
                </a>
              );
            },
          },

          /* eslint-disable */
          h2:
            depth === 0
              ? {
                  component: ({ children }) => {
                    const slug = slugifyMarkdownHeadline(children);
                    return (
                      <a
                        href={`#${slug}`}
                        className='block cursor-pointer mb-3 text-slate-600  dark:text-slate-300 leading-5 font-medium ml-4'
                      >
                        {children}
                      </a>
                    );
                  },
                }
              : depth >= 2
                ? {
                    component: ({ children }) => {
                      const slug = slugifyMarkdownHeadline(children);
                      const [isChrome, setIsChrome] = useState(false);

                      useEffect(() => {
                        const chromeCheck =
                          /Chrome/.test(navigator.userAgent) &&
                          /Google Inc/.test(navigator.vendor);
                        setIsChrome(chromeCheck);
                      }, []);

                      return (
                        // chromeClass
                        <a
                          href={`#${slug}`}
                          className={`block cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-4 ] max-sm:-ml-[6px] font-medium ${isChrome ? '-ml-[4.8px]' : '-ml-[6.5px]'}`}
                        >
                          <span className='mr-1 text-blue-400 text-[0.7em]'>
                            &#9679;
                          </span>
                          {children}
                        </a>
                      );
                    },
                  }
                : { component: () => null },
          h3:
            depth >= 3
              ? {
                  component: ({ children }) => {
                    const slug = slugifyMarkdownHeadline(children);
                    return (
                      <a
                        href={`#${slug}`}
                        className='flex flex-row items-center cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-4 ml-[-0.25rem]'
                      >
                        <span className='text-blue-400/40 font-extrabold text-[0.8em] max-sm:text-[1.2em] ml-1'>
                          &mdash;&mdash;
                        </span>
                        <span className='mr-1 text-blue-400/90 text-[0.7em] flex justify-center items-center'>
                          &#9679;
                        </span>

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
                        className='flex flex-row items-center cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-4 ml-[-0.25rem] '
                      >
                        <span className='text-blue-400/40 font-extrabold text-[0.8em] ml-1 max-sm:text-[1.2em]'>
                          &mdash;&mdash;&mdash;&mdash;
                        </span>
                        <span className='mr-1 text-blue-400/90 text-[0.7em] flex justify-center items-center'>
                          &#9679;
                        </span>

                        {children}
                      </a>
                    );
                  },
                }
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
            'Regularquote',
            'specialBox',
            'Infobox',
            'Danger',
            'Warning',
            'Tip',
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
