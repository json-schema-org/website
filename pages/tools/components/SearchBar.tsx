import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import type { Transform } from '../hooks/useToolsTransform';

interface SearchBarProps {
  transform: Transform;
  onQueryChange?: (query: string) => void;
  /** How long to wait after the last keystroke before reporting a change. */
  debounce?: number;
  id?: string;
}

const SearchBar = ({
  transform,
  onQueryChange,
  debounce = 0,
  id,
}: SearchBarProps) => {
  const [query, setQuery] = useState(transform.query);
  const reportedQuery = useRef(transform.query);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const report = (newQuery: string) => {
    reportedQuery.current = newQuery;
    onQueryChange?.(newQuery);
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    clearTimeout(timeout.current);

    if (debounce > 0) {
      timeout.current = setTimeout(() => report(newQuery), debounce);
    } else {
      report(newQuery);
    }
  };

  useEffect(() => {
    // Take on changes made elsewhere (the filters being reset, say), but not
    // the echo of what was typed here, which may by now have been added to.
    if (transform.query !== reportedQuery.current) {
      clearTimeout(timeout.current);
      reportedQuery.current = transform.query;
      setQuery(transform.query);
    }
  }, [transform.query]);

  useEffect(() => () => clearTimeout(timeout.current), []);

  return (
    <Input
      id={id}
      type='search'
      className='dark:border-slate-700 focus:border-blue-300 dark:bg-slate-900'
      placeholder='Search by name'
      name='query'
      value={query}
      onChange={changeHandler}
    />
  );
};

export default SearchBar;
