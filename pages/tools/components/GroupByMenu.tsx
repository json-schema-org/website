import React, { Dispatch, SetStateAction } from 'react';
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
          <button
            key={group.accessorKey}
            value={group.accessorKey}
            onClick={setGroupBy}
            className={`px-4 py-2 self-stretch border dark:border-slate-800 rounded ${groupedBy === group.accessorKey ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200'}`}
          >
            {group.label}
          </button>
        );
      })}
    </div>
  );
};

export default GroupByMenu;
