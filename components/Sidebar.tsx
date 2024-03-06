import { getLayout as getSiteLayout } from './SiteLayout';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { HOST } from '~/lib/config';
import classnames from 'classnames';
import { SegmentHeadline } from './Layout';
import extractPathWithoutFragment from '~/lib/extractPathWithoutFragment';
import CarbonAds from './CarbonsAds';

const DocLink = ({
  uri,
  label,
}: {
  uri: string;
  label: string | React.ReactNode;
}) => {
  const router = useRouter();
  const url = new URL(`${router.asPath}`, HOST);
  url.search = '';
  url.hash = '';
  const stringUrl = url.toString().substr(HOST.length, Infinity);
  const isActive = uri === extractPathWithoutFragment(stringUrl);
  return (
    <Link
      href={uri}
      className={classnames('text-sm block border-l-2 py-1 pl-2', {
        '  font-medium': !isActive,
        'text-primary text-bold border-l-primary font-semibold': isActive,
      })}
    >
      {label}
    </Link>
  );
};

const DocLinkBlank = ({
  uri,
  label,
}: {
  uri: string;
  label: string | React.ReactNode;
}) => {
  const router = useRouter();
  const url = new URL(`${router.asPath}`, HOST);
  url.search = '';
  url.hash = '';
  const stringUrl = url.toString().substr(HOST.length, Infinity);
  const isActive = uri === extractPathWithoutFragment(stringUrl);
  return (
    <Link
      href={uri}
      className={classnames('text-sm block border-l-2 py-1 pl-2', {
        '  font-medium': !isActive,
        'text-primary text-bold border-l-primary font-semibold': isActive,
      })}
      target='_blank'
      rel='noopener noreferrer'
    >
      {label}
    </Link>
  );
};

const SegmentSubtitle = ({ label }: { label: string }) => {
  return <div className='text-sm italic text-slate-900 mt-2 mb-2'>{label}</div>;
};
const getDocsPath = [
  '/overview/what-is-jsonschema',
  '/overview/sponsors',
  '/overview/similar-technologies',
  '/overview/code-of-conduct',
];
const getStartedPath = [
  '/learn/json-schema-examples',
  '/learn/file-system',
  '/learn/miscellaneous-examples',
  '/learn/getting-started-step-by-step',
];
const getReferencePath = [
  '/understanding-json-schema',
  '/understanding-json-schema/basics',
  '/understanding-json-schema/conventions',
  '/understanding-json-schema/about',
  '/understanding-json-schema/credits',
  '/understanding-json-schema/structuring',
  '/understanding-json-schema/reference/annotations',
  '/understanding-json-schema/reference/array',
  '/understanding-json-schema/reference/boolean',
  '/understanding-json-schema/reference/combining',
  '/understanding-json-schema/reference/comments',
  '/understanding-json-schema/reference/conditionals',
  '/understanding-json-schema/reference/const',
  '/understanding-json-schema/reference/enums',
  '/understanding-json-schema/reference/non_json_data',
  '/understanding-json-schema/reference/null',
  '/understanding-json-schema/reference/numeric',
  '/understanding-json-schema/reference/object',
  '/understanding-json-schema/reference/regular_expressions',
  '/understanding-json-schema/reference/schema',
  '/understanding-json-schema/reference/string',
  '/understanding-json-schema/reference/type',
  '/understanding-json-schema/reference/generic',
  '/understanding-json-schema/reference',
  '/learn/glossary',
  '/implementers',
  '/implementers/interfaces',
];
const getSpecificationPath = [
  '/draft/2020-12/release-notes',
  '/draft/2019-09/release-notes',
  '/draft-07/json-schema-release-notes',
  '/draft-06/json-schema-release-notes',
  '/draft-05/readme',
  '/draft-07/json-hyper-schema-release-notes',
  '/draft-06/json-hyper-schema-release-notes',
  '/specification-links',
  '/specification',
];
export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rotateChevron, setRotateChevron] = useState(false);
  const handleRotate = () => setRotateChevron(!rotateChevron);
  const rotate = rotateChevron ? 'rotate(180deg)' : 'rotate(0)';
  const pathWtihoutFragment = extractPathWithoutFragment(router.asPath);
  return (
    <div className='max-w-[1400px] mx-auto flex flex-col items-center'>
      <section>
        <div className='bg-primary w-full h-12 mt-[4.5rem] z-150 flex relative flex-col justify-between items-center lg:hidden'>
          <div
            className='z-[150] flex w-full bg-primary justify-between items-center mt-2'
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              handleRotate();
              setOpen(!open);
            }}
          >
            {pathWtihoutFragment === '/overview/what-is-jsonschema' && (
              <h3 className='text-white ml-12'>Overview</h3>
            )}
            {getStartedPath.includes(pathWtihoutFragment) && (
              <h3 className='text-white ml-12'>Getting Started</h3>
            )}

            {getReferencePath.includes(pathWtihoutFragment) && (
              <h3 className='text-white ml-12'>Reference</h3>
            )}

            {getSpecificationPath.includes(pathWtihoutFragment) && (
              <h3 className='text-white ml-12'>Specification</h3>
            )}

            {router.pathname === null && (
              <h3 className='text-white ml-12'>Docs</h3>
            )}
            <svg
              style={{
                marginRight: '50px',
                color: 'white',
                transform: rotate,
                transition: 'all 0.2s linear',
              }}
              xmlns='http://www.w3.org/2000/svg'
              height='24'
              viewBox='0 0 256 512'
            >
              <path
                d='M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z'
                id='mainIconPathAttribute'
                fill='#ffffff'
              ></path>
            </svg>
          </div>
        </div>

        <div
          className={`z-[150] absolute top-10 mt-24 left-0 h-full w-screen bg-white transform ${open ? '-translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out filter drop-shadow-md `}
        >
          <div className='flex flex-col mt-4'>
            <DocsNav />
          </div>
        </div>

        <div className='max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-4 mx-4 md:mx-12'>
          <div className='hidden lg:block mt-24'>
            <DocsNav />
            <CarbonAds
              className='lg:mt-8 w-4/5 mx-auto lg:ml-4'
              variant='sidebar'
            />
          </div>
          <div className='col-span-4 md:col-span-3 lg:mt-20 lg:w-5/6 mx-4 md:mx-0'>
            {children}
          </div>
        </div>
      </section>
    </div>
  );
};

