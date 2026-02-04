import React, {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  useEffect,
} from 'react';
import LanguageIcon from '~/public/icons/language.svg';
import ToolingIcon from '~/public/icons/tooling.svg';
import EnvironmentIcon from '~/public/icons/environment.svg';
import DialectIcon from '~/public/icons/dialect.svg';
import LicenseIcon from '~/public/icons/license.svg';
import { Button } from '~/components/ui/button';
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
  const [pendingSelections, setPendingSelections] = useState<Transform>(
    () => transform,
  );

  // Sync pendingSelections with transform when transform changes
  useEffect(() => {
    setPendingSelections(transform);
  }, [transform]);

  const filters = [
    { label: 'Language', accessorKey: 'languages' },
    { label: 'Tooling Type', accessorKey: 'toolingTypes' },
    { label: 'Environment', accessorKey: 'environments' },
    { label: 'Dialect', accessorKey: 'drafts' },
    { label: 'License', accessorKey: 'licenses' },
  ];

  const handleCheckboxChange = (
    name: string,
    value: string,
    checked: boolean,
  ) => {
    setPendingSelections((prev) => {
      const currentValues = prev[name as keyof Transform] as string[];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);

      return {
        ...prev,
        [name]: newValues,
      };
    });
  };

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setTransform(pendingSelections);
    postAnalytics({ eventType: 'query', eventPayload: pendingSelections });
    setIsSidebarOpen((prev) => !prev);
  };

  const clearFilters = () => {
    if (filterFormRef.current) {
      filterFormRef.current.reset();
    }

    // Reset pending selections to initial empty state
    const initialTransform: Transform = {
      query: '',
      sortBy: 'name',
      sortOrder: 'ascending',
      groupBy: 'toolingTypes',
      languages: [],
      licenses: [],
      drafts: [],
      toolingTypes: [],
      environments: [],
      showObsolete: 'false',
      supportsBowtie: 'false',
    };

    setPendingSelections(initialTransform);
    resetTransform();
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className='pb-4 top-12 mx-auto lg:ml-4 lg:mt-8 w-4/5 h-fit'>
      <form onSubmit={applyFilters} ref={filterFormRef} className='w-full'>
        <SearchBar
          transform={pendingSelections}
          onQueryChange={(query) =>
            setPendingSelections((prev) => ({ ...prev, query }))
          }
        />
        {filters.map(({ label, accessorKey }) => {
          const checkedValues =
            pendingSelections[accessorKey as keyof Transform] || [];
          const IconComponent =
            filterIcons[accessorKey as keyof typeof filterIcons];
          return (
            <DropdownMenu
              key={accessorKey}
              label={label}
              icon={<IconComponent />}
              count={checkedValues.length}
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
                    onChange={(checked) =>
                      handleCheckboxChange(accessorKey, filterOption, checked)
                    }
                  />
                ))}
            </DropdownMenu>
          );
        })}
        <Checkbox
          label='Show obsolete'
          value='showObsolete'
          name='showObsolete'
          checked={pendingSelections.showObsolete === 'true'}
          onChange={(checked) =>
            setPendingSelections((prev) => ({
              ...prev,
              showObsolete: checked ? 'true' : 'false',
            }))
          }
        />

        <Checkbox
          label='Support Bowtie'
          value='supportsBowtie'
          name='supportsBowtie'
          checked={pendingSelections.supportsBowtie === 'true'}
          onChange={(checked) =>
            setPendingSelections((prev) => ({
              ...prev,
              supportsBowtie: checked ? 'true' : 'false',
            }))
          }
        />

        <div className='w-full flex items-center justify-between mt-4 gap-2'>
          <Button
            type='submit'
            variant='default'
            className='flex-1 text-white dark:bg-[#bfdbfe] dark:text-slate-900'
          >
            Apply Filters
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={clearFilters}
            className='flex-1 text-red-600 border-red-600 hover:bg-red-50 dark:bg-[#0f172a] dark:text-[#bfdbfe] dark:border-transparent'
          >
            Clear Filters
          </Button>
        </div>
      </form>
    </div>
  );
}
