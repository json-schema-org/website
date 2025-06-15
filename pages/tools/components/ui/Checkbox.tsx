import React, { useEffect, useState } from 'react';

export default function Checkbox({
  label,
  value,
  name,
  checked,
}: {
  label: string;
  value: string;
  name: string;
  checked?: boolean;
}) {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = () => {
    setIsChecked((prevChecked) => !prevChecked);
  };

  return (
    <label
      className='flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-800 transition-all duration-200 rounded hover:scale-[1.02] group'
      style={{
        transition: 'all 0.2s ease-in-out !important',
      }}
    >
      <input
        type='checkbox'
        value={value}
        name={name}
        checked={isChecked}
        onChange={handleChange}
        className='group-hover:scale-90 transition-all duration-200'
      />
      <span className='text-gray-700 dark:text-slate-300 font-medium group-hover:text-primary dark:group-hover:text-blue-400 transition-all duration-200'>
        {label}
      </span>
    </label>
  );
}
