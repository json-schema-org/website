import React from 'react';
import JsonEditor from './JsonEditor';

const StyledValidator = () => {
  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-row justify-between mt-5'>
          <h1 className='text-h4 font-medium max-sm:text-[12px]'>
            Select a JSON Schema Validator
          </h1>
          <select
            name='Getting Started Examples'
            className='p-2 dark:bg-slate-900 rounded-md max-sm:text-[12px]'
            id='Examples'
          >
            <option
              value='Getting Started Examples'
              className='dark:bg-slate-900'
            >
              Getting Started Examples
            </option>
          </select>
        </div>

        <p className='my-5 leading-7'>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
          tinctio sint voluptate.
        </p>

        <h2 className='text-h5'>JSON Schema</h2>
        <JsonEditor initialCode={''} />
      </div>

      <div className='flex flex-col'>
        <div className='flex flex-row justify-between my-5'>
          <h1 className='text-h4 max-sm:text-[12px] font-medium'>
            Select a JSON Schema Instance
          </h1>
          <select
            name='Getting Started Examples'
            className='p-2  dark:bg-slate-900 rounded-md max-sm:text-[12px] '
            id='Examples'
          >
            <option
              value='Getting Started Examples'
              className='dark:bg-slate-900 max-sm:text-[12px]'
            >
              Basic valid instance
            </option>
          </select>
        </div>

        <h2 className='text-h5'>Instance</h2>
        <JsonEditor initialCode={''} />
      </div>

      <h2 className='text-h5'>Result</h2>
      <div className='flex bg-slate-800 justify-between items-center text-white font-medium flex-row border p-5 rounded-xl'>
        <p>This is a valid JSON instance for the provided JSON Schema</p>

        <img src='/icons/green-tick.svg' alt='' />
      </div>
      <div className='flex justify-end'>
        <button className='px-3 py-2 text-white rounded-md mt-5 bg-startBlue hover:bg-startBlue/90'>
          Download Example
        </button>
      </div>
    </>
  );
};

export default StyledValidator;
