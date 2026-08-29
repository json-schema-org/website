import React, { useEffect, useMemo, useState } from 'react';
import { getLayout } from '../components/SiteLayout';
import { DocSearch } from '@docsearch/react';
import fs from 'fs';
import matter from 'gray-matter';
const PATH = 'pages/blog/posts';
import readingTime from 'reading-time';
import Link from 'next/link';
import TextTruncate from 'react-text-truncate';
import Image from 'next/image';
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

type CalendarEvent = {
  title: string;
  time: string;
  day: string;
  timezone: string;
  parsedStartDate: string;
};

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
      return { slug, frontmatter, content };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    )
    .slice(0, 5);
  const remoteICalUrl =
    'https://calendar.google.com/calendar/ical/info%40json-schema.org/public/basic.ics';
  let datesInfo: CalendarEvent[] = [];
  try {
    const icalData = await fetchRemoteICalFile(remoteICalUrl);
    if (icalData) {
      const parsed = ical.parseICS(icalData) as Record<string, unknown>;
      const events = printEventsForNextWeeks(parsed) as
        | CalendarEvent[]
        | undefined;
      datesInfo = events ?? [];
    }
  } catch (error) {
    console.error('Error fetching iCal data:', error);
  }
  return { props: { blogPosts, datesInfo, fallback: false } };
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

const UPCOMING_EVENTS_PREVIEW = 2;

