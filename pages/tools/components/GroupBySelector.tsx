import React, { Dispatch, SetStateAction } from 'react';
import { Preferences } from '../hooks/usePreferences';

export default function GroupBySelector({
  preferences,
  setPreferences,
}: {
  preferences: Preferences;
  setPreferences: Dispatch<SetStateAction<Preferences>>;
}) {
  const groupBy = preferences.groupBy;
  const setGroupPreference = (event: React.MouseEvent) => {
    setPreferences((prev) => ({
      ...prev,
      groupBy: (event.target as HTMLButtonElement).value as typeof groupBy,
      sortBy: 'name',
      sortOrder: 'ascending',
    }));
  };

  const groups: Record<string, Preferences['groupBy']> = {
    None: 'none',
    'Tooling Types': 'toolingTypes',
    Languages: 'languages',
    Environments: 'environments',
  };

  return (
    <div className='ml-2 my-8 flex items-center space-x-2 max-w-screen overflow-x-auto'>
      <span className='text-slate-600 dark:text-slate-300'>GROUP BY:</span>
      {Object.keys(groups).map((group) => {
        return (
          <button
            key={groups[group]}
            value={groups[group]}
            onClick={setGroupPreference}
            className={`px-4 py-2 self-stretch border dark:border-slate-800 rounded ${preferences.groupBy === groups[group] ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200'}`}
          >
            {group}
          </button>
        );
      })}
    </div>
  );
}
