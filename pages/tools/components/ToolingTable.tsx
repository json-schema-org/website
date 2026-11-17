import React, { type ReactNode, useState } from 'react';
import classnames from 'classnames';
import { ChevronDown, ChevronUp } from 'lucide-react';

import toTitleCase from '../lib/toTitleCase';
import { postAnalytics } from '../lib/postAnalytics';
import type { GetBowtieInfo } from '../lib/transformTools';
import type { SetTransform, Transform } from '../hooks/useToolsTransform';
import type { JSONSchemaTool } from '../JSONSchemaTool';
import Badge from './ui/Badge';
import Tag from './ui/Tag';
import BowtieBadge from './BowtieBadge';
import ToolingDetailModal from './ToolingDetailModal';

interface ToolingTableProps {
  tools: JSONSchemaTool[];
  transform: Transform;
  setTransform: SetTransform;
  getBowtieInfo: GetBowtieInfo;
  /** Whether it is still being found out which tools are on Bowtie. */
  isBowtieLoading?: boolean;
}

/**
 * Give each tool a key which stays the same however the list is filtered and
 * sorted. The tooling data has the odd duplicate entry, hence the counting.
 */
const withKeys = (tools: JSONSchemaTool[]) => {
  const seen = new Map<string, number>();

  return tools.map((tool) => {
    const identity = `${tool.name}|${tool.source ?? ''}`;
    const occurrence = seen.get(identity) ?? 0;
    seen.set(identity, occurrence + 1);

    return { tool, key: `${identity}|${occurrence}` };
  });
};

const formatToolingTypes = (tool: JSONSchemaTool) =>
  tool.toolingTypes?.map((type) => toTitleCase(type, '-')).join(', ');

