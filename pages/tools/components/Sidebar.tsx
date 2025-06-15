import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import LanguageIcon from '~/public/icons/language.svg';
import ToolingIcon from '~/public/icons/tooling.svg';
import EnvironmentIcon from '~/public/icons/environment.svg';
import DialectIcon from '~/public/icons/dialect.svg';
import LicenseIcon from '~/public/icons/license.svg';
import DropdownMenu from './ui/DropdownMenu';
import Checkbox from './ui/Checkbox';
import SearchBar from './SearchBar';
import toTitleCase from '../lib/toTitleCase';
import type { Transform } from '../hooks/useToolsTransform';
import type { FilterCriteriaFields } from '../index.page';
import { postAnalytics } from '../lib/postAnalytics';

const filterIcons = {
  languages: LanguageIcon,
  toolingTypes: ToolingIcon,
  environments: EnvironmentIcon,
  drafts: DialectIcon,
  licenses: LicenseIcon,
};

interface SidebarProps {
  filterCriteria: Record<FilterCriteriaFields, string[]>;
  transform: Transform;
  setTransform: Dispatch<SetStateAction<Transform>>;
  resetTransform: () => void;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({
  filterCriteria,
  transform,
  setTransform,
  resetTransform,
  setIsSidebarOpen,
}: SidebarProps) {
  const filterFormRef = useRef<HTMLFormElement>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filters = [
    { label: 'Language', accessorKey: 'languages' },
    { label: 'Tooling Type', accessorKey: 'toolingTypes' },
    { label: 'Environment', accessorKey: 'environments' },
    { label: 'Dialect', accessorKey: 'drafts' },
    { label: 'License', accessorKey: 'licenses' },
  ];

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterFormRef.current) return;
    const formData = new FormData(filterFormRef.current);
    setTransform((prev) => {
      const newTransform = {
        query: (formData.get('query') as Transform['query']) || '',
        sortBy: prev.sortBy || 'name',
        sortOrder: prev.sortOrder || 'ascending',
        groupBy: prev.groupBy || 'toolingTypes',
        languages: formData.getAll('languages').map((value) => value as string),
        licenses: formData.getAll('licenses').map((value) => value as string),
        drafts: formData
          .getAll('drafts')
          .map((value) => value) as Transform['drafts'],
        toolingTypes: formData
          .getAll('toolingTypes')
          .map((value) => value as string),
        environments: formData
          .getAll('environments')
          .map((value) => value as string),
        showObsolete:
          (formData.get('showObsolete') as string) === 'showObsolete'
            ? 'true'
            : 'false',
        supportsBowtie:
          (formData.get('supportsBowtie') as string) === 'supportsBowtie'
            ? 'true'
            : 'false',
      } satisfies Transform;
      postAnalytics({ eventType: 'query', eventPayload: newTransform });
      return newTransform;
    });
    setIsSidebarOpen((prev) => !prev);
  };

  const clearFilters = () => {
    if (filterFormRef.current) {
      filterFormRef.current.reset();
    }
    resetTransform();
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className='pb-4 top-12 mx-auto lg:ml-4 lg:mt-8 w-4/5 h-fit'>
      <form onSubmit={applyFilters} ref={filterFormRef} className='w-full'>
        <SearchBar transform={transform} />
        {filters.map(({ label, accessorKey }) => {
          const checkedValues = transform[accessorKey as keyof Transform] || [];
          const IconComponent =
            filterIcons[accessorKey as keyof typeof filterIcons];
          return (
            <DropdownMenu
              key={accessorKey}
              id={accessorKey}
              label={label}
              icon={<IconComponent />}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            >
              {filterCriteria[accessorKey as FilterCriteriaFields]
                ?.map(String)
                .map((filterOption) => (
                  <Checkbox
                    key={filterOption}
                    label={
                      accessorKey === 'toolingTypes'
                        ? toTitleCase(filterOption, '-')
                        : filterOption
                    }
                    value={filterOption}
                    name={accessorKey}
                    checked={checkedValues.includes(filterOption)}
                  />
                ))}
            </DropdownMenu>
          );
        })}
        <Checkbox
          label='Show obsolete'
          value='showObsolete'
          name='showObsolete'
          checked={transform['showObsolete'] === 'true'}
        />
        <Checkbox
          label='Support Bowtie'
          value='supportsBowtie'
          name='supportsBowtie'
          checked={transform['supportsBowtie'] === 'true'}
        />
        <div className='w-full flex items-center justify-between mt-4 gap-2'>
          <button
            type='submit'
            className='bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none transition-all duration-200 hover:scale-[1.05]'
            style={{
              transition: 'all 0.2s ease-in-out !important',
            }}
          >
            Apply Filters
          </button>
          <button
            type='button'
            className='bg-slate-200 dark:bg-slate-900 text-gray-700 dark:text-slate-200 px-4 py-2 rounded hover:bg-slate-300 dark:hover:bg-slate-700 focus:outline-none transition-all duration-200 hover:scale-[1.05]'
            onClick={clearFilters}
            style={{
              transition: 'all 0.2s ease-in-out !important',
            }}
          >
            Clear Filters
          </button>
        </div>
      </form>
    </div>
  );
}
