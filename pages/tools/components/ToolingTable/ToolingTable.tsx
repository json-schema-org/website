import React, { Dispatch, SetStateAction, useState } from 'react';

import { Headline2 } from '~/components/Headlines';
import CancelIcon from '~/public/icons/cancel.svg';
import OutLinkIcon from '~/public/icons/outlink.svg';

import toTitleCase from '../../lib/toTitleCase';
import type { GroupedTools, Transform } from '../../hooks/useToolsTransform';
import type { JSONSchemaTool } from '../../JSONSchemaTool';
import Badge from '../ui/Badge';

import TableColumnHeader from './TableColumnHeader';
import TableSortableColumnHeader from './TableSortableColumnHeader';
import TableCell from './TableCell';
import ToolingDetailModal from './ToolingDetailModal';

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

  const columnWidths = {
    allPresent: {
      name: 'w-[25%]',
      toolingType: 'w-[20%]',
      languages: 'w-[20%]',
      drafts: 'w-[15%]',
      license: 'w-[10%]',
      bowtie: 'w-[10%]',
    },
    oneAbsent: {
      name: 'w-[30%]',
      toolingType: 'w-[25%]',
      languages: 'w-[25%]',
      drafts: 'w-[20%]',
      license: 'w-[15%]',
      bowtie: 'w-[10%]',
    },
  };

  const currentWidths =
    transform.groupBy === 'toolingTypes'
      ? columnWidths.oneAbsent
      : transform.groupBy === 'languages'
        ? columnWidths.oneAbsent
        : columnWidths.allPresent;

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
                    preferences={transform}
                    setPreferences={setTransform}
                    className={currentWidths.name}
                  >
                    Name
                  </TableSortableColumnHeader>
                  {transform.groupBy !== 'toolingTypes' && (
                    <TableColumnHeader className={currentWidths.toolingType}>
                      Tooling Type
                    </TableColumnHeader>
                  )}
                  {transform.groupBy !== 'languages' && (
                    <TableColumnHeader className={currentWidths.languages}>
                      Languages
                    </TableColumnHeader>
                  )}
                  <TableColumnHeader className={currentWidths.drafts}>
                    Drafts
                  </TableColumnHeader>
                  <TableSortableColumnHeader
                    sortBy='license'
                    preferences={transform}
                    setPreferences={setTransform}
                    className={currentWidths.license}
                  >
                    License
                  </TableSortableColumnHeader>
                  <TableColumnHeader className={currentWidths.bowtie}>
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
                    <TableCell className={currentWidths.name}>
                      {tool.name}
                    </TableCell>
                    {transform.groupBy !== 'toolingTypes' && (
                      <TableCell className={currentWidths.toolingType}>
                        {tool.toolingTypes
                          ?.map((type) => toTitleCase(type, '-'))
                          .join(', ')}
                      </TableCell>
                    )}
                    {transform.groupBy !== 'languages' && (
                      <TableCell className={currentWidths.languages}>
                        {tool.languages?.join(', ')}
                      </TableCell>
                    )}
                    <TableCell className={currentWidths.drafts}>
                      {tool.supportedDialects?.draft?.map((draft) => {
                        return <Badge key={draft}>{draft}</Badge>;
                      })}
                    </TableCell>
                    <TableCell className={currentWidths.license}>
                      {tool.license}
                    </TableCell>
                    <TableCell className={`${currentWidths.bowtie} h-[1px]`}>
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

export default ToolingTable;
