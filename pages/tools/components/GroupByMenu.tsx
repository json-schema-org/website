import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '~/components/ui/button';
import { Transform } from '../hooks/useToolsTransform';

interface GroupByMenuProps {
  transform: Transform;
  setTransform: Dispatch<SetStateAction<Transform>>;
}

const GroupByMenu = ({ transform, setTransform }: GroupByMenuProps) => {
  const groupedBy = transform.groupBy;

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
    <div className='ml-2 my-8 flex items-center space-x-2 max-w-screen overflow-x-auto'>
      <span className='text-slate-600 dark:text-slate-300'>GROUP BY:</span>
      {groupBy.map((group) => {
        return (
          <Button
            key={group.accessorKey}
            value={group.accessorKey}
            onClick={setGroupBy}
            variant={groupedBy === group.accessorKey ? 'default' : 'outline'}
            className={`${groupedBy === group.accessorKey ? 'text-white dark:text-slate-900 dark:bg-[#bfdbfe] hover:scale-105 hover:shadow-lg' : 'dark:bg-[#0f172a] text-black dark:text-slate-300 dark:border-transparent hover:bg-slate-200 hover:border-slate-300 dark:hover:bg-slate-700 dark:hover:border-slate-600 hover:scale-105 hover:shadow-md'} transition-all duration-200`}
          >
            {group.label}
          </Button>
        );
      })}
    </div>
  );
};

export default GroupByMenu;
