import React, { useEffect } from 'react';

import Badge from './ui/Badge';
import type { JSONSchemaTool } from '../JSONSchemaTool';
import toTitleCase from '../lib/toTitleCase';

export default function ToolingDetailModal({
  tool,
  onClose,
}: {
  tool: JSONSchemaTool;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 overflow-x-hidden'>
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={onClose}
      ></div>
      <div
        className='bg-white dark:bg-slate-800 rounded-lg p-8 max-w-full lg:max-w-4xl w-10/12 lg:w-full relative top-8 z-50 max-h-[80vh] overflow-y-auto'
        style={{ overflowWrap: 'anywhere' }}
      >
        <div className='flex justify-end absolute top-0 right-0 mt-4 mr-4'>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <svg
              className='h-6 w-6 fill-current'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
            >
              <path d='M6.293 7.293a1 1 0 011.414 0L12 10.586l4.293-4.293a1 1 0 111.414 1.414L13.414 12l4.293 4.293a1 1 0 01-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L10.586 12 6.293 7.707a1 1 0 010-1.414z' />
            </svg>
          </button>
        </div>
        <div className='mt-4 flex flex-row items-center justify-start gap-2'>
          {tool.landscape?.logo && (
            <div className='p-2 flex flex-row items-center dark:bg-white rounded-md flex-none'>
              <img
                src={`img/tools/logos/${tool.landscape?.logo}`}
                className='h-[48px] w-[48px]'
              />
            </div>
          )}
          <div>
            <h2 className='text-h4 font-bold'>{tool.name}</h2>
            {tool.description && (
              <p className='text-gray-600 dark:text-slate-300 mt-1 text-sm md:text-base'>
                {tool.description}
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-col md:flex-row mt-6'>
          <div className='w-full md:w-1/2 md:pr-4'>
            {tool.source && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Source</h3>
                <a
                  href={tool.source}
                  target='blank'
                  className='text-blue-500 hover:underline'
                >
                  {tool.source}
                </a>
              </div>
            )}
            {tool.homepage && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Homepage</h3>
                <a
                  href={tool.homepage}
                  target='blank'
                  className='text-blue-500 hover:underline'
                >
                  {tool.homepage}
                </a>
              </div>
            )}
            {tool.license && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>License</h3>
                <p>{tool.license}</p>
              </div>
            )}
            {tool.compliance && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Compliance</h3>
                {tool.compliance.config && (
                  <div>
                    {tool.compliance.config.docs && (
                      <div className='mt-2'>
                        <h4 className='font-semibold'>Docs:</h4>
                        <a
                          href={tool.compliance.config.docs}
                          target='blank'
                          className='text-blue-500 hover:underline'
                        >
                          {tool.compliance.config.docs}
                        </a>
                      </div>
                    )}
                    {tool.compliance.config.instructions && (
                      <div className='mt-2'>
                        <h4 className='font-semibold'>Instructions:</h4>
                        <p>{tool.compliance.config.instructions}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {tool.toolingListingNotes && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Tooling Listing Notes</h3>
                <p>{tool.toolingListingNotes}</p>
              </div>
            )}
            {tool.creators && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Creators</h3>
                <ul className='list-disc list-inside'>
                  {tool.creators.map((creator, index) => (
                    <li key={index}>
                      <span>{creator.name ? creator.name : 'N.A.'}</span>
                      <span className='ml-1'>
                        (
                        {creator.username && creator.platform && (
                          <a
                            href={`https://${creator.platform}.com/${creator.username}`}
                            target='blank'
                            className='text-blue-500 hover:underline'
                          >
                            @{creator.username}
                          </a>
                        )}
                        )
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tool.maintainers && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Maintainers</h3>
                <ul className='list-disc list-inside'>
                  {tool.maintainers.map((maintainer, index) => (
                    <li key={index}>
                      <span>{maintainer.name ? maintainer.name : 'N.A.'}</span>
                      <span className='ml-1'>
                        (
                        {maintainer.username && maintainer.platform && (
                          <a
                            href={`https://${maintainer.platform}.com/${maintainer.username}`}
                            target='blank'
                            className='text-blue-500 hover:underline'
                          >
                            @{maintainer.username}
                          </a>
                        )}
                        )
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className='w-full md:w-1/2 md:pl-4'>
            {tool.supportedDialects && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Supported Dialects</h3>
                {tool.supportedDialects.draft && (
                  <div className='mt-2'>
                    <h4 className='text-[14px] font-semibold'>Draft:</h4>
                    <ul className='list-disc list-inside'>
                      {tool.supportedDialects.draft.map((draft) => (
                        <Badge key={draft}>{draft}</Badge>
                      ))}
                    </ul>
                  </div>
                )}
                {tool.supportedDialects.additional && (
                  <div className='mt-2'>
                    <h4 className='text-[14px] font-semibold'>Additional:</h4>
                    <ul className='list-disc list-inside'>
                      {tool.supportedDialects.additional.map(
                        (additional, index) => (
                          <li key={index}>
                            {additional.name} (
                            <a
                              href={additional.source}
                              target='blank'
                              className='text-blue-500 hover:underline'
                            >
                              Source
                            </a>
                            )
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {tool.bowtie?.badges && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Bowtie Report</h3>
                {tool.bowtie.badges.supported_versions && (
                  <div className='mt-2'>
                    <h4 className='text-[14px] font-semibold'>
                      Supported Versions:
                    </h4>
                    <BowtieReportBadge
                      uri={tool.bowtie.badges.supported_versions}
                    />
                  </div>
                )}
                {tool.bowtie.badges.compliance && (
                  <div className='mt-2'>
                    <h4 className='text-[14px] font-semibold'>Compliance:</h4>
                    {Object.values(tool.bowtie.badges.compliance).map(
                      (badgeURI) => {
                        return (
                          <BowtieReportBadge key={badgeURI} uri={badgeURI} />
                        );
                      },
                    )}
                  </div>
                )}
              </div>
            )}
            {tool.toolingTypes && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Tooling Types</h3>
                <ul className='list-disc list-inside'>
                  {tool.toolingTypes.map((type) => (
                    <Badge key={type}>{toTitleCase(type, '-')}</Badge>
                  ))}
                </ul>
              </div>
            )}
            {tool.languages && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Languages</h3>
                <ul className='list-disc list-inside'>
                  {tool.languages.map((language) => (
                    <Badge key={language}>{language}</Badge>
                  ))}
                </ul>
              </div>
            )}
            {tool.environments && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Environments</h3>
                <ul className='list-disc list-inside'>
                  {tool.environments.map((environment) => (
                    <Badge key={environment}>{environment}</Badge>
                  ))}
                </ul>
              </div>
            )}
            {tool.bowtie && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Bowtie Identifier</h3>
                <p>{tool.bowtie.identifier}</p>
              </div>
            )}
            {tool.dependsOnValidators && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Depends On Validators</h3>
                <ul className='list-disc list-inside'>
                  {tool.dependsOnValidators.map((validator, index) => (
                    <li key={index}>
                      <a
                        href={validator}
                        target='blank'
                        className='text-blue-500 hover:underline'
                      >
                        {validator}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tool.landscape?.optOut && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Landscape</h3>
                {/* {tool.landscape.logo && (
                  <div className='mt-2'>
                    <h4 className='font-semibold'>Logo:</h4>
                    <p>{tool.landscape.logo}</p>
                  </div>
                )} */}
                {tool.landscape.optOut !== undefined && (
                  <div className='mt-2'>
                    <h4 className='font-semibold'>Opt-Out:</h4>
                    <p>{tool.landscape.optOut ? 'Yes' : 'No'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const BowtieReportBadge = ({ uri }: { uri: string }) => {
  return (
    <img
      className='my-1'
      src={`https://img.shields.io/endpoint?url=${encodeURIComponent(uri)}`}
    />
  );
};
