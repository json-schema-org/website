import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { Headline2 } from '~/components/Headlines';
import InfoIcon from '~/public/icons/icons8-info.svg';
import OutLinkIcon from '~/public/icons/outlink.svg';
import { Button } from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell as ShadcnTableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

import toTitleCase from '../lib/toTitleCase';
import type { GroupedTools, Transform } from '../hooks/useToolsTransform';
import type { BowtieReport, JSONSchemaTool } from '../JSONSchemaTool';
import Badge from './ui/Badge';

import ToolingDetailModal from './ToolingDetailModal';
import classnames from 'classnames';
import { postAnalytics } from '../lib/postAnalytics';
import Tag from './ui/Tag';

interface ToolingTableProps {
  toolsByGroup: GroupedTools;
  transform: Transform;
  setTransform: Dispatch<SetStateAction<Transform>>;
  numberOfTools: number;
}

const ToolingTable = ({
  toolsByGroup,
  transform,
  setTransform,
  numberOfTools,
}: ToolingTableProps) => {
  const [selectedTool, setSelectedTool] = useState<JSONSchemaTool | null>(null);
  const [bowtieReport, setBowtieReport] = useState<BowtieReport | null>(null);

  useEffect(() => {
    const fetchBowtieReport = async () => {
      try {
        const res = await fetch(
          'https://bowtie.report/api/v1/json-schema-org/implementations',
        );
        const bowtieReport: BowtieReport = await res.json();
        setBowtieReport(bowtieReport);
      } catch (error) {
        console.error('Error fetching Bowtie report:', error);
        setBowtieReport(null);
      }
    };

    fetchBowtieReport();
  }, []);

  const getBowtieData = (tool: JSONSchemaTool) => {
    if (!bowtieReport || !tool.source) return null;

    const cleanedSource = tool.source.replace(/^www\./, '').replace(/\/$/, '');

    const exactMatch = bowtieReport[cleanedSource];
    if (exactMatch) {
      return exactMatch;
    }

    const rootUrlRegex = /^(https?:\/\/[^/]+\/[^/]+\/[^/]+)/;

    const match = cleanedSource.match(rootUrlRegex);
    if (match) {
      const rootUri = match[1];
      const rootMatch = bowtieReport[rootUri];
      if (rootMatch) {
        return rootMatch;
      }
    }

    return null;
  };

  const groups = Object.keys(toolsByGroup);

  const openModal = (tool: JSONSchemaTool) => {
    setSelectedTool(tool);
    postAnalytics({
      eventType: 'about',
      eventPayload: {
        name: tool.name,
        toolingTypes: tool.toolingTypes,
        languages: tool.languages,
        environments: tool.environments,
        license: tool.license,
        supportedDialects: tool.supportedDialects,
      },
    });
  };

  const closeModal = () => {
    setSelectedTool(null);
  };

  if (numberOfTools === 0) {
    return (
      <div className='text-center py-12 text-gray-500 dark:text-gray-400 border'>
        <p className='text-lg'>No Tools Found :(</p>
        <p className='text-sm'>Try Adjusting Your Filters to Find More Tools</p>
      </div>
    );
  }

  return (
    <>
      {groups.map((group) => (
        <section key={group} className='mb-12 text-left'>
          {group !== 'none' && (
            <div className='mb-10 px-4 w-full bg-gray-100 dark:bg-slate-900'>
              <Headline2>{toTitleCase(group, '-')}</Headline2>
            </div>
          )}
          <div className='w-full'>
            {/* Desktop Table */}
            <div className='hidden lg:block'>
              <Table className='w-full table-fixed bg-white dark:bg-slate-800 border border-gray-200'>
                <TableHeader>
                  <TableRow className='border-b border-gray-200 hover:bg-transparent'>
                  <TableSortableColumnHeader
                    sortBy='name'
                    transform={transform}
                    setTransform={setTransform}
                    attributes={{
                      className: 'w-1/4',
                    }}
                  >
                    Name
                  </TableSortableColumnHeader>
                  {transform.groupBy !== 'toolingTypes' && (
                    <TableColumnHeader
                      attributes={{
                        className: 'w-1/6',
                      }}
                    >
                      Tooling Type
                    </TableColumnHeader>
                  )}
                  {transform.groupBy !== 'languages' && (
                    <TableColumnHeader
                      attributes={{ className: 'w-1/6' }}
                    >
                      Languages
                    </TableColumnHeader>
                  )}
                  <TableColumnHeader
                    attributes={{
                      className: '!px-0 w-1/4',
                    }}
                  >
                    Dialects
                  </TableColumnHeader>
                  <TableSortableColumnHeader
                    sortBy='license'
                    transform={transform}
                    setTransform={setTransform}
                    attributes={{ className: 'w-1/6' }}
                  >
                    License
                  </TableSortableColumnHeader>
                  <TableSortableColumnHeader
                    sortBy='bowtie'
                    transform={transform}
                    setTransform={setTransform}
                    attributes={{
                      className: 'text-center px-1 w-20',
                    }}
                  >
                    Bowtie
                  </TableSortableColumnHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {toolsByGroup[group].map((tool: JSONSchemaTool, index) => {
                  const bowtieData = getBowtieData(tool);
                  if (bowtieData) {
                    tool.bowtie = bowtieData;
                  }
                  return (
                    <TableRow
                      key={index}
                      className='hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer border-b border-gray-200'
                      onClick={() => openModal(tool)}
                    >
                      <TableCell
                        attributes={{
                          className: 'break-words',
                          title: 'See details',
                        }}
                      >
                        <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                          <span className={tool.name.split(' ').some((segment) => segment.length > 25) ? 'break-all' : 'break-words'}>
                            {tool.name}
                          </span>
                          {tool.status === 'obsolete' && (
                            <Tag intent='error'>{tool.status}</Tag>
                          )}
                        </div>
                      </TableCell>
                      {transform.groupBy !== 'toolingTypes' && (
                        <TableCell>
                          {tool.toolingTypes
                            ?.map((type) => toTitleCase(type, '-'))
                            .join(', ')}
                        </TableCell>
                      )}
                      {transform.groupBy !== 'languages' && (
                        <TableCell>
                          {tool.languages?.join(', ')}
                        </TableCell>
                      )}
                      <TableCell
                        attributes={{
                          className: '!px-0',
                        }}
                      >
                        <div className='flex flex-wrap gap-1'>
                          {tool.supportedDialects?.draft?.map((draft) => {
                            return <Badge key={draft}>{draft}</Badge>;
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {tool.license}
                      </TableCell>
                      <TableCell
                        attributes={{
                          className: 'text-center px-1',
                        }}
                      >
                        {bowtieReport && (
                          <div className='flex justify-center items-center h-full m-auto'>
                            {bowtieData ? (
                              <a
                                className='flex justify-center items-center h-full'
                                href={`https://bowtie.report/#/implementations/${bowtieData.id}`}
                                target='blank'
                                onClick={(event) => event.stopPropagation()}
                                title='See at Bowtie'
                              >
                                <OutLinkIcon className='fill-none stroke-current w-5 h-5 stroke-2' />
                              </a>
                            ) : (
                              <InfoIcon className='fill-none stroke-current w-5 h-5 stroke-2' />
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Table */}
            <div className='lg:hidden'>
              <Table className='w-full bg-white dark:bg-slate-800 border border-gray-200'>
                <TableBody>
                  {toolsByGroup[group].map((tool: JSONSchemaTool, index) => {
                    const bowtieData = getBowtieData(tool);
                    if (bowtieData) {
                      tool.bowtie = bowtieData;
                    }
                    return (
                      <TableRow
                        key={index}
                        className='border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer'
                        onClick={() => openModal(tool)}
                      >
                        <ShadcnTableCell className='p-3 relative text-base'>
                        {bowtieData && (
                          <div className='absolute top-0 right-0 m-2 text-sm text-gray-600 dark:text-gray-300 flex items-center'>
                            <span>Bowtie:</span>
                            <a
                              href={`https://bowtie.report/#/implementations/${bowtieData.id}`}
                              target='blank'
                              onClick={(event) => event.stopPropagation()}
                              title='See at Bowtie'
                              className='ml-1'
                            >
                              <OutLinkIcon className='fill-none stroke-current w-5 h-5 stroke-2' />
                            </a>
                          </div>
                        )}

                        <div className='flex justify-between items-center'>
                          <div className='font-medium text-base'>
                            {tool.name}
                            {tool.status === 'obsolete' && (
                              <Tag intent='error'>{tool.status}</Tag>
                            )}
                          </div>
                        </div>
                        <div className='text-sm text-gray-600 dark:text-gray-300 mt-1'>
                          Languages: {tool.languages?.join(', ')}
                        </div>
                        <div className='text-sm text-gray-600 dark:text-gray-300 mt-1'>
                          Supported Dialects:
                        </div>
                        <div className='flex flex-wrap gap-1 mt-1'>
                          {tool.supportedDialects?.draft?.map((draft) => (
                            <Badge key={draft}>{draft}</Badge>
                          ))}
                        </div>
                                                <div className='text-sm text-gray-600 dark:text-gray-300 mt-1'>
                          License: {tool.license}
                        </div>
                        </ShadcnTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      ))}
      {selectedTool && (
        <ToolingDetailModal tool={selectedTool} onClose={closeModal} />
      )}
    </>
  );
};
const TableColumnHeader = ({
  children,
  attributes: propAttributes,
}: {
  children: ReactNode | ReactNode[];
  attributes?: Record<string, any>;
}) => {
  return (
    <TableHead
      {...propAttributes}
      className={classnames(
        propAttributes?.className,
        'px-2 py-3 border-b border-gray-200 text-left align-middle font-semibold text-base whitespace-normal',
      )}
    >
      {children}
    </TableHead>
  );
};

const TableSortableColumnHeader = ({
  sortBy,
  transform,
  setTransform,
  children,
  attributes: propAttributes,
}: {
  sortBy: Transform['sortBy'];
  transform: Transform;
  setTransform: Dispatch<SetStateAction<Transform>>;
  children: ReactNode;
  attributes?: Record<string, any>;
}) => {
  const [isSortedBy, setIsSortedBy] = useState(transform.sortBy === sortBy);

  useEffect(() => {
    setIsSortedBy(transform.sortBy === sortBy);
  }, [transform.sortBy]);

  const sortByColumn = (e: React.MouseEvent) => {
    e.preventDefault();
    setTransform((prevTransform) => {
      const newSortOrder =
        prevTransform.sortBy === sortBy
          ? prevTransform.sortOrder === 'descending'
            ? 'ascending'
            : 'descending'
          : 'ascending';
      return {
        ...prevTransform,
        sortBy,
        sortOrder: newSortOrder,
      };
    });

    setIsSortedBy(true);
  };

  const rotateClass = transform.sortOrder === 'ascending' ? 'rotate-180' : '';

  return (
    <TableColumnHeader attributes={propAttributes}>
      <Button
        variant='ghost'
        className='flex items-center focus:outline-none'
        onClick={sortByColumn}
      >
        {children}
        {isSortedBy && (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            className={`w-4 h-4 ml-1 transform ${rotateClass}`}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M5 15l7-7 7 7'
            />
          </svg>
        )}
      </Button>
    </TableColumnHeader>
  );
};

const TableCell = ({
  children,
  attributes: propAttributes,
}: {
  children: ReactNode | ReactNode[];
  attributes?: Record<string, any>;
}) => {
  return (
    <ShadcnTableCell
      {...propAttributes}
      className={classnames(
        propAttributes?.className,
        'px-2 py-3 border-b border-gray-200 align-middle text-base whitespace-normal break-words',
      )}
      title={propAttributes?.title || 'See details'}
    >
      {children}
    </ShadcnTableCell>
  );
};

export default ToolingTable;
