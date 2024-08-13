import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { Headline2 } from '~/components/Headlines';
import CancelIcon from '~/public/icons/cancel.svg';
import OutLinkIcon from '~/public/icons/outlink.svg';

import toTitleCase from '../lib/toTitleCase';
import type { GroupedTools, Transform } from '../hooks/useToolsTransform';
import type { JSONSchemaTool } from '../JSONSchemaTool';
import Badge from './ui/Badge';

import ToolingDetailModal from './ToolingDetailModal';
import classnames from 'classnames';
import { postAnalytics } from '../lib/postAnalytics';

interface ToolingTableProps {
  toolsByGroup: GroupedTools;
  transform: Transform;
  setTransform: Dispatch<SetStateAction<Transform>>;
}

const ToolingTable = ({
  toolsByGroup,
  transform,
  setTransform,
}: ToolingTableProps) => {
  const [selectedTool, setSelectedTool] = useState<JSONSchemaTool | null>(null);

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
        source: tool.source,
        homepage: tool.homepage,
        supportedDialects: tool.supportedDialects,
      },
    });
  };

  const closeModal = () => {
    setSelectedTool(null);
  };

  return (
    <>
      {groups.map((group) => (
        <section key={group} className='mb-12 text-left'>
          {group !== 'none' && (
            <div className='mb-10 px-4 w-full bg-gray-100 dark:bg-slate-900'>
              <Headline2>{toTitleCase(group, '-')}</Headline2>
            </div>
          )}
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white dark:bg-slate-800 border border-gray-200'>
              <thead>
                <tr className='flex w-full min-w-[976px]'>
                  <TableSortableColumnHeader
                    sortBy='name'
                    transform={transform}
                    setTransform={setTransform}
                    attributes={{
                      style: { flexBasis: '240px', flexShrink: 0, flexGrow: 0 },
                    }}
                  >
                    Name
                  </TableSortableColumnHeader>
                  {transform.groupBy !== 'toolingTypes' && (
                    <TableColumnHeader
                      attributes={{
                        style: { flexBasis: '15%', flexShrink: 0, flexGrow: 0 },
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
                    Drafts
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
                      style: { flexBasis: '70px', flexShrink: 0, flexGrow: 0 },
                    }}
                  >
                    Bowtie
                  </TableSortableColumnHeader>
                </tr>
              </thead>
              <tbody>
                {toolsByGroup[group].map((tool: JSONSchemaTool, index) => (
                  <tr
                    key={index}
                    className='flex w-full hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer'
                    onClick={() => openModal(tool)}
                  >
                    <TableCell
                      attributes={{
                        className: `${tool.name.split(' ').some((segment) => segment.length > 25) ? 'break-all' : ''}`,
                        style: {
                          flexBasis: '240px',
                          flexShrink: 0,
                          flexGrow: 0,
                        },
                      }}
                    >
                      {tool.name}
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
                      <div className='flex justify-center items-center h-full m-auto'>
                        {tool.bowtie?.identifier ? (
                          <a
                            className='flex justify-center items-center h-full'
                            href={`https://bowtie.report/#/implementations/${tool.bowtie?.identifier}`}
                            target='blank'
                            onClick={(event) => event.stopPropagation()}
                          >
                            <OutLinkIcon className='fill-none stroke-current w-5 h-5 stroke-2' />
                          </a>
                        ) : (
                          <CancelIcon className='fill-current stroke-current w-4 h-4' />
                        )}
                      </div>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
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
      <button
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
      </button>
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
        'flex items-center w-full px-2 py-2 border-b border-gray-200 lg:break-words',
      )}
    >
      {children}
    </td>
  );
};

export default ToolingTable;
