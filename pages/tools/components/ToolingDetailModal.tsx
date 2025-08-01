import React, { useEffect, useState } from 'react';

import CancelIcon from '~/public/icons/cancel.svg';
import { Button } from '~/components/ui/button';

import Badge from './ui/Badge';
import type { JSONSchemaTool } from '../JSONSchemaTool';
import toTitleCase from '../lib/toTitleCase';
import Link from 'next/link';
import Image from 'next/image';
import Tag from './ui/Tag';
import StyledMarkdown from '~/components/StyledMarkdown';

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

  useEffect(() => {
    const clickEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', clickEsc);
    return () => {
      document.removeEventListener('keydown', clickEsc);
    };
  }, [onClose]);

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
        <div className='flex justify-end absolute top-0 right-0 mt-6 mr-6'>
          <Button
            onClick={onClose}
            variant='ghost'
            size='icon'
            className='text-gray-500 hover:text-gray-300'
          >
            <CancelIcon className='fill-current stroke-current w-4 h-4' />
          </Button>
        </div>
        <div className='mt-4 flex flex-row items-center justify-start gap-2'>
          {tool.landscape?.logo && (
            <div className='p-2 flex flex-row items-center dark:bg-white rounded-md flex-none'>
              <Image
                src={`img/tools/logos/${tool.landscape?.logo}`}
                className='h-[48px] w-[48px]'
                height={48}
                width={48}
                alt='landscape logos'
              />
            </div>
          )}
          <div>
            <h2 className='text-h4 font-bold flex items-center gap-x-2'>
              {tool.name}
              {tool.status === 'obsolete' && (
                <Tag intent='error'>{tool.status}</Tag>
              )}
            </h2>
            {tool.description && (
              <p className='text-gray-600 dark:text-slate-300 mt-1 text-sm md:text-base'>
                {tool.description}
              </p>
            )}
          </div>
        </div>
        <div className='columns-1 md:columns-2 gap-6 mt-6'>
          <div>
            {tool.source && (
              <div className='break-inside-avoid mb-4'>
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
              <div className='break-inside-avoid mb-4'>
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
              <div className='break-inside-avoid mb-4'>
                <h3 className='text-lg font-semibold'>License</h3>
                <p>{tool.license}</p>
              </div>
            )}

            {tool.compliance && (
              <div className='break-inside-avoid mb-4'>
                <h3 className='text-lg font-semibold'>Compliance</h3>
                {tool.compliance.config && (
                  <div>
                    {tool.compliance.config.docs && (
                      <div>
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
                      <div>
                        <h4 className='font-semibold'>Instructions:</h4>
                        <p>{tool.compliance.config.instructions}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {tool.toolingListingNotes && (
              <div className='break-inside-avoid mb-4'>
                <h3 className='text-lg font-semibold'>Tooling Listing Notes</h3>
                <StyledMarkdown markdown={tool.toolingListingNotes} />
              </div>
            )}

            {tool.creators && (
              <div className='break-inside-avoid mb-4'>
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
              <div className='break-inside-avoid mb-4'>
                <h3 className='text-lg font-semibold'>Maintainers</h3>
                <ul className='list-none list-inside'>
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

            {tool.supportedDialects && (
              <div className='break-inside-avoid mb-4'>
                <h3 className='text-lg font-semibold'>Supported Dialects</h3>
                {tool.supportedDialects.draft && (
                  <div>
                    <ul className='list-none list-inside'>
                      {tool.supportedDialects.draft.map((draft) => (
                        <Badge key={draft}>{draft}</Badge>
                      ))}
                    </ul>
                  </div>
                )}
                {tool.supportedDialects.additional && (
                  <div>
                    <h4 className='text-[14px] font-semibold'>Additional:</h4>
                    <ul className='list-none list-inside'>
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

            {tool.bowtie && (
              <div className='break-inside-avoid mb-4'>
                <h3 className='text-lg font-semibold'>Bowtie Report</h3>
                {tool.bowtie.badges_urls.supported_versions && (
                  <div>
                    <h4 className='text-[14px] font-semibold'>
                      Supported Versions:
                    </h4>
                    <BowtieReportBadge
                      uri={tool.bowtie.badges_urls.supported_versions}
                    />
                  </div>
                )}
                {tool.bowtie.badges_urls.compliance && (
                  <div>
                    <h4 className='text-[14px] font-semibold'>Compliance:</h4>
                    {Object.values(tool.bowtie.badges_urls.compliance).map(
                      (badgeURI) => (
                        <BowtieReportBadge key={badgeURI} uri={badgeURI} />
                      ),
                    )}
                  </div>
                )}
                <Link
                  className='text-[14px] underline italic'
                  href={`https://bowtie.report/#/implementations/${tool.bowtie.id}`}
                  target='_blank'
                >
                  View detailed report
                </Link>
              </div>
            )}

            {tool.toolingTypes && (
              <div className='break-inside-avoid mb-4'>
                <h3 className='text-lg font-semibold'>Tooling Types</h3>
                <ul className='list-none list-inside'>
                  {tool.toolingTypes.map((type) => (
                    <Badge key={type}>{toTitleCase(type, '-')}</Badge>
                  ))}
                </ul>
              </div>
            )}

            {tool.languages && (
              <div className='break-inside-avoid mb-4'>
                <h3 className='text-lg font-semibold'>Languages</h3>
                <ul className='list-none list-inside'>
                  {tool.languages.map((language) => (
                    <Badge key={language}>{language}</Badge>
                  ))}
                </ul>
              </div>
            )}

            {tool.environments && (
              <div className='break-inside-avoid mb-4'>
                <h3 className='text-lg font-semibold'>Environments</h3>
                <ul className='list-none list-inside'>
                  {tool.environments.map((environment) => (
                    <Badge key={environment}>{environment}</Badge>
                  ))}
                </ul>
              </div>
            )}

            {tool.bowtie && (
              <div className='break-inside-avoid mb-4'>
                <h3 className='text-lg font-semibold'>Bowtie Identifier</h3>
                <p>{tool.bowtie.id}</p>
              </div>
            )}

            {tool.dependsOnValidators && (
              <div className='break-inside-avoid mb-4'>
                <h3 className='text-lg font-semibold'>Depends On Validators</h3>
                <ul className='list-none list-inside'>
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
              <div className='break-inside-avoid mb-4'>
                <h3 className='text-lg font-semibold'>Landscape</h3>
                {tool.landscape.optOut !== undefined && (
                  <div>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const checkImage = async () => {
      try {
        const response = await fetch(
          `https://img.shields.io/endpoint?url=${encodeURIComponent(uri)}`,
        );
        if (response.ok) {
          setLoading(false);
        } else {
          setLoading(false);
          setError(true);
        }
      } catch (err) {
        setLoading(false);
        setError(true);
      }
    };
    checkImage();
  }, [uri]);

  return (
    <div className='my-1'>
      {loading && !error && (
        <div className='animate-pulse bg-gray-300 dark:bg-slate-600 h-6 w-[176px] rounded-md'></div>
      )}
      {!loading && !error && (
        <Image
          src={`https://img.shields.io/endpoint?url=${encodeURIComponent(uri)}`}
          alt='Bowtie Badge'
          className='my-1 h-[20px] w-auto'
          width={100}
          height={20}
        />
      )}
      {error && (
        <div className='text-red-500 text-sm mt-1'>Failed to load badge</div>
      )}
    </div>
  );
};
