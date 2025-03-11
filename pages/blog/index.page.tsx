/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import { getLayout } from '~/components/SiteLayout';
import matter from 'gray-matter';
import readingTime from 'reading-time';
const PATH = 'pages/blog/posts';
import TextTruncate from 'react-text-truncate';
import generateRssFeed from './generateRssFeed';
import { useRouter } from 'next/router';
import { SectionContext } from '~/context';
import Image from 'next/image';

type Author = {
  name: string;
  photo?: string;
  link?: string;
  byline?: string;
};

export type blogCategories =
  | 'All'
  | 'Community'
  | 'Case Study'
  | 'Engineering'
  | 'Update'
  | 'Opinion'
  | 'Documentation';

export async function getStaticProps({ query }: { query: any }) {
  const files = fs.readdirSync(PATH);
  const blogPosts = files
    .filter((file) => file.substr(-3) === '.md')
    .map((fileName) => {
      const slug = fileName.replace('.md', '');
      const fullFileName = fs.readFileSync(
        `pages/blog/posts/${slug}.md`,
        'utf-8',
      );
      const { data: frontmatter, content } = matter(fullFileName);
      return {
        slug: slug,
        frontmatter,
        content,
      };
    });

  await generateRssFeed(blogPosts);

  // Filtering based on query parameter
  const filterTag: string = query?.type || 'All';

  return {
    props: {
      blogPosts,
      filterTag,
    },
  };
}

function isValidCategory(category: any): category is blogCategories {
  return [
    'All',
    'Community',
    'Case Study',
    'Engineering',
    'Update',
    'Opinion',
    'Documentation',
  ].includes(category);
}

// Helper to extract categories whether frontmatter.categories or frontmatter.type is provided.
const extractCategories = (post: any): string[] => {
  const categories = post.frontmatter.categories || post.frontmatter.type;
  if (Array.isArray(categories)) {
    return categories;
  } else if (typeof categories === 'string') {
    return [categories];
  }
  return [];
};

