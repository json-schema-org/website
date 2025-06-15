import React, { useEffect, useState } from 'react';
import type { Transform } from '../hooks/useToolsTransform';

const SearchBar = ({ transform }: { transform: Transform }) => {
  const [query, setQuery] = useState(transform.query);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    setQuery(transform.query);
  }, [transform.query]);

  return (
    <div className='w-full max-w-md mx-auto my-6 lg:my-auto'>
      <div className='relative'>
        <input
          type='text'
          className='w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring bg-white text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-900 focus:border-blue-300 transition-all duration-200'
          placeholder='Search'
          name='query'
          value={query}
          onChange={changeHandler}
          style={{
            transition: 'all 0.2s ease-in-out',
          }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
