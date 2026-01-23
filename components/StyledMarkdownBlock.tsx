/* eslint-disable linebreak-style */
/* eslint-disable react-hooks/rules-of-hooks */

import React from 'react';
import Markdown from 'markdown-to-jsx';
import Link from 'next/link';
import Image from 'next/image';
import JsonEditor from '~/components/JsonEditor';
import Code from '~/components/Code';
import { FullMarkdownContext } from '~/context';
import {
  Headline1,
  Headline2,
  Headline3,
  Headline4,
} from '~/components/Headlines';
import classnames from 'classnames';
import { checkHasContent } from '~/lib/markdownUtils';
import { TableOfContent } from '~/components/TableOfContentMarkdown';

interface StyledMarkdownBlockProps {
  markdown: string;
}

export const StyledMarkdownBlock = ({ markdown }: StyledMarkdownBlockProps) => {
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
            code: {
              component: ({ children, className }) => {
                const isInline = !className?.includes('lang-');
                if (isInline) {
                  // Wrap inline code in a span with break-words
                  return (
                    <span className='break-words inline'>
                      <Code>{children}</Code>
                    </span>
                  );
                }
                return <Code>{children}</Code>;
              },
            },
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
                <summary className='bg-slate-100 dark:bg-slate-700 -mx-4 p-4 rounded-xl my-3 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200'>
                  {children}
                </summary>
              ),
            },
            details: {
              component: ({ children }) => {
                return (
                  <details className='bg-slate-50 dark:bg-slate-800 p-0 rounded-xl my-3 px-4'>
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
                  <div className='text-h2mobile md:text-h2 text-center p-10 py-16 font-semibold text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 mb-4 rounded-xl'>
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
                return <TableOfContent depth={depth} />;
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
