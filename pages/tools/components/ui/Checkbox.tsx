import React, { useEffect, useState } from 'react';
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';

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
    <label className='flex items-center gap-3 px-4 py-2 cursor-pointer'>
      <ShadcnCheckbox
        value={value}
        name={name}
        checked={isChecked}
        onCheckedChange={handleChange}
        className='data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:text-white dark:data-[state=checked]:bg-[#bfdbfe] dark:data-[state=checked]:border-[#bfdbfe] dark:data-[state=checked]:text-black border-gray-300'
      />
      <span className='text-gray-700 dark:text-slate-300 font-medium'>
        {label}
      </span>
    </label>
  );
}