export default function StaticMarkdownPage({
  blogPosts,
  filterTag,
}: {
  blogPosts: any[];
  filterTag: any;
}) {
  const router = useRouter();
  // Initialize selected filter tags: if query.type is 'All' or not provided, no filter is applied.
  const initialTags =
    filterTag && filterTag !== 'All'
      ? ((filterTag as string)
          .split(',')
          .filter((tag) => isValidCategory(tag)) as blogCategories[])
      : [];
  const [selectedFilterTags, setSelectedFilterTags] =
    useState<blogCategories[]>(initialTags);

  useEffect(() => {
    const { query } = router;
    if (query.type) {
      const types = (query.type as string)
        .split(',')
        .filter((tag) => isValidCategory(tag)) as blogCategories[];
      setSelectedFilterTags(types);
    } else {
      setSelectedFilterTags([]);
    }
  }, [router.query]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const clickedTag = event.currentTarget.value as blogCategories;
    if (clickedTag === 'All') {
      setSelectedFilterTags([]);
      history.replaceState(null, '', '/blog');
    } else {
      if (selectedFilterTags.includes(clickedTag)) {
        const newTags = selectedFilterTags.filter((tag) => tag !== clickedTag);
        setSelectedFilterTags(
          newTags.filter(isValidCategory) as blogCategories[],
        );
        if (newTags.length > 0) {
          history.replaceState(null, '', `/blog?type=${newTags.join(',')}`);
        } else {
          history.replaceState(null, '', '/blog');
        }
      } else {
        const newTags = [...selectedFilterTags, clickedTag];
        setSelectedFilterTags(
          newTags.filter(isValidCategory) as blogCategories[],
        );
        history.replaceState(null, '', `/blog?type=${newTags.join(',')}`);
      }
    }
  };

  // Sort all blog posts in descending order by date (for the hero section)
  const recentBlog = blogPosts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });

  // Calculate time to read for the most recent blog post.
  const timeToRead = Math.ceil(readingTime(recentBlog[0].content).minutes);

  // Create a set of unique tags from all posts using the helper.
  const allTagsSet = blogPosts.flatMap((post) => extractCategories(post));
  const uniqueTags = [...new Set(allTagsSet)];
  // Prepend 'All' for the filter button.
  const allTags = ['All', ...uniqueTags];

  return (
    <SectionContext.Provider value='blog'>
      <Head>
        <title>JSON Schema Blog</title>
      </Head>
      <div className='max-w-[1400px] mx-auto overflow-x-hidden flex flex-col items-center mt-10 '>
        {recentBlog[0] && (
          <div className='relative w-full h-[400px] bg-black clip-bottom mt-1.5 flex flex-col items-center justify-start dark:bg-slate-700'>
            <div className='absolute w-full h-full dark:bg-[#282d6a]'>
              <Image
                src={recentBlog[0].frontmatter.cover}
                width={800}
                height={450}
                className='object-cover w-full h-full opacity-70 blur-[5px]'
                alt='hero image example'
              />
            </div>
            <div className='absolute text-white w-full h-full mt-custom ml-14'>
              {/* Render each category as a separate badge */}
              <div className='flex flex-wrap gap-2'>
                {extractCategories(recentBlog[0]).map((cat, idx) => (
                  <div
                    key={idx}
                    className='bg-blue-100 hover:bg-blue-200 font-semibold text-blue-800 inline-block px-3 py-1 rounded-full my-3 text-sm'
                  >
                    {cat}
                  </div>
                ))}
              </div>
              <Link href={`/blog/posts/${recentBlog[0].slug}`}>
                <h1 className='text-h1mobile ab1:text-h1 sm:text-h2 font-semibold text-stroke-1 mr-6 dark:slate-300'>
                  {recentBlog[0].frontmatter.title}
                </h1>
                <div className='flex ml-2 mb-2 gap-2'>
                  <div
                    className='bg-slate-50 h-10 w-10 lg:h-[44px] lg:w-[44px] rounded-full -ml-3 bg-cover bg-center border-2 border-white'
                    style={{
                      backgroundImage: `url(${recentBlog[0].frontmatter.authors[0].photo})`,
                    }}
                  />
                  <div className='max-w-full lg:max-w-[calc(100% - 64px)] mx-auto lg:mx-0 flex-col ml-2'>
                    <p className='text-sm font-semibold text-stroke-1'>
                      {recentBlog[0].frontmatter.authors[0].name}
                    </p>
                    <div className='mb-6 text-sm text-stroke-1'>
                      <span>
                        {recentBlog[0].frontmatter.date} &middot; {timeToRead}{' '}
                        min read
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
        <div className='w-full mx-auto my-5'>
          <div className='flex h-full flex-col justify-center items-center mb-3 my-2'>
            <h2 className='text-h3mobile md:text-h3 font-bold px-4 items-center text-center'>
              Welcome to the JSON Schema Blog!
            </h2>
          </div>
          <div className='flex h-full flex-col justify-center items-center text-center text-sm sm:text-base px-4 my-2'>
            <p>
              Want to publish a blog post? Check out the&nbsp;
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://github.com/json-schema-org/community/blob/main/docs/blog-guidelines.md'
                className='underline'
              >
                guidelines
              </a>
              &nbsp;and submit yours!
            </p>
          </div>
          <div className='flex h-full flex-col justify-center items-center text-sm sm:text-base px-4 my-2'>
            <a
              href='/rss/feed.xml'
              className='flex items-center text-blue-500 hover:text-blue-600 cursor-pointer'
            >
              <Image
                src='/icons/rss.svg'
                className='rounded h-5 w-5 mr-2'
                alt='rss'
                height={20}
                width={20}
              />
              RSS&nbsp;Feed
            </a>
          </div>
        </div>
        {/* Filter Buttons */}
        <div className='w-full ml-8 flex flex-wrap justify-start'>
          {allTags.map((tag) => (
            <button
              key={tag}
              value={tag}
              onClick={handleClick}
              className={`cursor-pointer font-semibold inline-block px-3 py-1 rounded-full mb-4 mr-4 text-sm ${
                (tag === 'All' && selectedFilterTags.length === 0) ||
                (tag !== 'All' &&
                  selectedFilterTags.includes(tag as blogCategories))
                  ? 'dark:bg-blue-200 dark:text-slate-700 bg-blue-800 text-blue-100'
                  : 'dark:bg-slate-700 dark:text-blue-100 bg-blue-100 text-blue-800 hover:bg-blue-200 hover:dark:bg-slate-600'
              }`}
            >
              {tag}
            </button>
          ))}
          <span className='text-blue-800 inline-block px-3 py-1 mb-4 mr-4 text-sm items-center dark:text-slate-300'>
            Filter blog posts by category...
          </span>
        </div>
        {/* Filtered Blog Posts */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 grid-flow-row mb-20 bg-white dark:bg-slate-800 mx-auto p-4'>
          {blogPosts
            .filter((post) => {
              if (selectedFilterTags.length === 0) return true;
              const postCategories = extractCategories(post);
              if (!postCategories.length) return false;
              return selectedFilterTags.some((tag) =>
                postCategories
                  .map((c) => c.toLowerCase())
                  .includes(tag.toLowerCase()),
              );
            })
            .sort((a, b) => {
              // When multiple filter tags are selected, sort by match count first.
              if (selectedFilterTags.length > 1) {
                const aMatches = extractCategories(a).filter((cat) =>
                  selectedFilterTags.some(
                    (tag) => tag.toLowerCase() === cat.toLowerCase(),
                  ),
                ).length;
                const bMatches = extractCategories(b).filter((cat) =>
                  selectedFilterTags.some(
                    (tag) => tag.toLowerCase() === cat.toLowerCase(),
                  ),
                ).length;
                if (aMatches !== bMatches) {
                  return bMatches - aMatches;
                }
              }
              // Fallback sort: by date descending.
              const dateA = new Date(a.frontmatter.date).getTime();
              const dateB = new Date(b.frontmatter.date).getTime();
              return dateB - dateA;
            })
            .map((blogPost: any) => {
              const { frontmatter, content } = blogPost;
              const date = new Date(frontmatter.date);
              const timeToRead = Math.ceil(readingTime(content).minutes);
              const postCategories = extractCategories(blogPost);

              return (
                <section key={blogPost.slug}>
                  <div className='sm:h-[498px] flex border rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden dark:border-slate-500'>
                    <Link
                      href={`/blog/posts/${blogPost.slug}`}
                      className='inline-flex flex-col flex-1 w-full'
                    >
                      <div
                        className='bg-slate-50 h-[160px] w-full self-stretch mr-3 bg-cover bg-center'
                        style={{ backgroundImage: `url(${frontmatter.cover})` }}
                      />
                      <div className='p-4 flex flex-col flex-1 justify-between'>
                        <div>
                          {/* Render each category as a separate clickable badge */}
                          <div className='flex gap-2 flex-wrap'>
                            {postCategories.map((cat, idx) => (
                              <div
                                key={idx}
                                className='bg-blue-100 hover:bg-blue-200 dark:bg-slate-700 dark:text-blue-100 cursor-pointer font-semibold text-blue-800 inline-block px-3 py-1 rounded-full mb-4 text-sm'
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const newTags = selectedFilterTags.includes(
                                    cat as blogCategories,
                                  )
                                    ? selectedFilterTags.filter(
                                        (tag) => tag !== cat,
                                      )
                                    : [...selectedFilterTags, cat];
                                  setSelectedFilterTags(
                                    newTags.filter(
                                      isValidCategory,
                                    ) as blogCategories[],
                                  );
                                  if (newTags.length > 0) {
                                    history.replaceState(
                                      null,
                                      '',
                                      `/blog?type=${newTags.join(',')}`,
                                    );
                                  } else {
                                    history.replaceState(null, '', '/blog');
                                  }
                                }}
                              >
                                {cat}
                              </div>
                            ))}
                          </div>
                          <div className='text-lg font-semibold'>
                            {frontmatter.title}
                          </div>
                          <div className='mt-3 mb-6 text-slate-500 dark:text-slate-300'>
                            <TextTruncate
                              element='span'
                              line={4}
                              text={frontmatter.excerpt}
                            />
                          </div>
                        </div>
                        <div className='flex flex-row items-center'>
                          <div className='flex flex-row pl-2 mr-2'>
                            {(frontmatter.authors || []).map(
                              (author: Author, index: number) => (
                                <div
                                  key={index}
                                  className={`bg-slate-50 rounded-full -ml-3 bg-cover bg-center border-2 border-white ${
                                    frontmatter.authors.length > 2
                                      ? 'h-8 w-8'
                                      : 'h-11 w-11'
                                  }`}
                                  style={{
                                    backgroundImage: `url(${author.photo})`,
                                    zIndex: 10 - index,
                                  }}
                                />
                              ),
                            )}
                          </div>
                          <div className='flex flex-col items-start'>
                            <div className='text-sm font-semibold'>
                              {frontmatter.authors.length > 2 ? (
                                <>
                                  {frontmatter.authors
                                    .slice(0, 2)
                                    .map((author: Author, index: number) => (
                                      <span key={author.name}>
                                        {author.name}
                                        {index === 0 && ' & '}
                                      </span>
                                    ))}
                                  {'...'}
                                </>
                              ) : (
                                frontmatter.authors.map(
                                  (author: Author, index: number) => (
                                    <span key={author.name}>
                                      {author.name}
                                      {index < frontmatter.authors.length - 1 &&
                                        ' & '}
                                    </span>
                                  ),
                                )
                              )}
                            </div>
                            <div className='text-slate-500 text-sm dark:text-slate-300'>
                              {frontmatter.date && (
                                <span>
                                  {date.toLocaleDateString('en-us', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </span>
                              )}{' '}
                              &middot; {timeToRead} min read
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </section>
              );
            })}
        </div>
      </div>
    </SectionContext.Provider>
  );
}

StaticMarkdownPage.getLayout = getLayout;