function UpcomingEventsList({ events }: { events: CalendarEvent[] }) {
  const [expanded, setExpanded] = React.useState(false);
  if (!events || events.length === 0) {
    return (
      <p className='text-sm text-slate-500 dark:text-slate-400'>
        No upcoming events scheduled.
      </p>
    );
  }
  const visible = expanded ? events : events.slice(0, UPCOMING_EVENTS_PREVIEW);
  const hasMore = events.length > UPCOMING_EVENTS_PREVIEW;
  return (
    <>
      <ul className='space-y-2'>
        {visible.map((event, index) => (
          <li key={index}>
            <div className='flex items-start'>
              <p className='bg-btnOrange rounded-full w-10 h-10 flex items-center justify-center text-white mr-3 text-sm font-semibold shrink-0'>
                {event.day}
              </p>
              <div className='text-sm leading-snug'>
                <p className='font-medium text-slate-800 dark:text-slate-100'>
                  {event.title}
                </p>
                <p className='text-slate-500 dark:text-slate-400'>
                  <b>{event.time}</b> ({event.timezone})
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          type='button'
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className='mt-2 text-sm font-semibold text-primary hover:text-blue-700 dark:text-linkBlue dark:hover:text-blue-400 transition-colors'
        >
          {expanded
            ? 'Show less'
            : `Read more (${events.length - UPCOMING_EVENTS_PREVIEW} more)`}
        </button>
      )}
    </>
  );
}

type SponsorEntry = {
  name: string;
  href: string;
  logoKey: keyof LogosMap;
  width?: number;
  className?: string;
};

type LogosMap = Record<string, string>;

const MARQUEE_BASE_DURATION_S = 25;
const SECONDS_PER_LOGO = 1.5;

function SponsorMarquee({
  sponsors,
  logos,
}: {
  sponsors: SponsorEntry[];
  logos: LogosMap;
}) {
  const duration = Math.max(
    MARQUEE_BASE_DURATION_S,
    sponsors.length * SECONDS_PER_LOGO,
  );
  const renderGroup = (isDuplicate: boolean) => (
    <div
      className='flex shrink-0 items-center gap-16 animate-marquee group-hover:[animation-play-state:paused] will-change-transform'
      aria-hidden={isDuplicate ? true : undefined}
    >
      {sponsors.map((s) => {
        const src = logos[s.logoKey] ?? logos.asyncapi ?? '';
        if (!logos[s.logoKey] && process.env.NODE_ENV !== 'production') {
          console.warn(
            `[SponsorMarquee] Missing logo for key "${s.logoKey}" (sponsor: ${s.name})`,
          );
        }
        const img = (
          <Image
            src={src}
            alt={isDuplicate ? '' : `${s.name} logo`}
            width={150}
            height={48}
            className={
              s.className ?? 'h-12 w-auto max-w-[150px] object-contain'
            }
          />
        );
        return (
          <div
            key={`${isDuplicate ? 'b-' : 'a-'}${s.name}`}
            className='marquee-item flex h-20 w-48 items-center justify-center shrink-0'
          >
            {isDuplicate ? (
              img
            ) : (
              <a
                href={s.href}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={s.name}
                className='flex items-center justify-center w-full h-full'
              >
                {img}
              </a>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className='relative w-full flex overflow-hidden py-8 group gap-16'
      style={{
        ['--gap' as any]: '4rem',
        ['--duration' as any]: `${duration}s`,
        maskImage:
          'linear-gradient(to right, transparent 0, black 60px, black calc(100% - 60px), transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0, black 60px, black calc(100% - 60px), transparent 100%)',
      }}
    >
      {renderGroup(false)}
      {renderGroup(true)}
    </div>
  );
}

const BRONZE_SPONSORS: SponsorEntry[] = [
  { name: 'AsyncAPI', href: 'https://www.asyncapi.com/', logoKey: 'asyncapi' },
  { name: 'Airbnb', href: 'https://www.airbnb.com/', logoKey: 'airbnb' },
  { name: 'LLC', href: 'https://www.llc.org/', logoKey: 'llc' },
  {
    name: 'VPS Server',
    href: 'https://www.vpsserver.com/en-us/',
    logoKey: 'vpsserver',
  },
  {
    name: 'Route4Me',
    href: 'https://www.route4me.com/',
    logoKey: 'route4me',
  },
  { name: 'n8n', href: 'https://n8n.io/', logoKey: 'n8n' },
  {
    name: 'Apideck',
    href: 'https://www.apideck.com/',
    logoKey: 'apideck',
  },
  {
    name: 'RxDB',
    href: 'https://rxdb.info/?utm_source=sponsor&utm_medium=json-schema&utm_campaign=json-schema',
    logoKey: 'rxdb',
  },
  { name: 'Anon Stories', href: 'https://anonstories.com', logoKey: 'anon' },
  { name: 'Supadata', href: 'https://supadata.ai/', logoKey: 'supadata' },
  { name: 'dottxt', href: 'https://dottxt.ai/', logoKey: 'dottxt' },
  {
    name: 'Sourcemeta',
    href: 'https://www.sourcemeta.com/',
    logoKey: 'sourcemeta',
  },
  { name: 'N-iX', href: 'https://www.n-ix.com/', logoKey: 'nix' },
  { name: 'Oracle', href: 'https://www.oracle.com/', logoKey: 'oracle' },
  {
    name: 'Spin the wheel',
    href: 'https://spinthewheel.io/',
    logoKey: 'spinthewheel',
  },
  {
    name: 'Time Now',
    href: 'https://time.now/',
    logoKey: 'timenow',
    className: 'w-44 h-auto max-h-20 object-contain',
  },
  {
    name: 'BairesDev',
    href: 'https://www.bairesdev.com/',
    logoKey: 'bairesdev',
  },
];

if (process.env.NODE_ENV !== 'production') {
  const missing = BRONZE_SPONSORS.filter((s) => s.logoKey === undefined);
  if (missing.length) {
    console.warn(
      '[SponsorMarquee] Bronze sponsors missing logoKey:',
      missing.map((s) => s.name),
    );
  }
}

const LOGOS_PATHS: { darkLogos: LogosMap; lightLogos: LogosMap } = {
  darkLogos: {
    asyncapi: '/img/logos/dark-mode/asyncapi_white.svg',
    airbnb: '/img/logos/dark-mode/airbnb_white.png',
    postman: '/img/logos/usedby/postman-white.png',
    endjin: '/img/logos/sponsors/endjin-logo.svg',
    llc: '/img/logos/dark-mode/llc_white.svg',
    common_room: '/img/logos/dark-mode/common-room_white.svg',
    slack: '/img/logos/dark-mode/slack_white.svg',
    vpsserver: '/img/logos/sponsors/vps-server-logo.svg',
    itflashcards: '/img/logos/sponsors/it_flashcards-white.svg',
    route4me: '/img/logos/sponsors/route4me-logo-dark.svg',
    n8n: '/img/logos/sponsors/n8n-logo-dark.svg',
    ccopter: '/img/logos/sponsors/copycopter-white.png',
    octue: '/img/logos/sponsors/octue-white.svg',
    apideck: '/img/logos/sponsors/apideck-white.svg',
    rxdb: '/img/logos/sponsors/rxdb.svg',
    wda: '/img/logos/sponsors/wda-dark.svg',
    anon: '/img/logos/sponsors/anon-white.png',
    sourcemeta: '/img/logos/sponsors/sourcemeta-logo-light.svg',
    dottxt: '/img/logos/sponsors/dottxt-logo-white.svg',
    supadata: '/img/logos/sponsors/supadata-logo-light.svg',
    devevents: '/img/logos/dark-mode/dev_events_logo.png',
    nix: '/img/logos/sponsors/n-ix-logo.png',
    oracle: '/img/logos/sponsors/Oracle.png',
    litslink: '/img/logos/sponsors/litslink_dark.svg',
    spinthewheel: '/img/logos/sponsors/spinthewheel.svg',
    timenow: '/img/logos/sponsors/time_now_dark.svg',
    legasset: '/img/logos/sponsors/legasset-logo.svg',
    bairesdev: '/img/logos/sponsors/bairesdev-logo-orange-light.svg',
  },
  lightLogos: {
    asyncapi: '/img/logos/sponsors/asyncapi-logo-dark.svg',
    airbnb: '/img/logos/sponsors/airbnb-logo.png',
    postman: '/img/logos/sponsors/postman_logo-orange.svg',
    endjin: '/img/logos/sponsors/endjin-logo.svg',
    llc: '/img/logos/sponsors/llc-logo.svg',
    common_room: '/img/logos/supported/common-room.svg',
    slack: '/img/logos/supported/slack-logo.svg',
    vpsserver: '/img/logos/sponsors/vps-server-logo.svg',
    itflashcards: '/img/logos/sponsors/it_flashcards.svg',
    route4me: '/img/logos/sponsors/route4me-logo-white.svg',
    n8n: '/img/logos/sponsors/n8n-logo-white.svg',
    ccopter: '/img/logos/sponsors/copycopter.png',
    octue: '/img/logos/sponsors/octue-black.svg',
    apideck: '/img/logos/sponsors/apideck.svg',
    rxdb: '/img/logos/sponsors/rxdb.svg',
    wda: '/img/logos/sponsors/wda.svg',
    anon: '/img/logos/sponsors/anon-black.png',
    sourcemeta: '/img/logos/sponsors/sourcemeta-logo-dark.svg',
    supadata: '/img/logos/sponsors/supadata-logo-dark.svg',
    dottxt: '/img/logos/sponsors/dottxt-logo-dark.svg',
    devevents: '/img/logos/dark-mode/dev_events_logo.png',
    nix: '/img/logos/sponsors/n-ix-logo.png',
    oracle: '/img/logos/sponsors/Oracle.png',
    spinthewheel: '/img/logos/sponsors/spinthewheel.svg',
    litslink: '/img/logos/sponsors/litslink_white.svg',
    timenow: '/img/logos/sponsors/time_now_white.svg',
    legasset: '/img/logos/sponsors/legasset-logo-dark.svg',
    bairesdev: '/img/logos/sponsors/bairesdev-logo-orange-dark.svg',
  },
};

if (process.env.NODE_ENV !== 'production') {
  const bronzeKeys = new Set(BRONZE_SPONSORS.map((s) => s.logoKey));
  const lightKeys = new Set(Object.keys(LOGOS_PATHS.lightLogos));
  const darkKeys = new Set(Object.keys(LOGOS_PATHS.darkLogos));
  const missingInLight = [...bronzeKeys].filter(
    (k) => !lightKeys.has(k as string),
  );
  const missingInDark = [...bronzeKeys].filter(
    (k) => !darkKeys.has(k as string),
  );
  if (missingInLight.length || missingInDark.length) {
    console.warn(
      `[SponsorMarquee] Bronze logoKey(s) not present in LOGOS_PATHS — light: ${JSON.stringify(missingInLight)}, dark: ${JSON.stringify(missingInDark)}`,
    );
  }
}

const Home = (props: any) => {
  const blogPosts = props.blogPosts;
  const timeToRead = Math.ceil(readingTime(blogPosts[0].content).minutes);
  const { resolvedTheme } = useTheme();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure the component is only rendered client-side
    setIsClient(true);
  }, []);

  const logos = useMemo(
    () =>
      (resolvedTheme === 'dark'
        ? LOGOS_PATHS.darkLogos
        : LOGOS_PATHS.lightLogos) ?? LOGOS_PATHS.lightLogos,
    [resolvedTheme],
  );
  const mounted = isClient && resolvedTheme !== undefined;
  return (
    <div>
      <div className='flex flex-col items-center'>
        {/* Hero  */}
        <section className='bg-[linear-gradient(72.68deg,_#002CC4_28.97%,_#5468FF_145.47%)] clip-bottom w-full dark:bg-[linear-gradient(72.68deg,_#002C34_28.97%,_#5468FF_145.47%)]'>
          <div className='max-w-[1400px] text-center mx-auto mt-24 lg:mt-40'>
            <h1 className='lg:leading-header text-h1mobile lg:text-h1 font-semibold text-white text-center px-1 md:px-0 dark:text-slate-200'>
              Build more. Break less. Empower others.
            </h1>

            <h2 className='lg:leading-6 text-center text-h5mobile md:text-h5  text-white mt-4 px-4 md:px-0 dark:text-slate-300'>
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
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center rounded border-2 border-white dark:border-none hover:bg-blue-700 transition-all duration-300 ease-in-out text-white  w-[194px] h-[40px] font-semibold bg-primary dark:shadow-2xl'
              >
                Join Slack
              </Link>
              <AlgoliaSearch />
            </div>

            <div className='mb-16 md:mb-36  mx-auto w-full md:w-5/6 lg:w-full'>
              <h3 className='text-white text-xl mb-4'>Used by</h3>

              <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto items-center w-1/3 md:w-100 text-center'>
                {isClient && (
                  <>
                    <Image
                      src='/img/logos/usedby/zapier-logo_white.png'
                      className='w-40 mx-auto'
                      alt='zapier'
                      height={40}
                      width={160}
                    />
                    <Image
                      src='/img/logos/usedby/microsoft-white.png'
                      className='w-40 mx-auto'
                      alt='microsoft'
                      height={40}
                      width={160}
                    />
                    <Image
                      src='/img/logos/usedby/postman-white.png'
                      className='w-40 mx-auto'
                      alt='postman'
                      height={40}
                      width={160}
                    />
                    <Image
                      src='/img/logos/usedby/github-white.png'
                      className='w-40 mx-auto'
                      alt='github'
                      height={40}
                      width={160}
                    />
                  </>
                )}
              </div>

              <p className='text-white mx-4 my-5 dark:text-slate-400'>
                Please visit the JSON Schema{' '}
                <a
                  className='underline'
                  href='https://landscape.json-schema.org/'
                  target='_blank'
                  rel='noopener noreferrer'
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
            <div className='w-full shadow-3xl rounded-[10px] p-[20px] dark:shadow-slate-700 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-[0_10px_40px_rgba(0,44,196,0.15)] dark:hover:shadow-[0_10px_40px_rgba(84,104,255,0.2)]'>
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
            <div className='w-full shadow-3xl rounded-[10px] p-[20px] dark:shadow-slate-700 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-[0_10px_40px_rgba(0,44,196,0.15)] dark:hover:shadow-[0_10px_40px_rgba(84,104,255,0.2)]'>
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
            <div className='w-full shadow-3xl rounded-[10px] p-[20px] dark:shadow-slate-700 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-[0_10px_40px_rgba(0,44,196,0.15)] dark:hover:shadow-[0_10px_40px_rgba(84,104,255,0.2)]'>
              <h3 className='text-h5mobile md:text-h5 font-semibold mb-6 dark:text-slate-200 '>
                Document your data
              </h3>
              <p className='dark:text-slate-300'>
                Create a clear, standardized representation of your data to
                improve understanding and collaboration among developers,
                stakeholders, and collaborators.
              </p>
            </div>
            <div className='w-full shadow-3xl rounded-[10px] p-[20px] dark:shadow-slate-700 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-[0_10px_40px_rgba(0,44,196,0.15)] dark:hover:shadow-[0_10px_40px_rgba(84,104,255,0.2)]'>
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
            <Link
              href='/docs'
              rel='noopener noreferrer'
              className='w-[170px] h-[45px] mx-auto hover:bg-blue-700 transition-all duration-300 ease-in-out rounded border-2 bg-primary text-white font-semibold dark:border-none flex items-center justify-center'
            >
              Read the docs
            </Link>
          </div>
        </section>

        {/* SidebySide section*/}
        <section className='max-w-[1400px] w-full lg:flex lg:gap-20 my-16 '>
          {isClient && (
            <>
              <Image
                src='/img/home-page/community-illustration.svg'
                className='w-5/6 mx-auto lg:w-[600px] xl:w-[800px]'
                alt='community'
                height={600}
                width={800}
              />
            </>
          )}
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
            <Link
              href='/tools/'
              rel='noopener noreferrer'
              className='w-full md:w-1/2 md:ml-28 lg:ml-0 mx-auto hover:bg-blue-700 transition-all duration-300 ease-in-out h-[45px] rounded border-2 bg-primary text-white dark:border-none flex items-center justify-center'
            >
              Explore
            </Link>
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
            <div className='p-5 w-full dark:shadow-2xl rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col'>
              <Link
                href='https://json-schema.org/slack'
                target='_blank'
                rel='noopener noreferrer'
                className='flex-1'
              >
                <h3 className='mb-3 font-semibold flex items-center gap-2 dark:text-slate-200'>
                  Join the JSON Schema Slack Workspace!
                  {isClient && (
                    <Image
                      src='/img/logos/Slack-mark.svg'
                      className='size-5'
                      alt='slack'
                      height={20}
                      width={20}
                    />
                  )}
                </h3>

                <div className='relative mb-3 overflow-hidden rounded-md border border-slate-200 dark:border-slate-700'>
                  <Image
                    src='/img/home-page/slack-json-schema.png'
                    className='w-full h-auto'
                    alt='JSON Schema Slack workspace'
                    width={480}
                    height={240}
                    sizes='(max-width: 768px) 100vw, 33vw'
                  />
                </div>

                <p className='mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 text-balance'>
                  Join our Slack to ask questions, get feedback on your
                  projects, and connect with +5000 practitioners and experts.
                </p>
              </Link>
              <Link
                href='https://json-schema.org/slack'
                target='_blank'
                rel='noreferrer'
                className='w-full rounded border-2 bg-primary hover:bg-blue-700 transition-all duration-300 ease-in-out text-white h-[40px] flex items-center justify-center dark:border-none text-sm font-semibold'
              >
                {isClient && (
                  <Image
                    src='/img/logos/slack_logo_small-white.svg'
                    className='w-4 h-4 mr-2'
                    width={16}
                    height={16}
                    alt='slack'
                  />
                )}
                Join Slack
              </Link>
            </div>
            {/* BlogPost Data */}
            <div className='p-5 w-full dark:shadow-2xl rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col'>
              <Link
                href={`/blog/posts/${blogPosts[0].slug}`}
                className='flex-1'
              >
                <h3 className='mb-3 font-semibold pt-1 dark:text-slate-200'>
                  The JSON Schema Blog
                </h3>
                {isClient && (
                  <Image
                    src={blogPosts[0].frontmatter.cover}
                    className='w-full h-[180px] object-cover rounded mb-3'
                    width={600}
                    height={180}
                    alt='blog'
                  />
                )}
                <h3 className='mb-2 font-semibold text-base dark:text-slate-200'>
                  {blogPosts[0].frontmatter.title}
                </h3>
                <div className='mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>
                  <TextTruncate
                    element='span'
                    line={3}
                    text={blogPosts[0].frontmatter.excerpt}
                  />
                </div>

                <div className='flex items-center ml-1 mb-2'>
                  {(blogPosts[0].frontmatter.authors || []).map(
                    (author: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className='bg-slate-50 h-[32px] w-[32px] rounded-full -ml-2 bg-cover bg-center border-2 border-white'
                          style={{
                            backgroundImage: `url(${author.photo})`,
                            zIndex: 10 - index,
                          }}
                        />
                      );
                    },
                  )}
                  <div className='flex flex-col ml-3 text-sm'>
                    <p className='font-semibold dark:text-slate-200'>
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

                    <div className='text-slate-500 dark:text-slate-400'>
                      <span>
                        {blogPosts[0].frontmatter.date} &middot; {timeToRead}{' '}
                        min read
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href={`/blog/posts/${blogPosts[0].slug}`}
                className='w-full rounded border-2 bg-primary text-white hover:bg-blue-700 transition-all duration-300 ease-in-out h-[40px] flex items-center justify-center dark:border-none text-sm font-semibold'
              >
                Read more
              </Link>
            </div>
            <div className='lg:col-span-1 flex flex-col gap-4'>
              <div className='p-5 w-full dark:shadow-2xl rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col'>
                <h3 className='mb-2 font-semibold dark:text-slate-200'>
                  JSON Schema Community Meetings &amp; Events
                </h3>
                <p className='mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>
                  We hold monthly Office Hours and Open Community Working
                  Meetings. Office Hours are every first Tuesday of the month
                  and by appointment. Open Community Working Meetings are every
                  third Monday of the month at 12:00 PT.
                </p>
                <div className='flex flex-col gap-2 mt-auto'>
                  <a
                    href='https://github.com/orgs/json-schema-org/discussions/35'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full text-center rounded border-2 bg-primary hover:bg-blue-700 transition-all duration-300 ease-in-out text-white min-h-[40px] px-4 py-2 flex items-center justify-center dark:border-none text-sm font-semibold'
                  >
                    Open Community Working Meetings
                  </a>

                  <a
                    href='https://github.com/orgs/json-schema-org/discussions/34/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full text-center rounded border-2 bg-primary hover:bg-blue-700 transition-all duration-300 ease-in-out text-white h-[40px] flex items-center justify-center dark:border-none text-sm font-semibold'
                  >
                    Office Hours
                  </a>
                </div>
              </div>
              <div className='p-5 w-full dark:shadow-2xl rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col'>
                <Headline4>Upcoming events</Headline4>
                <div className='mt-2 mb-4 flex-1'>
                  <UpcomingEventsList events={props.datesInfo} />
                </div>

                <a
                  href='https://calendar.google.com/calendar/embed?src=info%40json-schema.org'
                  className='w-full rounded border-2 bg-primary text-white hover:bg-blue-700 transition-all duration-300 ease-in-out h-[40px] flex items-center justify-center dark:border-none text-sm font-semibold'
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
            <Link
              href='https://github.com/json-schema-org#-contributing-to-json-schema'
              rel='noopener noreferrer'
              target='_blank'
              className='w-[170px] h-[45px] mx-auto rounded border-2 bg-primary hover:bg-blue-700 transition-all duration-300 ease-in-out text-white font-semibold dark:border-none flex items-center justify-center'
            >
              Contribute
            </Link>
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
                className='border-b border-black dark:border-white'
                target='_blank'
                rel='noopener noreferrer'
              >
                sponsor
              </a>{' '}
              or a{' '}
              <a
                href='https://json-schema.org/overview/sponsors#benefits-of-being-an-individual-backer'
                className='border-b border-black dark:border-white'
                target='_blank'
                rel='noopener noreferrer'
              >
                backer
              </a>{' '}
              .
            </p>

            <p className='w-5/6 lg:w-3/5 mx-auto'>
              <a
                href='https://opencollective.com/json-schema'
                className='border-b border-black dark:border-white'
                target='_blank'
                rel='noopener noreferrer'
              >
                Support us!
              </a>
            </p>
          </div>
          <div className=' text-center mb-12 '>
            <h3
              className='p-4 text-h4mobile md:text-h4 font-semibold my-4 dark:text-slate-200'
              id='gold-sponsors'
            >
              Gold Sponsors
            </h3>
            <Link
              href='https://opencollective.com/json-schema/contribute/golden-sponsor-68354/checkout?interval=month&amount=1000&name=&legalName=&email='
              target='_blank'
              rel='noopener noreferrer'
              className='w-[310px] h-[180px] mx-auto rounded-lg bg-primary text-white font-semibold flex items-center justify-center space-x-2 cursor-pointer px-3 transition-transform duration-300 hover:scale-105'
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
            </Link>
            <h3
              className='p-4 text-h4mobile md:text-h4 font-semibold my-4 dark:text-slate-200'
              id='silver-sponsors'
            >
              Silver Sponsors
            </h3>
            <Link
              href='https://opencollective.com/json-schema/contribute/silver-sponsor-68353/checkout?interval=month&amount=500&name=&legalName=&email='
              target='_blank'
              rel='noopener noreferrer'
              className='w-[200px] h-[120px] mx-auto rounded-lg bg-primary text-white font-semibold flex items-center justify-center space-x-2 cursor-pointer px-3 transition-transform duration-300 hover:scale-105'
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
            </Link>
            <h3
              className='p-4 text-h4mobile md:text-h4 font-semibold my-4 dark:text-slate-200'
              id='bronze-sponsors'
            >
              Bronze Sponsors
            </h3>
            <div className='w-full'>
              {mounted ? (
                <SponsorMarquee sponsors={BRONZE_SPONSORS} logos={logos} />
              ) : (
                <div
                  className='relative w-full flex overflow-hidden py-8 gap-16'
                  aria-hidden='true'
                  style={{ minHeight: '160px' }}
                />
              )}
            </div>
            <div className='flex justify-center mt-8'>
              <a
                href='https://opencollective.com/json-schema/contribute/sponsor-10816/checkout?interval=month&amount=100&name=&legalName=&email='
                target='_blank'
                rel='noopener noreferrer'
                className='w-[155px] md:w-[176px] h-[44px] rounded-lg bg-primary text-white font-semibold flex items-center justify-center space-x-2 cursor-pointer px-3 transition-transform duration-300 hover:scale-105'
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

        <section className='my-16'>
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
                className='border-b border-black dark:border-white'
              >
                Email us
              </a>{' '}
              for more info!
            </p>
          </div>
          <div className='flex flex-col items-center md:flex-row justify-center text-center gap-x-14 gap-y-4'>
            <a
              href='https://www.commonroom.io'
              target='_blank'
              rel='noopener noreferrer'
            >
              {isClient && (
                <>
                  <Image
                    src={logos.common_room}
                    className='w-48 md:w-56'
                    width={192}
                    height={224}
                    alt='n8n'
                  />
                </>
              )}
            </a>
            <a
              href='https://json-schema.org/slack'
              target='_blank'
              rel='noopener noreferrer'
            >
              {isClient && (
                <>
                  <Image
                    src={logos.slack}
                    className=' w-24 md:w-32'
                    width={96}
                    height={128}
                    alt='slack'
                  />
                </>
              )}
            </a>
          </div>{' '}
        </section>
      </div>
    </div>
  );
};

export default Home;
Home.getLayout = (page: React.ReactNode) => getLayout(page);
