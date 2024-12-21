import React, { useEffect, useState } from 'react';
import { getLayout } from '../components/SiteLayout';
import { DocSearch } from '@docsearch/react';
import fs from 'fs';
import matter from 'gray-matter';
const PATH = 'pages/blog/posts';
import readingTime from 'reading-time';
import Link from 'next/link';
import TextTruncate from 'react-text-truncate';
import {
  fetchRemoteICalFile,
  printEventsForNextWeeks,
} from '../lib/calendarUtils';
import { Headline4 } from '~/components/Headlines';
import { GetStaticProps } from 'next';

/* eslint-disable */
import ical from 'node-ical';
import { useTheme } from 'next-themes';

// apiKey and appId are set in the .env.local file
const algoliaAppId: string = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string;
const algoliaApiKey: string = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY as string;

/* eslint-enable */
export const getStaticProps: GetStaticProps = async () => {
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
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    )
    .slice(0, 5);
  // Example usage:
  const remoteICalUrl =
    'https://calendar.google.com/calendar/ical/json.schema.community%40gmail.com/public/basic.ics'; // Replace with the actual URL
  const datesInfo = await fetchRemoteICalFile(remoteICalUrl)
    .then((icalData: any) => printEventsForNextWeeks(ical.parseICS(icalData)))
    .catch((error) => console.error('Error:', error));
  // console.log('this is fetched data', datesInfo)
  return {
    props: {
      blogPosts,
      datesInfo,
      fallback: false,
    },
  };
};