export const DocsNav = () => {
  const router = useRouter();

  /* eslint-disable no-constant-condition */
  const [active, setActive] = useState({
    getDocs: false,
    getStarted: false,
    getReference: false,
    getSpecification: false,
  });
  useEffect(() => {
    const pathWtihoutFragment = extractPathWithoutFragment(router.asPath);
    if (getDocsPath.includes(pathWtihoutFragment)) {
      setActive({ ...active, getDocs: true });
    } else if (getStartedPath.includes(pathWtihoutFragment)) {
      setActive({ ...active, getStarted: true });
    } else if (getReferencePath.includes(pathWtihoutFragment)) {
      setActive({ ...active, getReference: true });
    } else if (getSpecificationPath.includes(pathWtihoutFragment)) {
      setActive({ ...active, getSpecification: true });
    }
  }, [router.asPath]);

  const handleClickDoc = () => {
    setActive({ ...active, getDocs: !active.getDocs });
  };

  const handleClickGet = () => {
    setActive({ ...active, getStarted: !active.getStarted });
  };

  const handleClickReference = () => {
    setActive({ ...active, getReference: !active.getReference });
  };

  const handleClickSpec = () => {
    setActive({ ...active, getSpecification: !active.getSpecification });
  };

  const rotate = active.getDocs ? 'rotate(180deg)' : 'rotate(0)';
  const rotateG = active.getStarted ? 'rotate(180deg)' : 'rotate(0)';
  const rotateR = active.getReference ? 'rotate(180deg)' : 'rotate(0)';
  const rotateSpec = active.getSpecification ? 'rotate(180deg)' : 'rotate(0)';

  return (
    <div id='sidebar ' className='lg:mt-8 w-4/5 mx-auto lg:ml-4'>
      <div className='mb-2 bg-slate-200 p-2 rounded'>
        <div
          className='flex justify-between w-full items-center'
          onClick={handleClickDoc}
        >
          <div className='flex  items-center align-middle'>
            <img src='/icons/eye.svg' alt='eye icon' className='mr-2' />
            <SegmentHeadline label='Overview' />
          </div>
          <svg
            style={{ transform: rotate, transition: 'all 0.2s linear' }}
            id='arrow'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            height='32'
            viewBox='0 0 24 24'
            width='24'
          >
            <path
              clipRule='evenodd'
              d='m16.5303 8.96967c.2929.29289.2929.76777 0 1.06063l-4 4c-.2929.2929-.7677.2929-1.0606 0l-4.00003-4c-.29289-.29286-.29289-.76774 0-1.06063s.76777-.29289 1.06066 0l3.46967 3.46963 3.4697-3.46963c.2929-.29289.7677-.29289 1.0606 0z'
              fill='#707070'
              fillRule='evenodd'
            />
          </svg>
        </div>
        <div
          className={classnames('ml-6', { hidden: !active.getDocs })}
          id='overview'
        >
          <DocLink
            uri='/overview/what-is-jsonschema'
            label='What is JSON Schema?'
          />
          <DocLink uri='/overview/sponsors' label='Sponsors' />
          <DocLink
            uri='/overview/similar-technologies'
            label='Similar Technologies'
          />
          <DocLink uri='/overview/code-of-conduct' label='Code of Conduct' />
        </div>
      </div>
      {/* Get Started */}
      <div className='mb-2 bg-slate-200 p-2 rounded'>
        <div
          className='flex justify-between w-full items-center'
          onClick={handleClickGet}
        >
          <div className='flex  items-center align-middle'>
            <img src='/icons/compass.svg' alt='eye icon' className='mr-2' />
            <SegmentHeadline label='Getting Started' />
          </div>
          <svg
            style={{ transform: rotateG, transition: 'all 0.2s linear' }}
            id='arrow'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            height='32'
            viewBox='0 0 24 24'
            width='24'
          >
            <path
              clipRule='evenodd'
              d='m16.5303 8.96967c.2929.29289.2929.76777 0 1.06063l-4 4c-.2929.2929-.7677.2929-1.0606 0l-4.00003-4c-.29289-.29286-.29289-.76774 0-1.06063s.76777-.29289 1.06066 0l3.46967 3.46963 3.4697-3.46963c.2929-.29289.7677-.29289 1.0606 0z'
              fill='#707070'
              fillRule='evenodd'
            />
          </svg>
        </div>
        <div
          className={classnames('ml-6', { hidden: !active.getStarted })}
          id='getStarted'
        >
          <DocLink
            uri='/learn/getting-started-step-by-step'
            label='Creating your first schema'
          />
          <SegmentSubtitle label='Examples' />
          <div className='pl-4 pb-1 pt-1'>
            <DocLink
              uri='/learn/miscellaneous-examples'
              label='Miscellaneous examples'
            />
            <DocLink uri='/learn/file-system' label='Modelling a file system' />
            <DocLink uri='/learn/json-schema-examples' label='Other examples' />
          </div>
        </div>
      </div>
      {/* Reference */}
      <div className='mb-2 bg-slate-200 p-2 rounded'>
        <div
          className='flex justify-between w-full items-center'
          onClick={handleClickReference}
        >
          <div className='flex  items-center align-middle'>
            <img src='/icons/book.svg' alt='eye icon' className='mr-2' />
            <SegmentHeadline label='Reference' />
          </div>
          <svg
            style={{ transform: rotateR, transition: 'all 0.2s linear' }}
            id='arrow'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            height='32'
            viewBox='0 0 24 24'
            width='24'
          >
            <path
              clipRule='evenodd'
              d='m16.5303 8.96967c.2929.29289.2929.76777 0 1.06063l-4 4c-.2929.2929-.7677.2929-1.0606 0l-4.00003-4c-.29289-.29286-.29289-.76774 0-1.06063s.76777-.29289 1.06066 0l3.46967 3.46963 3.4697-3.46963c.2929-.29289.7677-.29289 1.0606 0z'
              fill='#707070'
              fillRule='evenodd'
            />
          </svg>
        </div>
        <div
          className={classnames('ml-6', { hidden: !active.getReference })}
          id='reference'
        >
          <DocLink uri='/learn/glossary' label='JSON Schema Glossary' />
          <DocLinkBlank
            uri='https://www.learnjsonschema.com/'
            label='Learn JSON Schema'
          />
          <DocLink
            uri='/understanding-json-schema'
            label='Understanding JSON Schema'
          />
          <div className='pl-4 pb-1 pt-1'>
            <DocLink
              uri='/understanding-json-schema/conventions'
              label='Conventions used'
            />
            <DocLink
              uri='/understanding-json-schema/about'
              label='What is a schema?'
            />
            <DocLink
              uri='/understanding-json-schema/basics'
              label='The basics'
            />
            <DocLink
              uri='/understanding-json-schema/reference'
              label='JSON Schema Reference'
            />
            <div className='pl-4 pb-1 pt-1'>
              <DocLink
                uri='/understanding-json-schema/reference/type'
                label='Type-specific keywords'
              />
              <div className='pl-4 pb-1 pt-1'>
                <DocLink
                  uri='/understanding-json-schema/reference/string'
                  label='string'
                />
                <DocLink
                  uri='/understanding-json-schema/reference/regular_expressions'
                  label='regular expressions'
                />
                <DocLink
                  uri='/understanding-json-schema/reference/numeric'
                  label='numeric types'
                />
                <DocLink
                  uri='/understanding-json-schema/reference/object'
                  label='object'
                />
                <DocLink
                  uri='/understanding-json-schema/reference/array'
                  label='array'
                />
                <DocLink
                  uri='/understanding-json-schema/reference/boolean'
                  label='boolean'
                />
                <DocLink
                  uri='/understanding-json-schema/reference/null'
                  label='null'
                />
              </div>
              <DocLink
                uri='/understanding-json-schema/reference/generic'
                label='Generic keywords'
              />
              <div className='pl-4 pb-1 pt-1'>
                <DocLink
                  uri='/understanding-json-schema/reference/annotations'
                  label='Annotations'
                />
                <DocLink
                  uri='/understanding-json-schema/reference/comments'
                  label='Comments'
                />
                <DocLink
                  uri='/understanding-json-schema/reference/enum'
                  label='Enumerated values'
                />
                <DocLink
                  uri='/understanding-json-schema/reference/const'
                  label='Constant values'
                />
              </div>
              <DocLink
                uri='/understanding-json-schema/reference/non_json_data'
                label='Media: string-encoding non-JSON data'
              />
              <DocLink
                uri='/understanding-json-schema/reference/combining'
                label='Schema Composition'
              />
              <DocLink
                uri='/understanding-json-schema/reference/conditionals'
                label='Applying Subschemas Conditionally'
              />
              <DocLink
                uri='/understanding-json-schema/reference/schema'
                label='Declaring a Dialect'
              />
            </div>
            <DocLink
              uri='/understanding-json-schema/structuring'
              label='Structuring a complex schema'
            />
          </div>
          <DocLink uri='/implementers' label='For implementers' />
          <div className='pl-4 pb-1 pt-1'>
            <DocLink
              uri='/implementers/interfaces'
              label='Common Interfaces across Implementations'
            />
          </div>
        </div>
      </div>
      {/* Specification */}
      <div className='mb-2 bg-slate-200 p-2 rounded'>
        <div
          className='flex justify-between w-full items-center'
          onClick={handleClickSpec}
        >
          <div className='flex  items-center align-middle'>
            <img src='/icons/clipboard.svg' alt='eye icon' className='mr-2' />
            <SegmentHeadline label='Specification' />
          </div>
          <svg
            id='arrow'
            className='arrow'
            style={{ transform: rotateSpec, transition: 'all 0.2s linear' }}
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            height='32'
            viewBox='0 0 24 24'
            width='24'
          >
            <path
              clipRule='evenodd'
              d='m16.5303 8.96967c.2929.29289.2929.76777 0 1.06063l-4 4c-.2929.2929-.7677.2929-1.0606 0l-4.00003-4c-.29289-.29286-.29289-.76774 0-1.06063s.76777-.29289 1.06066 0l3.46967 3.46963 3.4697-3.46963c.2929-.29289.7677-.29289 1.0606 0z'
              fill='#707070'
              fillRule='evenodd'
            />
          </svg>
        </div>
        <div
          className={classnames('ml-6', { hidden: !active.getSpecification })}
          id='specification'
        >
          <DocLink uri='/specification' label='Overview' />
          <DocLink uri='/draft/2020-12/release-notes' label='2020-12 notes' />
          <DocLink uri='/draft/2019-09/release-notes' label='2019-09 notes' />
          <DocLink
            uri='/draft-07/json-schema-release-notes'
            label='draft-07 notes'
          />
          <DocLink
            uri='/draft-06/json-schema-release-notes'
            label='draft-06 notes'
          />
          <DocLink uri='/draft-05/readme' label='draft-05 notes' />
          <SegmentSubtitle label='JSON Hyper-Schema' />
          <div className='pl-4 pb-1 pt-1'>
            <DocLink
              uri='/draft/2019-09/release-notes#hyper-schema-vocabulary'
              label='2019-09 notes'
            />
            <DocLink
              uri='/draft-07/json-hyper-schema-release-notes'
              label='draft-07 notes'
            />
            <DocLink
              uri='/draft-06/json-hyper-schema-release-notes'
              label='draft-06 notes'
            />
          </div>
          <DocLink uri='/specification-links' label='Specification Links' />
        </div>
      </div>
    </div>
  );
};

export const getLayout = (page: React.ReactNode) =>
  getSiteLayout(<SidebarLayout>{page}</SidebarLayout>);
