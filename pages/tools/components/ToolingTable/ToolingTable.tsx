import React, { Dispatch, SetStateAction, useState } from 'react';

import { Headline2 } from '~/components/Headlines';

import type { GroupedTools, Preferences } from '../../hooks/usePreferences';
import type { JSONSchemaTool } from '../../JSONSchemaTool';
import toTitleCase from '../../lib/toTitleCase';
import Badge from '../ui/Badge';
import TableColumnHeader from './TableColumnHeader';
import TableSortableColumnHeader from './TableSortableColumnHeader';
import TableCell from './TableCell';
import ToolingDetailModal from './ToolingDetailModal';

const ToolingTable = ({
  groupedTools,
  preferences,
  setPreferences,
}: {
  groupedTools: GroupedTools;
  preferences: Preferences;
  setPreferences: Dispatch<SetStateAction<Preferences>>;
}) => {
  const [selectedTool, setSelectedTool] = useState<JSONSchemaTool | null>(null);

  const groups = Object.keys(groupedTools);

  const openModal = (tool: JSONSchemaTool) => {
    setSelectedTool(tool);
  };

  const closeModal = () => {
    setSelectedTool(null);
  };

  const outlinkIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      className='w-5 h-5'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M14 3h7m0 0v7m0-7L10 14m1-9H5a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-6'
      />
    </svg>
  );

  const notAvailableIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      className='w-5 h-5'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M6 18L18 6M6 6l12 12'
      />
    </svg>
  );

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
    preferences.groupBy === 'toolingTypes'
      ? columnWidths.oneAbsent
      : preferences.groupBy === 'languages'
        ? columnWidths.oneAbsent
        : columnWidths.allPresent;

  return (
    <>
      {groups.map((group) => (
        <section key={group} className='mb-12 text-left'>
          {group !== 'none' && (
            <div className='mb-10 px-4 w-full bg-gray-100 dark:bg-slate-900'>
              <Headline2 attributes={{ className: 'mt-[0px]' }}>
                {toTitleCase(group, '-')}
              </Headline2>
            </div>
          )}
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white dark:bg-slate-800 border border-gray-200'>
              <thead>
                <tr>
                  <TableSortableColumnHeader
                    sortBy='name'
                    preferences={preferences}
                    setPreferences={setPreferences}
                    className={currentWidths.name}
                  >
                    Name
                  </TableSortableColumnHeader>
                  {preferences.groupBy !== 'toolingTypes' && (
                    <TableColumnHeader className={currentWidths.toolingType}>
                      Tooling Type
                    </TableColumnHeader>
                  )}
                  {preferences.groupBy !== 'languages' && (
                    <TableColumnHeader className={currentWidths.languages}>
                      Languages
                    </TableColumnHeader>
                  )}
                  <TableColumnHeader className={currentWidths.drafts}>
                    Drafts
                  </TableColumnHeader>
                  <TableSortableColumnHeader
                    sortBy='license'
                    preferences={preferences}
                    setPreferences={setPreferences}
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
                {groupedTools[group].map((tool: JSONSchemaTool, index) => (
                  <tr
                    key={index}
                    className='hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer'
                    onClick={() => openModal(tool)}
                  >
                    <TableCell className={currentWidths.name}>
                      {tool.name}
                    </TableCell>
                    {preferences.groupBy !== 'toolingTypes' && (
                      <TableCell className={currentWidths.toolingType}>
                        {tool.toolingTypes
                          ?.map((type) => toTitleCase(type, '-'))
                          .join(', ')}
                      </TableCell>
                    )}
                    {preferences.groupBy !== 'languages' && (
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
                    <TableCell className={currentWidths.bowtie}>
                      {tool.bowtie?.identifier ? (
                        <a
                          href={`https://bowtie.report/#/implementations/${tool.bowtie?.identifier}`}
                          target='blank'
                          onClick={(event) => event.stopPropagation()}
                        >
                          {outlinkIcon}
                        </a>
                      ) : (
                        <span>{notAvailableIcon}</span>
                      )}
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
