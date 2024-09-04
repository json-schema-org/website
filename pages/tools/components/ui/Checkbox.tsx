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
    <label className='flex items-center gap-3 px-4 py-2'>
      <input
        type='checkbox'
        value={value}
        name={name}
        checked={isChecked}
        onChange={handleChange}
      />
      <span className='text-gray-700 dark:text-slate-300 font-medium'>
        {label}
      </span>
    </label>
  );
}
