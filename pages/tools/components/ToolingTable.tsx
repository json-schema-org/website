import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Headline2 } from '~/components/Headlines';
import InfoIcon from '~/public/icons/icons8-info.svg';
import OutLinkIcon from '~/public/icons/outlink.svg';
import { Button } from '~/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
} from 'lucide-react';

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
  onVisibleToolCountChange?: (count: number) => void;
}

const INITIAL_VISIBLE_ROWS = 5;

const ToolingTable = ({
  toolsByGroup,
  transform,
  setTransform,
  onVisibleToolCountChange,
}: ToolingTableProps) => {
  const [selectedTool, setSelectedTool] = useState<JSONSchemaTool | null>(null);
  const [bowtieReport, setBowtieReport] = useState<BowtieReport | null>(null);
  const [isLoadingBowtie, setIsLoadingBowtie] = useState<boolean>(true);
  const [bowtieError, setBowtieError] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  const fetchBowtieReport = useCallback(async () => {
    setIsLoadingBowtie(true);
    setBowtieError(null);
    try {
      const res = await fetch(
        'https://bowtie.report/api/v1/json-schema-org/implementations',
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch Bowtie data: ${res.status}`);
      }
      const data: BowtieReport = await res.json();
      setBowtieReport(data);
    } catch (error) {
      console.error('Error fetching Bowtie report:', error);
      setBowtieError(
        'Unable to load Bowtie compliance data. Please check your connection and try again.',
      );
      setBowtieReport(null);
    } finally {
      setIsLoadingBowtie(false);
    }
  }, []);

  useEffect(() => {
    fetchBowtieReport();
  }, [fetchBowtieReport]);

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

  const filteredToolsByGroup = Object.fromEntries(
    Object.entries(toolsByGroup).map(([group, tools]) => [
      group,
      transform.supportsBowtie === 'true'
        ? tools.filter((tool) => Boolean(getBowtieData(tool)))
        : tools,
    ]),
  );

  const groupWithTools = Object.entries(filteredToolsByGroup)
    .filter(([, tools]) => tools.length > 0)
    .map(([group]) => group);

  const groups = groupWithTools;

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

  const visibleToolCount = Object.values(filteredToolsByGroup).reduce(
    (sum, tools) => sum + tools.length,
    0,
  );
  useEffect(() => {
    onVisibleToolCountChange?.(visibleToolCount);
  }, [visibleToolCount, onVisibleToolCountChange]);

  useEffect(() => {
    setExpandedGroups({});
  }, [toolsByGroup]);

  const toggleGroupExpansion = (group: string) => {
    const isExpanded = expandedGroups[group];
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));

    if (isExpanded) {
      setTimeout(() => {
        const element = document.getElementById(`expand-button-${group}`);
        if (element) {
          element.scrollIntoView({ block: 'nearest', behavior: 'auto' });
        }
      }, 0);
    }
  };

  const renderBowtieErrorBanner = () => {
    if (!bowtieError) return null;

    return (
      <Alert
        variant='destructive'
        className='mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200'
        data-testid='bowtie-error-banner'
      >
        <div className='flex items-start gap-3'>
          <AlertCircle className='h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0' />
          <div>
            <AlertTitle className='font-semibold text-red-800 dark:text-red-300'>
              Failed to load Bowtie compliance data
            </AlertTitle>
            <AlertDescription className='text-sm text-red-700 dark:text-red-300/80'>
              {bowtieError}
            </AlertDescription>
          </div>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => fetchBowtieReport()}
          disabled={isLoadingBowtie}
          aria-label='Retry fetching Bowtie compliance data'
          className='flex-shrink-0 flex items-center gap-1.5 border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-900 dark:text-red-100'
          data-testid='bowtie-retry-button'
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoadingBowtie ? 'animate-spin' : ''}`}
          />
          {isLoadingBowtie ? 'Retrying...' : 'Retry'}
        </Button>
      </Alert>
    );
  };

  if (visibleToolCount === 0) {
    return (
      <div className='w-full'>
        {renderBowtieErrorBanner()}
        <div className='text-center py-12 text-gray-500 dark:text-gray-400 border'>
          <p className='text-lg'>No Tools Found :(</p>
          <p className='text-sm'>
            Try Adjusting Your Filters to Find More Tools
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {renderBowtieErrorBanner()}
      {groups.map((group) => {
        const tools = filteredToolsByGroup[group] ?? [];
        const isExpanded = expandedGroups[group];
        const visibleTools = isExpanded
          ? tools
          : tools.slice(0, INITIAL_VISIBLE_ROWS);
        const hasMore = tools.length > INITIAL_VISIBLE_ROWS;

        return (
          <section
            key={group}
            id={`group-${group}`}
            className='mb-12 text-left'
          >
            {group !== 'none' && (
              <div className='mb-10 px-4 w-full bg-gray-100 dark:bg-slate-900'>
                <Headline2>{toTitleCase(group, '-')}</Headline2>
              </div>
            )}
            <div className='overflow-x-hidden'>
              {/* Desktop Table */}
              <table className='hidden lg:table min-w-full bg-white dark:bg-slate-800 border border-gray-200'>
                <thead>
                  <tr className='flex w-full min-w-[860px]'>
                    <TableSortableColumnHeader
                      sortBy='name'
                      transform={transform}
                      setTransform={setTransform}
                      attributes={{
                        style: {
                          flexBasis: '240px',
                          flexShrink: 0,
                          flexGrow: 0,
                        },
                      }}
                    >
                      Name
                    </TableSortableColumnHeader>
                    {transform.groupBy !== 'toolingTypes' && (
                      <TableColumnHeader
                        attributes={{
                          style: {
                            flexBasis: '15%',
                            flexShrink: 0,
                            flexGrow: 0,
                          },
                        }}
                      >
                        Tooling Type
                      </TableColumnHeader>
                    )}
                    {transform.groupBy !== 'languages' && (
                      <TableColumnHeader
                        attributes={{ style: { flexBasis: '15%' } }}
                      >
                        Languages
                      </TableColumnHeader>
                    )}
                    <TableColumnHeader
                      attributes={{
                        className: '!px-0',
                        style: { flexBasis: '20%', flexGrow: 1 },
                      }}
                    >
                      Dialects
                    </TableColumnHeader>
                    <TableSortableColumnHeader
                      sortBy='license'
                      transform={transform}
                      setTransform={setTransform}
                      attributes={{ style: { flexBasis: '15%' } }}
                    >
                      License
                    </TableSortableColumnHeader>
                    <TableSortableColumnHeader
                      sortBy='bowtie'
                      transform={transform}
                      setTransform={setTransform}
                      attributes={{
                        className: 'text-center !px-0',
                        style: {
                          flexBasis: '70px',
                          flexShrink: 0,
                          flexGrow: 0,
                        },
                      }}
                    >
                      Bowtie
                    </TableSortableColumnHeader>
                  </tr>
                </thead>
                <tbody>
                  {visibleTools.map((tool: JSONSchemaTool, index) => {
                    const bowtieData = getBowtieData(tool);
                    return (
                      <tr
                        key={index}
                        className='flex w-full hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer'
                        onClick={() => openModal(tool)}
                      >
                        <TableCell
                          attributes={{
                            className: `${tool.name.split(' ').some((segment) => segment.length > 25) ? 'break-all' : ''} gap-x-2 gap-y-1`,
                            style: {
                              flexBasis: '240px',
                              flexShrink: 1,
                              flexGrow: 0,
                            },
                            title: 'See details',
                          }}
                        >
                          {tool.name}
                          {tool.status === 'obsolete' && (
                            <Tag intent='error'>{tool.status}</Tag>
                          )}
                        </TableCell>
                        {transform.groupBy !== 'toolingTypes' && (
                          <TableCell
                            attributes={{
                              style: { flexBasis: '15%' },
                            }}
                          >
                            {tool.toolingTypes
                              ?.map((type) => toTitleCase(type, '-'))
                              .join(', ')}
                          </TableCell>
                        )}
                        {transform.groupBy !== 'languages' && (
                          <TableCell
                            attributes={{
                              style: { flexBasis: '15%' },
                            }}
                          >
                            {tool.languages?.join(', ')}
                          </TableCell>
                        )}
                        <TableCell
                          attributes={{
                            className: '!block !px-0',
                            style: { flexBasis: '20%', flexGrow: 1 },
                          }}
                        >
                          {tool.supportedDialects?.draft?.map((draft) => {
                            return <Badge key={draft}>{draft}</Badge>;
                          })}
                        </TableCell>
                        <TableCell attributes={{ style: { flexBasis: '15%' } }}>
                          {tool.license}
                        </TableCell>
                        <TableCell
                          attributes={{
                            className: 'text-center !px-0',
                            style: {
                              flexBasis: '70px',
                              flexShrink: 0,
                              flexGrow: 0,
                            },
                          }}
                        >
                          {isLoadingBowtie ? (
                            <div
                              className='flex justify-center items-center h-full m-auto text-gray-400'
                              role='status'
                              aria-label='Loading Bowtie compliance data'
                              data-testid='bowtie-loading-spinner'
                            >
                              <Loader2 className='w-4 h-4 animate-spin' />
                              <span className='sr-only'>
                                Loading Bowtie compliance data...
                              </span>
                            </div>
                          ) : bowtieReport ? (
                            <div className='flex justify-center items-center h-full m-auto'>
                              {bowtieData ? (
                                <a
                                  className='flex justify-center items-center h-full'
                                  href={`https://bowtie.report/#/implementations/${bowtieData.id}`}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  onClick={(event) => event.stopPropagation()}
                                  title='See at Bowtie'
                                >
                                  <OutLinkIcon className='fill-none stroke-current w-5 h-5 stroke-2' />
                                </a>
                              ) : (
                                <InfoIcon className='fill-none stroke-current w-5 h-5 stroke-2' />
                              )}
                            </div>
                          ) : bowtieError ? (
                            <div
                              className='flex justify-center items-center h-full m-auto text-red-500'
                              title='Failed to load Bowtie data'
                              aria-label='Bowtie compliance data unavailable'
                              data-testid='bowtie-cell-error'
                            >
                              <AlertCircle className='w-4 h-4' />
                            </div>
                          ) : null}
                        </TableCell>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Mobile Table */}
              <table className='lg:hidden min-w-full bg-white dark:bg-slate-800 border border-gray-200'>
                <tbody>
                  {visibleTools.map((tool: JSONSchemaTool, index) => {
                    const bowtieData = getBowtieData(tool);
                    return (
                      <tr
                        key={index}
                        className='border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer'
                        onClick={() => openModal(tool)}
                      >
                        <td className='p-2 relative'>
                          {isLoadingBowtie ? (
                            <div
                              className='absolute top-0 right-0 m-2 text-sm text-gray-500 dark:text-gray-400 flex items-center'
                              role='status'
                              aria-label='Loading Bowtie compliance data'
                              data-testid='bowtie-mobile-loading'
                            >
                              <span className='mr-1'>Bowtie:</span>
                              <Loader2 className='w-3.5 h-3.5 animate-spin' />
                            </div>
                          ) : bowtieReport ? (
                            <div className='absolute top-0 right-0 m-2 text-sm text-gray-600 dark:text-gray-300 flex items-center'>
                              <span>Bowtie:</span>
                              {bowtieData ? (
                                <a
                                  href={`https://bowtie.report/#/implementations/${bowtieData.id}`}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  onClick={(event) => event.stopPropagation()}
                                  title='See at Bowtie'
                                  className='ml-1'
                                >
                                  <OutLinkIcon className='fill-none stroke-current w-5 h-5 stroke-2' />
                                </a>
                              ) : (
                                <InfoIcon className='fill-none stroke-current w-5 h-5 stroke-2' />
                              )}
                            </div>
                          ) : bowtieError ? (
                            <div
                              className='absolute top-0 right-0 m-2 text-sm text-red-500 flex items-center'
                              title='Failed to load Bowtie data'
                              aria-label='Bowtie compliance data unavailable'
                              data-testid='bowtie-mobile-error'
                            >
                              <span className='mr-1 text-gray-500 dark:text-gray-400'>
                                Bowtie:
                              </span>
                              <AlertCircle className='w-3.5 h-3.5 text-red-500' />
                            </div>
                          ) : null}
                          <div className='flex justify-between items-center pr-24'>
                            <div className='font-medium'>
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {hasMore && (
                <div className='flex justify-center mt-4'>
                  <Button
                    id={`expand-button-${group}`}
                    variant='default'
                    onClick={() => toggleGroupExpansion(group)}
                    className='flex items-center gap-2 text-white'
                  >
                    {isExpanded ? (
                      <>
                        Show Less <ChevronUp className='h-4 w-4' />
                      </>
                    ) : (
                      <>
                        Load More <ChevronDown className='h-4 w-4' />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </section>
        );
      })}
      {selectedTool && (
        <ToolingDetailModal
          tool={selectedTool}
          bowtieData={getBowtieData(selectedTool)}
          onClose={closeModal}
        />
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
    <th
      {...propAttributes}
      className={classnames(
        propAttributes?.className,
        'px-2 py-2 flex items-center border-b border-gray-200',
      )}
    >
      {children}
    </th>
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
    <td
      {...propAttributes}
      className={classnames(
        propAttributes?.className,
        'flex items-center w-full px-2 py-2 border-b border-gray-200 lg:break-words flex-wrap',
      )}
      title={propAttributes?.title || 'See details'}
    >
      {children}
    </td>
  );
};

export default ToolingTable;