const ToolingTable = ({
  tools,
  transform,
  setTransform,
  getBowtieInfo,
  isBowtieLoading = false,
}: ToolingTableProps) => {
  const [selectedTool, setSelectedTool] = useState<JSONSchemaTool | null>(null);

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

  if (tools.length === 0) {
    return (
      <div
        className='text-center py-12 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-700 rounded-lg'
        data-test='tools-empty'
      >
        <p className='text-lg'>No tools found</p>
        <p className='text-sm'>Try adjusting your filters to find more tools</p>
      </div>
    );
  }

  const keyedTools = withKeys(tools);

  const name = (tool: JSONSchemaTool) => (
    <button
      type='button'
      className='text-left font-medium hover:underline focus-visible:underline focus:outline-none'
      style={{ overflowWrap: 'anywhere' }}
      title='See details'
      onClick={(event) => {
        event.stopPropagation();
        openModal(tool);
      }}
    >
      {tool.name}
    </button>
  );

  const bowtieBadge = (tool: JSONSchemaTool) => (
    <BowtieBadge info={getBowtieInfo(tool)} isLoading={isBowtieLoading} />
  );

  return (
    <>
      {/* Desktop Table */}
      <table
        className='hidden lg:table w-full table-fixed text-left bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700'
        data-test='tools-table'
      >
        <colgroup>
          <col className='w-[21%]' />
          <col className='w-[15%]' />
          <col className='w-[11%]' />
          <col />
          <col className='w-[11%]' />
          <col className='w-[13rem]' />
        </colgroup>
        <thead>
          <tr className='border-b border-gray-200 dark:border-slate-700'>
            <SortableColumnHeader
              sortBy='name'
              transform={transform}
              setTransform={setTransform}
            >
              Name
            </SortableColumnHeader>
            <ColumnHeader>Tool type</ColumnHeader>
            <ColumnHeader>Languages</ColumnHeader>
            <ColumnHeader>Dialects</ColumnHeader>
            <SortableColumnHeader
              sortBy='license'
              transform={transform}
              setTransform={setTransform}
            >
              License
            </SortableColumnHeader>
            <SortableColumnHeader
              sortBy='bowtie'
              transform={transform}
              setTransform={setTransform}
            >
              Bowtie
            </SortableColumnHeader>
          </tr>
        </thead>
        <tbody>
          {keyedTools.map(({ tool, key }) => (
            <tr
              key={key}
              className='border-b border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer align-middle'
              onClick={() => openModal(tool)}
              data-test='tools-row'
            >
              <td className='px-3 py-2'>
                <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                  {name(tool)}
                  {tool.status === 'obsolete' && (
                    <Tag intent='error'>{tool.status}</Tag>
                  )}
                </div>
              </td>
              <td className='px-3 py-2 text-sm'>{formatToolingTypes(tool)}</td>
              <td className='px-3 py-2 text-sm'>
                {tool.languages?.join(', ')}
              </td>
              <td className='px-1 py-1'>
                {tool.supportedDialects?.draft?.map((draft) => (
                  <Badge key={draft}>{draft}</Badge>
                ))}
              </td>
              <td
                className='px-3 py-2 text-sm'
                style={{ overflowWrap: 'anywhere' }}
              >
                {tool.license}
              </td>
              <td className='px-3 py-2'>{bowtieBadge(tool)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile List */}
      <ul
        className='lg:hidden bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 divide-y divide-gray-200 dark:divide-slate-700'
        data-test='tools-list'
      >
        {keyedTools.map(({ tool, key }) => (
          <li
            key={key}
            className='p-3 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer'
            onClick={() => openModal(tool)}
          >
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                {name(tool)}
                {tool.status === 'obsolete' && (
                  <Tag intent='error'>{tool.status}</Tag>
                )}
              </div>
              {bowtieBadge(tool)}
            </div>
            <dl className='mt-1 text-sm text-gray-600 dark:text-gray-300'>
              <MobileField label='Tool type'>
                {formatToolingTypes(tool)}
              </MobileField>
              <MobileField label='Languages'>
                {tool.languages?.join(', ')}
              </MobileField>
              <MobileField label='License'>{tool.license}</MobileField>
            </dl>
            <div className='flex flex-wrap -mx-1'>
              {tool.supportedDialects?.draft?.map((draft) => (
                <Badge key={draft}>{draft}</Badge>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {selectedTool && (
        <ToolingDetailModal
          tool={selectedTool}
          bowtieInfo={getBowtieInfo(selectedTool)}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </>
  );
};

const MobileField = ({
  label,
  children,
}: {
  label: string;
  children?: ReactNode;
}) =>
  children ? (
    <div className='mt-1'>
      <dt className='inline'>{label}: </dt>
      <dd className='inline'>{children}</dd>
    </div>
  ) : null;

const ColumnHeader = ({
  children,
  ariaSort,
}: {
  children: ReactNode;
  ariaSort?: 'ascending' | 'descending' | 'none';
}) => (
  <th scope='col' aria-sort={ariaSort} className='px-3 py-2 font-semibold'>
    {children}
  </th>
);

const SortableColumnHeader = ({
  sortBy,
  transform,
  setTransform,
  children,
}: {
  sortBy: Transform['sortBy'];
  transform: Transform;
  setTransform: SetTransform;
  children: ReactNode;
}) => {
  const isSortedBy = transform.sortBy === sortBy;
  // Names and licenses start out from A to Z, Bowtie results best first.
  const initialSortOrder = sortBy === 'bowtie' ? 'descending' : 'ascending';

  const sortByColumn = () => {
    setTransform((prevTransform) => ({
      sortBy,
      sortOrder:
        prevTransform.sortBy !== sortBy
          ? initialSortOrder
          : prevTransform.sortOrder === 'descending'
            ? 'ascending'
            : 'descending',
    }));
  };

  const Chevron =
    transform.sortOrder === initialSortOrder ? ChevronDown : ChevronUp;

  return (
    <ColumnHeader ariaSort={isSortedBy ? transform.sortOrder : 'none'}>
      <button
        type='button'
        className={classnames(
          'flex items-center gap-1 font-semibold hover:underline focus:outline-none focus-visible:underline',
        )}
        title={`Sort by ${typeof children === 'string' ? children.toLowerCase() : sortBy}`}
        onClick={sortByColumn}
        data-test={`tools-sort-${sortBy}`}
      >
        {children}
        {isSortedBy && <Chevron className='h-4 w-4' aria-hidden='true' />}
      </button>
    </ColumnHeader>
  );
};

export default ToolingTable;
