/* eslint-disable linebreak-style */
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useContext, useEffect, useState } from 'react';
import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import slugifyMarkdownHeadline from '~/lib/slugifyMarkdownHeadline';
import { hiddenElements } from '~/lib/markdownUtils';
import { FullMarkdownContext } from '~/context';
import { cn } from '~/lib/utils';

interface TableOfContentMarkdownProps {
  markdown: string;
  depth?: number;
}

const useScrollSpy = (markdown: string) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const getSlugs = () =>
      Array.from(
        document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'),
      )
        .map((element) => element.getAttribute('href')?.replace('#', ''))
        .filter((slug): slug is string => Boolean(slug));

    const getSections = () => {
      const slugSet = new Set(getSlugs());
      return Array.from(
        document.querySelectorAll<HTMLElement>(
          'h1[id], h2[id], h3[id], h4[id]',
        ),
      ).filter((element) => slugSet.has(element.id));
    };

    let sections = getSections();
    let ticking = false;

    const update = () => {
      const header = document.querySelector('header');
      const scrollOffset = (header?.getBoundingClientRect().height ?? 84) + 24;

      let current: string | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= scrollOffset) {
          current = section.id;
        } else {
          break;
        }
      }

      const hash = window.location.hash.replace('#', '');
      if (!current && hash && getSlugs().includes(hash)) {
        current = hash;
      }

      setActiveSection((previous) =>
        previous === current ? previous : current,
      );
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    sections = getSections();
    update();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [markdown]);

  return activeSection;
};

export function TableOfContentMarkdown({
  markdown,
  depth = 2,
}: TableOfContentMarkdownProps) {
  const activeSection = useScrollSpy(markdown);

  const headingClassName = (baseClass: string, slug: string) =>
    cn(
      baseClass,
      activeSection === slug &&
        'text-blue-600 dark:text-blue-400 font-semibold',
    );

  return (
    <Markdown
      options={{
        overrides: {
          h1: {
            component: ({ children }) => {
              const slug = slugifyMarkdownHeadline(children);
              const isActive = activeSection === slug;
              return (
                <a
                  href={`#${slug}`}
                  data-toc-link
                  aria-current={isActive ? 'true' : undefined}
                  className={headingClassName(
                    'flex cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-6 font-medium',
                    slug,
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
                    const isActive = activeSection === slug;
                    return (
                      <a
                        href={`#${slug}`}
                        data-toc-link
                        aria-current={isActive ? 'true' : undefined}
                        className={headingClassName(
                          'block cursor-pointer mb-3 text-slate-600  dark:text-slate-300 leading-5 font-medium ml-4',
                          slug,
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
                      const isActive = activeSection === slug;
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
                          data-toc-link
                          aria-current={isActive ? 'true' : undefined}
                          className={headingClassName(
                            `block cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-4 max-sm:-ml-[6px] font-medium ${isChrome ? '-ml-[4.8px]' : '-ml-[6.5px]'}`,
                            slug,
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
                    const isActive = activeSection === slug;
                    return (
                      <a
                        href={`#${slug}`}
                        data-toc-link
                        aria-current={isActive ? 'true' : undefined}
                        className={headingClassName(
                          'flex flex-row items-center cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-4 ml-[-0.25rem]',
                          slug,
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
                    const isActive = activeSection === slug;
                    return (
                      <a
                        href={`#${slug}`}
                        data-toc-link
                        aria-current={isActive ? 'true' : undefined}
                        className={headingClassName(
                          'flex flex-row items-center cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-4 ml-[-0.25rem] ',
                          slug,
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
