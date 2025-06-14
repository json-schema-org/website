import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function Radio({
  label,
  value,
  selectedValue,
  onChange,
}: {
  label: string;
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
}) {
  return (
    <RadioGroup value={selectedValue} onValueChange={onChange}>
      <label className='flex items-center gap-3 px-4 py-2'>
        <RadioGroupItem value={value} id={value} className='border-gray-300' />
        <span className='text-gray-700 font-medium'>{label}</span>
      </label>
    </RadioGroup>
  );
}
