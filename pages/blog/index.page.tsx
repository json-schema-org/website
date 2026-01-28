/* eslint-disable linebreak-style */
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
import { SectionContext } from '../../context';
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

const getCategories = (frontmatter: any): blogCategories[] => {
  const cat = frontmatter.categories || frontmatter.type;
  if (!cat) return [];
  return Array.isArray(cat) ? cat : [cat];
};

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
        slug,
        frontmatter,
        content,
      };
    });

  await generateRssFeed(blogPosts);

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

export default function StaticMarkdownPage({
  blogPosts,
  filterTag,
}: {
  blogPosts: any[];
  filterTag: any;
}) {
  const router = useRouter();
  // Initialize the filter as an array. If "All" or not specified, we show all posts.
  const initialFilters =
    filterTag && filterTag !== 'All'
      ? filterTag.split(',').filter(isValidCategory)
      : ['All'];

  const [currentFilterTags, setCurrentFilterTags] =
    useState<blogCategories[]>(initialFilters);

  // When the router query changes, update the filters.
  useEffect(() => {
    const { query } = router;
    if (query.type) {
      const tags = (typeof query.type === 'string' ? query.type : '')
        .split(',')
        .filter(isValidCategory);
      setCurrentFilterTags(tags.length ? tags : ['All']);
      setCurrentPage(1);
    }
  }, [router.query]);

  useEffect(() => {
    const tags =
      filterTag && filterTag !== 'All'
        ? filterTag.split(',').filter(isValidCategory)
        : ['All'];
    setCurrentFilterTags(tags);
  }, [filterTag]);

  const toggleCategory = (tag: blogCategories) => {
    let newTags: blogCategories[] = [];
    if (tag === 'All') {
      newTags = ['All'];
    } else {
      if (currentFilterTags.includes('All')) {
        newTags = [tag];
      } else {
        if (currentFilterTags.includes(tag)) {
          newTags = currentFilterTags.filter((t) => t !== tag);
        } else {
          newTags = [...currentFilterTags, tag];
        }
      }
      if (newTags.length === 0) {
        newTags = ['All'];
      }
    }
    setCurrentFilterTags(newTags);
    if (newTags.includes('All')) {
      history.replaceState(null, '', '/blog');
    } else {
      history.replaceState(null, '', `/blog?type=${newTags.join(',')}`);
    }
  };

  // First, sort all posts by date descending (for fallback sorting)
  const postsSortedByDate = [...blogPosts].sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });

  // Filter posts based on selected categories.
  // If "All" is selected, all posts are returned.
  const filteredPosts = postsSortedByDate.filter((post) => {
    if (currentFilterTags.includes('All') || currentFilterTags.length === 0)
      return true;
    const postCategories = getCategories(post.frontmatter);
    return postCategories.some((cat) =>
      currentFilterTags.some(
        (filter) => filter.toLowerCase() === cat.toLowerCase(),
      ),
    );
  });

  const sortedFilteredPosts = filteredPosts.sort((a, b) => {
    const aMatches = getCategories(a.frontmatter).filter((cat) =>
      currentFilterTags.some(
        (filter) => filter.toLowerCase() === cat.toLowerCase(),
      ),
    ).length;
    const bMatches = getCategories(b.frontmatter).filter((cat) =>
      currentFilterTags.some(
        (filter) => filter.toLowerCase() === cat.toLowerCase(),
      ),
    ).length;
    if (aMatches !== bMatches) {
      return bMatches - aMatches;
    }
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });

  const recentBlog = postsSortedByDate;
  const timeToRead = Math.ceil(
    readingTime(recentBlog[0]?.content || '').minutes,
  );

  // Collect all unique categories across posts.
  const allTagsSet = new Set<string>();
  blogPosts.forEach((post) => {
    getCategories(post.frontmatter).forEach((cat) => allTagsSet.add(cat));
  });
  const allTags = ['All', ...Array.from(allTagsSet)];

  // pagination implement
  const POSTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(sortedFilteredPosts.length / POSTS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  const currentPagePosts = sortedFilteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  return (
    // @ts-ignore
    <SectionContext.Provider value='blog'>
      <Head>
        <title>JSON Schema Blog</title>
      </Head>
      <div className='max-w-[1400px] mx-auto overflow-x-hidden flex flex-col items-center mt-0 sm:mt-10'>
        {recentBlog[0] && (
          <div className='relative w-full h-[500px] sm:h-[400px] bg-black clip-bottom mt-1.5 flex flex-col items-center justify-start dark:bg-slate-700'>
            <div className='absolute w-full h-full dark:bg-[#282d6a]' />
            <Image
              src={recentBlog[0].frontmatter.cover}
              alt={recentBlog[0].frontmatter.title}
              fill
              className='object-cover w-full h-full opacity-70 blur-[5px]'
              priority
              quality={75}
            />
            <div className='absolute text-white w-full h-full mt-custom ml-14'>
              {/* Display all categories (joined by comma) */}
              <div className='bg-blue-100 hover:bg-blue-200 font-semibold text-blue-800 inline-block px-3 py-1 rounded-full my-3 text-sm '>
                {getCategories(recentBlog[0].frontmatter).join(', ')}
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
                    <div className='mb-6 text-sm  text-stroke-1'>
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
            <Link
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
            </Link>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className='w-full ml-8 flex flex-wrap justify-start'>
          {allTags.map((tag) => (
            <button
              key={tag}
              value={tag}
              onClick={() => toggleCategory(tag as blogCategories)}
              className={`cursor-pointer font-semibold inline-block px-3 py-1 rounded-full mb-4 mr-4 text-sm ${
                currentFilterTags.includes(tag as blogCategories)
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

        {/* Blog Posts Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 grid-flow-row mb-16 bg-white dark:bg-slate-800 mx-auto p-4'>
          {currentPagePosts.map((blogPost: any, idx: number) => {
            const { frontmatter, content } = blogPost;
            const date = new Date(frontmatter.date);
            const postTimeToRead = Math.ceil(readingTime(content).minutes);

            return (
              <section key={blogPost.slug}>
                <Link
                  href={`/blog/posts/${blogPost.slug}`}
                  className='h-[600px] sm:h-[540px] flex border rounded-lg shadow-sm transition-shadow duration-300 overflow-hidden dark:border-slate-500 group flex-col flex-1 w-full'
                >
                  <div className='relative w-full aspect-[16/9] overflow-hidden'>
                    <Image
                      src={frontmatter.cover}
                      alt={frontmatter.title}
                      fill
                      className='object-cover transition-transform duration-300 group-hover:scale-110'
                      loading={idx < 10 ? 'eager' : 'lazy'}
                      priority={idx < 10}
                      quality={75}
                    />
                    <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 pointer-events-none' />
                  </div>
                  <div className='p-4 flex flex-col flex-1 justify-between min-h-0 pt-2'>
                    <div>
                      {/* Display each category as a clickable badge */}
                      <div className='flex flex-wrap gap-2 mb-4'>
                        {getCategories(frontmatter).map((cat, index) => (
                          <button
                            key={index}
                            type='button'
                            className='bg-blue-100 hover:bg-blue-200 dark:bg-slate-700 dark:text-blue-100 cursor-pointer font-semibold text-blue-800 inline-block px-3 py-1 rounded-full text-sm'
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleCategory(cat);
                            }}
                          >
                            {cat || 'Unknown'}
                          </button>
                        ))}
                      </div>
                      <div className='text-lg h-[95px] font-semibold overflow-hidden transition-transform duration-300 group-hover:scale-105'>
                        {frontmatter.title}
                      </div>
                      <div className='mt-3   text-slate-500 dark:text-slate-300 flex-1 min-h-0'>
                        <TextTruncate
                          element='span'
                          line={4}
                          text={frontmatter.excerpt}
                        />
                      </div>
                    </div>
                    <div className='flex flex-row items-center mt-2'>
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
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Separator Line */}
                  <div className='border-t border-gray-200 dark:border-slate-600 mx-4'></div>
                  {/* Read More Section */}
                  <div className='flex w-full px-4 py-2 justify-between items-center'>
                    <span className='text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 group/readmore'>
                      Read More
                      <span className='transition-transform group-hover/readmore:translate-x-1 text-xs'>
                        →
                      </span>
                    </span>
                    <span className='text-slate-500 text-sm dark:text-slate-400'>
                      {postTimeToRead} min read
                    </span>
                  </div>
                </Link>
              </section>
            );
          })}
        </div>
        {/* pagination control */}
        <div className='flex justify-center items-center gap-4'>
          <button
            className={`px-4 py-2 rounded-md font-semibold ${
              currentPage === 1
                ? 'bg-gray-300 dark:bg-slate-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className='text-lg font-medium dark:text-white'>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`px-4 py-2 rounded-md font-semibold ${
              currentPage === totalPages
                ? 'bg-gray-300 dark:bg-slate-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </SectionContext.Provider>
  );
}

StaticMarkdownPage.getLayout = getLayout;
