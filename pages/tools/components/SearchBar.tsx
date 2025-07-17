import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import type { Transform } from '../hooks/useToolsTransform';

interface SearchBarProps {
  transform: Transform;
  onQueryChange?: (query: string) => void;
}

const SearchBar = ({ transform, onQueryChange }: SearchBarProps) => {
  const [query, setQuery] = useState(transform.query);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onQueryChange?.(newQuery);
  };

  useEffect(() => {
    setQuery(transform.query);
  }, [transform.query]);

  return (
    <div className='w-full max-w-md mx-auto my-6 lg:my-auto'>
      <Input
        type='text'
        className='dark:border-slate-900 focus:border-blue-300 dark:bg-slate-900'
        placeholder='Search'
        name='query'
        value={query}
        onChange={changeHandler}
      />
    </div>
  );
};

export default SearchBar;
