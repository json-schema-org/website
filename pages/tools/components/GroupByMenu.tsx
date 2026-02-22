import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '~/components/ui/button';
import { Transform } from '../hooks/useToolsTransform';

interface GroupByMenuProps {
  transform: Transform;
  setTransform: Dispatch<SetStateAction<Transform>>;
  activeSections?: string[];
}

const GroupByMenu = ({
  transform,
  setTransform,
  activeSections = [],
}: GroupByMenuProps) => {
  const groupedBy = transform.groupBy;

  const scrollToSection = (section: string) => {
    const id = `group-${section}`;
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const groupBy = [
    {
      label: 'None',
      accessorKey: 'none',
    },
    {
      label: 'Tooling Type',
      accessorKey: 'toolingTypes',
    },
    {
      label: 'Language',
      accessorKey: 'languages',
    },
  ];

  const setGroupBy = (event: React.MouseEvent) => {
    setTransform((prev) => ({
      ...prev,
      groupBy: (event.target as HTMLButtonElement)
        .value as Transform['groupBy'],
      sortBy: 'name',
      sortOrder: 'ascending',
    }));
  };

  return (
    <div className='ml-2 my-8 flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full'>
      <div className='flex items-center space-x-2 max-w-screen overflow-x-auto'>
        <span className='text-slate-600 dark:text-slate-300'>GROUP BY:</span>
        {groupBy.map((group) => {
          return (
            <Button
              key={group.accessorKey}
              value={group.accessorKey}
              onClick={setGroupBy}
              variant={groupedBy === group.accessorKey ? 'default' : 'outline'}
              className={`${groupedBy === group.accessorKey ? 'text-white dark:text-slate-900 dark:bg-[#bfdbfe]' : 'dark:bg-[#0f172a] text-black dark:text-slate-300 dark:border-transparent'}`}
            >
              {group.label}
            </Button>
          );
        })}
      </div>
      {activeSections.length > 0 && groupedBy !== 'none' && (
        <div className='relative inline-block w-48 lg:ml-2'>
          <select
            onChange={(e) => scrollToSection(e.target.value)}
            defaultValue=''
            className='w-full h-9 pl-3 pr-8 appearance-none rounded-md text-sm font-medium border bg-white dark:bg-[#0f172a] text-black dark:text-slate-300 dark:border-transparent cursor-pointer outline-none shadow-sm transition-all'
          >
            <option value='' disabled>
              Jump to Section
            </option>
            {activeSections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500'>
            <svg className='h-4 w-4 fill-current' viewBox='0 0 20 20'>
              <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupByMenu;
