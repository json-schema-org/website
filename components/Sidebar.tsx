import { getLayout as getSiteLayout } from './SiteLayout';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { HOST } from '~/lib/config';
import classnames from 'classnames';
import { SegmentHeadline } from './Layout';
import extractPathWithoutFragment from '~/lib/extractPathWithoutFragment';
import CarbonAds from './CarbonsAds';
import { useTheme } from 'next-themes';
import ExternalLinkIcon from '../public/icons/external-link-black.svg';

const DocLink = ({
  uri,
  label,
  onClick,
  setOpen,
}: {
  uri: string;
  label: string | React.ReactNode;
  onClick?: () => void;
  setOpen: (open: boolean) => void;
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
      className={classnames('text-sm block py-1 pl-2', {
        '  font-medium': !isActive,
        'text-primary dark:text-[#007bff] text-bold border-l-2 border-l-primary  font-semibold':
          isActive,
      })}
      onClick={() => {
        if (onClick) onClick();
        setOpen(false);
      }}
    >
      {label}
    </Link>
  );
};

const DocLinkBlank = ({
  uri,
  label,
  onClick,
  setOpen,
}: {
  uri: string;
  label: string | React.ReactNode;
  onClick?: () => void;
  setOpen: (open: boolean) => void;
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
      className={classnames('flex text-sm block  py-1 pl-2', {
        'font-medium': !isActive,
        'text-primary text-bold border-l-2 border-l-primary font-semibold':
          isActive,
      })}
      target='_blank'
      rel='noopener noreferrer'
      onClick={() => {
        if (onClick) onClick();
        setOpen(false);
      }}
      style={{
        position: 'relative',
        paddingRight: '1.25em',
      }}
    >
      {label}
      <span className='dark:invert flex justify-center items-center'>
        <ExternalLinkIcon
          style={{
            marginLeft: '0.25em',
            width: '1em',
            height: '1em',
          }}
        />
      </span>
    </Link>
  );
};
const SegmentSubtitle = ({ label }: { label: string }) => {
  return (
    <div className='text-sm italic text-slate-900 dark:text-slate-400 mt-2 mb-2'>
      {label}
    </div>
  );
};
const getDocsPath = [
  '/overview/what-is-jsonschema',
  '/overview/sponsors',
  '/overview/case-studies',
  '/overview/similar-technologies',
  '/overview/use-cases',
  '/overview/code-of-conduct',
  '/overview/faq',
  '/overview/roadmap',
];
const getStartedPath = [
  '/learn',
  '/learn/json-schema-examples',
  '/learn/file-system',
  '/learn/miscellaneous-examples',
  '/learn/getting-started-step-by-step',
];
const getReferencePath = [
  '/understanding-json-schema',
  '/understanding-json-schema/keywords',
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
  '/understanding-json-schema/reference/enum',
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
  '/draft/2020-12',
  '/draft/2019-09',
  '/draft-07',
  '/draft-06',
  '/draft-05',
  '/specification-links',
  '/specification/migration',
  '/specification/release-notes',
  '/specification/json-hyper-schema',
  '/specification',
  '/specification-links',
];

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rotateChevron, setRotateChevron] = useState(false);
  const handleRotate = () => setRotateChevron(!rotateChevron);
  const rotate = rotateChevron ? 'rotate(180deg)' : 'rotate(0)';
  const pathWtihoutFragment = extractPathWithoutFragment(router.asPath);
  useEffect(() => {
    if (window) {
      window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
          setOpen(false);
        }
      });
    }
  }, [typeof window !== 'undefined']);
  return (
    <div className='max-w-[1400px] mx-auto flex flex-col items-center'>
      <section>
        <div className='bg-primary dark:bg-slate-900 w-full h-12 mt-[4.5rem] z-150 flex relative flex-col justify-center items-center  lg:hidden '>
          <div
            className='z-[150] flex w-full bg-primary dark:bg-slate-900 justify-between items-center'
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              handleRotate();
              setOpen(!open);
            }}
          >
            {getDocsPath.includes(pathWtihoutFragment) && (
              <h3 className='text-white  ml-12'>Overview</h3>
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
          className={`z-[150] absolute top-10 mt-24 left-0 h-full w-screen bg-white dark:bg-slate-900 dark:shadow-lg transform ${open ? '-translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out filter drop-shadow-md `}
        >
          <div className='flex flex-col  dark:bg-slate-900'>
            <DocsNav open={open} setOpen={setOpen} />
          </div>
        </div>
        <div className='dark:bg-slate-800 max-w-[1400px] grid grid-cols-1 lg:grid-cols-4 mx-4 md:mx-12'>
          <div className='hidden lg:block mt-24'>
            <DocsNav open={open} setOpen={setOpen} />
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

export const DocsNav = ({
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
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

  const { resolvedTheme } = useTheme();

  const [learn_icon, setLearn_icon] = useState('');
  const [reference_icon, setReference_icon] = useState('');
  const [spec_icon, setSpec_icon] = useState('');
  const [overview_icon, setOverview_icon] = useState('');
  useEffect(() => {
    if (resolvedTheme === 'dark') {
      setOverview_icon('/icons/eye-dark.svg');
      setLearn_icon('/icons/compass-dark.svg');
      setReference_icon('/icons/book-dark.svg');
      setSpec_icon('/icons/clipboard-dark.svg');
    } else {
      setOverview_icon('/icons/eye.svg');
      setLearn_icon('/icons/compass.svg');
      setReference_icon('/icons/book.svg');
      setSpec_icon('/icons/clipboard.svg');
    }
  }, [resolvedTheme]);

  return (
    <div id='sidebar' className='lg:mt-8 w-4/5 mx-auto lg:ml-4'>
      <div className='my-2 bg-slate-200 dark:bg-slate-900 border-white border lg:border-hidden p-2 rounded'>
        <div
          className='flex justify-between w-full items-center'
          onClick={handleClickDoc}
        >
          <div className='flex  items-center align-middle'>
            <img src={`${overview_icon}`} alt='eye icon' className='mr-2' />
            <SegmentHeadline label='Overview' />
          </div>
          <svg
            style={{
              transform: rotate,
              transition: 'all 0.2s linear',
              cursor: 'pointer',
            }}
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
            setOpen={setOpen}
          />
          <DocLink uri='/overview/roadmap' label='Roadmap' setOpen={setOpen} />
          <DocLink
            uri='/overview/sponsors'
            label='Sponsors'
            setOpen={setOpen}
          />
          <DocLink
            uri='/overview/use-cases'
            label='Use Cases'
            setOpen={setOpen}
          />
          <DocLink
            uri='/overview/case-studies'
            label='Case Studies'
            setOpen={setOpen}
          />
          <DocLink uri='/overview/faq' label='FAQ' setOpen={setOpen} />
          <DocLink
            uri='/overview/similar-technologies'
            label='Similar Technologies'
            setOpen={setOpen}
          />
          <DocLinkBlank
            uri='https://landscape.json-schema.org'
            label='Landscape'
            setOpen={setOpen}
          />
          <DocLink
            uri='/overview/code-of-conduct'
            label='Code of Conduct'
            setOpen={setOpen}
          />
        </div>
      </div>
      {/* Get Started */}

      <div className='mb-2 bg-slate-200 dark:bg-slate-900 p-2 rounded border border-white  lg:border-hidden '>
        <div
          className='flex justify-between w-full items-center'
          onClick={handleClickGet}
        >
          <div className='flex  items-center align-middle'>
            <img src={`${learn_icon}`} alt='compass icon' className='mr-2' />
            <SegmentHeadline label='Getting Started' />
          </div>
          <svg
            style={{
              transform: rotateG,
              transition: 'all 0.2s linear',
              cursor: 'pointer',
            }}
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
          <DocLink uri='/learn' label='Overview' setOpen={setOpen} />
          <DocLink
            uri='/learn/getting-started-step-by-step'
            label='Creating your first schema'
            setOpen={setOpen}
          />
          <DocLinkBlank
            uri='https://tour.json-schema.org/'
            label='Tour of JSON Schema'
            setOpen={setOpen}
          />
          <SegmentSubtitle label='Examples' />
          <div className='pl-4 pb-1 pt-1'>
            <DocLink
              uri='/learn/miscellaneous-examples'
              label='Miscellaneous examples'
              setOpen={setOpen}
            />
            <DocLink
              uri='/learn/file-system'
              label='Modelling a file system'
              setOpen={setOpen}
            />
            <DocLink
              uri='/learn/json-schema-examples'
              label='Other examples'
              setOpen={setOpen}
            />
          </div>
        </div>
      </div>
      {/* Reference */}

      <div className='mb-2 bg-slate-200 dark:bg-slate-900 p-2 rounded border border-white lg:border-hidden '>
        <div
          className='flex justify-between w-full items-center'
          onClick={handleClickReference}
        >
          <div className='flex  items-center align-middle'>
            <img src={`${reference_icon}`} alt='book icon' className='mr-2' />
            <SegmentHeadline label='Reference' />
          </div>
          <svg
            style={{
              transform: rotateR,
              transition: 'all 0.2s linear',
              cursor: 'pointer',
            }}
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
          <DocLink
            uri='/learn/glossary'
            label='JSON Schema Glossary'
            setOpen={setOpen}
          />
          <DocLink
            uri='/understanding-json-schema/keywords'
            label='JSON Schema Keywords'
            setOpen={setOpen}
          />
          <DocLinkBlank
            uri='https://www.learnjsonschema.com/'
            label='Learn JSON Schema'
            setOpen={setOpen}
          />
          <DocLink
            uri='/understanding-json-schema'
            label='Understanding JSON Schema'
            setOpen={setOpen}
          />
          <div className='pl-4 pb-1 pt-1'>
            <DocLink
              uri='/understanding-json-schema/conventions'
              label='Conventions used'
              setOpen={setOpen}
            />
            <DocLink
              uri='/understanding-json-schema/about'
              label='What is a schema?'
              setOpen={setOpen}
            />
            <DocLink
              uri='/understanding-json-schema/basics'
              label='The basics'
              setOpen={setOpen}
            />
            <DocLink
              uri='/understanding-json-schema/reference'
              label='JSON Schema Reference'
              setOpen={setOpen}
            />
            <div className='pl-4 pb-1 pt-1'>
              <DocLink
                uri='/understanding-json-schema/reference/type'
                label='Type-specific keywords'
                setOpen={setOpen}
              />
              <div className='pl-4 pb-1 pt-1'>
                <DocLink
                  uri='/understanding-json-schema/reference/string'
                  label='string'
                  setOpen={setOpen}
                />
                <DocLink
                  uri='/understanding-json-schema/reference/regular_expressions'
                  label='regular expressions'
                  setOpen={setOpen}
                />
                <DocLink
                  uri='/understanding-json-schema/reference/numeric'
                  label='numeric types'
                  setOpen={setOpen}
                />
                <DocLink
                  uri='/understanding-json-schema/reference/object'
                  label='object'
                  setOpen={setOpen}
                />
                <DocLink
                  uri='/understanding-json-schema/reference/array'
                  label='array'
                  setOpen={setOpen}
                />
                <DocLink
                  uri='/understanding-json-schema/reference/boolean'
                  label='boolean'
                  setOpen={setOpen}
                />
                <DocLink
                  uri='/understanding-json-schema/reference/null'
                  label='null'
                  setOpen={setOpen}
                />
              </div>
              <DocLink
                uri='/understanding-json-schema/reference/generic'
                label='Generic keywords'
                setOpen={setOpen}
              />
              <div className='pl-4 pb-1 pt-1'>
                <DocLink
                  uri='/understanding-json-schema/reference/annotations'
                  label='Annotations'
                  setOpen={setOpen}
                />
                <DocLink
                  uri='/understanding-json-schema/reference/comments'
                  label='Comments'
                  setOpen={setOpen}
                />
                <DocLink
                  uri='/understanding-json-schema/reference/enum'
                  label='Enumerated values'
                  setOpen={setOpen}
                />
                <DocLink
                  uri='/understanding-json-schema/reference/const'
                  label='Constant values'
                  setOpen={setOpen}
                />
              </div>
              <DocLink
                uri='/understanding-json-schema/reference/non_json_data'
                label='Media: string-encoding non-JSON data'
                setOpen={setOpen}
              />
              <DocLink
                uri='/understanding-json-schema/reference/combining'
                label='Schema Composition'
                setOpen={setOpen}
              />
              <DocLink
                uri='/understanding-json-schema/reference/conditionals'
                label='Applying Subschemas Conditionally'
                setOpen={setOpen}
              />
              <DocLink
                uri='/understanding-json-schema/reference/schema'
                label='Declaring a Dialect'
                setOpen={setOpen}
              />
            </div>
            <DocLink
              uri='/understanding-json-schema/structuring'
              label='Structuring a complex schema'
              setOpen={setOpen}
            />
          </div>
          <DocLink
            uri='/implementers'
            label='For implementers'
            setOpen={setOpen}
          />
          <div className='pl-4 pb-1 pt-1'>
            <DocLink
              uri='/implementers/interfaces'
              label='Common Interfaces across Implementations'
              setOpen={setOpen}
            />
          </div>
        </div>
      </div>
      {/* Specification */}

      <div className='mb-2 bg-slate-200 dark:bg-slate-900 p-2 rounded border border-white lg:border-hidden '>
        <div
          className='flex justify-between w-full items-center'
          onClick={handleClickSpec}
        >
          <div className='flex  items-center align-middle'>
            <img src={`${spec_icon}`} alt='clipboard icon' className='mr-2' />
            <SegmentHeadline label='Specification' />
          </div>
          <svg
            id='arrow'
            className='arrow'
            style={{
              transform: rotateSpec,
              transition: 'all 0.2s linear',
              cursor: 'pointer',
            }}
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
          <DocLink uri='/specification' label='Overview' setOpen={setOpen} />

          <SegmentSubtitle label='Versions' />
          <div className='pl-4 pb-1 pt-1'>
            <DocLink uri='/draft/2020-12' label='2020-12' setOpen={setOpen} />

            <DocLink uri='/draft/2019-09' label='2019-09' setOpen={setOpen} />
            <DocLink uri='/draft-07' label='draft-07' setOpen={setOpen} />
            <DocLink uri='/draft-06' label='draft-06' setOpen={setOpen} />
            <DocLink uri='/draft-05' label='draft-05' setOpen={setOpen} />
          </div>

          <DocLink
            uri='/specification-links'
            label='Specification Links'
            setOpen={setOpen}
          />

          <DocLink
            uri='/specification/migration'
            label='Migration'
            setOpen={setOpen}
          />
          <DocLink
            uri='/specification/release-notes'
            label='Release Notes'
            setOpen={setOpen}
          />

          <DocLink
            uri='/specification/json-hyper-schema'
            label='JSON Hyper-Schema'
            setOpen={setOpen}
          />
        </div>
      </div>
    </div>
  );
};

export const getLayout = (page: React.ReactNode) =>
  getSiteLayout(<SidebarLayout>{page}</SidebarLayout>);
