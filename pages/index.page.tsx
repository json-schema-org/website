import React from 'react';
import { getLayout } from '../components/SiteLayout';
import { DocSearch } from '@docsearch/react';
import fs from 'fs';
import matter from 'gray-matter';
const PATH = 'pages/blog/posts';
import readingTime from 'reading-time';
import Link from 'next/link';
import TextTruncate from 'react-text-truncate';

import { Headline4 } from '~/components/Headlines';
import { GetStaticProps } from 'next';

/* eslint-disable */
import axios from 'axios';
import ical from 'node-ical';
import moment from 'moment-timezone';

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
        slug: slug,
        frontmatter,
        content,
      };
    })
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime();
      const dateB = new Date(b.frontmatter.date).getTime();
      return dateA < dateB ? 1 : -1;
    })
    .slice(0, 5);

  // Function to fetch the remote iCal file
  async function fetchRemoteICalFile(url: string) {
    try {
      const response = await axios.get(url, { method: 'no-cors' });
      return response.data;
    } catch (error) {
      console.error('Error fetching iCal file:', error);
      return null;
    }
  }
  // Example usage:
  const remoteICalUrl =
    'https://calendar.google.com/calendar/ical/c_8r4g9r3etmrmt83fm2gljbatos%40group.calendar.google.com/public/basic.ics'; // Replace with the actual URL
  const datesInfo = await fetchRemoteICalFile(remoteICalUrl)
    .then((icalData) => printEventsForNextFourWeeks(ical.parseICS(icalData)))
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
// Function to filter and print events for the next 4 weeks from today
function printEventsForNextFourWeeks(icalData: { [x: string]: any }) {
  const arrayDates = [];
  if (!icalData) {
    console.error('iCal data is empty or invalid.');
    return;
  }

  // Calculate the range of dates for the next 4 weeks from today
  const today = moment().startOf('day');
  const nextFourWeeksEnd = moment().add(4, 'weeks').endOf('day');

  // Loop through the events in the iCal data
  for (const k in icalData) {
    const event = icalData[k];

    if (event.type === 'VEVENT') {
      const title = event.summary;

      const timezoneL = moment.tz.guess(); // Default to UTC if timezone information is not provided
      const startDate = moment.tz(event.start, timezoneL);

      // Complicated case - if an RRULE exists, handle multiple recurrences of the event.
      if (event.rrule !== undefined) {
        // For recurring events, get the set of event start dates that fall within the range
        // of dates we're looking for.
        const dates = event.rrule.between(
          today.toDate(),
          nextFourWeeksEnd.toDate(),
          true,
        );

        // Loop through the set of date entries to see which recurrences should be printed.
        for (const date of dates) {
          const startDate = moment.tz(date, timezoneL);

          // Check if the event falls within the next 4 weeks from today
          if (startDate.isBetween(today, nextFourWeeksEnd, undefined, '[]')) {
            const dateTimezone = moment.tz.zone(event.start.tz);
            const localTimezone = moment.tz.guess();
            const tz =
              event.rrule.origOptions.tzid === localTimezone
                ? event.rrule.origOptions.tzid
                : localTimezone;
            const timezone = moment.tz.zone(tz);
            let offset;
            if (timezone && dateTimezone)
              offset = timezone.utcOffset(date) - dateTimezone.utcOffset(date);
            const newDate = moment(date).add(offset, 'minutes').toDate();

            const start = moment(newDate);
            const utcDate = start.utc();

            const time = utcDate.format('MMMM Do YYYY, h:mm a');
            const day = utcDate.format('D');
            const parsedStartDate = utcDate.format('YYYY-MM-DD HH:mm:ss');
            arrayDates.push({
              title,
              time,
              day,
              timezone: 'UTC',
              parsedStartDate,
            });
          }
        }
      } else {
        // Simple case - no recurrences, just print out the calendar event.
        if (startDate.isBetween(today, nextFourWeeksEnd, undefined, '[]')) {
          const utcDate = startDate.utc();

          const time = utcDate.format('MMMM Do YYYY, h:mm a');
          const day = utcDate.format('D');
          const parsedStartDate = startDate.format('YYYY-MM-DD HH:mm:ss');
          arrayDates.push({
            title,
            time,
            day,
            timezone: 'UTC',
            parsedStartDate,
          });
        }
      }
    }
  }

  arrayDates.sort(
    (x, y) =>
      new Date(x.parsedStartDate).getTime() -
      new Date(y.parsedStartDate).getTime(),
  );

  return arrayDates;
}
const Home = (props: any) => {
  const blogPosts = props.blogPosts;
  const timeToRead = Math.ceil(readingTime(blogPosts[0].content).minutes);

  return (
    <div>
      <div className='flex flex-col items-center'>
        {/* Hero  */}
        <section className='bg-[linear-gradient(72.68deg,_#002CC4_28.97%,_#5468FF_145.47%)] clip-bottom w-full'>
          <div className='max-w-[1400px] text-center mx-auto mt-24 lg:mt-40'>
            <h1 className='lg:leading-header text-h1mobile lg:text-h1 font-semibold text-white text-center px-1 md:px-0'>
              Build more. Break less. Empower others.
            </h1>
            <h2 className='lg:leading-6 text-center text-h5mobile md:text-h5  text-white mt-4 '>
              JSON Schema enables the confident and reliable use of the JSON
              data format.
            </h2>
            <div className='lg:w-[650px]  mx-auto my-10 grid grid-cols-1 lg:grid-cols-3 gap-8 justify-items-center'>
              <Link
                href='/learn/getting-started-step-by-step'
                className='flex items-center justify-center rounded border-2 border-white text-white w-[194px] h-[40px] font-semibold'
              >
                Getting started
              </Link>
              <Link
                href='/slack'
                className='flex items-center justify-center rounded border-2 border-white text-white  w-[194px] h-[40px] font-semibold'
              >
                Join Slack
              </Link>

              <div className='herobtn rounded border-2 border-white text-white mx-auto'>
                <DocSearch
                  appId='6ZT4KX2OUI'
                  apiKey='69f76fba13585144f6686622e9c8f2a8'
                  indexName='json-schema'
                />
              </div>
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
              <p className='text-white mx-4 my-5'>
                Please visit the official list of{' '}
                <a
                  className='underline'
                  href='https://github.com/json-schema-org/community/blob/main/ADOPTERS.md'
                >
                  adopters
                </a>{' '}
                and discover more companies using JSON Schema.
              </p>
            </div>
          </div>
        </section>
        {/* Feature */}
        <section className='max-w-[1400px] mt-12 lg:mt-[80px]'>
          <div className='w-5/6 md:w-1/2 text-center  mb-6  mx-auto'>
            <h2 className='text-h3mobile md:text-h3 font-bold mb-6'>
              Why JSON Schema?
            </h2>
            <p className='mb-6 text-h5mobile md:text-h5 leading-7'>
              While JSON is probably the most popular format for exchanging
              data, JSON Schema is the vocabulary that enables JSON data
              consistency, validity, and interoperability at scale.
            </p>
          </div>
          {/* Feature 4 section*/}
          <div className='w-5/6 lg:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-6   my-[85px] mx-auto '>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px]'>
              <h3 className='text-h5mobile md:text-h5 font-semibold mb-6'>
                Streamline testing and validation
              </h3>
              <p>
                Simplify your validation logic to reduce your code’s complexity
                and save time on development. Define constraints for your data
                structures to catch and prevent errors, inconsistencies, and
                invalid data.
              </p>
            </div>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px]'>
              <h3 className='text-h5mobile md:text-h5 font-semibold mb-6'>
                Exchange data seamlessly
              </h3>
              <p>
                Establish a common language for data exchange, no matter the
                scale or complexity of your project. Define precise validation
                rules for your data structures to create shared understanding
                and increase interoperability across different systems and
                platforms.
              </p>
            </div>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px]'>
              <h3 className='text-h5mobile md:text-h5 font-semibold mb-6'>
                Document your data
              </h3>
              <p>
                Create a clear, standardized representation of your data to
                improve understanding and collaboration among developers,
                stakeholders, and collaborators.
              </p>
            </div>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px]'>
              <h3 className='text-h5mobile md:text-h5 font-semibold mb-6'>
                Vibrant tooling ecosystem
              </h3>
              <p>
                Adopt JSON Schema with an expansive range of community-driven
                tools, libraries, and frameworks across many programming
                languages.
              </p>
            </div>
          </div>
        </section>

        <section className='w-full h-[300px] lg:h-[367px] bg-gradient-to-r from-primary from-1.95% to-endBlue clip-both grid items-center'>
          <div className='lg:w-full mx-auto text-center'>
            <h2 className='text-h3mobile lg:text-h3 text-white mb-6'>
              Start learning JSON Schema
            </h2>
            <button className='w-[170px] h-[45px] mx-auto rounded border-2 bg-primary text-white font-semibold'>
              <a href='/learn/getting-started-step-by-step '>Read the docs</a>
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
            <h3 className=' text-center lg:text-left text-h3mobile md:text-h3 font-semibold mb-4'>
              Explore the JSON Schema Ecosystem
            </h3>
            <p className='lg:pr-8 mb-4 text-center lg:text-left '>
              Discover JSON Schema tooling to help your organization leverage
              the benefits of JSON Schema. Because JSON Schema is much more than
              a Specification, it is a vibrant ecosystem of Validators,
              Generators, Linters, and other JSON Schema Utilities made by this
              amazing Community.
            </p>
            <button className='w-full md:w-1/2 md:ml-28 lg:ml-0 mx-auto  h-[45px] rounded border-2 bg-primary text-white'>
              <a href='/implementations/'>Explore</a>
            </button>
          </div>
        </section>

        {/* Join community */}
        <h2 className='anchor'>
          <span id='community'></span>
        </h2>
        <section className='lg:my-12 max-w-[1400px]'>
          <div className='mb-12 md:w-3/4  mx-auto text-center'>
            <h2 className='text-h3mobile md:text-h3 font-semibold mb-2'>
              Welcome to the JSON Schema Community
            </h2>
            <p className='mx-6 md:w-3/4 md:mx-auto  lg:text-h5'>
              With over 60 million weekly downloads, JSON Schema has a large and
              active developer community across the world. Join the Community to
              learn, share ideas, ask questions, develop JSON Schema tooling and
              build new connections.
            </p>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 mx-auto w-5/6 md:w-3/5 lg:w-5/6'>
            <div className='w-full mb-6'>
              <Link href='https://json-schema.org/slack'>
                <h3 className='mb-4 font-semibold flex items-center'>
                  Join the JSON Schema Slack Workspace!
                  <img src='/img/logos/Slack-mark.svg' className='w-8 h-8' />
                </h3>
                <img
                  src='/img/home-page/slack-json-schema.png'
                  className='w-full mb-4'
                />
                {/* <h3 className='mb-4 font-semibold' >Event</h3> */}
                <p className='mb-4'>
                  Join our Slack to ask questions, get feedback on your
                  projects, and connect with +5000 practitioners and experts.
                </p>
              </Link>
              <button className='w-full lg:w-1/2 rounded border-2 bg-primary text-white h-[40px] flex items-center justify-center'>
                <a
                  href='https://json-schema.org/slack'
                  className='flex items-center'
                >
                  <img
                    src='/img/logos/slack_logo_small-white.svg'
                    className='w-4 h-4 mr-2'
                  />
                  Join Slack
                </a>
              </button>
            </div>
            {/* BlogPost Data */}
            <div className='w-full mb-6'>
              <Link href={`/blog/posts/${blogPosts[0].slug}`}>
                <h3 className='mb-5 font-semibold pt-1'>
                  The JSON Schema Blog
                </h3>
                <img
                  src={blogPosts[0].frontmatter.cover}
                  className='w-full h-[232px]  mb-4'
                />
                <h3 className='mb-4 font-semibold'>
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
                  <div
                    className='bg-slate-50 h-[44px] w-[44px] rounded-full -ml-3 bg-cover bg-center border-2 border-white'
                    style={{
                      backgroundImage: `url(${blogPosts[0].frontmatter.authors[0].photo})`,
                    }}
                  />
                  <div className='flex flex-col ml-2'>
                    <p className='text-sm font-semibold'>
                      {blogPosts[0].frontmatter.authors[0].name}
                    </p>
                    <div className='text-slate-500 text-sm'>
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
                  className='w-full lg:w-1/2 rounded border-2 bg-primary text-white  h-[40px] text-center semi-bold flex items-center justify-center'
                >
                  Read more{' '}
                </Link>
              </div>
            </div>
            <div>
              <div className='md:w-full mb-6 mr-4'>
                <h3 className='mb-2 font-semibold'>
                  JSON Schema Community Meetings & Events
                </h3>
                <p className='mb-4'>
                  We hold monthly Office Hours and weekly Open Community Working
                  Meetings. Office Hours are every first Tuesday of the month at
                  15:00 BST, and by appointment. Open Community Working Meetings
                  are every Monday at 14:00 PT.
                </p>
                <div className=''>
                  <button className='max-w-[300px] w-full text-center rounded border-2 bg-primary text-white  h-[40px] mb-4 flex items-center justify-center'>
                    <a href='https://github.com/orgs/json-schema-org/discussions/35'>
                      Open Community Working Meetings
                    </a>
                  </button>
                  <button className='max-w-[200px] w-full text-center rounded border-2 bg-primary text-white  h-[40px] flex items-center justify-center'>
                    <a href='https://github.com/orgs/json-schema-org/discussions/34/'>
                      Office Hours
                    </a>
                  </button>
                </div>
              </div>
              <div>
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
                  href='https://calendar.google.com/calendar/u/0/embed?src=c_8r4g9r3etmrmt83fm2gljbatos@group.calendar.google.com'
                  className='w-full lg:w-1/2 rounded border-2 bg-primary text-white  h-[40px] text-center flex items-center justify-center'
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

        <section className='w-full h-[300px] lg:h-[367px] bg-gradient-to-r from-primary from-1.95% to-endBlue clip-both grid items-center'>
          <div className='lg:w-full mx-auto text-center'>
            <h2 className='text-h3mobile lg:text-h3 text-white mb-6'>
              Start contributing to JSON Schema
            </h2>
            <button className='w-[170px] h-[45px] mx-auto rounded border-2 bg-primary text-white font-semibold'>
              <a href='https://github.com/json-schema-org#-contributing-to-json-schema'>
                Contribute
              </a>
            </button>
          </div>
        </section>

        {/* Sponsors */}

        <section className='my-16'>
          <div className='text-center mb-12'>
            <h2 className='text-h3mobile md:text-h3 font-semibold mb-2'>
              Sponsors
            </h2>
            <p className='w-5/6 lg:w-3/5 mx-auto'>
              If you 🖤 JSON Schema consider becoming a{' '}
              <a
                href='https://opencollective.com/json-schema/contribute'
                className='border-b border-black'
              >
                sponsor
              </a>{' '}
              or a{' '}
              <a
                href='https://opencollective.com/json-schema/contribute'
                className='border-b border-black'
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
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 items-center mx-auto  md:mx-0 px-4'>
            <a href=' https://www.asyncapi.com/'>
              <img
                src='/img/logos/sponsors/asyncapi-logo-dark.svg'
                className=' w-44'
              />
            </a>
            <a href='https://www.airbnb.com/'>
              <img
                src='/img/logos/sponsors/airbnb-logo.svg'
                className=' w-44'
              />
            </a>
            <a href='https://stoplight.io/'>
              <img
                src='/img/logos/sponsors/stoplight-logo.svg'
                className=' w-44'
              />
            </a>
            <a href='https://www.postman.com/'>
              <img
                src='/img/logos/sponsors/Postman_logo-orange.svg'
                className='w-44'
              />
            </a>
            <a href='https://retool.com/'>
              <img
                src='/img/logos/sponsors/retool-logo.svg'
                className=' w-44'
              />
            </a>
            <a href='https://www.apideck.com/'>
              <img
                src='/img/logos/sponsors/apideck-logo.png'
                className=' w-44'
              />
            </a>
            <a href='https://endjin.com/'>
              <img
                src='/img/logos/sponsors/endjin-logo.svg'
                className=' w-44'
              />
            </a>
            <a href='https://www.llc.org/'>
              <img src='/img/logos/sponsors/llc-logo.svg' className=' w-44' />
            </a>
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
              <img
                src='/img/logos/supported/common-room.svg'
                className='w-48 md:w-56'
              />
            </a>
            <a href='https://json-schema.org/slack'>
              <img
                src='/img/logos/supported/slack-logo.svg'
                className='w-24 md:w-32'
              />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
Home.getLayout = (page: React.ReactNode) => getLayout(page);
