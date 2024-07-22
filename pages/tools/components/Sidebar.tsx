import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import DropdownMenu from './ui/DropdownMenu';
import SearchBar from './SearchBar';
import Checkbox from './ui/Checkbox';
import { type UniqueValuesPerField } from '../lib/getUniqueValuesPerField';
import toTitleCase from '../lib/toTitleCase';
import { useTheme } from 'next-themes';
import { Preferences } from '../hooks/usePreferences';

export default function Sidebar({
  uniqueValuesPerField,
  preferences,
  setPreferences,
  resetPreferences,
  setIsSidebarOpen,
}: {
  uniqueValuesPerField: UniqueValuesPerField;
  preferences: Preferences;
  setPreferences: Dispatch<SetStateAction<Preferences>>;
  resetPreferences: () => void;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const filterFormRef = useRef<HTMLFormElement>(null);
  const [filterIcon, setFilterIcon] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === 'dark') {
      setFilterIcon('/icons/filter-dark.svg');
    } else {
      setFilterIcon('/icons/filter.svg');
    }
  }, [theme]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterFormRef.current) return;
    const formData = new FormData(filterFormRef.current);

    setPreferences((prev) => {
      const updatedPreferences: Preferences = {
        query: (formData.get('query') as Preferences['query']) || '',
        groupBy: prev.groupBy || 'toolingTypes',
        sortBy: prev.sortBy || 'name',
        sortOrder: prev.sortOrder || 'ascending',
        languages: formData.getAll('languages').map((value) => value as string),
        licenses: formData.getAll('licenses').map((value) => value as string),
        drafts: formData
          .getAll('drafts')
          .map((value) => value) as Preferences['drafts'],
        toolingTypes: formData
          .getAll('toolingTypes')
          .map((value) => value as string),
      };
      return updatedPreferences;
    });
    setIsSidebarOpen((prev) => (prev ? false : prev));
  };

  const resetHandler = () => {
    if (!filterFormRef.current) return;
    filterFormRef.current.reset();
    resetPreferences();
    setIsSidebarOpen((prev) => (prev ? false : prev));
  };

  return (
    <div className='pb-4 top-12 mx-auto lg:ml-4 lg:mt-8 w-4/5 h-fit'>
      <form onSubmit={submitHandler} ref={filterFormRef} className='w-full'>
        <SearchBar preferences={preferences} />
        <DropdownMenu
          label='Languages'
          iconSrc={filterIcon}
          iconAlt='Filter Icon'
        >
          {uniqueValuesPerField.languages?.map((uniqueValue) => (
            <Checkbox
              key={uniqueValue}
              label={uniqueValue}
              value={uniqueValue}
              name='languages'
            />
          ))}
        </DropdownMenu>
        <DropdownMenu label='Drafts' iconSrc={filterIcon} iconAlt='Filter Icon'>
          {uniqueValuesPerField.drafts?.map((uniqueValue) => (
            <Checkbox
              key={uniqueValue}
              label={uniqueValue}
              value={uniqueValue}
              name='drafts'
            />
          ))}
        </DropdownMenu>
        <DropdownMenu
          label='Tooling Types'
          iconSrc={filterIcon}
          iconAlt='Filter Icon'
        >
          {uniqueValuesPerField.toolingTypes?.map((uniqueValue) => (
            <Checkbox
              key={uniqueValue}
              label={toTitleCase(uniqueValue, '-')}
              value={uniqueValue}
              name='toolingTypes'
            />
          ))}
        </DropdownMenu>
        <DropdownMenu
          label='License'
          iconSrc={filterIcon}
          iconAlt='Filter Icon'
        >
          {uniqueValuesPerField.licenses?.map((uniqueValue) => (
            <Checkbox
              key={uniqueValue}
              label={uniqueValue}
              value={uniqueValue}
              name='licenses'
            />
          ))}
        </DropdownMenu>
        <div className='w-full flex items-center justify-between mt-4'>
          <button
            type='submit'
            className='bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none'
          >
            Apply Filters
          </button>
          <button
            type='button'
            className='bg-slate-200 dark:bg-slate-900 text-gray-700 dark:text-slate-200 px-4 py-2 rounded hover:bg-slate-300 focus:outline-none'
            onClick={resetHandler}
          >
            Clear Filters
          </button>
        </div>
      </form>
    </div>
  );
}
