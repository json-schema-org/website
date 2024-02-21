'use client'
import React, { ReactNode } from 'react';
import { BlockContext, BlockContextValue } from '~/context';
import classNames from 'classnames';


// Define a type for the component's props
interface InformationProps {
  children: ReactNode; // This type is suitable for any valid React child (string, number, JSX, array of these, etc.)
  label?: string; // Optional string
  iconSrc?: string; // Optional string
  bgColor: string; // Required string
  textColor: string; // Required string
}

const Information: React.FC<InformationProps> = ({ children, label, iconSrc, bgColor, textColor }) => {
  const infoLabelColor = 'bg-' + bgColor + '-100';
  const infoColor = 'bg-' + bgColor + '-50';
  const infoTxtColor = 'text-' + textColor + '-600';
  const infoBorderColor = 'border-' + bgColor + '-100';
  return (
    <BlockContext.Provider value={BlockContextValue.Information}>
    <div className='my-2'>
      {label && (
        <div className={classNames(
          infoLabelColor,
          'inline-block text-sm rounded-t-lg px-6 py-1',
          infoTxtColor
        )}>
        <div className={classNames(infoLabelColor)}>
          {label}
        </div>
        </div>
      )}
      <div className={classNames(
        'flex flex-row items-center mb-6 px-6 py-4 border rounded text-slate-600 leading-7',
        infoColor,
        infoBorderColor
      )}>
        <img src={iconSrc} className='h-7 w-7 mr-1' alt="" />
        <div className={classNames('font',infoColor)}>
          {children}
        </div>
      </div>
    </div>
    </BlockContext.Provider>
  );
};

export default Information;