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
                <tr>
                  <TableSortableColumnHeader
                    sortBy='name'
                    transform={transform}
                    setTransform={setTransform}
                  >
                    Name
                  </TableSortableColumnHeader>
                  {transform.groupBy !== 'toolingTypes' && (
                    <TableColumnHeader>Tooling Type</TableColumnHeader>
                  )}
                  {transform.groupBy !== 'languages' && (
                    <TableColumnHeader>Languages</TableColumnHeader>
                  )}
                  <TableColumnHeader>Drafts</TableColumnHeader>
                  <TableSortableColumnHeader
                    sortBy='license'
                    transform={transform}
                    setTransform={setTransform}
                  >
                    License
                  </TableSortableColumnHeader>
                  <TableColumnHeader attributes={{ className: 'text-center' }}>
                    Bowtie
                  </TableColumnHeader>
                </tr>
              </thead>
              <tbody>
                {toolsByGroup[group].map((tool: JSONSchemaTool, index) => (
                  <tr
                    key={index}
                    className='hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer'
                    onClick={() => openModal(tool)}
                  >
                    <TableCell>{tool.name}</TableCell>
                    {transform.groupBy !== 'toolingTypes' && (
                      <TableCell>
                        {tool.toolingTypes
                          ?.map((type) => toTitleCase(type, '-'))
                          .join(', ')}
                      </TableCell>
                    )}
                    {transform.groupBy !== 'languages' && (
                      <TableCell>{tool.languages?.join(', ')}</TableCell>
                    )}
                    <TableCell>
                      {tool.supportedDialects?.draft?.map((draft) => {
                        return <Badge key={draft}>{draft}</Badge>;
                      })}
                    </TableCell>
                    <TableCell>{tool.license}</TableCell>
                    <TableCell>
                      <div className='flex justify-center items-center h-full'>
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
                          <>
                            <CancelIcon className='fill-current stroke-current w-4 h-4' />
                          </>
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
        'px-4 py-2 border-b border-gray-200',
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
        'px-4 py-2 border-b border-gray-200 lg:break-all',
      )}
    >
      {children}
    </td>
  );
};

export default ToolingTable;
