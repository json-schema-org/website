import React from 'react';
import fs from 'fs';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';
import NextPrevButton from '~/components/NavigationButtons';
import StyledMarkdown from '~/components/StyledMarkdown';

interface ContractorLink {
  title: string;
  url: string;
}

interface Contractor {
  name: string;
  bio: string;
  email?: string;
  website?: string;
  github: string;
  x?: string;
  mastodon?: string;
  linkedin?: string;
  incorporatedIn: string[];
  type: string;
  links: ContractorLink[];
}

export async function getStaticProps() {
  const contractorData = JSON.parse(
    fs.readFileSync(
      '_includes/community/programs/contractors/contractors.json',
      'utf-8'
    )
  ) as Contractor[];

  return {
    props: {
      contractorData,
    },
  };
}

interface ProHelpPageProps {
  contractorData: Contractor[];
}

export default function ProHelp({ contractorData }: ProHelpPageProps) {
  const newTitle = 'Need pro help with JSON Schema?';

  return (
    <SectionContext.Provider value="docs">
      <Head>
        <title>{newTitle}</title>
      </Head>
      <div
        className="max-w-screen-xl block lg:px-8 px-4 mx-auto w-full pt-0 mt-0"
        data-testid="pro-help"
      >
        <div>
          <Headline1>{newTitle}</Headline1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Whether you need training, personalized advice, or custom JSON Schema solutions, some members of the JSON Schema Technical Steering Committee (TSC) and Ambassadors programs offer pro services beyond community support. Don't hesitate in reaching out to discuss further.
          </p>
          <br />
          <p className="italic text-gray-600 dark:text-gray-400">
            Hiring our top contributors also helps funding the JSON Schema open-source organization, and as a consequence, the specifications that build on top of it, such as{' '}
            <a href="https://www.openapis.org" className="underline text-blue-600 dark:text-blue-400">
              OpenAPI
            </a>,{' '}
            <a href="https://www.asyncapi.com" className="underline text-blue-600 dark:text-blue-400">
              AsyncAPI
            </a>,{' '}
            <a href="https://raml.org" className="underline text-blue-600 dark:text-blue-400">
              RAML
            </a>,{' '}
            <a href="https://www.w3.org/WoT/" className="underline text-blue-600 dark:text-blue-400">
              W3C WoT
            </a>, and many more.
          </p>
          <br />
          <span className="font-bold text-[1.3rem] text-gray-800 dark:text-gray-200">Available Members</span>
          <div className="my-8 space-y-6">
            {contractorData.map((contractor) => (
              <div
                key={contractor.github}
                className="border border-solid border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900"
              >
             {/* Mobile Header */}
<div className="md:hidden">
  {/* Image and Main Title */}
  <div className="flex flex-row items-center space-x-4">
    {/* Image */}
    <div className="relative group flex-shrink-0">
      <img
        src={`https://github.com/${contractor.github}.png`}
        className="w-20 h-20 rounded-md border-4 border-blue-100 shadow-lg hover:border-blue-300 transition-all duration-300 dark:border-gray-600"
        alt={`${contractor.name}'s avatar`}
      />
      <div className="absolute inset-0 bg-blue-500/10 rounded-full mix-blend-multiply group-hover:opacity-0 transition-opacity duration-300" />
    </div>

    {/* Title and Type */}
    <div className="flex flex-col items-start space-y-2">
      <h1 className="text-[17px] font-bold text-gray-900 dark:text-gray-100">
        {contractor.name}
      </h1>
      <span className="text-base text-gray-500 dark:text-gray-800 border border-gray-200 uppercase bg-zinc-200 px-3 py-0.5 rounded">
        {contractor.type}
      </span>
    </div>
  </div>

  {/* Social Links */}
  <div className="mt-4 flex flex-row flex-wrap items-center gap-2">
    {contractor.website && (
      <a
        href={contractor.website}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
        title="Website"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>
        <span className="ml-1 whitespace-nowrap text-sm">Website</span>
      </a>
    )}
    {contractor.linkedin && (
      <a
        href={`https://www.linkedin.com/in/${contractor.linkedin}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
        title="LinkedIn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-5 h-5"
          fill="currentColor"
        >
          <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
        </svg>
        <span className="ml-1 whitespace-nowrap text-sm">LinkedIn</span>
      </a>
    )}
    {contractor.github && (
      <a
        href={`https://github.com/${contractor.github}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
        title="GitHub"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 496 512"
          className="w-5 h-5"
          fill="currentColor"
        >
          <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
        </svg>
        <span className="ml-1 whitespace-nowrap text-sm">GitHub</span>
      </a>
    )}
  </div>

  {/* Reach Out Button */}
  <div className="mt-4 flex justify-center">
    {contractor.email && (
      <a
        href={`mailto:${contractor.email}`}
        className="w-full sm:w-auto px-4 py-2 text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full shadow-xl transform transition-all duration-300 flex items-center justify-center gap-2 dark:from-blue-700 dark:to-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-700 hover:scale-105"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 11 4 6.01V6h16zm0 12H4V8.02l8 4.99 8-4.99V18z" />
        </svg>
        <span className="text-base font-semibold tracking-wide">Reach Out</span>
      </a>
    )}
  </div>
</div>

                {/* Desktop Header */}
                <div className="hidden md:flex flex-col md:flex-row items-center justify-between">
                  {/* Image and Name */}
                  <div className="flex items-center space-x-8 pr-8 border-r border-gray-200 dark:border-gray-700">
                    <div className="relative group">
                      <img
                        src={`https://github.com/${contractor.github}.png`}
                        className="w-32 h-32 rounded-md border-4 border-blue-100 shadow-lg hover:border-blue-300 transition-all duration-300 dark:border-gray-600"
                        alt={`${contractor.name}'s avatar`}
                      />
                      <div className="absolute inset-0 bg-blue-500/10 rounded-full mix-blend-multiply group-hover:opacity-0 transition-opacity duration-300" />
                    </div>
                    <div>
                      <h1 className="pb-2 text-[30px] font-bold text-gray-900 dark:text-gray-100">
                        {contractor.name}
                      </h1>

                      <span className=" text-base text-gray-500 dark:text-gray-800 border border-gray-200 uppercase bg-zinc-200 px-3 py-1.5 rounded">
                        {contractor.type}
                      </span>
                      {/* Social Links */}
                      <div className="pt-4 flex flex-row items-center space-x-4">
                        {contractor.website && (
                          <a
                            href={contractor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
                            title="Website"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                              />
                            </svg>
                            <span className="ml-1 whitespace-nowrap text-sm">Website</span>
                          </a>
                        )}
                        {contractor.linkedin && (
                          <a
                            href={`https://www.linkedin.com/in/${contractor.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
                            title="LinkedIn"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 448 512"
                              className="w-5 h-5"
                              fill="currentColor"
                            >
                              <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                            </svg>
                            <span className="ml-1 whitespace-nowrap text-sm">LinkedIn</span>
                          </a>
                        )}
                        {contractor.github && (
                          <a
                            href={`https://github.com/${contractor.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
                            title="GitHub"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 496 512"
                              className="w-5 h-5"
                              fill="currentColor"
                            >
                              <path d='M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z' />
                            </svg>
                            <span className="ml-1 whitespace-nowrap text-sm">GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>



                  <div className="flex-1 flex justify-center items-center">
                    {contractor.email && (
                      <a
                        href={`mailto:${contractor.email}`}
                        className="px-4 py-2 text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full shadow-xl transform transition-all duration-300 flex items-center gap-2 dark:from-blue-700 dark:to-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-700 hover:scale-105"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="w-5 h-5"
                        >
                          <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 11 4 6.01V6h16zm0 12H4V8.02l8 4.99 8-4.99V18z" />
                        </svg>
                        <span className="text-base font-semibold tracking-wide">Reach Out</span>
                      </a>
                    )}
                  </div>



                </div>

                {/* End of Header */}
                <div className="mt-6 border-t pt-6 border-gray-100 dark:border-gray-700">
                  <StyledMarkdown markdown={contractor.bio} />
                </div>
                <div className="mt-6 border-t pt-6 border-gray-100 dark:border-gray-700">
                  <p className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">
                    Previous work and relevant links
                  </p>
                  <ul className="grid grid-cols-1 gap-3">
                    {contractor.links.map((link) => (
                      <li key={link.url} className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        <a
                          href={link.url}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors break-words"
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        <NextPrevButton
          prevLabel="FAQ"
          prevURL="/overview/faq"
          nextLabel="Similar Technologies"
          nextURL="/overview/similar-technologies"
        />
        <DocsHelp />
      </div>
    </SectionContext.Provider>
  );
}

ProHelp.getLayout = getLayout;
