import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

import { Button } from '~/components/ui/button';

import SearchBar from './SearchBar';
import toTitleCase from '../lib/toTitleCase';
import { postAnalytics } from '../lib/postAnalytics';
import { countActiveFilters } from '../lib/transformTools';
import type { SetTransform, Transform } from '../hooks/useToolsTransform';
import type { FilterCriteriaFields } from '../index.page';

type QuickFilterField = 'languages' | 'drafts' | 'toolingTypes';

const QUICK_FILTERS: {
  field: QuickFilterField;
  label: string;
  all: string;
  optionLabel: (option: string) => string;
}[] = [
  {
    field: 'languages',
    label: 'Language',
    all: 'All languages',
    optionLabel: (option) => option,
  },
  {
    field: 'drafts',
    label: 'Dialect',
    all: 'All dialects',
    optionLabel: (option) => `Draft ${option}`,
  },
  {
    field: 'toolingTypes',
    label: 'Tool type',
    all: 'All tool types',
    optionLabel: (option) => toTitleCase(option, '-'),
  },
];

const ALL = '';
const SEVERAL = '__several__';

interface FilterBarProps {
  filterCriteria: Record<FilterCriteriaFields, string[]>;
  transform: Transform;
  setTransform: SetTransform;
  resetTransform: () => void;
  onMoreFilters: () => void;
}

/**
 * The filters most people are after: which language, which dialect, and what
 * kind of tool. Each narrows the list to a single choice; the "More filters"
 * drawer allows several, and has the less commonly used filters.
 */
export default function FilterBar({
  filterCriteria,
  transform,
  setTransform,
  resetTransform,
  onMoreFilters,
}: FilterBarProps) {
  const activeFilters = countActiveFilters(transform);

  const select = (field: QuickFilterField, value: string) => {
    const update = { [field]: value === ALL ? [] : [value] };
    setTransform(update);
    postAnalytics({
      eventType: 'query',
      eventPayload: { ...transform, ...update },
    });
  };

  return (
    <div
      className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))_auto] gap-x-4 gap-y-3 items-end p-4 mb-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900'
      data-test='tools-filter-bar'
    >
      <div className='flex flex-col gap-1'>
        <label
          htmlFor='tools-search'
          className='text-sm font-semibold text-slate-700 dark:text-slate-300'
        >
          Search
        </label>
        <SearchBar
          id='tools-search'
          transform={transform}
          debounce={250}
          onQueryChange={(query) =>
            setTransform({ query }, { history: 'replace' })
          }
        />
      </div>

      {QUICK_FILTERS.map(({ field, label, all, optionLabel }) => {
        const options = filterCriteria[field]?.map(String) ?? [];
        const selected: string[] = transform[field];
        // Values arriving in a link may differ in case from the options.
        const isSelected = (option: string) =>
          option.toLowerCase() === selected[0].toLowerCase();
        const selectedOption =
          selected.length === 1 ? options.find(isSelected) : undefined;
        const value = selected.length === 0 ? ALL : (selectedOption ?? SEVERAL);

        return (
          <div key={field} className='flex flex-col gap-1'>
            <label
              htmlFor={`tools-filter-${field}`}
              className='text-sm font-semibold text-slate-700 dark:text-slate-300'
            >
              {label}
            </label>
            <select
              id={`tools-filter-${field}`}
              name={field}
              value={value}
              onChange={(event) => select(field, event.target.value)}
              className='h-9 w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400'
            >
              <option value={ALL}>{all}</option>
              {value === SEVERAL && (
                <option value={SEVERAL} disabled>
                  {selected.length === 1
                    ? selected[0]
                    : `${selected.length} selected`}
                </option>
              )}
              {options.map((option) => (
                <option key={option} value={option}>
                  {optionLabel(option)}
                </option>
              ))}
            </select>
          </div>
        );
      })}

      <div className='flex items-center gap-2 sm:col-span-2 lg:col-span-1'>
        <Button
          type='button'
          variant='outline'
          onClick={onMoreFilters}
          className='flex items-center gap-2 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
          data-test='tools-more-filters'
        >
          <SlidersHorizontal className='h-4 w-4' />
          More filters
        </Button>
        {activeFilters > 0 && (
          <Button
            type='button'
            variant='ghost'
            onClick={resetTransform}
            className='flex items-center gap-1 text-slate-600 dark:text-slate-300'
            data-test='tools-reset-filters'
          >
            <X className='h-4 w-4' />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
