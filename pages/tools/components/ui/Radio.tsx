import React, { ChangeEventHandler } from 'react';

export default function Radio({
  label,
  value,
  selectedValue,
  onChange,
}: {
  label: string;
  value: string;
  selectedValue: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <label className='flex items-center gap-3 px-4 py-2'>
      <input
        type='radio'
        value={value}
        checked={selectedValue === value}
        onChange={onChange}
        className='hidden'
        id={value}
      />
      <span className='w-4 h-4 inline-block rounded-full border-2 border-gray-300 flex-shrink-0 relative'>
        <span
          className={`w-2 h-2 bg-blue-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${selectedValue === value ? 'opacity-100' : 'opacity-0'}`}
        ></span>
      </span>
      <span className='text-gray-700 font-medium'>{label}</span>
    </label>
  );
}
