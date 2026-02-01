/* eslint-disable linebreak-style */
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useContext, useEffect, useState } from 'react';
import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import slugifyMarkdownHeadline from '~/lib/slugifyMarkdownHeadline';
import { hiddenElements } from '~/lib/markdownUtils';
import { FullMarkdownContext } from '~/context';

interface TableOfContentMarkdownProps {
  markdown: string;
  depth?: number;
}

export function TableOfContentMarkdown({
  markdown,
  depth = 2,
}: TableOfContentMarkdownProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          let newActiveSection = null;

          sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top < 150 && section.id) {
              newActiveSection = section.id;
            }
          });

          setActiveSection(newActiveSection);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [markdown]);

  const getSectionClassName = (slug: string, defaultClass: string) => {
    const isActive = activeSection === slug;
    return `${defaultClass} ${isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}`;
  };

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
                  className={getSectionClassName(
                    slug,
                    'flex cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-6 font-medium',
                  )}
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
                        className={getSectionClassName(
                          slug,
                          'block cursor-pointer mb-3 text-slate-600 dark:text-slate-300 leading-5 font-medium ml-4',
                        )}
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
                        <a
                          href={`#${slug}`}
                          className={getSectionClassName(
                            slug,
                            `block cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-4 max-sm:-ml-[6px] font-medium ${isChrome ? '-ml-[4.8px]' : '-ml-[6.5px]'}`,
                          )}
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
                        className={getSectionClassName(
                          slug,
                          'flex flex-row items-center cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-4 ml-[-0.25rem]',
                        )}
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
                        className={getSectionClassName(
                          slug,
                          'flex flex-row items-center cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-4 ml-[-0.25rem] ',
                        )}
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

interface TableOfContentProps {
  depth?: number;
}

export const TableOfContent = ({ depth }: TableOfContentProps) => {
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
        <TableOfContentMarkdown markdown={fullMarkdown} depth={depth} />
      </div>
    </>
  );
};
