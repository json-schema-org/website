'use client'
import React from 'react';
import { BlockContext, BlockContextValue } from '~/context';

const Information = ({ children, label, iconSrc, bgColor, textColor }) => {
  return (
    <BlockContext.Provider value={BlockContextValue.Infobox}>
    <div className='my-2'>
      {label && (
        <div className={`bg-${bgColor}-100 inline-block text-sm rounded-t-lg px-6 py-1 text-${textColor}-600`}>
          {label}
        </div>
      )}
      <div className={`flex flex-row items-center mb-6 bg-${bgColor}-50 px-6 py-4 border border-${bgColor}-100 rounded text-slate-600 leading-7`}>
        <img src={iconSrc} className='h-7 w-7 mr-1' />
        <div className='font'>
          {children}
        </div>
      </div>
    </div>
    </BlockContext.Provider>
  );
};

export default Information;