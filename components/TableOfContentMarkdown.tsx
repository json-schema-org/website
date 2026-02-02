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
    const cssOffset = getComputedStyle(document.documentElement)
      .getPropertyValue('--toc-offset')
      .trim();
    const parsedOffset = parseInt(cssOffset || '', 10);
    const offset = Number.isFinite(parsedOffset) ? parsedOffset : 180;
    const selector = '[data-test="headline"], h1[id], h2[id], h3[id], h4[id]';
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    );
    if (!sections.length) {
      return;
    }
    const setIfChanged = (slug: string | null) => {
      setActiveSection((prev) => (prev === slug ? prev : slug));
    };
    const initial = window.location.hash.slice(1) || sections[0]?.id || null;
    setIfChanged(initial);
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          let candidate: string | null = null;
          for (const entry of entries) {
            const id = (entry.target as HTMLElement).id;
            if (entry.isIntersecting && id) {
              candidate = id;
            }
          }
          if (!candidate) {
            for (const s of sections) {
              const r = s.getBoundingClientRect();
              if (r.top <= offset && s.id) {
                candidate = s.id;
              } else if (r.top > offset) {
                break;
              }
            }
          }
          setIfChanged(candidate || sections[0]?.id || null);
        },
        { rootMargin: `-${offset}px 0px -80% 0px`, threshold: [0, 1] },
      );
      sections.forEach((s) => observer.observe(s));
      return () => {
        observer.disconnect();
      };
    } else {
      let ticking = false;
      const onScrollOrResize = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          let candidate: string | null = null;
          for (const s of sections) {
            const r = s.getBoundingClientRect();
            if (r.top <= offset && s.id) {
              candidate = s.id;
            } else if (r.top > offset) {
              break;
            }
          }
          setIfChanged(candidate || sections[0]?.id || null);
          ticking = false;
        });
      };
      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize);
      window.addEventListener('hashchange', onScrollOrResize);
      onScrollOrResize();
      return () => {
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
        window.removeEventListener('hashchange', onScrollOrResize);
      };
    }
  }, [markdown]);

  const getSectionClassName = (slug: string, defaultClass: string) =>
    `${defaultClass} ${activeSection === slug ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}`;

  return (
    <Markdown
      options={{
        overrides: (() => {
          const base: Record<string, any> = {
            h1: {
              component: ({ children }: { children: any }) => {
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
          };
          if (depth === 0) {
            base.h2 = {
              component: ({ children }: { children: any }) => {
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
            };
          } else if (depth >= 2) {
            base.h2 = {
              component: ({ children }: { children: any }) => {
                const slug = slugifyMarkdownHeadline(children);
                const isChrome =
                  /Chrome/.test(navigator.userAgent) &&
                  /Google Inc/.test(navigator.vendor);
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
            };
          } else {
            base.h2 = { component: () => null };
          }
          if (depth >= 3) {
            base.h3 = {
              component: ({ children }: { children: any }) => {
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
            };
          } else {
            base.h3 = { component: () => null };
          }
          if (depth >= 4) {
            base.h4 = {
              component: ({ children }: { children: any }) => {
                const slug = slugifyMarkdownHeadline(children);
                return (
                  <a
                    href={`#${slug}`}
                    className={getSectionClassName(
                      slug,
                      'flex flex-row items-center cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-4 ml-[-0.25rem]',
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
            };
          } else {
            base.h4 = { component: () => null };
          }
          return {
            ...base,
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
          };
        })(),
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
  const fullMarkdown = useContext(FullMarkdownContext);
  if (!fullMarkdown) return null;
  return (
    <>
      <div className='flex flex-row gap-2 text-slate-600 dark:text-slate-300 text-h5 max-sm:text-[1rem] items-center'>
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