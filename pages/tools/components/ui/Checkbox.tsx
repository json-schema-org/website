import React from 'react';
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';

export default function Checkbox({
  label,
  value,
  name,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  name: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label className='flex items-center gap-3 px-4 py-2 cursor-pointer bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 transition-colors duration-200 border border-slate-300 dark:border-slate-700 rounded-md my-2'>
      <ShadcnCheckbox
        value={value}
        name={name}
        defaultChecked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
        className='h-5 w-5 border data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:text-white dark:data-[state=checked]:bg-[#bfdbfe] dark:data-[state=checked]:border-[#bfdbfe] dark:data-[state=checked]:text-black border-gray-500 dark:border-slate-600'
      />
      <span className='text-gray-700 dark:text-slate-300 font-medium'>
        {label}
      </span>
    </label>
  );
}
