/* eslint-disable linebreak-style */
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 10;

  const initialFilters =
    filterTag && filterTag !== 'All'
      ? filterTag.split(',').filter(isValidCategory)
      : ['All'];

  const [currentFilterTags, setCurrentFilterTags] =
    useState<blogCategories[]>(initialFilters);

  // Sync with Router
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
    setCurrentPage(1); // Reset to page 1 on filter change
    if (newTags.includes('All')) {
      history.replaceState(null, '', '/blog');
    } else {
      history.replaceState(null, '', `/blog?type=${newTags.join(',')}`);
    }
  };

  // Main Filtering Logic (Search + Categories)
  const filteredAndSortedPosts = useMemo(() => {
    return blogPosts
      .filter((post) => {
        // 1. Category Filter
        const postCategories = getCategories(post.frontmatter);
        const matchesCategory =
          currentFilterTags.includes('All') ||
          postCategories.some((cat) =>
            currentFilterTags.some(
              (filter) => filter.toLowerCase() === cat.toLowerCase(),
            ),
          );

        // 2. Search Filter
        const searchContent = searchQuery.toLowerCase();
        const matchesSearch =
          searchQuery === '' ||
          post.frontmatter.title.toLowerCase().includes(searchContent) ||
          post.frontmatter.excerpt?.toLowerCase().includes(searchContent) ||
          post.frontmatter.authors?.some((author: Author) =>
            author.name.toLowerCase().includes(searchContent),
          );

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        // Sort by date descending
        const dateA = new Date(a.frontmatter.date).getTime();
        const dateB = new Date(b.frontmatter.date).getTime();
        return dateB - dateA;
      });
  }, [blogPosts, currentFilterTags, searchQuery]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE);
  const currentPagePosts = filteredAndSortedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const blogPostsContainerRef = useRef<HTMLDivElement>(null);

  // Pagination safety
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const allTagsSet = new Set<string>();
  blogPosts.forEach((post) => {
    getCategories(post.frontmatter).forEach((cat) => allTagsSet.add(cat));
  });
  const allTags = ['All', ...Array.from(allTagsSet)];

  return (
    // @ts-ignore
    <SectionContext.Provider value='blog'>
      <Head>
        <title>JSON Schema Blog</title>
      </Head>
      <div className='max-w-[1400px] mx-auto overflow-x-hidden flex flex-col items-center mt-0 sm:mt-10'>
        {/* Featured Post Hero */}
        {blogPosts[0] && searchQuery === '' && currentPage === 1 && (
          <div className='relative w-full h-[500px] sm:h-[400px] bg-black clip-bottom mt-1.5 flex flex-col items-center justify-start dark:bg-slate-700'>
            <div className='absolute w-full h-full dark:bg-[#282d6a]' />
            <Image
              src={blogPosts[0].frontmatter.cover}
              alt={blogPosts[0].frontmatter.title}
              fill
              className='object-cover w-full h-full opacity-70 blur-[5px]'
              priority
              quality={75}
            />
            <div className='absolute text-white w-full h-full mt-custom ml-14'>
              <div className='bg-blue-100 hover:bg-blue-200 font-semibold text-blue-800 inline-block px-3 py-1 rounded-full my-3 text-sm '>
                {getCategories(blogPosts[0].frontmatter).join(', ')}
              </div>
              <Link href={`/blog/posts/${blogPosts[0].slug}`}>
                <h1 className='text-h1mobile ab1:text-h1 sm:text-h2 font-semibold text-stroke-1 mr-6 dark:slate-300 sm:leading-tight cursor-pointer'>
                  {blogPosts[0].frontmatter.title}
                </h1>
              </Link>
              <div className='flex ml-2 mb-2 gap-2 mt-4'>
                <div
                  className='bg-slate-50 h-10 w-10 lg:h-[44px] lg:w-[44px] rounded-full -ml-3 bg-cover bg-center border-2 border-white'
                  style={{
                    backgroundImage: `url(${blogPosts[0].frontmatter.authors[0].photo})`,
                  }}
                />
                <div className='flex-col ml-2'>
                  <p className='text-sm font-semibold text-stroke-1'>
                    {blogPosts[0].frontmatter.authors[0].name}
                  </p>
                  <p className='text-sm text-stroke-1'>
                    {blogPosts[0].frontmatter.date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={blogPostsContainerRef} className='w-full mx-auto my-10 px-4'>
          <div className='flex flex-col items-center mb-8'>
            <h2 className='text-h3mobile md:text-h3 font-bold text-center mb-4'>
              Welcome to the JSON Schema Blog!
            </h2>

            {/* SEARCH BAR COMPONENT */}
            <div className='relative w-full max-w-2xl mt-4'>
              <input
                type='text'
                placeholder='Search by title, excerpt, or author...'
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className='w-full px-12 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white'
              />
              <svg
                className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className='flex flex-col items-center text-sm sm:text-base gap-2 mb-8'>
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
            </p>
            <Link
              href='/rss/feed.xml'
              className='flex items-center text-blue-500 hover:text-blue-600'
            >
              <Image
                src='/icons/rss.svg'
                className='mr-2'
                alt='rss'
                height={20}
                width={20}
              />
              RSS Feed
            </Link>
          </div>

          {/* Filter Buttons */}
          <div className='w-full flex flex-wrap justify-center mb-8 gap-2'>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleCategory(tag as blogCategories)}
                className={`cursor-pointer font-semibold px-4 py-1.5 rounded-full text-sm transition-colors ${
                  currentFilterTags.includes(tag as blogCategories)
                    ? 'bg-blue-800 text-white dark:bg-blue-200 dark:text-slate-900'
                    : 'bg-blue-100 text-blue-800 dark:bg-slate-700 dark:text-blue-100 hover:bg-blue-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        {searchQuery && (
          <div className='w-full px-8 mb-4 text-slate-600 dark:text-slate-400'>
            Found {filteredAndSortedPosts.length} results for "{searchQuery}"
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16 px-4 w-full'>
          {currentPagePosts.length > 0 ? (
            currentPagePosts.map((blogPost: any, idx: number) => {
              const { frontmatter, content } = blogPost;
              const postTimeToRead = Math.ceil(readingTime(content).minutes);

              return (
                <section key={blogPost.slug}>
                  <Link
                    href={`/blog/posts/${blogPost.slug}`}
                    className='h-[600px] sm:h-[540px] flex border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden dark:border-slate-500 group flex-col w-full'
                  >
                    <div className='relative w-full aspect-[16/9] overflow-hidden'>
                      <Image
                        src={frontmatter.cover}
                        alt={frontmatter.title}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-110'
                        loading={idx < 5 ? 'eager' : 'lazy'}
                      />
                    </div>
                    <div className='p-4 flex flex-col flex-1 justify-between'>
                      <div>
                        <div className='flex flex-wrap gap-2 mb-3'>
                          {getCategories(frontmatter).map((cat, i) => (
                            <span
                              key={i}
                              className='text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-300'
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                        <h3 className='text-lg font-semibold line-clamp-3 mb-2 group-hover:text-blue-600 transition-colors'>
                          {frontmatter.title}
                        </h3>
                        <div className='text-sm text-slate-500 dark:text-slate-400'>
                          <TextTruncate line={3} text={frontmatter.excerpt} />
                        </div>
                      </div>

                      <div className='mt-4'>
                        <div className='flex items-center gap-2 mb-3'>
                          <div
                            className='h-8 w-8 rounded-full border border-gray-200 bg-cover'
                            style={{
                              backgroundImage: `url(${frontmatter.authors[0]?.photo})`,
                            }}
                          />
                          <span className='text-xs font-medium'>
                            {frontmatter.authors[0]?.name}
                          </span>
                        </div>
                        <div className='flex justify-between items-center text-[11px] text-slate-400 border-t pt-3 dark:border-slate-600'>
                          <span>
                            {new Date(frontmatter.date).toLocaleDateString()}
                          </span>
                          <span>{postTimeToRead} min read</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </section>
              );
            })
          ) : (
            <div className='col-span-full text-center py-20'>
              <p className='text-xl text-slate-500'>
                No posts found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentFilterTags(['All']);
                }}
                className='mt-4 text-blue-600 underline'
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination Control */}
        {totalPages > 1 && (
          <div className='flex justify-center items-center gap-4 mb-20'>
            <button
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
            <span className='text-lg font-medium dark:text-white'>
              {currentPage} / {totalPages}
            </span>
            <button
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </SectionContext.Provider>
  );
}

StaticMarkdownPage.getLayout = getLayout;