export function AlgoliaSearch() {
  useEffect(() => {
    const customButton = document.querySelector('.herobtn');
    const docSearchButton = document.querySelector(
      '.DocSearch-Button',
    ) as HTMLButtonElement;

    if (customButton && docSearchButton) {
      customButton.addEventListener('click', () => {
        docSearchButton.click();
      });
    }
  }, []);

  return (
    <div className='flex herobtn items-center justify-center font-semibold w-[194px] h-[40px] rounded border-2 border-white dark:border-none hover:bg-blue-700 transition-all duration-300 ease-in-out text-white bg-primary mx-auto dark:shadow-2xl cursor-pointer'>
      <div className='flex flex-row justify-center items-center mr-4'>
        <DocSearch
          appId={algoliaAppId}
          apiKey={algoliaApiKey}
          indexName='json-schema'
        />
        Search
      </div>
    </div>
  );
}
const Home = (props: any) => {
  const blogPosts = props.blogPosts;
  const timeToRead = Math.ceil(readingTime(blogPosts[0].content).minutes);
  const { resolvedTheme } = useTheme();

  const [asyncapi_logo, setAsyncapi_logo] = useState('');
  const [vpsserver_logo, setVPSserver_logo] = useState('');
  const [airbnb_logo, setAirbnb_logo] = useState('');
  const [postman_logo, setPostman_logo] = useState('');
  const [itflashcards_logo, setItflashcards_logo] = useState('');
  const [route4me_logo, setRoute4me_logo] = useState('');
  const [n8n_logo, setN8n_logo] = useState('');
  const [endjin_logo, setEndjin_logo] = useState('');
  const [llc_logo, setLlc_logo] = useState('');
  const [common_room_logo, setCommon_room_logo] = useState('');
  const [slack_logo, setSlack_logo] = useState('');
  const [ccopter_logo, setCCopter_logo] = useState('');
  const [octue_logo, setOctue_logo] = useState('');
  const [apideck_logo, setApideck_logo] = useState('');

  useEffect(() => {
    if (resolvedTheme === 'dark') {
      setAsyncapi_logo('/img/logos/dark-mode/asyncapi_white.svg');
      setAirbnb_logo('/img/logos/dark-mode/airbnb_white.png');
      setPostman_logo('/img/logos/usedby/postman-white.png');
      setEndjin_logo('/img/logos/sponsors/endjin-logo.svg');
      setLlc_logo('/img/logos/dark-mode/llc_white.svg');
      setCommon_room_logo('/img/logos/dark-mode/common-room_white.svg');
      setSlack_logo('/img/logos/dark-mode/slack_white.svg');
      setVPSserver_logo('/img/logos/sponsors/vps-server-logo.svg');
      setItflashcards_logo('/img/logos/sponsors/it_flashcards-white.svg');
      setRoute4me_logo('/img/logos/sponsors/route4me-logo-dark.svg');
      setN8n_logo('/img/logos/sponsors/n8n-logo-dark.svg');
      setCCopter_logo('/img/logos/sponsors/copycopter-white.png');
      setOctue_logo('/img/logos/sponsors/octue-white.svg');
      setApideck_logo('/img/logos/sponsors/apideck-white.svg');
    } else {
      setAsyncapi_logo('/img/logos/sponsors/asyncapi-logo-dark.svg');
      setAirbnb_logo('/img/logos/sponsors/airbnb-logo.png');
      setPostman_logo('/img/logos/sponsors/postman_logo-orange.svg');
      setEndjin_logo('/img/logos/sponsors/endjin-logo.svg');
      setLlc_logo('/img/logos/sponsors/llc-logo.svg');
      setCommon_room_logo('/img/logos/supported/common-room.svg');
      setSlack_logo('/img/logos/supported/slack-logo.svg');
      setVPSserver_logo('/img/logos/sponsors/vps-server-logo.svg');
      setItflashcards_logo('/img/logos/sponsors/it_flashcards.svg');
      setRoute4me_logo('/img/logos/sponsors/route4me-logo-white.svg');
      setN8n_logo('/img/logos/sponsors/n8n-logo-white.svg');
      setCCopter_logo('/img/logos/sponsors/copycopter.png');
      setOctue_logo('/img/logos/sponsors/octue-black.svg');
      setApideck_logo('/img/logos/sponsors/apideck.svg');
    }
  }, [resolvedTheme]);
  return (
    <div>
      <div className='flex flex-col items-center'>
        {/* Hero  */}
        <section className='bg-[linear-gradient(72.68deg,_#002CC4_28.97%,_#5468FF_145.47%)] clip-bottom w-full dark:bg-[linear-gradient(72.68deg,_#002C34_28.97%,_#5468FF_145.47%)]'>
          <div className='max-w-[1400px] text-center mx-auto mt-24 lg:mt-40'>
            <h1 className='lg:leading-header text-h1mobile lg:text-h1 font-semibold text-white text-center px-1 md:px-0 dark:text-slate-200'>
              Build more. Break less. Empower others.
            </h1>

            <h2 className='lg:leading-6 text-center text-h5mobile md:text-h5  text-white mt-4 dark:text-slate-300'>
              JSON Schema enables the confident and reliable use of the JSON
              data format.
            </h2>

            <div className='lg:w-[650px]  mx-auto my-10 grid grid-cols-1 lg:grid-cols-3 gap-8 justify-items-center '>
              <Link
                href='/learn'
                className='flex items-center justify-center rounded border-2 border-white dark:border-none hover:bg-blue-700 transition-all duration-300 ease-in-out text-white w-[194px] h-[40px] font-semibold bg-primary dark:shadow-2xl'
              >
                Getting started
              </Link>
              <Link
                href='/slack'
                className='flex items-center justify-center rounded border-2 border-white dark:border-none hover:bg-blue-700 transition-all duration-300 ease-in-out text-white  w-[194px] h-[40px] font-semibold bg-primary dark:shadow-2xl'
              >
                Join Slack
              </Link>
              <AlgoliaSearch />
            </div>

            <div className='mb-16 md:mb-36  mx-auto w-full md:w-5/6 lg:w-full'>
              <h3 className='text-white text-xl mb-4'>Used by</h3>

              <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto items-center w-1/3 md:w-100 text-center'>
                <img
                  src='/img/logos/usedby/zapier-logo_white.png'
                  className='w-40 mx-auto'
                />
                <img
                  src='/img/logos/usedby/microsoft-white.png'
                  className='w-40 mx-auto'
                />
                <img
                  src='/img/logos/usedby/postman-white.png'
                  className='w-40 mx-auto'
                />
                <img
                  src='/img/logos/usedby/github-white.png'
                  className='w-40 mx-auto'
                />
              </div>

              <p className='text-white mx-4 my-5 dark:text-slate-400'>
                Please visit the JSON Schema{' '}
                <a
                  className='underline'
                  href='https://landscape.json-schema.org/'
                >
                  Landscape
                </a>{' '}
                and discover more companies using JSON Schema.
              </p>
            </div>
          </div>
        </section>
        {/* Feature */}
        <section className='max-w-[1400px] mt-12 lg:mt-[80px]'>
          <div className='w-5/6 md:w-1/2 text-center  mb-6  mx-auto '>
            <h2 className='text-h3mobile md:text-h3 font-bold mb-6 dark:text-slate-200'>
              Why JSON Schema?
            </h2>
            <p className='mb-6 text-h5mobile md:text-h5 leading-7 dark:text-slate-300'>
              While JSON is probably the most popular format for exchanging
              data, JSON Schema is the vocabulary that enables JSON data
              consistency, validity, and interoperability at scale.
            </p>
          </div>
          {/* Feature 4 section*/}
          <div className='w-5/6 lg:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-6   my-[85px] mx-auto '>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px] dark:shadow-slate-700'>
              <h3 className='text-h5mobile md:text-h5 font-semibold mb-6 dark:text-slate-200'>
                Streamline testing and validation
              </h3>
              <p className='dark:text-slate-300'>
                Simplify your validation logic to reduce your code’s complexity
                and save time on development. Define constraints for your data
                structures to catch and prevent errors, inconsistencies, and
                invalid data.
              </p>
            </div>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px] dark:shadow-slate-700'>
              <h3 className='text-h5mobile md:text-h5 font-semibold mb-6 dark:text-slate-200'>
                Exchange data seamlessly
              </h3>
              <p className='dark:text-slate-300'>
                Establish a common language for data exchange, no matter the
                scale or complexity of your project. Define precise validation
                rules for your data structures to create shared understanding
                and increase interoperability across different systems and
                platforms.
              </p>
            </div>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px] dark:shadow-slate-700'>
              <h3 className='text-h5mobile md:text-h5 font-semibold mb-6 dark:text-slate-200 '>
                Document your data
              </h3>
              <p className='dark:text-slate-300'>
                Create a clear, standardized representation of your data to
                improve understanding and collaboration among developers,
                stakeholders, and collaborators.
              </p>
            </div>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px] dark:shadow-slate-700'>
              <h3 className='text-h5mobile md:text-h5 font-semibold mb-6 dark:text-slate-200'>
                Vibrant tooling ecosystem
              </h3>
              <p className='dark:text-slate-300'>
                Adopt JSON Schema with an expansive range of community-driven
                tools, libraries, and frameworks across many programming
                languages.
              </p>
            </div>
          </div>
        </section>

        <section className='w-full h-[300px] lg:h-[367px] bg-gradient-to-r from-primary from-1.95% to-endBlue clip-both dark:from-[#002C34] dark:to-[#023e8a] grid items-center'>
          <div className='lg:w-full mx-auto text-center  '>
            <h2 className='text-h3mobile lg:text-h3 text-white mb-6'>
              Start learning JSON Schema
            </h2>
            <button className='w-[170px] h-[45px] mx-auto hover:bg-blue-700 transition-all duration-300 ease-in-out rounded border-2 bg-primary text-white font-semibold dark:border-none'>
              <a href='/docs '>Read the docs</a>
            </button>
          </div>
        </section>

        {/* SidebySide section*/}
        <section className='max-w-[1400px] w-full lg:flex lg:gap-20 my-16 '>
          <img
            src='/img/home-page/community-illustration.svg'
            className='w-5/6 mx-auto lg:w-[600px] xl:w-[800px]'
          />
          <div className='w-5/6 md:w-3/5 mx-auto mt-12'>
            <h3 className=' text-center lg:text-left text-h3mobile md:text-h3 font-semibold mb-4 dark:text-slate-200'>
              Explore the JSON Schema Ecosystem
            </h3>
            <p className='lg:pr-8 mb-4 text-center lg:text-left dark:text-slate-300'>
              Discover JSON Schema tooling to help your organization leverage
              the benefits of JSON Schema. Because JSON Schema is much more than
              a Specification, it is a vibrant ecosystem of Validators,
              Generators, Linters, and other JSON Schema Utilities made by this
              amazing Community.
            </p>
            <button className='w-full md:w-1/2 md:ml-28 lg:ml-0 mx-auto hover:bg-blue-700 transition-all duration-300 ease-in-out h-[45px] rounded border-2 bg-primary text-white dark:border-none'>
              <a href='/tools/'>Explore</a>
            </button>
          </div>
        </section>

        {/* Join community */}
        <h2 className='anchor'>
          <span id='community'></span>
        </h2>
        <section className='lg:my-12 max-w-[1400px]'>
          <div className='mb-12 md:w-3/4  mx-auto text-center'>
            <h2 className='text-h3mobile md:text-h3 font-semibold mb-2 dark:text-slate-200'>
              Welcome to the JSON Schema Community
            </h2>
            <p className='mx-6 md:w-3/4 md:mx-auto  lg:text-h5 dark:text-slate-300'>
              With over 60 million weekly downloads, JSON Schema has a large and
              active developer community across the world. Join the Community to
              learn, share ideas, ask questions, develop JSON Schema tooling and
              build new connections.
            </p>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 mx-auto w-5/6 md:w-3/5 lg:w-5/6'>
            <div className='p-4 w-full mb-6 dark:shadow-2xl'>
              <Link href='https://json-schema.org/slack'>
                <h3 className='mb-4 font-semibold flex items-center dark:text-slate-200'>
                  Join the JSON Schema Slack Workspace!
                  <img src='/img/logos/Slack-mark.svg' className='w-8 h-8' />
                </h3>
                <img
                  src='/img/home-page/slack-json-schema.png'
                  className='w-full mb-4'
                />
                {/* <h3 className='mb-4 font-semibold' >Event</h3> */}
                <p className='mb-4 dark:text-slate-300'>
                  Join our Slack to ask questions, get feedback on your
                  projects, and connect with +5000 practitioners and experts.
                </p>
              </Link>
              <button className='w-full lg:w-1/2 rounded border-2 bg-primary hover:bg-blue-700 transition-all duration-300 ease-in-out text-white h-[40px] flex items-center justify-center mx-auto dark:border-none'>
                <a
                  href='https://json-schema.org/slack'
                  className='flex items-center '
                >
                  <img
                    src='/img/logos/slack_logo_small-white.svg'
                    className='w-4 h-4 mr-2 '
                  />
                  Join Slack
                </a>
              </button>
            </div>
            {/* BlogPost Data */}
            <div className='p-4 w-full mb-6 dark:shadow-2xl'>
              <Link href={`/blog/posts/${blogPosts[0].slug}`}>
                <h3 className='mb-5 font-semibold pt-1 dark:text-slate-200'>
                  The JSON Schema Blog
                </h3>
                <img
                  src={blogPosts[0].frontmatter.cover}
                  className='w-full h-[232px]  mb-4'
                />
                <h3 className='mb-4 font-semibold dark:text-slate-300'>
                  {' '}
                  {blogPosts[0].frontmatter.title}
                </h3>
                <div className='mb-4'>
                  <TextTruncate
                    element='span'
                    line={4}
                    text={blogPosts[0].frontmatter.excerpt}
                  />
                </div>

                <div className='flex ml-2 mb-2 '>
                  {(blogPosts[0].frontmatter.authors || []).map(
                    (author: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className='bg-slate-50 h-[44px] w-[44px] rounded-full -ml-3 bg-cover bg-center border-2 border-white'
                          style={{
                            backgroundImage: `url(${author.photo})`,
                            zIndex: 10 - index,
                          }}
                        />
                      );
                    },
                  )}
                  <div className='flex flex-col ml-2'>
                    <p className='text-sm font-semibold dark:text-slate-300'>
                      {blogPosts[0].frontmatter.authors.length > 2 ? (
                        <>
                          {blogPosts[0].frontmatter.authors
                            .slice(0, 2)
                            .map((author: any, index: number) => (
                              <span key={author.name}>
                                {author.name}
                                {index === 0 && ' & '}
                              </span>
                            ))}
                          {'...'}
                        </>
                      ) : (
                        blogPosts[0].frontmatter.authors.map((author: any) => (
                          <span key={author.name}>{author.name}</span>
                        ))
                      )}
                    </p>

                    <div className='text-slate-500 text-sm dark:text-slate-300'>
                      <span>
                        {blogPosts[0].frontmatter.date} &middot; {timeToRead}{' '}
                        min read
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              <div>
                <Link
                  href={`/blog/posts/${blogPosts[0].slug}`}
                  className=' w-full lg:w-1/2 rounded border-2 bg-primary text-white hover:bg-blue-700 transition-all duration-300 ease-in-out h-[40px] text-center pt-1 semi-bold flex items-center justify-center mx-auto dark:border-none'
                >
                  Read more{' '}
                </Link>
              </div>
            </div>
            <div>
              <div className='p-4 md:w-full mb-6 mr-4 dark:shadow-2xl'>
                <h3 className='mb-2 font-semibold dark:text-slate-200'>
                  JSON Schema Community Meetings & Events
                </h3>
                <p className='mb-4 dark:text-slate-300'>
                  We hold monthly Office Hours and Open Community Working
                  Meetings. Office Hours are every first Tuesday of the month
                  and by appointment. Open Community Working Meetings are every
                  third Monday of the month at 12:00 PT.
                </p>
                <div className=''>
                  <button className='max-w-[300px] w-full text-center rounded border-2 bg-primary hover:bg-blue-700 transition-all duration-300 ease-in-out text-white  h-[40px] mb-4 flex items-center justify-center mx-auto dark:border-none'>
                    <a href='https://github.com/orgs/json-schema-org/discussions/35'>
                      Open Community Working Meetings
                    </a>
                  </button>
                  <button className='max-w-[200px] w-full text-center rounded border-2 bg-primary hover:bg-blue-700 transition-all duration-300 ease-in-out text-white  h-[40px] flex items-center justify-center mx-auto dark:border-none'>
                    <a href='https://github.com/orgs/json-schema-org/discussions/34/'>
                      Office Hours
                    </a>
                  </button>
                </div>
              </div>
              <div className='p-2'>
                <div>
                  <Headline4>Upcoming events</Headline4>
                  <div>
                    <ul>
                      {props.datesInfo.map((event: any, index: any) => (
                        <li key={index}>
                          <div className='flex mb-4'>
                            <p className='bg-btnOrange rounded-full w-10 h-10 p-2 text-center text-white mr-2'>
                              {event.day}
                            </p>
                            <div className='text-sm'>
                              <p>{event.title}</p>
                              <p>
                                <b>{event.time}</b> ({event.timezone})
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href='https://calendar.google.com/calendar/embed?src=json.schema.community%40gmail.com&ctz=Europe%2FLondon'
                  className='w-full lg:w-1/2 rounded border-2 bg-primary text-white hover:bg-blue-700 transition-all duration-300 ease-in-out h-[40px] text-center flex items-center justify-center mx-auto dark:border-none'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  View Calendar
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* News & Blogs */}

        <section className='w-full h-[300px] lg:h-[367px] bg-gradient-to-r from-primary from-1.95% to-endBlue clip-both dark:from-[#002C34] dark:to-[#023e8a] grid items-center'>
          <div className='lg:w-full mx-auto text-center'>
            <h2 className='text-h3mobile lg:text-h3 text-white mb-6 dark:text-slate-200'>
              Start contributing to JSON Schema
            </h2>
            <button className='w-[170px] h-[45px] mx-auto rounded border-2 bg-primary hover:bg-blue-700 transition-all duration-300 ease-in-out text-white font-semibold dark:border-none'>
              <a href='https://github.com/json-schema-org#-contributing-to-json-schema'>
                Contribute
              </a>
            </button>
          </div>
        </section>

        {/* Sponsors */}

        <section className='my-16'>
          <div className='text-center mb-4'>
            <h2 className='text-h3mobile md:text-h3 font-semibold mb-2 dark:text-slate-200'>
              Sponsors
            </h2>
            <p className='w-5/6 lg:w-3/5 mx-auto dark:text-slate-300'>
              If you ❤️ JSON Schema consider becoming a{' '}
              <a
                href='https://json-schema.org/overview/sponsors'
                className='border-b border-black'
              >
                sponsor
              </a>{' '}
              or a{' '}
              <a
                href='https://json-schema.org/overview/sponsors#benefits-of-being-an-individual-backer'
                className='border-b border-black '
              >
                backer
              </a>
              .
            </p>
            <p className='w-5/6 lg:w-3/5 mx-auto'>
              <a
                href='https://opencollective.com/json-schema'
                className='border-b border-black'
              >
                Support us!
              </a>
            </p>
          </div>
          <div className=' text-center mb-12 '>
            <h3 className='p-4 text-h4mobile md:text-h4 font-semibold my-4 dark:text-slate-200'>
              Gold Sponsors
            </h3>
            <a
              href='https://opencollective.com/json-schema/contribute/golden-sponsor-68354/checkout?interval=month&amount=1000&name=&legalName=&email='
              target='_blank'
              rel='noreferrer'
              className='w-[310px] h-[180px] mx-auto rounded-lg bg-primary text-white font-semibold flex items-center justify-center space-x-2 cursor-pointer px-3'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v16m8-8H4'
                />
              </svg>
              <p className='block'>Your logo here</p>
            </a>
            <h3 className='p-4 text-h4mobile md:text-h4 font-semibold my-4 dark:text-slate-200'>
              Silver Sponsors
            </h3>
            <a
              href='https://opencollective.com/json-schema/contribute/silver-sponsor-68353/checkout?interval=month&amount=500&name=&legalName=&email='
              target='_blank'
              rel='noreferrer'
              className='w-[200px] h-[120px] mx-auto rounded-lg bg-primary text-white font-semibold flex items-center justify-center space-x-2 cursor-pointer px-3'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v16m8-8H4'
                />
              </svg>
              <p>Your logo here</p>
            </a>
            <h3 className='p-4 text-h4mobile md:text-h4 font-semibold my-4 dark:text-slate-200'>
              Bronze Sponsors
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 items-center mx-auto  md:mx-0 px-4 '>
              <a
                href=' https://www.asyncapi.com/'
                target='_blank'
                rel='noreferrer'
              >
                <img src={asyncapi_logo} className=' w-44' />
              </a>
              <a
                href='https://www.airbnb.com/'
                target='_blank'
                rel='noreferrer'
              >
                <img src={airbnb_logo} className=' w-44' />
              </a>
              <a
                href='https://www.postman.com/'
                target='_blank'
                rel='noreferrer'
              >
                <img src={postman_logo} className=' w-44' />
              </a>
              <a href='https://endjin.com/' target='_blank' rel='noreferrer'>
                <img src={endjin_logo} className=' w-44' />
              </a>
              <a href='https://www.llc.org/' target='_blank' rel='noreferrer'>
                <img src={llc_logo} className=' w-44' />
              </a>
              <a
                href='https://www.vpsserver.com/en-us/'
                target='_blank'
                rel='noreferrer'
              >
                <img src={vpsserver_logo} className=' w-44' />
              </a>
              <a
                href='https://www.itflashcards.com/'
                target='_blank'
                rel='noreferrer'
              >
                <img src={itflashcards_logo} className=' w-44' />
              </a>
              <a
                href='https://www.route4me.com/'
                target='_blank'
                rel='noreferrer'
              >
                <img src={route4me_logo} className=' w-44' />
              </a>
              <a href='https://n8n.io/' target='_blank' rel='noreferrer'>
                <img src={n8n_logo} className=' w-44' />
              </a>
              <a href='https://copycopter.ai/' target='_blank' rel='noreferrer'>
                <img src={ccopter_logo} className=' w-44' />
              </a>
              <a href='https://www.octue.com/' target='_blank' rel='noreferrer'>
                <img src={octue_logo} className=' w-44' />
              </a>
              <a
                href='https://www.apideck.com/'
                target='_blank'
                rel='noreferrer'
              >
                <img src={apideck_logo} className=' w-44' />
              </a>
              <a
                href='https://opencollective.com/json-schema/contribute/sponsor-10816/checkout?interval=month&amount=100&name=&legalName=&email='
                target='_blank'
                rel='noreferrer'
                className='w-[155px] md:w-[176px] h-[44px] mx-auto rounded-lg bg-primary text-white font-semibold flex items-center justify-center space-x-2 cursor-pointer px-3'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 4v16m8-8H4'
                  />
                </svg>
                <p className='text-sm md:text-base'>Your logo here</p>
              </a>
            </div>
          </div>
        </section>

        {/* Supported */}

        <section className='my-20'>
          <div className='text-center mb-12'>
            <h2 className='text-h3mobile md:text-h3 font-semibold mb-2'>
              Supported by
            </h2>
            <p className='px-12 mx-auto'>
              The following companies support us by letting us use their
              products.
              <br />
              <a
                href='mailto:info@json-schema.org'
                className='border-b border-black'
              >
                Email us
              </a>{' '}
              for more info!
            </p>
          </div>
          <div className='flex flex-col items-center md:flex-row justify-center text-center gap-x-14 gap-y-4'>
            <a href='https://www.commonroom.io'>
              <img src={common_room_logo} className='w-48 md:w-56' />
            </a>
            <a href='https://json-schema.org/slack'>
              <img src={slack_logo} className='w-24 md:w-32' />
            </a>
          </div>{' '}
        </section>
      </div>
    </div>
  );
};

export default Home;
Home.getLayout = (page: React.ReactNode) => getLayout(page);
