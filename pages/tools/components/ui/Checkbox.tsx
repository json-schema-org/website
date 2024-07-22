import React from 'react';

export default function Checkbox({
  label,
  value,
  name,
}: {
  label: string;
  value: string;
  name: string;
}) {
  return (
    <label className='flex items-center gap-3 px-4 py-2'>
      <input type='checkbox' value={value} name={name} />
      <span className='text-gray-700 dark:text-slate-300 font-medium'>
        {label}
      </span>
    </label>
  );
}
